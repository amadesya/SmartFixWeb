import React from 'react';
import { RepairRequest, RequestStatus } from '@/types';
import { Tabs } from '../ui/Tabs';
import { FiltersBar } from '../ui/FiltersBar';
import { RequestList } from '../requests/RequestList';

const STATUS_TABS = [
    { id: 'all', label: 'Все' },
    { id: RequestStatus.New, label: 'Новые' },
    { id: RequestStatus.InProgress, label: 'В работе' },
    { id: RequestStatus.Ready, label: 'Готовы к выдаче' },
    { id: RequestStatus.Rejected, label: 'Отклоненные' },
];

interface StaffViewProps {
    requests: RepairRequest[];
    isLoading: boolean;
    statusTab: RequestStatus | 'all';
    setStatusTab: (status: RequestStatus | 'all') => void;
    dateRange: { start: string; end: string };
    setDateRange: (range: { start: string; end: string }) => void;
    onReset: () => void;
    onOpenDetails: (request: RepairRequest) => void;
    statusOptions: { value: string; label: string }[];
}

export const StaffView: React.FC<StaffViewProps> = ({
    requests,
    isLoading,
    statusTab,
    setStatusTab,
    dateRange,
    setDateRange,
    onReset,
    onOpenDetails,
    statusOptions
}) => {
    return (
        <div className="space-y-6">
            <Tabs
                options={STATUS_TABS}
                activeTab={statusTab}
                onTabChange={(id) => setStatusTab(id as RequestStatus | 'all')}
            />

            <FiltersBar
                activeStatusTab={statusTab}
                filterStatus={statusTab} 
                setFilterStatus={setStatusTab}
                startDate={dateRange.start}
                setStartDate={(date) => setDateRange({ ...dateRange, start: date })}
                endDate={dateRange.end}
                setEndDate={(date) => setDateRange({ ...dateRange, end: date })}
                onReset={onReset}
                requestStatusOptions={statusOptions}
            />

            <RequestList
                requests={requests}
                isLoading={isLoading}
                onOpenDetails={onOpenDetails}
            />
        </div>
    );
};