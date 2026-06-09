import React from 'react';
import { Service } from '@/types';
import ServiceBentoItem from './ServiceBentoItem';

interface ServiceBentoGridProps {
    services: Service[];
    isLoading: boolean;
}

const ServiceBentoGrid: React.FC<ServiceBentoGridProps> = ({ services, isLoading }) => {
    if (isLoading) return <div className="text-center py-20 text-white">Загрузка...</div>;

    return (
        <section className="py-20 px-4 bg-smartfix-darker">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-4xl md:text-6xl font-black text-white text-center">
                        Наши услуги
                    </h2>
                </div>

                {/* Сетка Bento */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
                    {services.map((service, index) => (
                        <ServiceBentoItem
                            key={service.id}
                            service={service}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceBentoGrid;