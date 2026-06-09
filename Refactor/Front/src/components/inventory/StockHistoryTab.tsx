import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';
import { getStockMovements } from '@/services/api';
import DataTable, { Column } from '@/components/ui/DataTable';

export const StockHistoryTab: React.FC = () => {
    const [movements, setMovements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [typeFilter, setTypeFilter] = useState('');
    const [search, setSearch] = useState('');

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const data = await getStockMovements(page, 20, typeFilter, search);
            setMovements(data.items);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Загрузка данных при изменении страницы или фильтров
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchHistory();
        }, 300); // Debounce для поиска
        return () => clearTimeout(timer);
    }, [page, typeFilter, search]);

    const columns: Column<any>[] = [
        {
            header: 'Дата',
            render: (m) => <span className="whitespace-nowrap text-gray-900 dark:text-smartfix-lightest">{new Date(m.date).toLocaleString('ru-RU')}</span>
        },
        {
            header: 'Запчасть',
            render: (m) => <span className="font-medium text-gray-900 dark:text-smartfix-lightest">{m.partName}</span>
        },
        {
            header: 'Тип',
            render: (m) => <span className="text-gray-900 dark:text-smartfix-lightest">{m.type}</span>
        },
        {
            header: 'Количество',
            render: (m) => (
                <span className={`font-bold ${m.quantity > 0 ? 'text-emerald-600 dark:text-[#00FF88]' : 'text-red-600 dark:text-red-400'}`}>
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                </span>
            )
        },
        {
            header: 'Сотрудник',
            render: (m) => <span className="text-gray-900 dark:text-smartfix-lightest">{m.employeeName}</span>
        },
        {
            header: 'Комментарий',
            render: (m) => <span className="text-gray-500 dark:text-smartfix-light/70">{m.comment}</span>
        }
    ];

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            {/* Search and Filters Block */}
            <div className="bg-gray-50 dark:bg-smartfix-dark/30 p-4 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 mb-6 flex flex-col gap-4 shadow-sm">
                {/* Search Full-width */}
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Поиск по названию запчасти или артикулу..."
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-smartfix-medium/30 rounded-xl bg-white dark:bg-smartfix-darker text-gray-900 dark:text-white text-sm outline-none focus:border-emerald-500 transition-colors shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter size={18} className="text-gray-400" />
                            </div>
                            <select
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-smartfix-medium/30 rounded-xl bg-white dark:bg-smartfix-darker text-gray-900 dark:text-white text-sm outline-none focus:border-emerald-500 appearance-none transition-colors shadow-sm"
                                value={typeFilter}
                                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                            >
                                <option value="">Все операции</option>
                                <option value="Приход">Приход</option>
                                <option value="Расход">Расход</option>
                                <option value="Списание">Списание</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Reset Button */}
                    {(search || typeFilter) && (
                        <button 
                            onClick={() => { setSearch(''); setTypeFilter(''); setPage(1); }}
                            className="text-sm font-medium text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
                        >
                            <XCircle size={16} />
                            Сбросить
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-smartfix-darker rounded-xl border border-gray-200 dark:border-smartfix-medium/30 overflow-hidden shadow-sm">
                <DataTable
                    data={movements}
                    columns={columns}
                    isLoading={isLoading}
                    rowKey={(m) => m.id}
                    emptyMessage="История операций пуста."
                />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Страница {page} из {totalPages}</span>
                    <div className="flex gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 bg-white dark:bg-smartfix-darker border border-gray-200 dark:border-smartfix-medium/30 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-smartfix-dark text-gray-700 dark:text-gray-300 transition-colors shadow-sm">
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 bg-white dark:bg-smartfix-darker border border-gray-200 dark:border-smartfix-medium/30 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-smartfix-dark text-gray-700 dark:text-gray-300 transition-colors shadow-sm">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};