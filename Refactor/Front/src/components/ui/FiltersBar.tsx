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
        <div className="filter-card">
            {/* Селект статуса */}
            {activeStatusTab === 'all' && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label htmlFor="status-filter" className="text-sm font-medium text-gray-600 dark:text-smartfix-light">
                        Статус:
                    </label>
                    <select
                        id="status-filter"
                        onChange={(e) => setFilterStatus(e.target.value)}
                        value={filterStatus}
                        className="filter-input flex-1"
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
                    className="filter-input w-full"
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
                    className="filter-input w-full"
                />
            </div>

            {/* Кнопка сброса */}
            <button
                onClick={onReset}
                className="btn-details w-full sm:w-auto sm:ml-auto"
            >
                Сбросить фильтры
            </button>
        </div>
    );
};