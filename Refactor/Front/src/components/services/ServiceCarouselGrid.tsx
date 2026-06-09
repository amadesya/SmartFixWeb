import React, { useRef, useState } from 'react';
import { Service } from '@/types';
import {
    Stories,
    StoriesContent,
    Story,
    StoryTitle,
    StoryOverlay
} from '@/components/ui/stories-carousel';
import { CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import ServiceDetailModal from './ServiceDetailModal';
import AuthModal from '../auth/AuthModal';

interface ServiceCarouselGridProps {
    services: Service[];
    isLoading: boolean;
    isAdmin?: boolean;
    onEdit?: (service: Service) => void;
    onDelete?: (id: number) => void;
}

const ServiceCarouselGrid: React.FC<ServiceCarouselGridProps> = ({
    services,
    isLoading
}) => {
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="py-20 px-4 bg-white dark:bg-smartfix-darker border-t border-b border-gray-200 dark:border-smartfix-dark">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center max-w-7xl mx-auto mb-16 relative">
                    <h2 className="text-4xl md:text-5xl font-black text-left text-gray-900 dark:text-smartfix-lightest">
                        Наши услуги
                    </h2>

                    {/* Кнопки теперь интегрированы прямо в логику Embla Carousel */}
                </div>

                {isLoading ? (
                    <p className="text-center text-gray-500 dark:text-smartfix-light text-xl">Загрузка услуг...</p>
                ) : (
                    <Stories className="w-full relative">
                        {/* Кастомное расположение кнопок, как было в твоем оригинале */}
                        <div className="absolute -top-24 right-0 flex gap-4">
                            <CarouselPrevious className="static translate-y-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-700 dark:text-white transition-colors border-none" />
                            <CarouselNext className="static translate-y-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-700 dark:text-white transition-colors border-none" />
                        </div>

                        <StoriesContent>
                            {services.map((service) => (
                                <Story
                                    key={service.id}
                                    className="aspect-[4/4] basis-full md:basis-1/2 lg:basis-1/3"
                                    onClick={() => setSelectedService(service)}
                                >
                                    <StoryTitle className="text-lg font-bold leading-tight drop-shadow-md">
                                        {service.name}
                                    </StoryTitle>
                                    {/* Здесь можно использовать фото конкретной услуги (ремонта) */}
                                    <img 
                                        src={service.imageUrl}
                                        alt={service.name || 'Услуга'}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />

                                    <StoryOverlay side="top" />

                                    <StoryOverlay side="bottom" />
                                </Story>
                            ))}
                        </StoriesContent>
                    </Stories>
                )}
            </div>

            <ServiceDetailModal
                service={selectedService}
                onClose={() => setSelectedService(null)}
                onActionClick={() => {setIsModalOpen(true); setSelectedService(null);}}
            />

            <AuthModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>

        
    );
};

export default ServiceCarouselGrid;