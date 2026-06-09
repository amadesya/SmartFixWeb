import React, { useRef, useState } from 'react';
import { Service } from '@/types';
import { X } from 'lucide-react'; // Если используешь lucide-react для иконок

interface ServiceDetailModalProps {
    service: Service | null;
    onClose: () => void;
    onActionClick: () => void;
}

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, onClose, onActionClick }) => {
    if (!service) return null;
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Оверлей (задний фон) */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Контентное окно */}
            <div className="bg-smartfix-dark border border-white/10 p-6 md:p-8 rounded-2xl max-w-2xl w-full relative z-10 animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="text-smartfix-light hover:text-white transition-colors top-3 right-2 absolute"
                >
                    <X size={20} />
                </button>

                <div className="space-y-6">
                    <img
                        src={service.imageUrl}
                        className="w-full h-64 object-cover rounded-xl"
                        alt={service.name}
                    />

                    <div>
                        <h3 className="text-3xl font-bold text-white mb-2">
                            {service.name}
                        </h3>
                        <p className="text-smartfix-light text-lg leading-relaxed">
                            {service.description}
                        </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <div className="flex flex-col">
                            <span className="text-sm text-white/40">Стоимость услуги</span>
                            <span className="text-2xl font-bold text-white">
                                от {service.price} ₽
                            </span>
                        </div>
                        <button
                        onClick={onActionClick}
                         className="bg-smartfix-lightest text-smartfix-darkest font-bold py-4 px-10 rounded-lg text-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
                            Записаться
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailModal;