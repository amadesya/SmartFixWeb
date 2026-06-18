import React from 'react';

interface FiltersBarProps {
    activeStatusTab: string;
    filterStatus: string;
    setFilterStatus: (status: any) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
    onReset: () => void;
    requestStatusOptions: { value: string; label: string }[];
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
    activeStatusTab,
    filterStatus,
    setFilterStatus,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onReset,
    requestStatusOptions
}) => {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6 p-3 md:p-4 bg-white dark:bg-smartfix-dark rounded-lg border border-gray-200 dark:border-smartfix-medium shadow-sm dark:shadow-none">
            {/* Селект статуса: показываем только если выбрана вкладка "Все" */}
            {activeStatusTab === 'all' && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label htmlFor="status-filter" className="text-sm font-medium text-gray-600 dark:text-smartfix-light">
                        Статус:
                    </label>
                    <select
                        id="status-filter"
                        onChange={(e) => setFilterStatus(e.target.value)}
                        value={filterStatus}
                        className="bg-gray-50 dark:bg-smartfix-darker p-1.5 md:p-2 rounded-lg border border-gray-200 dark:border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light text-sm md:text-base text-gray-900 dark:text-smartfix-lightest flex-1"
                    >
                        <option value="all">Все статусы</option>
                        {requestStatusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Дата С */}
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
                <label htmlFor="start-date" className="hidden sm:block text-sm font-medium text-gray-600 dark:text-smartfix-light">С:</label>
                <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="bg-gray-50 dark:bg-smartfix-darker p-1.5 md:p-2 rounded-lg border border-gray-200 dark:border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light text-xs md:text-sm text-gray-900 dark:text-smartfix-lightest w-full"
                />
            </div>

            {/* Дата По */}
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
                <label htmlFor="end-date" className="hidden sm:block text-sm font-medium text-gray-600 dark:text-smartfix-light">По:</label>
                <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="bg-gray-50 dark:bg-smartfix-darker p-1.5 md:p-2 rounded-lg border border-gray-200 dark:border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light text-xs md:text-sm text-gray-900 dark:text-smartfix-lightest w-full"
                />
            </div>

            {/* Кнопка сброса */}
            <button
                onClick={onReset}
                className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 w-full sm:w-auto sm:ml-auto bg-gray-100 dark:bg-smartfix-medium/20 text-gray-900 dark:text-smartfix-lightest rounded-xl hover:bg-gray-200 dark:hover:bg-smartfix-medium transition-colors font-bold active:scale-95 transform"
            >
                Сбросить фильтры
            </button>
        </div>
    );
};