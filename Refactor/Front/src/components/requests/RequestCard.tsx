import React from 'react';
import StatusBadge from '@/components/ui/StatusBadge';

interface RequestCardProps {
    request: any;
    onOpenDetails: (req: any) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onOpenDetails }) => {
    return (
        <div className="p-5 mb-4 rounded-2xl bg-white dark:bg-smartfix-darker border border-gray-200 dark:border-white/10 hover:border-emerald-500/30 dark:hover:border-smartfix-light/30 transition-all duration-200 shadow-sm">
            {/* Верхняя часть: Заголовок и Дата */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-smartfix-lightest">
                        Заявка #{request.id}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-smartfix-light mt-1">
                        {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                </div>
            </div>

            {/* Средняя часть: Информация об устройстве */}
            <div className="mb-4">
                <div className="font-semibold text-lg text-gray-900 dark:text-smartfix-lightest">
                    {request.device}
                </div>
                <p className="text-sm text-gray-600 dark:text-smartfix-light mt-1 leading-relaxed line-clamp-2">
                    <span className="opacity-70">Клиент: </span>
                    {request.clientName}
                </p>
                <p className="text-sm text-gray-600 dark:text-smartfix-light mt-1 leading-relaxed line-clamp-2">
                    <span className="opacity-70">Проблема: </span>
                    {request.issueDescription}
                </p>
            </div>

            {/* Нижняя часть: Статус и Кнопка */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-white/5">
                <StatusBadge status={request.status} />

                <button
                    onClick={() => onOpenDetails(request)}
                    className="bg-gray-100 dark:bg-smartfix-medium/20 text-gray-900 dark:text-smartfix-lightest py-2.5 px-5 rounded-xl hover:bg-gray-200 dark:hover:bg-smartfix-medium transition-colors text-sm font-bold active:scale-95 transform"
                >
                    Подробнее
                </button>
            </div>
        </div>
    );
};