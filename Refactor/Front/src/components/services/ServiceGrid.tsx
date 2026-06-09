import React, { useRef } from 'react';
import { Service } from '@/types';
import ServiceGridItem from '@/components/services/ServiceGridItem';

interface ServiceGridProps {
    services: Service[];
    isLoading: boolean;
    isAdmin?: boolean;
    onEdit?: (service: Service) => void;
    onDelete?: (id: number) => void;
}

const ServiceGrid: React.FC<ServiceGridProps> = ({
    services,
    isLoading,
    isAdmin = false,
    onEdit = () => { },
    onDelete = () => { }
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-20 px-4 bg-white dark:bg-smartfix-darker border-t border-b border-gray-200 dark:border-smartfix-dark">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center max-w-7xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-left text-gray-900 dark:text-smartfix-lightest">
                        Наши услуги
                    </h2>

                    <div className="flex gap-4">
                        {/* Кнопка Влево */}
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-700 dark:text-white transition-colors"
                        >
                            <span className="mb-0.5 mr-0.5 text-xl font-light">&lt;</span>
                        </button>

                        {/* Кнопка Вправо */}
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-700 dark:text-white transition-colors"
                        >
                            <span className="mb-0.5 ml-0.5 text-xl font-light">&gt;</span>
                        </button>
                    </div>
            </div>
                {isLoading ? (
                    <p className="text-center text-gray-500 dark:text-smartfix-light text-xl">Загрузка услуг...</p>
                ) : (
                        <div
                        ref={scrollContainerRef} 
                        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 hide-scrollbar"
                        >
                        {services.map((service) => (
                            <ServiceGridItem
                                key={service.id}
                                service={service}
                                isAdmin={isAdmin}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ServiceGrid;