import React from 'react';
import { StatCard } from '@/components/ui/StatCard'; 
import { RepairRequest, RequestStatus, RequestStatusLabels } from '@/types'; 

interface RequestsStatsProps {
    requests: RepairRequest[];
    summary?: Record<RequestStatus, number>;
}

const RequestsStats: React.FC<RequestsStatsProps> = ({ requests, summary }) => {
    const stats = summary || requests.reduce((acc, req) => {
        acc[req.status] = (acc[req.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div id="report-content" className="bg-smartfix-darker p-5 rounded-2xl print:bg-white print:text-black print:shadow-none print:p-0">
            <h3 className="text-3xl font-bold mb-2 print:text-black">Сводный отчёт по заявкам</h3>
            <p className="text-smartfix-light mb-8 print:text-gray-600">
                Дата формирования: {new Date().toLocaleDateString('ru-RU')}
            </p>

            <div className="mb-12 p-6 bg-smartfix-dark rounded-lg print:bg-gray-100 print:p-4">
                <h4 className="text-2xl font-semibold mb-4 print:text-black">Статистика по статусам</h4>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Object.values(RequestStatus).map(status => (
                        <StatCard
                            key={status}
                            label={RequestStatusLabels[status]}
                            value={stats[status] || 0}
                            valueColor="text-white print:text-black"
                        />
                    ))}

                    <StatCard
                        label="Всего заявок"
                        value={requests.length}
                        valueColor="text-smartfix-lightest print:text-blue-900"
                    />
                </div>
            </div>
        </div>
    );
};

export default RequestsStats;