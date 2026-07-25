import React from 'react';
import { Role } from '@/types'; 

interface UserFiltersProps {
    filterRole: 'all' | Role;
    setFilterRole: (role: 'all' | Role) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
    filterRole,
    setFilterRole,
    searchQuery,
    setSearchQuery
}) => {
    const handleReset = () => {
        setFilterRole('all');
        setSearchQuery('');
    };

    return (
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-smartfix-dark rounded-lg border border-smartfix-medium">
            <div>
                <label htmlFor="role-filter" className="text-sm font-medium text-smartfix-light mr-2">
                    Роль:
                </label>
                <select
                    id="role-filter"
                    value={filterRole}
                    onChange={e => setFilterRole(e.target.value === 'all' ? 'all' : parseInt(e.target.value) as Role)}
                    className="bg-smartfix-darker p-2 rounded-lg border border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-smartfix-light"
                >
                    <option value="all">Все роли</option>
                    <option value={Role.Client}>Клиенты</option>
                    <option value={Role.Technician}>Техники</option>
                    <option value={Role.Admin}>Администраторы</option>
                </select>
            </div>

            <div className="flex-1">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Поиск по имени или email..."
                    className="w-full bg-smartfix-darker p-2 rounded-lg border border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-smartfix-light"
                />
            </div>

            <button
                onClick={handleReset}
                className="text-sm bg-smartfix-medium text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors"
            >
                Сбросить
            </button>
        </div>
    );
};