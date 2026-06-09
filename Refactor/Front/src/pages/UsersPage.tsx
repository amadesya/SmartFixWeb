import React, { useState, useEffect, useContext, useRef } from 'react';
import { getUsers, createUser, updateUser, deleteUser, getAuthHeader, API_URL, clientsApi } from '../services/api';
import { User, Role } from '../types';
import { AuthContext, useAuth } from '@/components/auth/AuthContext';
import { getFullAvatarUrl } from '../utils/avatarHelper';
import { UsersStats } from '@/components/users/UsersStats';
import UserModal from '@/components/users/UserModal';
import UserTable from '@/components/users/UserTable';
import { PageHeader } from '@/components/ui/PageHeader';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useConfirmation } from '@/hooks/useConfirmation';
import { Search, Filter, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { ClientDetailsModal } from '@/components/users/ClientDetailsModal';
import { ClientDetails } from '@/types/client';

const UsersPage: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [filterRole, setFilterRole] = useState<Role | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Client Details Modal State
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [selectedClientDetails, setSelectedClientDetails] = useState<ClientDetails | null>(null);
    const [clientAvatarUrl, setClientAvatarUrl] = useState<string | null>(null);

    const { itemToDelete, confirm, cancel } = useConfirmation<number>();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: Role.Client,
        isVerified: false,
        avatar: ''
    });

    useEffect(() => {
        if (!currentUser || currentUser.role !== Role.Admin) return;
        fetchUsers();
    }, [currentUser]);

    const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedAvatarFile(file);
            setFormData({ ...formData, avatar: '' });
        }
    };

    const handleAvatarUrlChange = (url: string) => {
        setFormData({ ...formData, avatar: url });
        if (url.trim()) {
            setSelectedAvatarFile(null);
        }
    };

    const handleSaveChanges = async () => {
        if (!selectedUser && !isCreating) {
            toast.error("Ошибка: Действие не определено.");
            return;
        }

        if (!formData.name || !formData.email) {
            toast.error('Заполните обязательные поля: Имя и Email');
            return;
        }
        if (isCreating && !formData.password) {
            toast.error('Укажите пароль для нового пользователя');
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append('Name', formData.name);
            submitData.append('Email', formData.email);
            submitData.append('Phone', formData.phone || '');

            if (formData.password) {
                submitData.append('Password', formData.password);
            }

            submitData.append('Role', formData.role.toString());
            submitData.append('IsVerified', formData.isVerified.toString());

            if (selectedAvatarFile) {
                submitData.append('AvatarFile', selectedAvatarFile);
            } else if (formData.avatar) {
                submitData.append('AvatarUrl', formData.avatar);
            }

            // Вызываем функции из api.ts вместо сырого fetch!
            if (isCreating) {
                await createUser(submitData as any);
            } else {
                await updateUser(selectedUser!.id, submitData);
            }

            toast.success(isCreating ? 'Пользователь успешно создан!' : 'Пользователь успешно обновлен!');

            setSelectedAvatarFile(null);
            closeModal();
            fetchUsers(); // Обновляем таблицу

        } catch (error: any) {
            console.error("Ошибка при сохранении:", error);
            toast.error(error.message || 'Произошла ошибка при сохранении данных.');
        }
    };
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
            toast.error('Не удалось загрузить пользователей');
        } finally {
            setIsLoading(false);
        }
    };

    const openCreateModal = () => {
        resetForm();
        setIsCreating(true);
        setSelectedUser(null);
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setIsCreating(false);
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            password: '',
            role: user.role,
            isVerified: !!user.isVerified,
            avatar: user.avatar || ''
        });
    };

    const closeModal = () => {
        setSelectedUser(null);
        setIsCreating(false);
        setSelectedAvatarFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        resetForm();
    };

    const handleViewClientDetails = async (user: User) => {
        try {
            const data = await clientsApi.getProfile(user.id);
            const realDetails: ClientDetails = {
                id: data.id.toString(),
                name: data.name,
                phone: data.phone && data.phone.trim() !== '' ? data.phone : '',
                email: data.email || '',
                registeredAt: new Date(data.registeredAt).getFullYear() > 2000 ? new Date(data.registeredAt).toLocaleDateString('ru-RU') : '',
                loyalty: {
                    discountPercent: data.loyalty.discountPercent,
                    accumulatedBonuses: data.loyalty.bonusPoints,
                    tier: data.loyalty.tier as any,
                    totalSpent: data.loyalty.totalSpent
                } as any,
                history: data.history.map(h => ({
                    id: h.id.toString(),
                    date: new Date(h.date).toLocaleDateString('ru-RU'),
                    device: h.device,
                    problem: h.problem,
                    status: h.status as any,
                    cost: h.cost,
                }))
            };
            
            setSelectedClientDetails(realDetails);
            setClientAvatarUrl(user.avatar || null);
            setIsClientModalOpen(true);
        } catch (error) {
            console.error("Ошибка загрузки профиля клиента:", error);
            toast.error("Не удалось загрузить данные клиента");
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            role: Role.Client,
            isVerified: false,
            avatar: ''
        });
    };


    const handleDelete = (userId: number) => {
        if (userId === currentUser?.id) {
            toast.error('Нельзя удалить собственный аккаунт');
            return;
        }

        confirm(userId);
    };

    const confirmAction = async () => {
        if (!itemToDelete) return;
        try {
            await deleteUser(itemToDelete);
            toast.success('Пользователь удален');
            fetchUsers();
        } catch (error: any) {
            console.error('Ошибка удаления:', error);
            toast.error(error.message || 'Не удалось удалить пользователя');
        } finally {
            cancel();
        }
    };

    const getRoleName = (role: Role): string => {
        switch (role) {
            case Role.Client: return 'Клиент';
            case Role.Technician: return 'Техник';
            case Role.Admin: return 'Администратор';
            default: return 'Неизвестно';
        }
    };

    const getRoleBadgeClass = (role: Role): string => {
        switch (role) {
            case Role.Client: return 'bg-blue-500/20 dark:text-blue-300 border-blue-500/30';
            case Role.Technician: return 'bg-green-500/20 dark:text-green-300 border-green-500/30';
            case Role.Admin: return 'bg-purple-500/20 dark:text-purple-300 border-purple-500/30';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesSearch;
    });

    if (!currentUser || currentUser.role !== Role.Admin) {
        return (
            <div className="text-center text-smartfix-light mt-12">
                <p className="text-xl">У вас нет доступа к этой странице</p>
            </div>
        );
    }

    const renderModal = () => {
        if (!isCreating && !selectedUser) return null;

        return (
            <UserModal
                isOpen={isCreating || !!selectedUser}
                isCreating={isCreating}
                selectedUser={selectedUser}
                formData={formData}
                setFormData={setFormData}
                fileInputRef={fileInputRef}
                onClose={closeModal}
                onSave={handleSaveChanges}
                handleAvatarUrlChange={handleAvatarUrlChange}
                handleAvatarFileChange={handleAvatarFileChange}
            />
        );
    };

    return (
        <div className="text-gray-900 dark:text-smartfix-lightest">
            <PageHeader
                title="Управление пользователями"
                actions={[
                    { label: 'Создать пользователя', onClick: openCreateModal }
                ]}
            />

            {/* Фильтры и поиск */}
            <div className="bg-gray-50 dark:bg-smartfix-dark/30 p-3 md:p-4 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 mb-4 md:mb-6 flex flex-col gap-3 md:gap-4">
                {/* Поиск */}
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Поиск по имени, фамилии или email..."
                        className="block w-full pl-10 pr-3 py-2 md:py-2.5 border border-gray-200 dark:border-smartfix-medium/30 rounded-xl bg-white dark:bg-smartfix-darker text-gray-900 dark:text-white text-sm outline-none focus:border-emerald-500 transition-colors shadow-sm"
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
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value === 'all' ? 'all' : Number(e.target.value) as Role)}
                            >
                                <option value="all">Все роли</option>
                                <option value={Role.Admin}>Администратор</option>
                                <option value={Role.Technician}>Техник</option>
                                <option value={Role.Client}>Клиент</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Кнопка Сбросить */}
                    {(searchQuery || filterRole !== 'all') && (
                        <button
                            onClick={() => { setSearchQuery(''); setFilterRole('all'); }}
                            className="text-sm font-medium text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
                        >
                            <XCircle size={16} />
                            Сбросить
                        </button>
                    )}
                </div>
            </div>

            {/* Статистика */}
            <UsersStats users={users} />

            {/* Список пользователей */}
            <div className="bg-white dark:bg-smartfix-darker rounded-xl shadow-sm border border-gray-200 dark:border-smartfix-medium/30 overflow-hidden mt-6">
                <UserTable
                    isLoading={isLoading}
                    filteredUsers={filteredUsers}
                    currentUser={currentUser}
                    getFullAvatarUrl={getFullAvatarUrl}
                    getRoleBadgeClass={getRoleBadgeClass}
                    getRoleName={getRoleName}
                    openEditModal={openEditModal}
                    handleDelete={handleDelete}
                    onViewClientDetails={handleViewClientDetails}
                />
            </div>
            {renderModal()}

            {/* Модальное окно профиля клиента */}
            <ClientDetailsModal
                isOpen={isClientModalOpen}
                onClose={() => setIsClientModalOpen(false)}
                client={selectedClientDetails}
                avatarUrl={clientAvatarUrl}
            />
            
            <ConfirmationModal
                isOpen={itemToDelete !== null}
                title="Удаление пользователя"
                message="Вы уверены, что хотите удалить этого пользователя? Это действие невозможно отменить."
                onConfirm={confirmAction}
                onCancel={cancel}
            />
        </div>
    );
};

export default UsersPage;