import React, { useState } from 'react';
import { Service } from '@/types';

interface ServiceGridItemProps {
    service: Service;
    isAdmin: boolean;
    onEdit: (service: Service) => void;
    onDelete: (id: number) => void;
}

const ServiceGridItem: React.FC<ServiceGridItemProps> = ({ service, isAdmin, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {/* Карточка-плитка */}
            <div
                onClick={() => setIsModalOpen(true)}
                className="group relative h-[400px] min-w-[300px] flex-shrink-0 rounded-2xl overflow-hidden isolate cursor-pointer transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl bg-smartfix-dark snap-center"
            >
                {/* Фоновое изображение */}
                <img
                    src={service.imageUrl || 'https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc9?q=80&w=600&auto=format&fit=crop'}
                    alt={service.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Градиент для читаемости текста */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Текст внизу карточки */}
                <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-white font-bold text-xl leading-tight mb-2">
                        {service.name}
                    </h3>
                    <p className="text-gray-300 text-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        Узнать подробности &rarr;
                    </p>
                </div>

                {/* Панель администратора (поверх всего) */}
                {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 z-10" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => onEdit(service)}
                            className="bg-blue-600/80 hover:bg-blue-600 px-3 py-1.5 rounded-lg text-white text-sm backdrop-blur-sm transition-colors"
                        >
                            Изменить
                        </button>
                        <button
                            onClick={() => onDelete(service.id)}
                            className="bg-red-600/80 hover:bg-red-600 px-3 py-1.5 rounded-lg text-white text-sm backdrop-blur-sm transition-colors"
                        >
                            Удалить
                        </button>
                    </div>
                )}
            </div>

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    {/* Клик по фону закрывает модалку */}
                    <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>

                    <div className="bg-[#1a1a1a] border border-gray-800 max-w-2xl w-full rounded-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
                        {/* Картинка в шапке модалки (опционально, смотрится красиво) */}
                        <div className="h-48 w-full relative">
                            <img
                                src={service.imageUrl || 'https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc9?q=80&w=800&auto=format&fit=crop'}
                                alt={service.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-8 pt-0">
                            <h2 className="text-3xl font-bold text-white mb-4 -mt-6 relative z-10">
                                {service.name}
                            </h2>
                            <div className="text-gray-300 space-y-4 mb-8">
                                <p className="leading-relaxed">
                                    {service.description || 'Подробное описание этой услуги пока не добавлено. Здесь будет текст с деталями, условиями и особенностями.'}
                                </p>
                                <div className="inline-block px-4 py-2 bg-gray-800 rounded-lg">
                                    <span className="text-gray-400 text-sm">Стоимость: </span>
                                    <span className="text-xl font-bold text-white ml-2">{service.price} ₽</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-transform active:scale-95"
                            >
                                Понятно
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ServiceGridItem;