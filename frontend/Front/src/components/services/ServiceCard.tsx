import React from 'react';
import { TrashIcon, PencilIcon, WrenchScrewdriverIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface ServiceCardProps {
    service: any;
    isAdmin: boolean;
    onEdit: (service: any) => void;
    onDelete: (id: number) => void | Promise<void>;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isAdmin, onEdit, onDelete }) => {
    return (
        <div className="group bg-gray-50 dark:bg-smartfix-darker rounded-2xl border border-smartfix-medium/10 overflow-hidden hover:border-emerald-500/40 transition-all duration-300 flex flex-col h-full hover:shadow-xl hover:shadow-emerald-900/10">

            {/* Техно-заглушка вместо фото */}
            <div className="relative h-40 bg-smartfix-darker flex items-center justify-center border-b border-smartfix-medium/5">
                {service.imageUrl ? (
                    <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="p-4 rounded-full bg-smartfix-dark group-hover:bg-emerald-500/10 transition-colors duration-500">
                        <WrenchScrewdriverIcon className="w-10 h-10 text-smartfix-medium group-hover:text-emerald-500 transition-colors" />
                    </div>
                )}

                {/* Админ-панель (только при наведении) */}
                {isAdmin && (
                    <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit(service)}
                            className="bg-smartfix-darkest p-2 rounded-lg text-blue-400 hover:text-white hover:bg-blue-600 transition-all shadow-lg"
                        >
                            <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(service.id)}
                            className="bg-smartfix-darkest p-2 rounded-lg text-red-400 hover:text-white hover:bg-red-600 transition-all shadow-lg"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Контент */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-smartfix-lightest leading-tight mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {service.name}
                </h3>

                <p className="text-sm text-gray-600 dark:text-smartfix-light line-clamp-3 mb-4 leading-relaxed">
                    {service.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-smartfix-medium/10 flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 dark:text-smartfix-medium uppercase font-bold tracking-wider">Стоимость</span>
                        <span className="text-xl font-bold text-gray-900 dark:text-smartfix-lightest mr-4">
                            от {service.price.toLocaleString('ru-RU')} ₽
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;