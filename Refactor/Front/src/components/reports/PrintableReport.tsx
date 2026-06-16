import React, { useEffect, useState } from "react";
import { RepairRequest, RequestStatus } from "@/types";
import { analyticsApi, AnalyticsSummary } from "@/services/api";
import { formatCurrency } from "@/lib/utils";

interface Props {
    requests: RepairRequest[];
    statusLabels: Record<RequestStatus, string>;
}

export const PrintableReport: React.FC<Props> = ({ requests, statusLabels }) => {
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Теперь ждем сразу 4 запроса
                const [summaryData] = await Promise.all([
                    analyticsApi.getSummary()
                ]);

                setSummary(summaryData);
            } catch (error) {
                console.error("Ошибка при загрузке аналитики", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);


    return (
        <div className="hidden print:block p-8 bg-white text-black font-serif">
            {/* Шапка отчета */}
            <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold uppercase">SmartFix: Отчет по заявкам</h1>
                    <p className="text-sm">Дата формирования: {new Date().toLocaleDateString('ru-RU')}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold">Итого заявок: {requests.length}</p>
                </div>
            </div>

            {/* Таблица данных */}
            <table className="w-full border-collapse border border-black text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-black p-2">ID</th>
                        <th className="border border-black p-2 text-left">Клиент</th>
                        <th className="border border-black p-2 text-left">Устройство</th>
                        <th className="border border-black p-2 text-left">Статус</th>
                        <th className="border border-black p-2 text-left">Дата создания</th>
                        <th className="border border-black p-2 text-left">Цена</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req) => (
                        <tr key={req.id} className="break-inside-avoid">
                            <td className="border border-black p-2 text-center">{req.id}</td>
                            <td className="border border-black p-2">{req.clientName}</td>
                            <td className="border border-black p-2">{req.device}</td>
                            <td className="border border-black p-2">{statusLabels[req.status]}</td>
                            <td className="border border-black p-2">
                                {new Date(req.createdAt).toLocaleDateString('ru-RU')}
                            </td>
                            <td className="border border-black p-2">
                                {req.price ? formatCurrency(req.price, 2) : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <thead>
                    <tr> {/* Обязательно добавляем строку (table row) */}
                        <th className="border border-black p-2 text-left">
                            Выручка
                        </th>
                        {/* Используем атрибут colSpan={5} вместо класса */}
                        <th colSpan={5} className="border border-black p-2 text-center">
                            {summary?.totalRevenue ? formatCurrency(summary.totalRevenue, 2) : '-'}
                        </th>
                    </tr>
                </thead>
            </table>

            {/* Футер отчета */}
            <div className="mt-10 flex justify-between">
                <div className="border-t border-black w-48 text-center pt-2">
                    <p className="text-xs italic">Подпись мастера</p>
                </div>
                <div className="border-t border-black w-48 text-center pt-2">
                    <p className="text-xs italic">Дата печати</p>
                </div>
            </div>
        </div>
    );
};