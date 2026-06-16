import React, { useState, useCallback, useMemo } from 'react';
import { Award, Gem, User } from 'lucide-react';
import { analyticsApi, employeesApi, AnalyticsSummary, DailyStat, TopPerson, EmployeeKpi, EmployeeDto} from '@/services/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAnalyticsFilter } from '@/hooks/useAnalyticsFilter';
import AnalyticsFilter from '@/components/reports/AnalyticsFilter';
import { EmployeeSalaryTable } from '@/components/reports/EmployeeSalaryTable';

interface ChartPoint {
    date: string;
    revenue: number;
}

const MONTH_LABELS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

function parseDate(str: string): Date {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function pad2(n: number): string {
    return String(n).padStart(2, '0');
}

function formatDM(d: Date): string {
    return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}`;
}

function buildChartData(
    raw: DailyStat[],
    from: string,
    to: string,
    preset?: string,
): ChartPoint[] {
    if (raw.length === 0) return [];

    // 1. Инициализируем revMap в самом начале, чтобы избежать ошибок области видимости
    const revMap = new Map<string, number>();

    const start = parseDate(from);
    const end = parseDate(to);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / 86400000);
    const totalMonths = (end.getFullYear() - start.getFullYear()) * 12
        + (end.getMonth() - start.getMonth());
    const isAllTime = preset === "all";
    const groupByYear = isAllTime || totalMonths > 24;
    const groupByMonth = totalDays > 90 && !groupByYear;

    // --- Daily (≤ 90 days) ---
    if (!groupByMonth && !groupByYear) {
        const lookup = new Map(raw.map(d => [d.date, d.revenue]));
        const result: ChartPoint[] = [];
        const cur = new Date(start);
        while (cur < end) {
            result.push({ date: formatDM(cur), revenue: lookup.get(formatDM(cur)) ?? 0 });
            cur.setDate(cur.getDate() + 1);
        }
        return result;
    }

    // --- Backward year inference ---
    let year = end.getFullYear();
    if (raw.length > 0) {
        const lastM = parseInt(raw[raw.length - 1].date.slice(3, 5), 10) - 1;
        if (lastM > end.getMonth()) year--;
    }
    let nextMonth = -1;
    for (let i = raw.length - 1; i >= 0; i--) {
        const m = parseInt(raw[i].date.slice(3, 5), 10) - 1;
        if (nextMonth >= 0 && m > nextMonth) year--;

        if (groupByYear) {
            const yk = year;
            const prev = revMap.get(String(yk)) ?? 0;
            revMap.set(String(yk), prev + raw[i].revenue);
        } else {
            const key = `${year}-${pad2(m + 1)}`;
            revMap.set(key, (revMap.get(key) ?? 0) + raw[i].revenue);
        }
        nextMonth = m;
    }

    // --- Yearly aggregation (> 24 months / "all") ---
    if (groupByYear) {
        const keys = [...revMap.keys()].map(Number);
        let firstY = Math.min(...keys);
        const lastY = Math.max(...keys);

        // Защита от одинокой точки на графике
        if (firstY === lastY && !isNaN(firstY)) {
            firstY = firstY - 1;
        }

        const result: ChartPoint[] = [];
        for (let y = firstY; y <= lastY; y++) {
            result.push({ date: String(y), revenue: revMap.get(String(y)) ?? 0 });
        }
        return result;
    }

    // --- Monthly aggregation (91 days–24 months) ---
    const monthKeys = [...revMap.keys()].sort();
    const firstKey = monthKeys[0];
    const [fy, fm] = firstKey.split('-').map(Number);
    const monthsSpan = (end.getFullYear() - fy) * 12 + (end.getMonth() - (fm - 1));
    const showYear = monthsSpan > 12;

    const result: ChartPoint[] = [];
    const cur = new Date(fy, fm - 1, 1);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
    while (cur < endMonth) {
        const key = `${cur.getFullYear()}-${pad2(cur.getMonth() + 1)}`;
        const label = showYear
            ? `${MONTH_LABELS[cur.getMonth()]} ${cur.getFullYear()}`
            : MONTH_LABELS[cur.getMonth()];
        result.push({ date: label, revenue: revMap.get(key) ?? 0 });
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
            const [summaryData, chartsData, techsData, clientsData, kpiData, empData] = await Promise.all([
                analyticsApi.getSummary(from, to),
                analyticsApi.getChartData(from, to),
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

    const processedChartData = useMemo(() => buildChartData(
        chartData,
        filter.dateFilter.from,
        filter.dateFilter.to,
        filter.dateFilter.preset ?? undefined,
    ), [chartData, filter.dateFilter.from, filter.dateFilter.to, filter.dateFilter.preset]);

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
                    <p className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Всего заявок</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{summary.totalRequests}</p>
                </div>
                <div className="bg-white dark:bg-smartfix-dark/30 p-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm flex flex-col justify-center transition-colors">
                    <p className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Выполнено</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{summary.completedRequests}</p>
                </div>
                <div className="bg-white dark:bg-smartfix-dark/30 p-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm flex flex-col justify-center transition-colors">
                    <p className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Общая выручка</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-[#00FF88]">{summary.totalRevenue.toLocaleString('ru-RU')} ₽</p>
                </div>
                <div className="bg-white dark:bg-smartfix-dark/30 p-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm flex flex-col justify-center transition-colors">
                    <p className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Средний чек</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{summary.averageCheck.toLocaleString('ru-RU')} ₽</p>
                </div>
                <div className="bg-white dark:bg-smartfix-dark/30 p-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm flex flex-col justify-center transition-colors">
                    <p className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Затраты на мат-лы</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">{summary.totalPartsCost.toLocaleString()} ₽</p>
                </div>
                <div className="bg-white dark:bg-smartfix-dark/30 p-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm flex flex-col justify-center transition-colors">
                    <p className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Зарплаты</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{Math.round(computedTotalSalary).toLocaleString('ru-RU')} ₽</p>
                </div>
                <div className="bg-white dark:bg-smartfix-dark/30 p-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm flex flex-col justify-center transition-colors">
                    <p className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Чистая прибыль</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-[#00FF88]">{netProfit.toLocaleString()} ₽</p>
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
                                    // Если это уже строка года (4 цифры) или пресет "all", возвращаем как есть
                                    if (value.length === 4 || filter.dateFilter.preset === 'all') {
                                        return value;
                                    }
                                    // В остальных случаях, если это дата, можно оставить форматирование или вернуть значение
                                    const dateObj = new Date(value);
                                    if (isNaN(dateObj.getTime())) return value;
                                    return dateObj.toLocaleString('ru-RU', { month: 'short' });
                                }}
                            />
                            <YAxis
                                stroke="var(--chart-axis)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 'auto']}
                                tickFormatter={(value) => `${value} ₽`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--chart-tooltip-text)' }}
                                labelStyle={{ color: 'var(--chart-tooltip-text)', opacity: 0.7 }}
                                labelFormatter={(label) => {
                                    // Если это год, выводим красивую подпись
                                    if (label?.length === 4 || filter.dateFilter.preset === 'all') {
                                        return `Год: ${label}`;
                                    }
                                    const dateObj = new Date(label);
                                    if (isNaN(dateObj.getTime())) return label;
                                    return dateObj.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
                                }}
                                formatter={(value) => [`${(value ?? 0).toLocaleString('ru-RU')} ₽`, "Выручка"]}
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
                                    <p className="text-sm font-black text-emerald-500">{tech.revenue.toLocaleString('ru-RU')} ₽</p>
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
                                    <p className="text-sm font-black text-purple-500">{client.revenue.toLocaleString('ru-RU')} ₽</p>
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
