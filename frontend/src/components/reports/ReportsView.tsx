import React, { useState, useCallback, useMemo } from 'react';
import { Award, Gem, User } from 'lucide-react';
import { analyticsApi, employeesApi, AnalyticsSummary, DailyStat, TopPerson, EmployeeKpi, EmployeeDto} from '@/services/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAnalyticsFilter } from '@/hooks/useAnalyticsFilter';
import AnalyticsFilter from '@/components/reports/AnalyticsFilter';
import { EmployeeSalaryTable } from '@/components/reports/EmployeeSalaryTable';
import { formatCurrency, formatCompactCurrency } from '@/lib/utils';

interface ChartPoint {
    date: string;
    revenue: number;
}

const MONTH_LABELS_RU = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

function parseDate(str: string): Date {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function pad2(n: number): string {
    return String(n).padStart(2, '0');
}

type GroupBy = 'day' | 'month' | 'year';

function detectGroupBy(from: string, to: string): GroupBy {
    const f = parseDate(from);
    const t = parseDate(to);
    const days = (t.getTime() - f.getTime()) / 86400000;
    if (days > 365) return 'year';
    if (days > 90) return 'month';
    return 'day';
}

function buildChartData(
    raw: DailyStat[],
    from: string,
    to: string,
    groupBy: GroupBy,
): ChartPoint[] {
    const start = parseDate(from);
    const end = parseDate(to);
    const lookup = new Map(raw.map(d => [d.date, d.revenue]));

    if (groupBy === 'day') {
        const result: ChartPoint[] = [];
        const cur = new Date(start);
        while (cur < end) {
            const key = `${cur.getFullYear()}-${pad2(cur.getMonth() + 1)}-${pad2(cur.getDate())}`;
            result.push({ date: key, revenue: lookup.get(key) ?? 0 });
            cur.setDate(cur.getDate() + 1);
        }
        return result;
    }

    if (groupBy === 'year') {
        const firstY = start.getFullYear();
        const lastY = end.getFullYear();
        const result: ChartPoint[] = [];
        for (let y = firstY; y <= lastY; y++) {
            const key = String(y);
            result.push({ date: key, revenue: lookup.get(key) ?? 0 });
        }
        return result;
    }

    // month
    const totalMonths = (end.getFullYear() - start.getFullYear()) * 12
        + (end.getMonth() - start.getMonth());
    const showYear = totalMonths > 12;
    const result: ChartPoint[] = [];
    const cur = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
    while (cur < endMonth) {
        const key = `${cur.getFullYear()}-${pad2(cur.getMonth() + 1)}`;
        const label = showYear
            ? `${MONTH_LABELS_RU[cur.getMonth()]} ${cur.getFullYear()}`
            : MONTH_LABELS_RU[cur.getMonth()];
        result.push({ date: label, revenue: lookup.get(key) ?? 0 });
        cur.setMonth(cur.getMonth() + 1);
    }
    return result;
}

const ReportsView: React.FC = () => {
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [chartData, setChartData] = useState<DailyStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [topTechs, setTopTechs] = useState<TopPerson[]>([]);
    const [topClients, setTopClients] = useState<TopPerson[]>([]);
    const [kpiSalaries, setKpiSalaries] = useState<EmployeeKpi[]>([]);
    const [employeeProfiles, setEmployeeProfiles] = useState<EmployeeDto[]>([]);
    const fetchAnalytics = useCallback(async (from: string, to: string) => {
        setLoading(true);
        try {
            const groupBy = detectGroupBy(from, to);

            const [summaryData, chartsData, techsData, clientsData, kpiData, empData] = await Promise.all([
                analyticsApi.getSummary(from, to),
                analyticsApi.getChartData(from, to, groupBy),
                analyticsApi.getTopTechnicians(from, to),
                analyticsApi.getTopClients(from, to),
                analyticsApi.getKpiSalaries(from, to),
                employeesApi.getAll(),
            ]);

            if (process.env.NODE_ENV === 'development') {
                console.debug('[analytics] summary:', summaryData);
                console.debug('[analytics] chartData:', chartsData);
                if (chartsData.length > 0) {
                    const chartSum = chartsData.reduce((s, d) => s + d.revenue, 0);
                    if (Math.abs(chartSum - summaryData.totalRevenue) > 0.01) {
                        console.warn(
                            '[analytics] revenue mismatch: chart sum =',
                            chartSum, 'summary =', summaryData.totalRevenue
                        );
                    }
                }
            }

            setSummary(summaryData);
            setChartData(chartsData);
            setTopTechs(techsData);
            setTopClients(clientsData);
            setKpiSalaries(kpiData);
            setEmployeeProfiles(empData);
        } catch (error) {
            console.error("Ошибка при загрузке аналитики", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const filter = useAnalyticsFilter(fetchAnalytics);

    const computedTotalSalary = useMemo(() => {
        const profileMap = new Map(employeeProfiles.map(p => [p.id, p]));
        return kpiSalaries.reduce((sum, emp) => {
            const profile = profileMap.get(emp.employeeId) || employeeProfiles.find(p => p.userName === emp.name);
            const salary = profile?.baseSalary ?? 0;
            const bonusPct = profile?.bonusPercentage ?? 0;
            const effectiveSalary = salary > 0 ? salary : 50000;
            const hours = emp.completedRequests * 2;
            const hourlyRate = effectiveSalary > 0 ? effectiveSalary / 160 : 0;
            const salaryByHours = hours * hourlyRate;
            const bonusAmount = salaryByHours * (bonusPct / 100);
            return sum + salaryByHours + bonusAmount;
        }, 0);
    }, [kpiSalaries, employeeProfiles]);

    const groupBy = useMemo(() => detectGroupBy(
        filter.dateFilter.from, filter.dateFilter.to
    ), [filter.dateFilter.from, filter.dateFilter.to]);

    const processedChartData = useMemo(() => buildChartData(
        chartData,
        filter.dateFilter.from,
        filter.dateFilter.to,
        groupBy,
    ), [chartData, filter.dateFilter.from, filter.dateFilter.to, groupBy]);

    const tickInterval = useMemo(() => {
        const len = processedChartData.length;
        if (len <= 15) return 0;
        return Math.max(0, Math.ceil(len / 12) - 1);
    }, [processedChartData.length]);

    if (loading) {
        return <div className="text-foreground text-center py-10 animate-pulse">Загрузка отчётов...</div>;
    }

    if (!summary) {
        return <div className="text-destructive text-center py-10">Не удалось загрузить данные</div>;
    }

    const netProfit = summary.totalRevenue - summary.totalPartsCost - computedTotalSalary;

    return (
        <div className="space-y-6">
            <AnalyticsFilter
                presets={filter.PRESETS}
                activePreset={filter.dateFilter.preset}
                showCustom={filter.showCustom}
                customFrom={filter.customFrom}
                customTo={filter.customTo}
                onPreset={filter.handlePreset}
                onToggleCustom={() => filter.setShowCustom(!filter.showCustom)}
                onCustomFromChange={filter.setCustomFrom}
                onCustomToChange={filter.setCustomTo}
                onCustomApply={filter.handleCustomApply}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-smartfix-dark/30 p-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm flex flex-col justify-center transition-colors">
                    <p className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Поступившие</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{summary.newRequests}</p>
                </div>
                <div className="bg-white dark:bg-smartfix-dark/30 p-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm flex flex-col justify-center transition-colors">
                    <p className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Завершённые</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{summary.completedRequests}</p>
                </div>
                <div className="bg-white dark:bg-smartfix-dark/30 p-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm flex flex-col justify-center transition-colors">
                    <p className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Общая выручка</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-[#00FF88]">{formatCurrency(summary.totalRevenue, 0)}</p>
                </div>
                <div className="bg-white dark:bg-smartfix-dark/30 p-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm flex flex-col justify-center transition-colors">
                    <p className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Средний чек</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(summary.averageCheck, 2)}</p>
                </div>
                <div className="bg-white dark:bg-smartfix-dark/30 p-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm flex flex-col justify-center transition-colors">
                    <p className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Затраты на мат-лы</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">{formatCurrency(summary.totalPartsCost, 0)}</p>
                </div>
                <div className="bg-white dark:bg-smartfix-dark/30 p-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm flex flex-col justify-center transition-colors">
                    <p className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Зарплаты</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(computedTotalSalary, 0)}</p>
                </div>
                <div className="bg-white dark:bg-smartfix-dark/30 p-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm flex flex-col justify-center transition-colors">
                    <p className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Чистая прибыль</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-[#00FF88]">{formatCurrency(netProfit, 0)}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-smartfix-darker rounded-2xl shadow-sm border border-gray-200 dark:border-smartfix-dark overflow-hidden transition-colors">
                <h3 className="text-gray-900 dark:text-white font-bold px-4 pt-4 pb-2">Динамика выручки</h3>

                {processedChartData.length === 0 ? (
                    <div className="flex items-center justify-center h-[350px] text-sm text-gray-500 dark:text-gray-400">
                        Нет данных за этот период
                    </div>
                ) : (
                <div style={{ width: '100%', height: 350 }} className="px-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={processedChartData} margin={{ top: 10, right: 40, left: 24, bottom: 10 }}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                type="category" // Явно указываем, что работаем со строковыми категориями
                                stroke="var(--chart-axis)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                interval={tickInterval}
                                allowDataOverflow={false}
                                tickFormatter={(value) => {
                                    if (!value) return '';
                                    // Год (4 цифры) или название месяца (кириллица)
                                    if (/^\d{4}$/.test(value) || /^[А-Яа-я]/.test(value)) return value;
                                    // ISO дата (yyyy-MM-dd) → "dd.MM"
                                    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                                        const parts = value.split('-');
                                        return `${parts[2]}.${parts[1]}`;
                                    }
                                    return value;
                                }}
                            />
                            <YAxis
                                stroke="var(--chart-axis)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, (dataMax: number) => dataMax > 0 ? Math.ceil(dataMax * 1.15 / 1000) * 1000 : 1000]}
                                tickFormatter={(value: number) => formatCompactCurrency(value)}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--chart-tooltip-text)' }}
                                labelStyle={{ color: 'var(--chart-tooltip-text)', opacity: 0.7 }}
                                labelFormatter={(label) => {
                                    if (!label) return '';
                                    // Год (4 цифры)
                                    if (/^\d{4}$/.test(label)) return `Год: ${label}`;
                                    // Название месяца (кириллица) — оставляем как есть
                                    if (/^[А-Яа-я]/.test(label)) return label;
                                    // ISO дата (yyyy-MM-dd) → "13 мая 2026 г."
                                    if (/^\d{4}-\d{2}-\d{2}$/.test(label)) {
                                        const [y, m, d] = label.split('-').map(Number);
                                        const date = new Date(y, m - 1, d);
                                        return date.toLocaleString('ru-RU', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        });
                                    }
                                    return label;
                                }}
                                formatter={(value) => [formatCurrency(value as number, 2), "Выручка"]}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorRev)"
                                name="Выручка"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bg-white dark:bg-smartfix-darker rounded-2xl shadow-sm border border-gray-200 dark:border-smartfix-dark overflow-hidden transition-colors">
                    <h3 className="text-gray-900 dark:text-white font-bold px-4 pt-4 pb-0 flex items-center gap-2">
                        <Award className="size-5 text-amber-500" aria-hidden="true" />
                        Топ-5 Мастеров по выручке
                    </h3>
                    {topTechs.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center px-4 pb-4 pt-3">Нет данных за этот период</p>
                    ) : (
                    <div className="divide-y divide-gray-100 dark:divide-smartfix-dark/50">
                        {topTechs.map((tech, index) => (
                            <div key={tech.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-smartfix-dark transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${index === 0 ? 'bg-amber-500/20 text-amber-500' : index === 1 ? 'bg-gray-400/20 text-gray-500 dark:text-gray-300' : index === 2 ? 'bg-orange-700/20 text-orange-400' : 'bg-gray-200/50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'}`}>
                                        #{index + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{tech.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{tech.requestsCount} выполнено</p>
                                    </div>
                                </div>
                <div className="text-right shrink-0 ml-3">
                                        <p className="text-sm font-black text-emerald-500">{formatCurrency(tech.revenue, 0)}</p>
                                    </div>
                            </div>
                        ))}
                    </div>
                    )}
                </div>

                <div className="bg-white dark:bg-smartfix-darker rounded-2xl shadow-sm border border-gray-200 dark:border-smartfix-dark overflow-hidden transition-colors">
                    <h3 className="text-gray-900 dark:text-white font-bold px-4 pt-4 pb-0 flex items-center gap-2">
                        <Gem className="size-5 text-purple-400" aria-hidden="true" />
                        Топ-5 VIP Клиентов
                    </h3>
                    {topClients.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center px-4 pb-4 pt-3">Нет данных за этот период</p>
                    ) : (
                    <div className="divide-y divide-gray-100 dark:divide-smartfix-dark/50">
                        {topClients.map((client, index) => (
                            <div key={client.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-smartfix-dark transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                                        <User className="size-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{client.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{client.requestsCount} заказов</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 ml-3">
                                    <p className="text-sm font-black text-purple-500">{formatCurrency(client.revenue, 0)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    )}
                </div>

            </div>

            <EmployeeSalaryTable employees={kpiSalaries} employeeProfiles={employeeProfiles} />
        </div>
    );
};

export default ReportsView;
