import React, { useState, useEffect } from 'react';
import { servicesApi, repairRequestsApi } from '@/services/api';
import { ServiceDto } from '@/types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    requestId: number;
    onSuccess: () => void;
}

const CompleteRepairModal: React.FC<Props> = ({ isOpen, onClose, requestId, onSuccess }) => {
    const [allServices, setAllServices] = useState<ServiceDto[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Загружаем список всех услуг из прайса
    useEffect(() => {
        if (isOpen) {
            servicesApi.getAll().then(setAllServices).catch(console.error);
        }
    }, [isOpen]);

    const toggleService = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
        );
    };

    const totalSum = allServices
        .filter(s => selectedIds.includes(s.id))
        .reduce((sum, s) => sum + s.price, 0);

    const handleSubmit = async () => {
        if (selectedIds.length === 0) {
            alert("Выберите хотя бы одну услугу!");
            return;
        }

        try {
            setIsSubmitting(true);
            await repairRequestsApi.completeRepair(requestId, selectedIds);
            onSuccess();
            onClose();
        } catch (error) {
            alert("Ошибка при сохранении: " + error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-smartfix-dark border border-smartfix-medium/20 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-smartfix-medium/10">
                    <h2 className="text-xl font-bold text-white">Завершение ремонта</h2>
                    <p className="text-sm text-smartfix-medium">Выберите выполненные услуги</p>
                </div>

                <div className="p-6 max-h-[400px] overflow-y-auto space-y-3">
                    {allServices.map(service => (
                        <label
                            key={service.id}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedIds.includes(service.id)
                                    ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                                    : 'bg-smartfix-darker/50 border-smartfix-medium/5 text-smartfix-medium hover:border-smartfix-medium/30'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="accent-emerald-500 w-4 h-4"
                                    checked={selectedIds.includes(service.id)}
                                    onChange={() => toggleService(service.id)}
                                />
                                <span className="text-sm font-medium">{service.name}</span>
                            </div>
                            <span className="font-bold text-xs">{service.price} ₽</span>
                        </label>
                    ))}
                </div>

                <div className="p-6 bg-smartfix-darker/30 space-y-4">
                    <div className="flex justify-between items-center text-white">
                        <span className="text-sm">Итого за работу:</span>
                        <span className="text-2xl font-black text-emerald-400">{totalSum} ₽</span>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-smartfix-medium/10 text-smartfix-medium hover:bg-smartfix-medium/20 transition-all font-bold"
                        >
                            Отмена
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 transition-all font-bold shadow-lg shadow-emerald-900/20"
                        >
                            {isSubmitting ? 'Сохранение...' : 'Завершить'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompleteRepairModal;