import React from 'react';
import ServiceStories from '@/components/services/ServiceStories.tsx';
import { Service } from '@/types';

interface ServiceStoriesSectionProps {
    services: Service[];
    isLoading: boolean;
}

const ServiceStoriesSection: React.FC<ServiceStoriesSectionProps> = ({ services, isLoading }) => {
    return (
        <section className="py-20 bg-smartfix-darker min-h-[80vh] flex flex-col justify-center">
            <div className="container mx-auto px-4">
                {/* Заголовок секции */}
                <div className="mb-12 text-center">
                    <h2 className="text-white text-5xl md:text-6xl font-black italic uppercase tracking-tighter">
                        Smart Stories
                    </h2>
                    <p className="text-gray-500 mt-4 text-lg max-w-md mx-auto">
                        Листайте наши услуги так же удобно, как ленту в соцсетях
                    </p>
                </div>

                {/* Основной компонент сторис */}
                <div className="relative">
                    <ServiceStories services={services} isLoading={isLoading} />
                </div>

                {/* Декоративный элемент снизу (опционально) */}
                <div className="mt-16 flex justify-center">
                    <div className="h-1 w-20 rounded-full bg-white/5" />
                </div>
            </div>
        </section>
    );
};

export default ServiceStoriesSection;