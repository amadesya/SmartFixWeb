import React from 'react';
import { Service } from '@/types';
import ServiceItem from './ServiceItem'; 

interface ServicesListProps {
    services: Service[];
    isLoading: boolean;
    isAdmin?: boolean;
    onEdit?: (service: Service) => void;
    onDelete?: (id: number) => void;
}

const ServicesList: React.FC<ServicesListProps> = ({
    services,
    isLoading,
    isAdmin = false,
    onEdit = () => { },
    onDelete = () => { }
}) => {
    return (
        <section className="py-20 px-4 bg-smartfix-darker">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-center text-smartfix-lightest mb-12">
                    Наши услуги
                </h2>

                {isLoading ? (
                    <p className="text-center text-smartfix-light">Загрузка услуг...</p>
                ) : (
                    <div className="bg-smartfix-dark rounded-xl border border-smartfix-medium shadow-lg overflow-hidden">
                        {services.map((service) => (
                            <div key={service.id} className="border-b border-smartfix-medium last:border-0">
                                <ServiceItem
                                    service={service}
                                    isAdmin={isAdmin}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ServicesList;