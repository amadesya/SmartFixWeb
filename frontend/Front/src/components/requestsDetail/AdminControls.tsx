import React from 'react';
import StatusSelect from '@/components/ui/StatusSelect';
import { RequestStatus, User } from '@/types';

interface AdminControlsProps {
    isAdmin: boolean;
    technicians: User[];
    selectedTechnician: string | number;
    setSelectedTechnician: (techId: string) => void;
    newStatus: any;
    setNewStatus: (status: any) => void;
    onSave: () => void;
    onDelete: () => void;
}

const requestStatusOptions = [
    { value: RequestStatus.New, label: 'В ожидании' },
    { value: RequestStatus.InProgress, label: 'В работе' },
    { value: RequestStatus.Ready, label: 'Выполнено' },
    { value: RequestStatus.Rejected, label: 'Отменено' },
];

const AdminControls: React.FC<AdminControlsProps> = ({
    isAdmin,
    technicians,
    selectedTechnician,
    setSelectedTechnician,
    newStatus,
    setNewStatus,
    onSave,
    onDelete
}) => {
    return (
        <section className="space-y-6 animate-in fade-in duration-300">
            {/* Карточка управления */}
            <div className="info-section-grid">
                {/* Фильтр: Мастер */}
                {isAdmin && (
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <label htmlFor="technician-filter" className="text-sm font-medium text-gray-600 dark:text-smartfix-light whitespace-nowrap">
                            Мастер:
                        </label>
                        <select
                            id="technician-filter"
                            onChange={(e) => setSelectedTechnician(e.target.value)}
                            value={selectedTechnician}
                            className="filter-input flex-1"
                        >
                            <option value="">Не назначен</option>
                            {technicians.map((tech) => (
                                <option key={tech.id} value={tech.id}>
                                    {tech.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Фильтр: Статус заявки */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <label htmlFor="status-select-filter" className="text-sm font-medium text-gray-600 dark:text-smartfix-light whitespace-nowrap">
                        Статус заявки:
                    </label>
                    <select
                        id="status-select-filter"
                        value={newStatus || ''}
                        onChange={(e) => setNewStatus(e.target.value as RequestStatus)}
                        className="filter-input flex-1"
                    >
                        {requestStatusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Блок-напоминание */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 rounded-xl shadow-sm dark:shadow-none">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm text-blue-800 dark:text-blue-100/80 leading-relaxed">
                        <span className="font-bold text-blue-700 dark:text-blue-400 text-xs uppercase block mb-0.5">Внимание</span>
                        Не забудьте сохранить изменения после выбора нового мастера или смены статуса, иначе данные будут потеряны при закрытии окна.
                    </p>
                </div>
            </div>

            {/* Кнопки действий */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <button
                    onClick={onDelete}
                    className="btn-action-base border py-3 text-red-600 hover:text-red-700 dark:text-red-400 border-red-200 hover:bg-red-50 dark:border-transparent dark:hover:bg-red-500/20"
                >
                    Удалить заявку
                </button>
                <button
                    onClick={onSave}
                    className="btn-action-base border border-transparent bg-[#a6dccf] text-[#144a35] hover:bg-[#85b9a0] shadow-sm dark:bg-[#8EB69B] dark:text-[#051F20] dark:hover:bg-[#7ba388]"
                >
                    Сохранить изменения
                </button>
            </div>
        </section>
    );
};

export default AdminControls;