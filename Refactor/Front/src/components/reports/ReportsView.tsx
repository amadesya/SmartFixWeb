import React, { useEffect, useState } from 'react';
import { analyticsApi, AnalyticsSummary, DailyStat, TopPerson} from '@/services/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const ReportsView: React.FC = () => {
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [chartData, setChartData] = useState<DailyStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [topTechs, setTopTechs] = useState<TopPerson[]>([]);
    const [topClients, setTopClients] = useState<TopPerson[]>([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Теперь ждем сразу 4 запроса
                const [summaryData, chartsData, techsData, clientsData] = await Promise.all([
                    analyticsApi.getSummary(),
                    analyticsApi.getChartData(),
                    analyticsApi.getTopTechnicians(),
                    analyticsApi.getTopClients()
                ]);

                setSummary(summaryData);
                setChartData(chartsData);
                setTopTechs(techsData);
                setTopClients(clientsData);
            } catch (error) {
                console.error("Ошибка при загрузке аналитики", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return <div className="text-white text-center py-10 animate-pulse">Загрузка отчётов...</div>;
    }

    if (!summary) {
        return <div className="text-red-400 text-center py-10">Не удалось загрузить данные</div>;
    }

    return (
        <div className="space-y-6">

            {/* Сетка с карточками */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                <MetricCard
                    title="Всего заявок"
                    value={summary.totalRequests}
                    icon="📋"
                    color="bg-blue-500/10 text-blue-500 border-blue-500/20"
                />

                <MetricCard
                    title="Выполнено"
                    value={summary.completedRequests}
                    icon="✅"
                    color="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                />

                <MetricCard
                    title="Общая выручка"
                    value={`${summary.totalRevenue.toLocaleString('ru-RU')} ₽`}
                    icon="💰"
                    color="bg-amber-500/10 text-amber-500 border-amber-500/20"
                />

                <MetricCard
                    title="Средний чек"
                    value={`${summary.averageCheck.toLocaleString('ru-RU')} ₽`}
                    icon="📊"
                    color="bg-purple-500/10 text-purple-500 border-purple-500/20"
                />

                <MetricCard
                    title="Затраты на мат-лы"
                    value={`${summary.totalPartsCost.toLocaleString()} ₽`}
                    icon="🛠️"
                    color="bg-red-500/10 text-red-400 border-red-500/20"
                />

                <MetricCard
                    title="Чистая прибыль"
                    value={`${summary.actualProfit.toLocaleString()} ₽`}
                    icon="📈"
                    color="bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                />

            </div>

            {/* Место для будущих графиков или таблиц */}
            <div className="bg-gray-50 dark:bg-smartfix-dark p-6 rounded-2xl border border-smartfix-medium/20 mt-8">
                <h3 className="text-black dark:text-white font-bold mb-6">Динамика выручки</h3>

                {/* Добавляем div-обертку с фиксированной высотой */}
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#9ca3af"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value} ₽`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#colorRev)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Рейтинги: Мастера и Клиенты */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

                {/* Топ Мастеров */}
                <div className="bg-gray-50 dark:bg-smartfix-dark p-6 rounded-2xl border border-smartfix-medium/20">
                    <h3 className="text-black dark:text-white font-bold mb-4 flex items-center gap-2">
                        <span>🏆</span> Топ-5 Мастеров по выручке
                    </h3>
                    <div className="space-y-3">
                        {topTechs.map((tech, index) => (
                            <div key={tech.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-smartfix-darker border border-smartfix-medium/10 hover:border-emerald-500/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${index === 0 ? 'bg-amber-500/20 text-amber-500' : index === 1 ? 'bg-gray-400/20 text-gray-300' : index === 2 ? 'bg-orange-700/20 text-orange-400' : 'bg-smartfix-medium/20 text-smartfix-light'}`}>
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-black dark:text-white">{tech.name}</p>
                                        <p className="text-xs text-smartfix-medium">{tech.requestsCount} выполнено</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-emerald-400">{tech.revenue.toLocaleString('ru-RU')} ₽</p>
                                </div>
                            </div>
                        ))}
                        {topTechs.length === 0 && <p className="text-sm text-smartfix-medium text-center py-4">Нет данных</p>}
                    </div>
                </div>

                {/* Топ Клиентов */}
                <div className="bg-gray-50 dark:bg-smartfix-dark p-6 rounded-2xl border border-smartfix-medium/20">
                    <h3 className="text-black dark:text-white font-bold mb-4 flex items-center gap-2">
                        <span>💎</span> Топ-5 VIP Клиентов
                    </h3>
                    <div className="space-y-3">
                        {topClients.map((client, index) => (
                            <div key={client.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-smartfix-darker border border-smartfix-medium/10 hover:border-purple-500/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        👤
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-black dark:text-white">{client.name}</p>
                                        <p className="text-xs text-smartfix-medium">{client.requestsCount} заказов</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-purple-400">{client.revenue.toLocaleString('ru-RU')} ₽</p>
                                </div>
                            </div>
                        ))}
                        {topClients.length === 0 && <p className="text-sm text-smartfix-medium text-center py-4">Нет данных</p>}
                    </div>
                </div>

            </div>
        </div>
    );
};

const MetricCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: string, color: string }) => (
    <div className={`p-5 rounded-xl border ${color} flex items-center gap-4 transition-all hover:scale-[1.02]`}>
        <div className="text-3xl">{icon}</div>
        <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{title}</p>
            <p className="text-2xl font-black">{value}</p>
        </div>
    </div>
);

export default ReportsView;