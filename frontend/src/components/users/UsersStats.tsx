import React from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { Role, User } from '@/types';

interface Props {
    users: User[];
}

export const UsersStats = ({ users }: Props) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard
                label="Всего пользователей"
                value={users.length}
            />
            <StatCard
                label="Клиентов"
                value={users.filter(u => u.role === Role.Client).length}
                valueColor="text-blue-900 dark:text-blue-300"
            />
            <StatCard
                label="Техников"
                value={users.filter(u => u.role === Role.Technician).length}
                valueColor="text-green-900 dark:text-green-300"
            />
            <StatCard
                label="Администраторов"
                value={users.filter(u => u.role === Role.Admin).length}
                valueColor="text-purple-900 dark:text-purple-300"
            />
        </div>
    );
};