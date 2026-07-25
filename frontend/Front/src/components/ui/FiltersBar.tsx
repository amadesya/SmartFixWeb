import React from 'react';

interface FiltersBarProps {
    activeStatusTab: string;
    filterStatus: string;
    setFilterStatus: (status: string) => void; // Исправили any на string
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
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <label htmlFor="status-filter" className="text-sm font-medium text-gray-600 dark:text-smartfix-light whitespace-nowrap">
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

            {/* Контейнер для полей даты (Грид 1х2 на мобильных, обычный флекс на десктопе) */}
            <div className="date-inputs-group grid grid-cols-2 gap-2 w-full md:flex md:w-auto md:contents">
                {/* Дата С */}
                <div className="flex items-center gap-1.5 md:gap-2 w-full md:w-auto">
                    <label htmlFor="start-date" className="text-sm font-medium text-gray-600 dark:text-smartfix-light whitespace-nowrap">
                        С:
                    </label>
                    <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="filter-input w-full"
                    />
                </div>

                {/* Дата По */}
                <div className="flex items-center gap-1.5 md:gap-2 w-full md:w-auto">
                    <label htmlFor="end-date" className="text-sm font-medium text-gray-600 dark:text-smartfix-light whitespace-nowrap">
                        По:
                    </label>
                    <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="filter-input w-full"
                    />
                </div>
            </div>

            {/* Кнопка сброса */}
            <button
                onClick={onReset}
                className="btn-details w-full md:w-auto md:ml-auto"
            >
                Сбросить фильтры
            </button>
        </div>
    );
};