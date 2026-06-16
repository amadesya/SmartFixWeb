import { useState, useEffect, useMemo } from 'react';
import { Clock, Wallet, Coins, Percent, CheckCircle, User } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';
import type { EmployeeKpi, EmployeeDto } from '@/services/api';

interface EmployeeSalaryTableProps {
  employees: EmployeeKpi[];
  employeeProfiles?: EmployeeDto[];
}

const MONTHLY_NORM_HOURS = 160;

function parseToNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  const cleaned = value.toString().replace(/[^\d.]/g, '');
  return parseFloat(cleaned) || 0;
}

function calculateEmployeeSalary(salary: number, bonusPercent: number, orderCount: number) {
  const hours = orderCount * 2;
  const hourlyRate = salary > 0 ? salary / MONTHLY_NORM_HOURS : 0;
  const salaryByHours = hours * hourlyRate;
  const bonusAmount = salaryByHours * (bonusPercent / 100);
  const totalPayout = salaryByHours + bonusAmount;
  return {
    hours: hours,
    hourlyRate: hourlyRate,
    salaryByHours: salaryByHours,
    bonusPercent: bonusPercent,
    bonusAmount: bonusAmount,
    totalPayout: totalPayout,
  };
}

function formatCurrency(value: number): string {
  return `${Math.round(value).toLocaleString('ru-RU')} ₽`;
}

export function EmployeeSalaryTable({ employees, employeeProfiles = [] }: EmployeeSalaryTableProps) {
  const pageSize = 15;
  const [page, setPage] = useState(1);

  const profileMap = useMemo(() => {
    const map = new Map<number, EmployeeDto>();
    for (const p of employeeProfiles) {
      map.set(p.id, p);
    }
    return map;
  }, [employeeProfiles]);

  const findProfile = (emp: EmployeeKpi): EmployeeDto | undefined => {
    const byId = profileMap.get(emp.employeeId);
    if (byId) return byId;
    return employeeProfiles.find(p => p.userName === emp.name);
  };

  const computedRows = useMemo(() => {
    return employees.map(emp => {
      const profile = findProfile(emp);
      const salary = profile ? parseToNumber(profile.baseSalary) : 0;
      const bonusPct = profile ? parseToNumber(profile.bonusPercentage) : 0;
      const effectiveSalary = salary > 0 ? salary : 50000;
      const effectiveBonus = bonusPct;
      return {
        employeeId: emp.employeeId,
        name: emp.name,
        completedRequests: emp.completedRequests,
        ...calculateEmployeeSalary(effectiveSalary, effectiveBonus, emp.completedRequests),
      };
    });
  }, [employees, employeeProfiles]);

  const totalPages = Math.max(1, Math.ceil(computedRows.length / pageSize));
  const displayData = computedRows.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [employees.length]);

  const totals = useMemo(() => {
    return computedRows.reduce(
      (acc, r) => ({
        hours: acc.hours + r.hours,
        salaryByHours: acc.salaryByHours + r.salaryByHours,
        completedRequests: acc.completedRequests + r.completedRequests,
        bonusAmount: acc.bonusAmount + r.bonusAmount,
        totalPayout: acc.totalPayout + r.totalPayout,
      }),
      { hours: 0, salaryByHours: 0, completedRequests: 0, bonusAmount: 0, totalPayout: 0 },
    );
  }, [computedRows]);

  if (computedRows.length === 0) return null;

  return (
    <div className="bg-white dark:bg-smartfix-darker rounded-2xl shadow-sm border border-gray-200 dark:border-smartfix-dark overflow-hidden transition-colors">
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <User className="size-5 text-gray-500 dark:text-smartfix-light" aria-hidden="true" />
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Зарплата сотрудников</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-smartfix-dark border-b border-gray-200 dark:border-smartfix-dark/50">
            <tr>
              <th className="p-4 font-semibold text-gray-600 dark:text-smartfix-light">Сотрудник</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-smartfix-light text-right whitespace-nowrap">
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" aria-hidden="true" />
                  Часы
                </span>
              </th>
              <th className="p-4 font-semibold text-gray-600 dark:text-smartfix-light text-right whitespace-nowrap">Ставка</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-smartfix-light text-right whitespace-nowrap">ЗП по часам</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-smartfix-light text-right whitespace-nowrap">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle className="size-3.5" aria-hidden="true" />
                  Заказы
                </span>
              </th>
              <th className="p-4 font-semibold text-gray-600 dark:text-smartfix-light text-right whitespace-nowrap">
                <span className="inline-flex items-center gap-1">
                  <Percent className="size-3.5" aria-hidden="true" />
                  Бонус
                </span>
              </th>
              <th className="p-4 font-semibold text-gray-600 dark:text-smartfix-light text-right whitespace-nowrap">
                <span className="inline-flex items-center gap-1">
                  <Wallet className="size-3.5" aria-hidden="true" />
                  Сумма бонуса
                </span>
              </th>
              <th className="p-4 font-semibold text-gray-600 dark:text-smartfix-light text-right whitespace-nowrap">
                <span className="inline-flex items-center gap-1">
                  <Coins className="size-3.5" aria-hidden="true" />
                  Итого
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-smartfix-dark">
            {displayData.map((row) => (
              <tr key={row.employeeId} className="hover:bg-gray-50 dark:hover:bg-smartfix-dark transition-colors">
                <td className="p-4 font-medium text-gray-900 dark:text-white">{row.name}</td>
                <td className="p-4 text-right text-gray-900 dark:text-white tabular-nums">{row.hours.toFixed(1)}</td>
                <td className="p-4 text-right text-gray-900 dark:text-white tabular-nums">{formatCurrency(row.hourlyRate)}</td>
                <td className="p-4 text-right text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">{formatCurrency(row.salaryByHours)}</td>
                <td className="p-4 text-right text-gray-900 dark:text-white tabular-nums">{row.completedRequests}</td>
                <td className="p-4 text-right text-gray-900 dark:text-white tabular-nums">{row.bonusPercent}%</td>
                <td className="p-4 text-right text-amber-600 dark:text-amber-400 font-semibold tabular-nums">{formatCurrency(row.bonusAmount)}</td>
                <td className="p-4 text-right text-gray-900 dark:text-white font-bold tabular-nums">{formatCurrency(row.totalPayout)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-200 dark:border-smartfix-dark bg-gray-50/50 dark:bg-smartfix-dark/30">
              <td className="p-4 font-bold text-gray-900 dark:text-white">Итого</td>
              <td className="p-4 text-right text-gray-900 dark:text-white tabular-nums font-semibold">{totals.hours.toFixed(1)}</td>
              <td className="p-4" />
              <td className="p-4 text-right text-emerald-600 dark:text-emerald-300 font-bold tabular-nums">{formatCurrency(totals.salaryByHours)}</td>
              <td className="p-4 text-right text-gray-900 dark:text-white tabular-nums font-semibold">{totals.completedRequests}</td>
              <td className="p-4" />
              <td className="p-4 text-right text-amber-600 dark:text-amber-300 font-bold tabular-nums">{formatCurrency(totals.bonusAmount)}</td>
              <td className="p-4 text-right text-gray-900 dark:text-white font-black tabular-nums">{formatCurrency(totals.totalPayout)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
