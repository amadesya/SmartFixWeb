import React, { useEffect, useState } from 'react';
import { RepairRequest, Service, SparePart } from '@/types'; // Убедись, что SparePart добавлен в типы
import { servicesApi, repairRequestsApi, sparePartsApi, createPart, promotionsApi, Promotion } from '@/services/api';
import { Plus, X, Trash2, Edit2, Check, Percent } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useConfirmation } from '@/hooks/useConfirmation';

interface PriceEditorProps {
    price: number | null;
    newPrice: number | "";
    setNewPrice: (price: number | "") => void;
    onSave: () => void;
    isSaving: boolean;
    canEdit: boolean;
    canPay?: boolean;
    onPay?: () => void;
    isPaying?: boolean;
    onRefresh: () => void;
    request: RepairRequest | null;
}

const PriceEditor: React.FC<PriceEditorProps> = ({
    price,
    newPrice,
    setNewPrice,
    onSave,
    isSaving,
    canEdit,
    canPay = false,
    onPay,
    isPaying = false,
    onRefresh,
    request,
}) => {
    if (!request) return null;

    const [isEditingTotalPrice, setIsEditingTotalPrice] = useState(false);

    const [allServices, setAllServices] = useState<Service[]>([]);
    const [allParts, setAllParts] = useState<SparePart[]>([]); // Состояние для склада запчастей
    const [promotions, setPromotions] = useState<Promotion[]>([]);

    // Теперь храним не просто ID, а объекты с ценами и флагами
    const [selectedServices, setSelectedServices] = useState<{ id: number, price: number }[]>([]);
    const [selectedParts, setSelectedParts] = useState<{ id: number, price: number, isHidden: boolean }[]>([]);

    const [loading, setLoading] = useState(false);

    // Состояния для быстрого добавления (инлайн-формы)
    const [isAddingSvc, setIsAddingSvc] = useState(false);
    const [newSvcName, setNewSvcName] = useState('');
    const [newSvcPrice, setNewSvcPrice] = useState('');

    const [isAddingPart, setIsAddingPart] = useState(false);
    const [newPartName, setNewPartName] = useState('');
    const [newPartPrice, setNewPartPrice] = useState('');

    // Состояния для редактирования цен в готовой детализации
    const [editingSvcId, setEditingSvcId] = useState<number | null>(null);
    const [editSvcPrice, setEditSvcPrice] = useState<number | ''>('');
    const [editingPartId, setEditingPartId] = useState<number | null>(null);
    const [editPartPrice, setEditPartPrice] = useState<number | ''>('');

    const { itemToDelete, confirm, cancel } = useConfirmation<{ type: 'service' | 'part', id: number }>();

    useEffect(() => {
        if (String(request.status).toLowerCase() === "inprogress") {
            // Загружаем услуги и запчасти параллельно
            Promise.all([
                servicesApi.getAll().then(setAllServices),
                sparePartsApi.getAll().then(setAllParts), // Вызов к API склада
                promotionsApi.getAll().then(setPromotions) // Акции
            ]).catch(console.error);
        }
    }, [request.status]);

    const handleToggleService = (service: Service) => {
        setSelectedServices(prev => {
            const exists = prev.find(s => s.id === service.id);
            if (exists) return prev.filter(s => s.id !== service.id);
            return [...prev, { id: service.id, price: service.price }];
        });
    };

    const handleServicePriceChange = (id: number, newPrice: number) => {
        setSelectedServices(prev => prev.map(s => s.id === id ? { ...s, price: newPrice } : s));
    };

    const handleTogglePart = (part: SparePart) => {
        setSelectedParts(prev => {
            const exists = prev.find(p => p.id === part.id);
            if (exists) return prev.filter(p => p.id !== part.id);
            return [...prev, { id: part.id, price: part.purchasePrice || part.price || 0, isHidden: false }];
        });
    };

    const handlePartPriceChange = (id: number, newPrice: number) => {
        setSelectedParts(prev => prev.map(p => p.id === id ? { ...p, price: newPrice, isHidden: newPrice === 0 } : p));
    };

    const handleToggleHidePart = (id: number) => {
        if (selectedServices.length === 0) {
            toast.error("Добавьте хотя бы одну услугу, чтобы скрыть в ней цену запчасти.");
            return;
        }
        setSelectedParts(prev => prev.map(p => p.id === id ? { ...p, isHidden: !p.isHidden } : p));
    };

    const handleAddService = async () => {
        if (!newSvcName || !newSvcPrice) return;
        try {
            const s = await servicesApi.create({ name: newSvcName, price: Number(newSvcPrice), imageUrl: '' });
            
            await repairRequestsApi.addServiceToRequest(request.id, s.id, s.price);
            
            setAllServices(prev => [...prev, s]);
            setSelectedServices(prev => [...prev, { id: s.id, price: s.price }]);
            setIsAddingSvc(false); setNewSvcName(''); setNewSvcPrice('');
            onRefresh();
        } catch (e: any) { toast.error("Ошибка при создании услуги"); }
    };

    const handleAddPart = async () => {
        if (!newPartName || !newPartPrice) return;
        try {
            const success = await createPart({ name: newPartName, purchasePrice: Number(newPartPrice), stockQuantity: 1, typeId: 1 });
            if (success) {
                const parts = await sparePartsApi.getAll();
                setAllParts(parts);
                const newPart = parts.find(p => p.name === newPartName);
                if (newPart) {
                    await repairRequestsApi.addPartToRequest(request.id, newPart.id, newPart.purchasePrice || 0);
                    setSelectedParts(prev => [...prev, { id: newPart.id, price: newPart.purchasePrice || 0, isHidden: false }]);
                    toast.success("Запчасть списана со склада и добавлена в заказ");
                }
                setIsAddingPart(false); setNewPartName(''); setNewPartPrice('');
                onRefresh();
            }
        } catch (e: any) { toast.error(e.message || "Ошибка при добавлении запчасти"); }
    };

    // Считаем общую сумму (Услуги + Запчасти)
    const hiddenPartsSum = selectedParts.filter(p => p.isHidden).reduce((sum, p) => sum + p.price, 0);
    const totalServices = selectedServices.reduce((sum, s) => sum + s.price, 0) + hiddenPartsSum;
    const totalParts = selectedParts.filter(p => !p.isHidden).reduce((sum, p) => sum + p.price, 0);
    const total = totalServices + totalParts;

    const clientDiscount = (request as any).client?.discount || 0;
    const activePromotion = promotions.find(p => p.isActive);
    const promoDiscount = activePromotion ? activePromotion.discountPercent : 0;
    const activeDiscount = Math.max(clientDiscount, promoDiscount);

    const handleComplete = async () => {
        if (selectedServices.length === 0 && selectedParts.length === 0) {
            toast.error("Выберите хотя бы одну услугу или запчасть");
            return;
        }
        setLoading(true);
        try {
            // Перераспределяем цены скрытых запчастей на услуги перед отправкой
            const effectiveServices = selectedServices.map((s, idx) => ({
                id: s.id,
                price: (idx === 0 ? s.price + hiddenPartsSum : s.price) * (1 - activeDiscount / 100)
            }));
            
            const effectiveParts = selectedParts.map(p => ({
                id: p.id,
                price: p.isHidden ? 0 : p.price
            }));

            await repairRequestsApi.completeRepair(request.id, effectiveServices, effectiveParts);
            onRefresh();
        } catch (e: any) {
            console.error("ПОЛНАЯ ОШИБКА:", e);
            toast.error(`Ошибка: ${e.message || "Неизвестная ошибка"}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTotalPrice = async () => {
        await onSave();
        setIsEditingTotalPrice(false);
        onRefresh();
    };

    const handleRemoveService = (repairServiceId: number) => {
        confirm({ type: 'service', id: repairServiceId });
    };

    const handleRemovePart = (repairPartId: number) => {
        confirm({ type: 'part', id: repairPartId });
    };

    const confirmAction = async () => {
        if (!itemToDelete) return;
        try {
            if (itemToDelete.type === 'service') {
                await repairRequestsApi.removeServiceFromRequest(request.id, itemToDelete.id);
                onRefresh();
            } else {
                await repairRequestsApi.removePartFromRequest(request.id, itemToDelete.id);
                toast.success("Статус обновлен, запчасти возвращены на склад");
                onRefresh();
                sparePartsApi.getAll().then(setAllParts).catch(console.error);
            }
        } catch (error) {
            console.error(error);
            toast.error(itemToDelete.type === 'service' ? "Не удалось удалить услугу" : "Не удалось удалить запчасть");
        } finally {
            cancel();
        }
    };

    const handleSaveSvcPrice = async (rsId: number) => {
        try {
            await repairRequestsApi.updateServicePriceInRequest(request.id, rsId, Number(editSvcPrice) || 0);
            setEditingSvcId(null);
            onRefresh();
        } catch (error) {
            console.error(error);
            toast.error("Не удалось обновить цену услуги");
        }
    };

    const handleSavePartPrice = async (rpId: number) => {
        try {
            await repairRequestsApi.updatePartPriceInRequest(request.id, rpId, Number(editPartPrice) || 0);
            setEditingPartId(null);
            onRefresh();
        } catch (error) {
            console.error(error);
            toast.error("Не удалось обновить цену запчасти");
        }
    };

    const handleToggleHidePartInDetails = async (rpId: number, currentPrice: number, basePrice: number) => {
        if (!request.repairServices || request.repairServices.length === 0) {
            toast.error("Невозможно скрыть цену запчасти, так как нет добавленных услуг.");
            return;
        }
        try {
            const isHiding = currentPrice > 0;
            const priceToTransfer = isHiding ? currentPrice : basePrice;
            const newPartPrice = isHiding ? 0 : basePrice;

            const firstService = request.repairServices[0];
            const priceDiff = isHiding ? priceToTransfer : -priceToTransfer;
            const newSvcPrice = firstService.priceAtTheTime + priceDiff;
            
            await repairRequestsApi.updateServicePriceInRequest(request.id, firstService.id, newSvcPrice);
            await repairRequestsApi.updatePartPriceInRequest(request.id, rpId, newPartPrice);
            onRefresh();
        } catch (error) {
            console.error(error);
            toast.error("Не удалось скрыть/показать цену");
        }
    };

    const statusLower = String(request.status).toLowerCase();
    const isNewOrInProgress = statusLower === 'new' || statusLower === 'inprogress';
    const isReady = statusLower === 'ready' || statusLower === 'готова';
    const showReceipt = isReady || statusLower === 'closed' || statusLower === 'закрыта';

    return (
        <div className="bg-white dark:bg-smartfix-dark p-4 md:p-5 rounded-2xl border border-gray-200 dark:border-smartfix-medium/20 shadow-sm dark:shadow-xl space-y-4 md:space-y-6">

            {/* 1. ШАПКА: Всегда показываем итоговую стоимость */}
            <div className="flex justify-between items-end border-b border-gray-100 dark:border-smartfix-medium/10 pb-4">
                <div>
                    <p className="text-xs text-gray-500 dark:text-smartfix-medium uppercase tracking-widest font-bold mb-1">
                        К оплате
                    </p>
                {isNewOrInProgress ? (
                    <p className="text-sm text-gray-500 dark:text-smartfix-light/80 italic mt-2">Сумма будет доступна после завершения работ</p>
                ) : isEditingTotalPrice && showReceipt ? (
                    <div className="flex items-center gap-2 mt-1">
                        <input 
                            type="number" 
                            value={newPrice} 
                            onChange={(e) => setNewPrice(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-28 text-3xl font-black bg-gray-50 dark:bg-smartfix-darker text-gray-900 dark:text-white outline-none border border-emerald-300 dark:border-emerald-500/50 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-lg px-2 py-1 text-right transition-colors"
                        />
                        <span className="text-3xl text-gray-900 dark:text-white font-black">₽</span>
                        <div className="flex flex-col gap-1 ml-2">
                            <button onClick={handleSaveTotalPrice} disabled={isSaving || !isReady} className="bg-emerald-600 hover:bg-emerald-500 text-white p-1 rounded transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed">
                                <Check size={14} />
                            </button>
                            <button onClick={() => setIsEditingTotalPrice(false)} className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white p-1 rounded transition-colors flex justify-center items-center">
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-3xl text-gray-900 dark:text-white font-black flex items-center gap-3">
                        {price !== null ? `${price} ₽` : '—'}
                        
                        {canEdit && isReady && price !== null && !isEditingTotalPrice && (
                            <button onClick={() => { setIsEditingTotalPrice(true); setNewPrice(price || 0); }} className="text-gray-400 dark:text-smartfix-light/50 hover:text-emerald-600 dark:hover:text-white transition-colors pb-1">
                                <Edit2 size={20} />
                            </button>
                        )}
                    </p>
                )}
                
                {activeDiscount > 0 && isNewOrInProgress && (
                    <div className="flex items-center gap-1 mt-2 text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 rounded-lg w-fit">
                        <Percent size={14} />
                        <span className="text-xs font-bold">
                            Применена скидка {activeDiscount}% 
                            {activeDiscount === clientDiscount ? " (Персональная)" : " (По акции)"}
                        </span>
                    </div>
                )}
                </div>
                {!canEdit && price === null && isNewOrInProgress && (
                    <span className="text-xs text-amber-700 dark:text-amber-500 bg-amber-100 dark:bg-amber-500/10 px-3 py-1 rounded-full">
                        Ожидает оценки
                    </span>
                )}
            </div>

            {/* 2. РАБОЧАЯ ЗОНА МАСТЕРА */}
            {canEdit && String(request.status).toLowerCase() === "inprogress" && (
                <div className="animate-in fade-in space-y-6">

                    {/* Блок Услуг */}
                    <div>
                        <div className="flex justify-between items-end mb-3">
                            <p className="text-xs text-gray-500 dark:text-smartfix-light font-bold uppercase tracking-wider">Выполненные работы:</p>
                            {!isAddingSvc && (
                                <button onClick={() => setIsAddingSvc(true)} className="text-[10px] uppercase font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"><Plus size={12} /> Новая услуга</button>
                            )}
                        </div>

                        {isAddingSvc && (
                            <div className="flex gap-2 mb-4 bg-emerald-50 dark:bg-smartfix-darker p-3 rounded-xl border border-emerald-200 dark:border-emerald-500/30 animate-in fade-in shadow-inner">
                                <input value={newSvcName} onChange={e => setNewSvcName(e.target.value)} placeholder="Название услуги" className="flex-1 text-xs p-2.5 rounded-lg bg-white dark:bg-smartfix-dark text-gray-900 dark:text-white outline-none border border-gray-200 dark:border-smartfix-medium/20 focus:border-emerald-500 dark:focus:border-emerald-500/50 transition-colors" />
                                <input value={newSvcPrice} type="number" onChange={e => setNewSvcPrice(e.target.value)} placeholder="Цена" className="w-24 text-xs p-2.5 rounded-lg bg-white dark:bg-smartfix-dark text-gray-900 dark:text-white outline-none border border-gray-200 dark:border-smartfix-medium/20 focus:border-emerald-500 dark:focus:border-emerald-500/50 transition-colors" />
                                <button onClick={() => handleAddService()} disabled={!newSvcName || !newSvcPrice} className="bg-emerald-600 disabled:opacity-50 text-white px-4 rounded-lg hover:bg-emerald-500 font-bold text-xs transition-colors">ОК</button>
                                <button onClick={() => setIsAddingSvc(false)} className="bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 px-3 rounded-lg hover:bg-red-500 hover:text-white transition-colors"><X size={16} /></button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {allServices.map(service => {
                                const selected = selectedServices.find(s => s.id === service.id);
                                const isSelected = !!selected;
                                return (
                                    <div 
                                        key={`srv-${service.id}`} 
                                        onClick={() => { if (!isSelected) handleToggleService(service); }}
                                        className={`flex justify-between items-center p-3 rounded-xl border text-left transition-all ${isSelected ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/50 text-emerald-900 dark:text-white shadow-sm dark:shadow-md' : 'bg-white dark:bg-smartfix-darker border-gray-200 dark:border-smartfix-medium/10 text-gray-700 dark:text-smartfix-medium hover:border-emerald-300 dark:hover:border-emerald-500/30 cursor-pointer'}`}
                                    >
                                        <span 
                                            className={`text-xs font-medium truncate pr-2 flex-1 ${isSelected ? 'cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors' : ''}`} 
                                            onClick={(e) => { if (isSelected) { e.stopPropagation(); handleToggleService(service); } }}
                                        >
                                            {service.name}
                                        </span>
                                        {isSelected ? (
                                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                <input 
                                                    type="number" 
                                                    value={selected.price === 0 && hiddenPartsSum === 0 ? '' : (selectedServices[0].id === service.id ? selected.price + hiddenPartsSum : selected.price)} 
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        const base = selectedServices[0].id === service.id ? val - hiddenPartsSum : val;
                                                        handleServicePriceChange(service.id, Math.max(0, base));
                                                    }}
                                                    placeholder="0"
                                                    className="w-20 text-xs p-1.5 rounded-lg bg-white dark:bg-smartfix-darker border border-emerald-300 dark:border-emerald-500/50 text-gray-900 dark:text-white outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/50 text-right transition-colors" 
                                                />
                                                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-100">₽</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs font-bold whitespace-nowrap">{selectedServices[0]?.id === service.id ? service.price + hiddenPartsSum : service.price} ₽</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Блок Запчастей */}
                    <div>
                        <div className="flex justify-between items-end mb-3">
                            <p className="text-xs text-gray-500 dark:text-smartfix-light font-bold uppercase tracking-wider">Использованные запчасти:</p>
                            {!isAddingPart && (
                                <button onClick={() => setIsAddingPart(true)} className="text-[10px] uppercase font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors"><Plus size={12} /> Новая запчасть</button>
                            )}
                        </div>

                        {isAddingPart && (
                            <div className="flex gap-2 mb-4 bg-blue-50 dark:bg-smartfix-darker p-3 rounded-xl border border-blue-200 dark:border-blue-500/30 animate-in fade-in shadow-inner">
                                <input value={newPartName} onChange={e => setNewPartName(e.target.value)} placeholder="Название запчасти" className="flex-1 text-xs p-2.5 rounded-lg bg-white dark:bg-smartfix-dark text-gray-900 dark:text-white outline-none border border-gray-200 dark:border-smartfix-medium/20 focus:border-blue-500 dark:focus:border-blue-500/50 transition-colors" />
                                <input value={newPartPrice} type="number" onChange={e => setNewPartPrice(e.target.value)} placeholder="Цена" className="w-24 text-xs p-2.5 rounded-lg bg-white dark:bg-smartfix-dark text-gray-900 dark:text-white outline-none border border-gray-200 dark:border-smartfix-medium/20 focus:border-blue-500 dark:focus:border-blue-500/50 transition-colors" />
                                <button onClick={() => handleAddPart()} disabled={!newPartName || !newPartPrice} className="bg-blue-600 disabled:opacity-50 text-white px-4 rounded-lg hover:bg-blue-500 font-bold text-xs transition-colors">ОК</button>
                                <button onClick={() => setIsAddingPart(false)} className="bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 px-3 rounded-lg hover:bg-red-500 hover:text-white transition-colors"><X size={16} /></button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {allParts.map(part => {
                                const selected = selectedParts.find(p => p.id === part.id);
                                const isSelected = !!selected;
                                const isOutOfStock = part.stockQuantity <= 0;
                                return (
                                    <div 
                                        key={`prt-${part.id}`} 
                                        onClick={isOutOfStock && !isSelected ? undefined : () => { if (!isSelected) handleTogglePart(part); }}
                                        className={`flex flex-col p-3 rounded-xl border text-left transition-all ${isSelected ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/50 text-blue-900 dark:text-white shadow-sm dark:shadow-md' : (isOutOfStock ? 'bg-gray-100 dark:bg-smartfix-darker border-gray-200 dark:border-smartfix-medium/10 text-gray-400 dark:text-smartfix-medium opacity-70 cursor-not-allowed' : 'bg-white dark:bg-smartfix-darker border-gray-200 dark:border-smartfix-medium/10 text-gray-700 dark:text-smartfix-medium hover:border-blue-300 dark:hover:border-blue-500/30 cursor-pointer')}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span 
                                                className={`text-xs font-medium truncate pr-2 flex-1 ${isSelected ? 'cursor-pointer hover:text-blue-600 dark:hover:text-blue-300 transition-colors' : ''}`} 
                                                onClick={(e) => { if (isSelected) { e.stopPropagation(); handleTogglePart(part); } }}
                                            >
                                                {part.name}
                                                {isOutOfStock && !isSelected && <span className="text-red-500 dark:text-red-400 text-[10px] ml-2 font-bold whitespace-nowrap">Нет в наличии</span>}
                                            </span>
                                            {isSelected ? (
                                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                    <input 
                                                        type="number" 
                                                        disabled={selected.isHidden} 
                                                        value={selected.isHidden ? '' : (selected.price === 0 ? '' : selected.price)} 
                                                        onChange={(e) => handlePartPriceChange(part.id, Number(e.target.value))} 
                                                        placeholder="0"
                                                        className="w-20 text-xs p-1.5 rounded-lg bg-white dark:bg-smartfix-darker border border-blue-300 dark:border-blue-500/50 text-gray-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/50 text-right disabled:opacity-50 transition-colors" 
                                                    />
                                                    <span className="text-xs font-bold text-blue-700 dark:text-blue-100">₽</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold whitespace-nowrap text-blue-600 dark:text-blue-400">{part.purchasePrice || part.price} ₽</span>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-500/20 flex items-center" onClick={(e) => e.stopPropagation()}>
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input type="checkbox" className="accent-blue-500 w-4 h-4 rounded cursor-pointer" checked={selected.isHidden} onChange={() => handleToggleHidePart(part.id)} />
                                                    <span className="text-[10px] text-blue-600 dark:text-blue-200 uppercase tracking-wide font-medium group-hover:text-blue-800 dark:group-hover:text-white transition-colors">Скрыть цену в чеке (добавьте её к услуге)</span>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Главная кнопка мастера */}
                    <button
                        onClick={handleComplete}
                        disabled={loading || (selectedServices.length === 0 && selectedParts.length === 0)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] flex justify-center items-center gap-2 mt-4"
                    >
                        {loading ? 'Сохранение...' : 'Завершить ремонт и выставить счет'}
                    </button>
                </div>
            )}

            {/* 3. КЛИЕНТСКИЙ ЧЕК И ОПЛАТА */}
            {showReceipt && price !== null && (
                <div className="animate-in slide-in-from-bottom-2">

                    <div className="bg-gray-50 dark:bg-smartfix-darker rounded-xl p-4 mb-6 border border-gray-100 dark:border-smartfix-medium/10">
                        <p className="text-[10px] text-gray-500 dark:text-smartfix-medium uppercase font-bold mb-3">Детализация заказа</p>
                        <div className="space-y-3 text-sm">

                            {/* Отображение УСЛУГ */}
                            {request.repairServices && request.repairServices.length > 0 && (
                                <div className="border-b border-gray-200 dark:border-smartfix-medium/10 pb-2">
                                    <p className="text-xs text-gray-500 dark:text-smartfix-medium mb-2">Работы:</p>
                                    {request.repairServices.map((rs: any) => (
                                        <div key={rs.id} className="flex justify-between items-center text-gray-700 dark:text-smartfix-light mb-1 group">
                                            <span>{rs.service?.name || 'Услуга'}</span>
                                            {editingSvcId === rs.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={editSvcPrice}
                                                        onChange={(e) => setEditSvcPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                                        placeholder="0"
                                                        className="w-20 text-xs p-1 rounded-md bg-white dark:bg-smartfix-dark border border-emerald-300 dark:border-emerald-500/50 text-gray-900 dark:text-white outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-right transition-colors"
                                                    />
                                                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-100">₽</span>
                                                    <button onClick={() => handleSaveSvcPrice(rs.id)} className="text-emerald-500 hover:text-emerald-400 p-1"><Check size={14} /></button>
                                                    <button onClick={() => setEditingSvcId(null)} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1"><X size={14} /></button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-900 dark:text-white font-medium">{rs.priceAtTheTime} ₽</span>
                                                    {canEdit && isReady && (
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                            <button onClick={() => { setEditingSvcId(rs.id); setEditSvcPrice(rs.priceAtTheTime); }} className="text-gray-400 dark:text-smartfix-light/50 hover:text-emerald-600 dark:hover:text-white transition-colors" title="Редактировать цену">
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button onClick={() => handleRemoveService(rs.id)} className="text-red-500/50 hover:text-red-500" title="Удалить услугу из заказа">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Отображение ЗАПЧАСТЕЙ */}
                            {request.repairParts && request.repairParts.length > 0 && (
                                <div className="pb-2">
                                    <p className="text-xs text-gray-500 dark:text-smartfix-medium mb-2">Запчасти:</p>
                                    {request.repairParts.map((rp: any) => (
                                        <div key={rp.id} className="flex flex-col mb-1 group">
                                            <div className="flex justify-between items-center text-gray-700 dark:text-smartfix-light">
                                                <span>{rp.sparePart?.name || 'Деталь'} (x{rp.quantity})</span>
                                                {editingPartId === rp.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={editPartPrice}
                                                            onChange={(e) => setEditPartPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                                            placeholder="0"
                                                            className="w-20 text-xs p-1 rounded-md bg-white dark:bg-smartfix-dark border border-blue-300 dark:border-blue-500/50 text-gray-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-400 text-right transition-colors"
                                                        />
                                                        <span className="text-xs font-bold text-blue-700 dark:text-blue-100">₽</span>
                                                        <button onClick={() => handleSavePartPrice(rp.id)} className="text-blue-500 hover:text-blue-400 p-1"><Check size={14} /></button>
                                                        <button onClick={() => setEditingPartId(null)} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1"><X size={14} /></button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-gray-900 dark:text-white font-medium">
                                                            {rp.priceAtTheTime === 0 ? <span className="text-blue-500 dark:text-blue-400 text-[10px] uppercase">Скрыто</span> : `${rp.priceAtTheTime} ₽`}
                                                        </span>
                                                        {canEdit && isReady && (
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                                <button onClick={() => { setEditingPartId(rp.id); setEditPartPrice(rp.priceAtTheTime); }} className="text-gray-400 dark:text-smartfix-light/50 hover:text-blue-600 dark:hover:text-white transition-colors" title="Редактировать цену">
                                                                    <Edit2 size={14} />
                                                                </button>
                                                                <button onClick={() => handleRemovePart(rp.id)} className="text-red-500/50 hover:text-red-500" title="Удалить запчасть из заказа">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {/* Чекбокс для скрытия/показа */}
                                            {canEdit && isReady && editingPartId !== rp.id && (
                                                <div className="mt-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                                                    <label className="flex items-center gap-2 cursor-pointer group/label">
                                                        <input
                                                            type="checkbox"
                                                            className="accent-blue-500 w-3 h-3 rounded cursor-pointer"
                                                            checked={rp.priceAtTheTime === 0}
                                                            onChange={() => handleToggleHidePartInDetails(rp.id, rp.priceAtTheTime, rp.sparePart?.purchasePrice || rp.sparePart?.price || 0)}
                                                        />
                                                        <span className="text-[10px] text-gray-400 dark:text-smartfix-light/50 group-hover/label:text-blue-600 dark:group-hover/label:text-blue-300 uppercase tracking-wide font-medium transition-colors">Скрыть цену в чеке</span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Итоговая сумма */}
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-smartfix-light/20 mt-3">
                            <span className="text-gray-900 dark:text-white font-bold text-lg">Итого к оплате</span>
                            {isEditingTotalPrice ? (
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        value={newPrice} 
                                        onChange={(e) => setNewPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-24 text-right px-2 py-1 rounded-lg bg-white dark:bg-smartfix-darker border border-emerald-300 dark:border-emerald-500/50 text-gray-900 dark:text-white outline-none focus:border-emerald-500 dark:focus:border-emerald-400 font-bold transition-colors"
                                    />
                                    <span className="font-bold text-gray-900 dark:text-white">₽</span>
                                    <button onClick={handleSaveTotalPrice} disabled={isSaving || !isReady} className="text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 p-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                        <Check size={20} />
                                    </button>
                                    <button onClick={() => setIsEditingTotalPrice(false)} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <span className="text-emerald-600 dark:text-green-400 font-extrabold text-xl">{price} ₽</span>
                                    {canEdit && isReady && (
                                        <button onClick={() => { setIsEditingTotalPrice(true); setNewPrice(price || 0); }} className="text-gray-400 dark:text-smartfix-light/50 hover:text-emerald-600 dark:hover:text-white transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        </div>
                    </div>

                    {/* Кнопка оплаты */}
                    {!canEdit && canPay && onPay && (
                        <button
                            onClick={onPay}
                            disabled={isPaying || !isReady}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPaying ? 'Подготовка...' : 'Перейти к оплате онлайн'}
                        </button>
                    )}
                </div>
            )}
            
            <ConfirmationModal
                isOpen={itemToDelete !== null}
                title={itemToDelete?.type === 'part' ? "Удаление запчасти" : "Удаление услуги"}
                message={itemToDelete?.type === 'part' ? "Вы уверены, что хотите удалить эту запчасть?" : "Вы уверены, что хотите удалить эту услугу из заказа? Это действие невозможно отменить."}
                onConfirm={confirmAction}
                onCancel={cancel}
            />
        </div>
    );
};

export default PriceEditor;