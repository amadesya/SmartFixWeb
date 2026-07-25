import React from 'react';
import { User, Camera, Trash2 } from 'lucide-react'; // Импортируем Trash2

interface ProfileAvatarProps {
    displayUrl: string | null;
    onEditClick: () => void;
    onDeleteClick: () => void; // Новый пропс
    userName: string;
    roleLabel: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
    displayUrl, onEditClick, onDeleteClick, userName, roleLabel 
}) => (
    <div className="flex items-center mb-8 pb-8 border-b border-smartfix-medium">
        <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-smartfix-dark flex items-center justify-center border-2 border-smartfix-medium overflow-hidden transition-all group-hover:border-smartfix-light/50">
                {displayUrl ? (
                    <img src={displayUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <User size={44} className="text-smartfix-medium" />
                )}
            </div>
            
            {/* Группа кнопок управления */}
            <div className="absolute -bottom-1 -right-2 flex gap-1">
                {/* Кнопка удаления (показываем только если есть аватар) */}
                {displayUrl && (
                    <button
                        type="button"
                        onClick={onDeleteClick}
                        className="bg-red-500/80 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors"
                        title="Удалить аватар"
                    >
                        <Trash2 size={14} />
                    </button>
                )}

                {/* Кнопка смены фото */}
                <button
                    type="button"
                    onClick={onEditClick}
                    className="bg-smartfix-light text-smartfix-darkest rounded-full p-2 shadow-lg hover:scale-110 transition-transform active:scale-95"
                    title="Изменить фото"
                >
                    <Camera size={16} strokeWidth={2.5} />
                </button>
            </div>
        </div>

        <div className="ml-6">
            <h3 className="text-2xl font-bold dark:text-smartfix-lightest text-black text-black">{userName}</h3>
            <p className="text-black dark:text-smartfix-light">{roleLabel}</p>
        </div>
    </div>
);

export default ProfileAvatar;