import React, { useEffect, useState } from 'react';
import { useProfileEditor } from '../hooks/useProfileEditor';
import { getFullAvatarUrl } from '../utils/avatarHelper';
import { clientsApi, ClientDetailsDto } from '../services/api';

import { Button } from '../components/ui/Button';
import Input from '../components/ui/Input';

import ProfileAvatar from '@/components/profile/ProfileAvatar.tsx'; 
import NotificationSettings from '@/components/profile/NotificationSettings';
import { ClientLoyaltyCard } from '@/components/users/ClientLoyaltyCard';
import { ClientBonus } from '@/types/client';
import { Role } from '@/types';

const currentClientLoyalty: ClientBonus = {
  discountPercent: 5,
  accumulatedBonuses: 4609,
  tier: 'Silver'
};

const ProfilePage: React.FC = () => {
    const {
        user, formData, isSaving, isSubscribing, message,
        avatarPreview, fileInputRef, handlePushSubscribe,
        handleInputChange, handleAvatarFileChange, handleAvatarUrlChange,
        handleSubmit, handleAvatarButtonClick, handleDeleteAvatar, botUsername
    } = useProfileEditor();

    const [loyaltyData, setLoyaltyData] = useState<ClientBonus | null>(null);
    const [clientHistory, setClientHistory] = useState<ClientDetailsDto['history']>([]);

    useEffect(() => {
        if (user && user.role === Role.Client) {
            clientsApi.getProfile(user.id)
                .then(data => {
                    setLoyaltyData({
                        discountPercent: data.loyalty.discountPercent,
                        accumulatedBonuses: data.loyalty.bonusPoints,
                        totalSpent: data.loyalty.totalSpent || 0,
                        tier: data.loyalty.tier as any
                    } as ClientBonus);
                    setClientHistory(data.history);
                })
                .catch(err => console.error("Ошибка загрузки профиля:", err));
        }
    }, [user]);

    if (!user) return <div className="p-10 text-gray-900 dark:text-smartfix-lightest">Загрузка...</div>;

    const avatarDisplay = avatarPreview || (formData.avatar ? getFullAvatarUrl(formData.avatar) : null);
    const botUrl = `https://t.me/${botUsername}?start=${user.id}`;

    return (
        <div className="max-w-4xl mx-auto text-gray-900 dark:text-smartfix-lightest p-4">
            <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-smartfix-lightest">Мой профиль</h2>

            {/* Алерт-сообщение */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-50 dark:bg-green-500/20 border-green-200 dark:border-green-500 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-500/20 border-red-200 dark:border-red-500 text-red-700 dark:text-red-300'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-smartfix-darker p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-smartfix-medium/30 dark:shadow-xl max-w-3xl mb-6">
                <ProfileAvatar
                    displayUrl={avatarDisplay}
                    userName={formData.name}
                    roleLabel={user.role === Role.Admin ? 'Админ' : user.role === Role.Technician ? 'Мастер' : 'Клиент'}
                    onEditClick={handleAvatarButtonClick}
                    onDeleteClick={handleDeleteAvatar}
                />
                
                {user.role === Role.Client && (
                    <div className="mt-8 mb-6">
                        <ClientLoyaltyCard loyalty={loyaltyData || currentClientLoyalty} />
                        
                        {clientHistory.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-xl font-semibold dark:text-smartfix-light text-black mb-4">История ремонтов</h4>
                                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                                    {clientHistory.map(item => (
                                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-smartfix-dark border border-gray-100 dark:border-smartfix-medium/20 rounded-xl">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{item.device}</p>
                                                <p className="text-xs text-gray-500 dark:text-smartfix-light/60">{new Date(item.date).toLocaleDateString('ru-RU')} • {item.problem}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900 dark:text-white">{item.cost} ₽</p>
                                                <p className={`text-xs font-medium ${item.status === 'Ready' || item.status === 'Готова' ? 'text-green-500' : item.status === 'New' ? 'text-purple-500' : 'text-blue-500'}`}>
                                                    {item.status === 'Ready' || item.status === 'Готова' ? 'Готово' : item.status === 'New' ? 'Новая' : item.status === 'InProgress' ? 'В работе' : item.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Имя" name="name" value={formData.name} onChange={handleInputChange} required />
                        <Input label="Телефон" name="phone" value={formData.phone} onChange={handleInputChange} />
                    </div>

                    <Input
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        helperText={user.email !== formData.email ? `Текущий: ${user.email}` : undefined}
                    />
                    
                    <NotificationSettings
                        onPushSubscribe={handlePushSubscribe}
                        isSubscribing={isSubscribing}
                        botUrl={botUrl}
                    />

                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold dark:text-smartfix-light text-black mb-4">Безопасность</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Новый пароль" type="password" name="password" value={formData.password} onChange={handleInputChange} />
                            <Input label="Подтверждение" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="pt-6">
                        <Button type="submit" disabled={isSaving} className="w-full md:w-auto px-12">
                            {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;