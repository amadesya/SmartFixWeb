import { useState, useEffect, useCallback } from "react";
import { getRepairRequests, getTechnicians } from "../services/api";
import { RepairRequest } from "../types";

export const useReportsData = () => {
    const [requests, setRequests] = useState<RepairRequest[]>([]);
    const [technicians, setTechnicians] = useState<{ id: number; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [requestsData, techniciansData] = await Promise.all([
                getRepairRequests(),
                getTechnicians(),
            ]);
            setRequests(requestsData);
            setTechnicians(techniciansData);
        } catch (err) {
            setError("Ошибка при загрузке данных");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { requests, technicians, isLoading, error, refresh: fetchData };
};