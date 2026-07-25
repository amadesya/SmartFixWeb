import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { getRepairRequests, getTechnicians } from "../services/api";
import { RepairRequest, RequestStatus, RequestStatusLabels, Role, User } from '../types';

export const useRequestsData = (user: User | null) => {
    const [allRequests, setAllRequests] = useState<RepairRequest[]>([]);
    const [technicians, setTechnicians] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const rawData = await getRepairRequests();
            
            // Логика фильтрации по ролям переехала сюда
            let allowedData = rawData;
            if (user.role === Role.Client) {
                allowedData = rawData.filter(r => r.clientId === user.id);
            } else if (user.role === Role.Technician) {
                allowedData = rawData.filter(r =>
                    r.technicianId === user.id ||
                    (r.status === RequestStatus.New && r.technicianId === null)
                );
            }

            if (user.role === Role.Admin) {
                const techs = await getTechnicians();
                setTechnicians(techs);
            }

            setAllRequests(allowedData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return { allRequests, technicians, isLoading, refresh: fetchData };
};