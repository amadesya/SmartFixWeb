import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { RepairRequest, Service, SparePart } from '@/types';
import {
    servicesApi,
    repairRequestsApi,
    getTypePart,
    createTypePart,
    updateRepairRequestPrice,
    sparePartsApi,
    createPart
} from '@/services/api';

export const usePriceEditor = ({
    onRefresh,
    request,
}: {
    onRefresh: () => void;
    request: RepairRequest | null;
}) => {
    const [isEditingTotalPrice, setIsEditingTotalPrice] = useState(false);
    const [localTotalPrice, setLocalTotalPrice] = useState<number | ''>('');
    const [isSavingTotal, setIsSavingTotal] = useState(false);

    const [editingSvcId, setEditingSvcId] = useState<number | null>(null);
    const [editSvcPrice, setEditSvcPrice] = useState<number | ''>('');

    const [editingPartId, setEditingPartId] = useState<number | null>(null);
    const [editPartPrice, setEditPartPrice] = useState<number | ''>('');

    const [activeEditTab, setActiveEditTab] = useState<'services' | 'parts'>('services');
    const [searchQuery, setSearchQuery] = useState('');
    const [isPartsExpanded, setIsPartsExpanded] = useState(true);
    const [isServicesExpanded, setIsServicesExpanded] = useState(true);

    const [allServices, setAllServices] = useState<Service[]>([]);
    const [allParts, setAllParts] = useState<SparePart[]>([]);

    const [selectedServices, setSelectedServices] = useState<{ id: number, price: number }[]>([]);
    const [selectedParts, setSelectedParts] = useState<{ id: number, price: number, isHidden: boolean }[]>([]);

    const [loading, setLoading] = useState(false);

    const [isAddingSvc, setIsAddingSvc] = useState(false);
    const [newSvcName, setNewSvcName] = useState('');
    const [newSvcPrice, setNewSvcPrice] = useState('');

    const [isAddingPart, setIsAddingPart] = useState(false);
    const [newPartName, setNewPartName] = useState('');
    const [newPartPrice, setNewPartPrice] = useState('');
    const [partTypes, setPartTypes] = useState<any[]>([]);

    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const [category, setCategory] = useState('');

    useEffect(() => {
        if (request && String(request.status).toLowerCase() === "inprogress") {
            Promise.all([
                servicesApi.getAll().then(setAllServices),
                sparePartsApi.getAll().then(setAllParts),
                getTypePart().then(setPartTypes)
            ]).catch(console.error);
        }
    }, [request?.status]);

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
        setSelectedParts(prev => prev.map(p => {
            if (p.id === id) {
                const isHidden = !p.isHidden;
                return { ...p, isHidden, price: isHidden ? 0 : (allParts.find(ap => ap.id === id)?.purchasePrice || 0) };
            }
            return p;
        }));
    };

    const handleAddService = async () => {
        if (!newSvcName || !newSvcPrice) return;
        try {
            const s = await servicesApi.create({ name: newSvcName, price: Number(newSvcPrice), imageUrl: '' });
            setAllServices(prev => [...prev, s]);
            setSelectedServices(prev => [...prev, { id: s.id, price: s.price }]);
            setIsAddingSvc(false); setNewSvcName(''); setNewSvcPrice('');
        } catch (e: any) { alert("Ошибка при создании услуги"); }
    };

    const handleCategoryChange = (val: string) => {
        if (val === 'new') {
            setIsAddingNewCategory(true);
            setCategory('');
        } else {
            setCategory(val);
            setIsAddingNewCategory(false);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName) return;
        try {
            await createTypePart({ name: newCategoryName });
            const types = await getTypePart();
            setPartTypes(types);
            const addedType = types.find((t: any) => t.name === newCategoryName);
            if (addedType) {
                setCategory(addedType.id.toString());
            }
            setIsAddingNewCategory(false);
            setNewCategoryName('');
        } catch (e: any) { alert("Ошибка при добавлении категории"); }
    };

    const handleAddPart = async () => {
        if (!newPartName || !newPartPrice || !category) {
            alert("Заполните все поля и выберите категорию");
            return;
        }
        try {
            await createPart({ name: newPartName, purchasePrice: Number(newPartPrice), stockQuantity: 1, typeId: Number(category) });
            const parts = await sparePartsApi.getAll();
            setAllParts(parts);
            const newPartFromDb = parts.find(p => p.name === newPartName);
            if (newPartFromDb) {
                setSelectedParts(prev => [...prev, { id: newPartFromDb.id, price: newPartFromDb.purchasePrice || newPartFromDb.price || 0, isHidden: false }]);
            }
            setIsAddingPart(false); setNewPartName(''); setNewPartPrice(''); setCategory('');
        } catch (e: any) { alert("Ошибка при добавлении запчасти"); }
    };

    const totalServices = useMemo(() => selectedServices.reduce((sum, s) => sum + s.price, 0), [selectedServices]);
    const totalParts = useMemo(() => selectedParts.reduce((sum, p) => sum + p.price, 0), [selectedParts]);
    const total = totalServices + totalParts;

    const handleComplete = async () => {
        if (!request) return;
        if (selectedServices.length === 0 && selectedParts.length === 0) {
            return alert("Выберите хотя бы одну услугу или запчасть");
        }
        setLoading(true);
        try {
            await repairRequestsApi.completeRepair(request.id, selectedServices, selectedParts);
            onRefresh();
        } catch (e: any) {
            console.error("ПОЛНАЯ ОШИБКА:", e);
            alert(`Ошибка: ${e.message || "Неизвестная ошибка"}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTotalPrice = async () => {
        if (!request) return;
        setIsSavingTotal(true);
        try {
            await updateRepairRequestPrice(request.id, Number(localTotalPrice) || 0);
            setIsEditingTotalPrice(false);
            onRefresh();
        } catch (error) {
            console.error(error);
            alert("Ошибка при сохранении итоговой цены");
        } finally {
            setIsSavingTotal(false);
        }
    };

    const handleRemoveService = async (repairServiceId: number) => {
        if (!request) return;
        if (!window.confirm("Удалить эту услугу из заказа?")) return;
        try {
            await repairRequestsApi.removeServiceFromRequest(request.id, repairServiceId);
            onRefresh();
        } catch (error) {
            console.error(error);
            alert("Не удалось удалить услугу");
        }
    };

    const handleSaveSvcPrice = async (repairServiceId: number) => {
        if (!request) return;
        try {
            await repairRequestsApi.updateServicePriceInRequest(request.id, repairServiceId, Number(editSvcPrice));
            setEditingSvcId(null);
            onRefresh();
        } catch (error) {
            alert("Ошибка при обновлении цены услуги");
        }
    };

    const handleSavePartPrice = async (repairPartId: number) => {
        if (!request) return;
        try {
            await repairRequestsApi.updatePartPriceInRequest(request.id, repairPartId, Number(editPartPrice));
            setEditingPartId(null);
            onRefresh();
        } catch (error) {
            alert("Ошибка при обновлении цены запчасти");
        }
    };

    const handleToggleHidePartInDetails = async (repairPartId: number, currentPrice: number, basePrice: number) => {
        if (!request) return;
        const newPrice = currentPrice === 0 ? basePrice : 0;
        try {
            await repairRequestsApi.updatePartPriceInRequest(request.id, repairPartId, newPrice);
            onRefresh();
        } catch (error) {
            alert("Ошибка при изменении видимости");
        }
    };

    const handleRemovePart = async (repairPartId: number) => {
        if (!request) return;
        if (!window.confirm("Удалить эту запчасть из заказа?")) return;
        try {
            await repairRequestsApi.removePartFromRequest(request.id, repairPartId);
            toast.success("Статус обновлен, запчасти возвращены на склад");
            onRefresh();
            sparePartsApi.getAll().then(setAllParts).catch(console.error);
        } catch (error) {
            console.error(error);
            toast.error("Не удалось удалить запчасть");
        }
    };

    const formatPrice = (p: number | string | undefined | null) => {
        if (p === null || p === undefined || p === '') return '0';
        return Math.round(Number(p)).toLocaleString('ru-RU');
    };

    const receiptServicesTotal = useMemo(() => request?.repairServices?.reduce((sum: number, s: any) => sum + s.priceAtTheTime, 0) || 0, [request?.repairServices]);
    const receiptPartsTotal = useMemo(() => request?.repairParts?.reduce((sum: number, p: any) => sum + p.priceAtTheTime, 0) || 0, [request?.repairParts]);

    const filteredServices = useMemo(() => allServices.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())), [allServices, searchQuery]);
    const filteredParts = useMemo(() => allParts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())), [allParts, searchQuery]);

    return {
        state: {
            isEditingTotalPrice, localTotalPrice, isSavingTotal,
            editingSvcId, editSvcPrice,
            editingPartId, editPartPrice,
            activeEditTab, searchQuery, isPartsExpanded, isServicesExpanded,
            allServices, allParts,
            selectedServices, selectedParts,
            loading,
            isAddingSvc, newSvcName, newSvcPrice,
            isAddingPart, newPartName, newPartPrice, partTypes,
            isAddingNewCategory, newCategoryName, category,
            totalServices, totalParts, total,
            receiptServicesTotal, receiptPartsTotal,
            filteredServices, filteredParts
        },
        actions: {
            setIsEditingTotalPrice, setLocalTotalPrice,
            setEditingSvcId, setEditSvcPrice,
            setEditingPartId, setEditPartPrice,
            setActiveEditTab, setSearchQuery, setIsPartsExpanded, setIsServicesExpanded,
            setIsAddingSvc, setNewSvcName, setNewSvcPrice,
            setIsAddingPart, setNewPartName, setNewPartPrice,
            setIsAddingNewCategory, setNewCategoryName, setCategory,
            handleToggleService, handleServicePriceChange,
            handleTogglePart, handlePartPriceChange, handleToggleHidePart,
            handleAddService, handleCategoryChange, handleAddCategory, handleAddPart,
            handleComplete, handleSaveTotalPrice,
            handleRemoveService, handleSaveSvcPrice,
            handleSavePartPrice, handleToggleHidePartInDetails, handleRemovePart,
            formatPrice
        }
    };
};