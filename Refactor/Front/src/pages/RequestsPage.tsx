import React, { useContext, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Role, RequestStatus, RequestStatusLabels } from '../types';
import { useRequestsData } from '@/hooks/useRequestsData'; 
import { useRequestFilters } from '@/hooks/useRequestFilters'; 
import { useRequestDetails } from '@/hooks/useRequestDetails';

import { PageHeader } from '@/components/ui/PageHeader';
import RequestDetailsModal from '@/components/requestsDetail/RequestDetailsModal';
import { ClientView } from '@/components/requests/ClientView';
import { StaffView } from '@/components/requests/StaffView';
import { Search } from '@/components/ui/Search';

const STATUS_OPTIONS = Object.values(RequestStatus).map(status => ({
    value: status,
    label: RequestStatusLabels[status] || status
}));

const RequestsPage: React.FC = () => {
    const { user } = useAuth();

    const { allRequests, technicians, isLoading, refresh } = useRequestsData(user);

    const {
        filteredRequests,
        statusTab, setStatusTab,
        dateRange, setDateRange,
        resetFilters,
        searchQuery,     
        setSearchQuery,
    } = useRequestFilters(allRequests);

    const {
        selectedRequest,
        openDetailsModal,
        modalProps
    } = useRequestDetails(undefined, refresh, user);

    if (!user) return null;

    const isClient = user.role === Role.Client;

    return (
        <div className="space-y-6">
            <PageHeader
                title={isClient ? 'Личный кабинет' : 'Заявки на ремонт'}
            />

            <Search
                value={searchQuery || ''}
                onChange={(value) => setSearchQuery(value)}
            />

            <main>
                {isClient ? (
                    <ClientView
                        user={user}
                        requests={filteredRequests}
                        isLoading={isLoading}
                        onOpenDetails={openDetailsModal}
                        onSubmitted={refresh}
                    />
                ) : (
                    <StaffView
                        requests={filteredRequests}
                        isLoading={isLoading}
                        statusTab={statusTab}
                        setStatusTab={setStatusTab}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        onReset={resetFilters}
                        onOpenDetails={openDetailsModal}
                        statusOptions={STATUS_OPTIONS}
                    />
                )}
            </main>

            <RequestDetailsModal
                {...modalProps}
                technicians={technicians}
                refreshList={refresh}
                actions={{
                    submitNewComment: modalProps.submitNewComment,
                    submitUpdateComment: modalProps.submitUpdate,
                    handleDeleteComment: modalProps.handleDeleteComment,
                    handlePriceUpdate: modalProps.handlePriceUpdate,
                    handleDeleteRequest: modalProps.handleDeleteRequest,
                    handlePayment: modalProps.handlePayment,
                    handleUpdateRequest: modalProps.handleUpdateRequest,
                }}
            />
        </div>
    );
};

export default RequestsPage;