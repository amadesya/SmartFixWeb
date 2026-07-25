import React from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline'; 

interface ServiceItemProps {
    service: any; 
    isAdmin: boolean;
    onEdit: (service: any) => void;
    // Исправляем здесь:
    onDelete: (id: number) => void | Promise<void>;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ service, isAdmin, onEdit, onDelete }) => {
    return (
        <div className="p-6 flex justify-between items-start hover:bg-gray-50 dark:hover:bg-smartfix-dark transition-colors duration-200">
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-smartfix-lightest">{service.name}</h3>
                <p className="text-gray-600 dark:text-smartfix-light mt-1">{service.description}</p>
            </div>
            <div className="text-right flex items-center shrink-0 ml-4">
                <p className="text-xl font-semibold text-gray-900 dark:text-smartfix-lightest mr-4">
                    {service.price.toLocaleString('ru-RU')} ₽
                </p>

                {isAdmin && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(service)}
                            className="text-blue-500 hover:text-blue-400 p-2 rounded-full hover:bg-blue-900/50 transition-colors"
                            title="Редактировать"
                        >
                            <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => onDelete(service.id)}
                            className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-900/50 transition-colors"
                            title="Удалить"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceItem;