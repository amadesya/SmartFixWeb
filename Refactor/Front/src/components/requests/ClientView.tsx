import React, { useState, useEffect } from 'react';
import { RepairRequest, User } from '@/types';
import { Tabs } from '../ui/Tabs';
import { RequestList } from '../requests/RequestList';
import NewRequestForm from '../requests/NewRequests';
import { ClientLoyaltyCard } from '../users/ClientLoyaltyCard';
import { ClientBonus } from '@/types/client';
import { clientsApi } from '@/services/api';

interface ClientViewProps {
    requests: RepairRequest[];
    isLoading: boolean;
    user: User;
    onOpenDetails: (request: RepairRequest) => void;
    onSubmitted: () => void;
}

const currentClientLoyalty: ClientBonus = {
  discountPercent: 5,
  accumulatedBonuses: 4609,
  tier: 'Silver'
};

export const ClientView: React.FC<ClientViewProps> = ({
    requests,
    isLoading,
    user,
    onOpenDetails,
    onSubmitted
}) => {
    const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');
    const [loyalty, setLoyalty] = useState<any>(null);

    useEffect(() => {
        if (user?.id) {
            clientsApi.getProfile(user.id)
                .then(data => setLoyalty(data.loyalty))
                .catch(console.error);
        }
    }, [user]);

    return (
        <div className="space-y-4">
            <Tabs
                options={[
                    { id: 'list', label: 'Мои заявки' },
                    { id: 'new', label: 'Новая заявка' },
                ]}
                activeTab={activeTab}
                onTabChange={(id) => setActiveTab(id as 'list' | 'new')}
            />

            {activeTab === 'new' ? (
                <div>
                    <NewRequestForm
                        user={user}
                        onSubmitted={() => {
                            onSubmitted();
                            setActiveTab('list');
                        } }
                        onCancel={() => setActiveTab('list')} onSubmit={function (data: any): void {
                            throw new Error('Function not implemented.');
                        } }                    />
                </div>
            ) : (
                <div className="space-y-6">
                    <ClientLoyaltyCard loyalty={loyalty || currentClientLoyalty} />
                    <RequestList
                        requests={requests}
                        isLoading={isLoading}
                        onOpenDetails={onOpenDetails}
                    />
                </div>
            )}
        </div>
    );
};