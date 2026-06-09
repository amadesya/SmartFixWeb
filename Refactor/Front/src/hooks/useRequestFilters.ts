import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { getRepairRequests, getTechnicians } from "../services/api";
import { RepairRequest, RequestStatus, RequestStatusLabels, Role, User } from '../types';

export const useRequestFilters = (requests: RepairRequest[]) => {
    const [statusTab, setStatusTab] = useState<RequestStatus | 'all'>('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [searchQuery, setSearchQuery] = useState("");

const filteredRequests = useMemo(() => {
    return requests.filter(r => {
        const matchStatus = statusTab === 'all' || r.status === statusTab;
        
        const date = new Date(r.createdAt);
        date.setHours(0, 0, 0, 0);
        const start = dateRange.start ? new Date(dateRange.start) : null;
        const end = dateRange.end ? new Date(dateRange.end) : null;
        const matchDate = (!start || date >= start) && (!end || date <= end);

        const search = searchQuery.toLowerCase().trim();
        const matchSearch = !search || 
            r.id.toString().includes(search) || 
            r.device?.toLowerCase().includes(search) ||
            r.clientName?.toLowerCase().includes(search);

        return matchStatus && matchDate && matchSearch;
    });
}, [requests, statusTab, dateRange, searchQuery]);

    return { 
        filteredRequests, 
        statusTab, setStatusTab, 
        dateRange, setDateRange,
        searchQuery,
        setSearchQuery,
        resetFilters: () => {
            setStatusTab('all');
            setDateRange({ start: '', end: '' });
            setSearchQuery('');
        }
    };
};