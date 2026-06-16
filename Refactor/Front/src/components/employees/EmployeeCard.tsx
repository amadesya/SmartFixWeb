import React from 'react';
import { TrashIcon, PencilIcon, ShieldCheckIcon, WrenchIcon } from '@heroicons/react/24/outline';
import SafeAvatar from '@/components/ui/SafeAvatar';
import { EmployeeDto } from '@/services/api'; // Убедись, что путь правильный

interface EmployeeCardProps {
    employee: EmployeeDto;
    onEdit: (emp: EmployeeDto) => void;
    onDelete: (id: number) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onEdit, onDelete }) => {
    const isMaster = employee.userRole === 1;

    return (
        <div className="group bg-gray-50 dark:bg-smartfix-darker rounded-2xl border border-smartfix-medium/10 overflow-hidden hover:border-emerald-500/40 transition-all duration-300 flex flex-col h-full hover:shadow-xl hover:shadow-emerald-900/10">

            {/* Верхняя часть: Аватар/Иконка и Роль */}
            <div className="relative pt-8 pb-4 flex flex-col items-center justify-center bg-smartfix-lightest/10">
                <SafeAvatar
                    src={employee.avatar}
                    alt={employee.userName}
                    className="relative w-28 h-28 rounded-full border-4 border-smartfix-dark shadow-2xl overflow-hidden group-hover:border-emerald-500/30 transition-all duration-500 z-10"
                    iconClassName="bg-smartfix-dark group-hover:bg-emerald-500/10 transition-colors duration-500"
                />

                {/* Бейдж с ролью */}
                <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md border backdrop-blur-md transition-colors ${isMaster
                        ? 'bg-blue-100/80 dark:bg-blue-900/40 border-blue-300 dark:border-blue-500/20 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/60 hover:text-blue-900 dark:hover:text-blue-100'
                        : 'bg-green-100/80 dark:bg-green-900/40 border-green-300 dark:border-green-500/20 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/60 hover:text-green-900 dark:hover:text-green-100'
                    }`}>
                    {isMaster ? <WrenchIcon className="w-3 h-3" /> : <ShieldCheckIcon className="w-3 h-3" />}
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                        {isMaster ? 'Мастер' : 'Админ'}
                    </span>
                </div>
                
                {/* Кнопки управления */}
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(employee)}
                        className="bg-smartfix-darkest p-2 rounded-lg text-blue-400 hover:text-white hover:bg-blue-600 transition-all shadow-lg"
                        title="Редактировать"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(employee.id)}
                        className="bg-smartfix-darkest p-2 rounded-lg text-red-400 hover:text-white hover:bg-red-600 transition-all shadow-lg"
                        title="Удалить"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Контент: Имя и финансовая информация */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-smartfix-darker dark:text-white mb-4 group-hover:text-white dark:group-hover:text-emerald-400 transition-colors text-center">
                    {employee.userName}
                </h3>

                <div className="mt-auto flex flex-col gap-3">
                    {/* Оклад */}
                    <div className="flex justify-between items-center bg-smartfix-dark p-3 rounded-lg border border-smartfix-medium/10">
                        <span className="text-xs text-smartfix-light font-bold uppercase">Оклад</span>
                        <span className="font-bold text-smartfix-lightest">
                            {employee.baseSalary.toLocaleString('ru-RU')} ₽
                        </span>
                    </div>

                    {/* Премия */}
                    <div className="flex justify-between items-center bg-smartfix-dark p-3 rounded-lg border border-smartfix-medium/10">
                        <span className="text-xs text-smartfix-light font-bold uppercase">Премия</span>
                        <span className="font-bold text-emerald-400">
                            {employee.bonusPercentage}%
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default EmployeeCard;