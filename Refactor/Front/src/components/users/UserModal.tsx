import React from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Role, User } from '@/types';

interface UserModalProps {
    isOpen: boolean;
    isCreating: boolean;
    selectedUser: User | null;
    formData: any;
    setFormData: (data: any) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onClose: () => void;
    onSave: () => void;
    handleAvatarUrlChange: (url: string) => void;
    handleAvatarFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserModal: React.FC<UserModalProps> = ({
    isOpen,
    isCreating,
    selectedUser,
    formData,
    setFormData,
    fileInputRef,
    onClose,
    onSave,
    handleAvatarUrlChange,
    handleAvatarFileChange,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isCreating ? 'Создать пользователя' : `Редактировать: ${selectedUser?.name}`}
        >
            <div className="space-y-4">

                <Input
                    label="Имя *"
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Иван Иванов"
                />

                <Input
                    label="Email *"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@mail.com"
                />

                <Input
                    label="Телефон"
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 (999) 123-45-67"
                />

                <Input
                    label={isCreating ? 'Пароль *' : 'Пароль (оставьте пустым, чтобы не менять)'}
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="********"
                />

                <Select
                    label="Роль"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: parseInt(e.target.value) as Role })}
                >
                    <option value={Role.Client}>Клиент</option>
                    <option value={Role.Technician}>Техник</option>
                    <option value={Role.Admin}>Администратор</option>
                </Select>

                {/* Блок аватара: используем Input для текста и нативный input для файла */}
                <div>
                    <Input
                        label="Аватар (URL или загрузка файла)"
                        type="text"
                        value={formData.avatar}
                        onChange={e => handleAvatarUrlChange(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="mb-3"
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileChange}
                        className="w-full text-gray-500 dark:text-smartfix-light text-sm 
                        file:mr-4 file:py-2 file:px-4 
                        file:rounded-lg file:border-0 
                        file:text-sm file:font-semibold 
                        file:bg-smartfix-medium file:text-white 
                        hover:file:bg-smartfix-light cursor-pointer"
                    />
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-smartfix-dark border border-gray-200 dark:border-transparent rounded-lg">
                    <input
                        type="checkbox"
                        id="isVerified"
                        checked={formData.isVerified}
                        onChange={e => setFormData({ ...formData, isVerified: e.target.checked })}
                        className="w-4 h-4 text-emerald-500 dark:text-smartfix-light border-gray-300 dark:border-smartfix-medium rounded focus:ring-emerald-500 dark:focus:ring-smartfix-light"
                    />
                    <label htmlFor="isVerified" className="text-gray-700 dark:text-smartfix-light text-sm">
                        Подтвержденный аккаунт
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button onClick={onClose} variant="secondary">
                        Отмена
                    </Button>
                    <Button onClick={onSave} variant="default">
                        {isCreating ? 'Создать' : 'Сохранить'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default UserModal;