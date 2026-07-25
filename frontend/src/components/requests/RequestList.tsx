import React from 'react';
import { RequestCard } from './RequestCard';

interface RequestListProps {
    requests: any[];
    isLoading: boolean;
    onOpenDetails: (req: any) => void;
}

export const RequestList: React.FC<RequestListProps> = ({ requests, isLoading, onOpenDetails }) => {
    if (isLoading) {
        return <div className="text-center text-smartfix-light py-12">Загрузка заявок...</div>;
    }

    // Если заявок нет, показываем заглушку
    if (requests.length === 0) {
        return (
            <div className="bg-gray-50 dark:bg-smartfix-darker rounded-2xl p-8 text-center">
                <p className="dark:text-smartfix-light text-gray-500">Заявок не найдено.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {requests.map(req => (
                <RequestCard
                    key={req.id}
                    request={req}
                    onOpenDetails={onOpenDetails}
                />
            ))}
        </div>
    );
};