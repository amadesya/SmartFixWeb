import React from 'react';
import Modal from '@/components/ui/Modal';
import { ClientDetails } from '@/types/client';
import { ClientLoyaltyCard } from './ClientLoyaltyCard';
import { ClientHistoryTable } from './ClientHistoryTable';
import { getFullAvatarUrl } from '@/utils/avatarHelper';
import { UserIcon } from 'lucide-react';

interface ClientDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    client: ClientDetails | null;
    avatarUrl?: string | null;
}

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
    isOpen,
    onClose,
    client,
    avatarUrl
}) => {
    if (!client) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Профиль клиента: ${client.name}`}
        >
            <div className="space-y-6">
                {/* Шапка профиля */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-smartfix-dark rounded-xl border border-gray-100 dark:border-smartfix-medium/20">
                    <div className="shrink-0">
                        {avatarUrl ? (
                            <img
                                src={getFullAvatarUrl(avatarUrl) ?? undefined}
                                alt="Аватар"
                                className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-smartfix-medium/30 shadow-sm"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-white dark:bg-smartfix-darker flex items-center justify-center border-2 border-gray-100 dark:border-smartfix-medium/30 shadow-sm">
                                <UserIcon className="w-8 h-8 text-gray-400 dark:text-smartfix-light/50" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-smartfix-lightest">{client.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:gap-4 mt-1 text-sm text-gray-500 dark:text-smartfix-light/70">
                            {client.phone && <span>📞 {client.phone}</span>}
                            {client.email && <span>✉️ {client.email}</span>}
                        </div>
                        {client.registeredAt && (
                            <p className="text-xs text-gray-400 dark:text-smartfix-light/50 mt-1">Клиент с {client.registeredAt}</p>
                        )}
                    </div>
                </div>

                {/* Блок лояльности */}
                <ClientLoyaltyCard loyalty={client.loyalty} />

                {/* История обращений */}
                <ClientHistoryTable history={client.history} />
            </div>
        </Modal>
    );
};