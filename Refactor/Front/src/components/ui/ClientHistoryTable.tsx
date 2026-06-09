import React, { useEffect, useState } from 'react';
import { getRepairRequests } from '@/services/api';
import { RepairRequest } from '@/types';

interface ClientHistoryTableProps {
    clientId: number;
}

const ClientHistoryTable: React.FC<ClientHistoryTableProps> = ({ clientId }) => {
    const [requests, setRequests] = useState<RepairRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRepairRequests()
            .then(data => {
                setRequests(data.filter(r => r.clientId === clientId));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [clientId]);

    if (loading) return <div className="text-sm text-gray-500">Загрузка истории...</div>;
    if (requests.length === 0) return <div className="text-sm text-gray-500">У клиента пока нет обращений.</div>;

    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <tr>
                        <th className="px-4 py-3 font-medium hidden sm:table-cell">ID</th>
                        <th className="px-4 py-3 font-medium">Дата</th>
                        <th className="px-4 py-3 font-medium">Устройство</th>
                        <th className="px-4 py-3 font-medium">Статус</th>
                        <th className="px-4 py-3 font-medium">Стоимость</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                    {requests.map(req => (
                        <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white hidden sm:table-cell">#{req.id}</td>
                            <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{new Date(req.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-slate-900 dark:text-slate-200">{req.device}</td>
                            <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{req.status}</td>
                            <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">{req.price ? `${req.price} ₽` : '—'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientHistoryTable;