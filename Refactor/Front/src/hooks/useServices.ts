import { useState, useEffect } from 'react';
import { Service } from '../types';
import { servicesApi } from '../services/api';
import { getFullAvatarUrl } from '../utils/avatarHelper';

export const useServices = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoadingServices, setIsLoadingServices] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoadingServices(true);
            setError(null);

            try {
                const data = await servicesApi.getAll();
                const mappedServices = data.map((s: Service) => ({
                    ...s,
                    imageUrl: getFullAvatarUrl(s.imageUrl) || ''
                }));
                setServices(mappedServices);
            } catch (err) {
                console.error("Failed to fetch services:", err);
                const errorMessage = "Не удалось загрузить список услуг. Попробуйте позже.";
                setError(errorMessage);
                alert(errorMessage); 
            } finally {
                setIsLoadingServices(false);
            }
        };

        fetchServices();
    }, []);

    return { services, isLoadingServices, error };
};