import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { InventoryTable } from '@/components/inventory/InventoryTable';
import { InventoryStats } from '@/components/inventory/InventoryStats';
import InventoryModal from '@/components/inventory/InventoryModal';
import { PageHeader } from '@/components/ui/PageHeader';
import { StockMovementHistoryModal } from '@/components/inventory/StockMovementHistoryModal';
import { History } from 'lucide-react';
import { StockHistoryTab } from '@/components/inventory/StockHistoryTab';
import { Search, Filter, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useConfirmation } from '@/hooks/useConfirmation';
import toast from 'react-hot-toast';
import { deletePart } from '@/services/api';


export const InventoryPage = () => {
    const {
        parts,
        searchQuery,
        setSearchQuery,
        modalMode,
        types,
        isModalOpen,
        formData,
        setFormData,
        typeFormData,
        setTypeFormData,
        filteredParts,
        closeModal,
        openEditModal,
        handleDelete,
        handleSubmit,
        handleTypeSubmit,
        handleAddPurchase,
        handleAddType
    } = useInventory();

    const [historyPart, setHistoryPart] = useState<{ id: number, name: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'stock' | 'history'>('stock');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');

    const finalFilteredParts = filteredParts.filter((part: any) => {
        const matchCategory = categoryFilter === '' || part.type?.id?.toString() === categoryFilter || part.typeId?.toString() === categoryFilter;
        let matchStock = true;
        if (stockFilter === 'low') matchStock = part.stockQuantity > 0 && part.stockQuantity <= 5;
        else if (stockFilter === 'in_stock') matchStock = part.stockQuantity > 0;
        else if (stockFilter === 'out_of_stock') matchStock = part.stockQuantity === 0;
        return matchCategory && matchStock;
    });

    const { itemToDelete, confirm, cancel } = useConfirmation<number>();

    const confirmDeleteAction = async () => {
        if (itemToDelete === null) return;
        try {
            await deletePart(itemToDelete);
            toast.success('Запчасть успешно списана со склада');
            window.location.reload(); // Перезагружаем для обновления списка
        } catch (error: any) {
            toast.error(error.message || 'Ошибка при удалении запчасти');
        } finally {
            cancel();
        }
    };

    return (
        <div className="text-gray-900 dark:text-smartfix-lightest">
            {isModalOpen && (
                <InventoryModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    modalMode={modalMode!}
                    formData={formData}
                    setFormData={setFormData}
                    typeFormData={typeFormData}
                    setTypeFormData={setTypeFormData}
                    types={types}
                    handleSubmit={handleSubmit}
                    handleTypeSubmit={handleTypeSubmit}
                />
            )}

            <PageHeader
                title="Запчасти"
                actions={[
                    { label: 'Оформить закупку', onClick: handleAddPurchase },
                    { label: 'Добавить новый тип запчасти', onClick: handleAddType }
                ]}
            />
            <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-smartfix-medium/30">
                <button 
                    onClick={() => setActiveTab('stock')} 
                    className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === 'stock' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                    Текущий остаток
                </button>
                <button 
                    onClick={() => setActiveTab('history')} 
                    className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === 'history' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                    История операций
                </button>
            </div>

            {activeTab === 'stock' ? (
                <>
                    <div className="bg-gray-50 dark:bg-smartfix-dark/30 p-3 md:p-4 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 mb-4 md:mb-6 flex flex-col gap-3 md:gap-4 shadow-sm">
                        {/* Поиск */}
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Поиск по названию запчасти или артикулу..."
                                className="block w-full pl-10 pr-3 py-2 md:py-2.5 border border-gray-200 dark:border-smartfix-medium/30 rounded-xl bg-white dark:bg-smartfix-darker text-gray-900 dark:text-white text-sm outline-none focus:border-emerald-500 transition-colors shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Фильтры */}
                        <div className="flex flex-col md:flex-row flex-wrap justify-between items-start md:items-center gap-3">
                            <div className="flex flex-wrap gap-2 md:gap-4 w-full sm:w-auto">
                                <div className="relative w-full sm:w-48 lg:w-64">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Filter size={18} className="text-gray-400" />
                                    </div>
                                    <select
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-smartfix-medium/30 rounded-xl bg-white dark:bg-smartfix-darker text-gray-900 dark:text-white text-sm outline-none focus:border-emerald-500 appearance-none transition-colors shadow-sm"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        <option value="">Все категории</option>
                                        {types.map((t: any) => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative w-full sm:w-48 lg:w-64">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Filter size={18} className="text-gray-400" />
                                    </div>
                                    <select
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-smartfix-medium/30 rounded-xl bg-white dark:bg-smartfix-darker text-gray-900 dark:text-white text-sm outline-none focus:border-emerald-500 appearance-none transition-colors shadow-sm"
                                        value={stockFilter}
                                        onChange={(e) => setStockFilter(e.target.value)}
                                    >
                                        <option value="">Любой статус запаса</option>
                                        <option value="in_stock">В наличии</option>
                                        <option value="low">Низкий (≤ 5)</option>
                                        <option value="out_of_stock">Нет в наличии</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Кнопка Сбросить */}
                            {(searchQuery || categoryFilter || stockFilter) && (
                                <button 
                                    onClick={() => { setSearchQuery(''); setCategoryFilter(''); setStockFilter(''); }}
                                    className="text-sm font-medium text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
                                >
                                    <XCircle size={16} />
                                    Сбросить
                                </button>
                            )}
                        </div>
                    </div>

                    <InventoryStats parts={parts} />

                    <InventoryTable
                        parts={finalFilteredParts}
                        onEdit={openEditModal}
                        onDelete={confirm}
                        onShowHistory={setHistoryPart}
                    />
                </>
            ) : (
                <StockHistoryTab />
            )}

            {historyPart && (
                <StockMovementHistoryModal
                    partId={historyPart.id}
                    partName={historyPart.name}
                    onClose={() => setHistoryPart(null)}
                />
            )}

            <ConfirmationModal
                isOpen={itemToDelete !== null}
                title="Удаление запчасти"
                message="Это действие приведет к списанию позиции из базы данных. Продолжить?"
                onConfirm={confirmDeleteAction}
                onCancel={cancel}
            />
        </div>
    );
};

export default InventoryPage;