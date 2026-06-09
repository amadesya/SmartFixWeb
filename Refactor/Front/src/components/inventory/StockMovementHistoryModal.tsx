import React, { useState, useEffect } from 'react';
import { X, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { API_URL, getAuthHeader } from '@/services/api';

interface StockMovement {
    id: number;
    quantity: number;
    type: string;
    date: string;
    comment: string;
    remainingStock: number;
}

interface Props {
    partId: number;
    partName: string;
    onClose: () => void;
}

export const StockMovementHistoryModal: React.FC<Props> = ({ partId, partName, onClose }) => {
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${API_URL}/stock/history/${partId}`, {
                    headers: getAuthHeader() as Record<string, string>
                });
                if (res.ok) {
                    const data = await res.json();
                    setMovements(data);
                }
            } catch (e) {
                console.error('Ошибка загрузки истории склада', e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, [partId]);

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-smartfix-darker shadow-xl w-full max-w-md h-full overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-smartfix-medium/30">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">История: {partName}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-gray-50 dark:bg-transparent">
                    {isLoading ? (
                        <div className="text-center py-8 text-gray-500 font-medium">Загрузка истории...</div>
                    ) : movements.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 font-medium">История перемещений пуста.</div>
                    ) : (
                        <div className="space-y-3">
                            {movements.map((m) => {
                                const isPositive = m.quantity > 0;
                                return (
                                    <div key={m.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 bg-white dark:bg-smartfix-dark shadow-sm hover:shadow-md transition-shadow">
                                        <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${isPositive ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-[#00FF88]' : 'bg-red-50 border-red-100 text-red-600 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400'}`}>
                                            {isPositive ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-bold truncate ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{m.type}</p>
                                            {m.comment && <p className="text-sm text-gray-600 dark:text-smartfix-light/70 truncate">{m.comment}</p>}
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className={`text-xl font-black ${isPositive ? 'text-emerald-600 dark:text-[#00FF88]' : 'text-red-600 dark:text-red-400'}`}>
                                                {isPositive ? `+${m.quantity}` : m.quantity}
                                            </p>
                                            <p className="text-xs font-medium text-gray-500 dark:text-smartfix-light/50 mt-1">
                                                {new Date(m.date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};