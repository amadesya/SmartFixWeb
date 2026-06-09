import React from 'react';
import StatusSelect from '@/components/ui/StatusSelect';
import { Button } from '@/components/ui/Button';
import { User } from '@/types';

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
            <div className="rounded-xl border border-gray-200 dark:border-smartfix-medium/20 shadow-xl md:grid-cols-2 gap-4 p-4 bg-white dark:bg-transparent">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isAdmin && (
                        <div>
                            <span className="info-label text-gray-600 dark:text-smartfix-light/70 text-xs font-bold uppercase tracking-wider">Мастер</span>
                            <select
                                value={selectedTechnician}
                                onChange={(e) => setSelectedTechnician(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-smartfix-dark p-2.5 rounded-lg border border-gray-200 dark:border-smartfix-medium/30 text-gray-900 dark:text-smartfix-lightest outline-none focus:border-emerald-500 dark:focus:border-smartfix-light/30 transition-all"
                            >
                                <option value="">Не назначен</option>
                                {technicians.map((tech) => (
                                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <span className="info-label text-gray-600 dark:text-smartfix-light/70 text-xs font-bold uppercase tracking-wider">Статус заявки</span>
                        <StatusSelect value={newStatus} onChange={setNewStatus} />
                    </div>
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
                <Button
                    variant="outline"
                    onClick={onDelete}
                    className="py-3 text-red-600 hover:text-red-700 dark:text-red-400 border-red-200 hover:bg-red-50 dark:border-transparent dark:hover:bg-red-500/20"
                >
                    Удалить заявку
                </Button>
                <Button
                    variant="default"
                    onClick={onSave}
                    className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                    Сохранить изменения
                </Button>

            </div>
        </section>
    );
};

export default AdminControls;