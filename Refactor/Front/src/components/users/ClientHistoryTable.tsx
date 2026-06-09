import React from 'react';
import { ClientHistoryItem } from '../../types/client';

export const ClientHistoryTable: React.FC<{ history: ClientHistoryItem[] }> = ({ history }) => {
  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'ready' || s === 'готова' || s === 'completed') return { text: 'Готово', style: 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' };
    if (s === 'inprogress' || s === 'in_progress' || s === 'в работе') return { text: 'В работе', style: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' };
    if (s === 'new' || s === 'новая') return { text: 'Новая', style: 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400' };
    if (s === 'cancelled' || s === 'отклонен') return { text: 'Отклонен', style: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400' };
    return { text: status, style: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' };
  };

  return (
    <div className="bg-white dark:bg-smartfix-darker rounded-xl border border-gray-100 dark:border-smartfix-medium/20 shadow-sm overflow-hidden">
      <div className="py-3 px-4 border-b border-gray-100 dark:border-smartfix-medium/20">
        <h3 className="text-base font-semibold text-gray-900 dark:text-smartfix-lightest">История ремонтов</h3>
      </div>
      <div className="p-4 space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
        {history.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">История пуста</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-smartfix-dark border border-gray-100 dark:border-smartfix-medium/20 rounded-xl hover:border-gray-200 dark:hover:border-smartfix-medium/40 transition-colors">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-400 dark:text-smartfix-light/50">#{item.id}</span>
                  <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">{item.device}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-smartfix-light/60 truncate">
                  {item.date} • {item.problem}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-sm text-gray-900 dark:text-white mb-1">{item.cost.toLocaleString()} ₽</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusStyle(item.status).style}`}>
                  {getStatusStyle(item.status).text}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};