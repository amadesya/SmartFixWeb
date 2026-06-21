import React from 'react';
import { Role, User } from '@/types';
import DataTable, { Column } from '@/components/ui/DataTable';
import { PencilIcon, TrashIcon } from '../ui/icons';
import { Eye } from 'lucide-react';

interface UserTableProps {
    isLoading: boolean;
    filteredUsers: User[];
    currentUser: User | null;
    getFullAvatarUrl: (path: string | undefined | null) => string | null;
    getRoleBadgeClass: (role: Role) => string;
    getRoleName: (role: Role) => string;
    openEditModal: (user: User) => void;
    handleDelete: (id: number) => void | Promise<void>;
    onViewClientDetails?: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = (props) => {
    const {
        filteredUsers,
        isLoading,
        getFullAvatarUrl,
        getRoleBadgeClass,
        getRoleName,
        openEditModal,
        handleDelete,
        currentUser,
        onViewClientDetails
    } = props;

    // Определяем колонки специально для пользователей
    const columns: Column<User>[] = [
        {
            header: 'ID',
            render: (user) => <span className="text-black dark:text-smartfix-lightest">{user.id}</span>
        },
        {
            header: 'Пользователь',
            render: (user) => (
                <div className="flex items-center gap-3">
                    {user.avatar ? (
                        <img
                            src={getFullAvatarUrl(user.avatar) ?? ''}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                                e.target.src = '/public/avatar-default.png'; 
                            }}
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-smartfix-medium flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="font-medium text-gray-900 dark:text-smartfix-lightest">{user.name}</span>
                </div>
            )
        },
        { header: 'Email', render: (user) => <span className="text-gray-500 dark:text-smartfix-light">{user.email}</span> },
        { header: 'Телефон', render: (user) => <span className="text-gray-500 dark:text-smartfix-light">{user.phone || '—'}</span> },
        {
            header: 'Роль',
            render: (user) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border text-gray-900 ${getRoleBadgeClass(user.role)}`}>
                    {getRoleName(user.role)}
                </span>
            )
        },
        {
            header: 'Статус',
            render: (user) => (
                user.isVerified ?
                    <span className="text-green-400 text-sm flex items-center gap-1">Подтвержден</span> :
                    <span className="text-gray-500 text-sm">Не подтвержден</span>
            )
        },
        {
            header: 'Действия',
            className: 'w-10',
            render: (user) => (
                <div className="flex justify-end items-center gap-2">
                    {user.role === Role.Client && onViewClientDetails && (
                        <button
                            onClick={() => onViewClientDetails(user)}
                            className="bg-gray-50 dark:bg-smartfix-darkest p-2 rounded-lg text-emerald-500 hover:text-white hover:bg-emerald-600 transition-all"
                            title="Профиль клиента"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={() => openEditModal(user)}
                        className="bg-gray-50 dark:bg-smartfix-darkest p-2 rounded-lg text-blue-400 hover:text-white hover:bg-blue-600 transition-all"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-gray-50 dark:bg-smartfix-darkest p-2 rounded-lg text-red-400 hover:text-white hover:bg-red-600 transition-all"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <DataTable
            data={filteredUsers}
            columns={columns}
            isLoading={isLoading}
            rowKey={(user) => user.id}
            emptyMessage="Пользователи не найдены"
        />
    );
};

export default UserTable;