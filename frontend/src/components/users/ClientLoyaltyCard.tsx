import React from 'react';

export const ClientLoyaltyCard: React.FC<{ loyalty: any }> = ({ loyalty }) => {
  const tierColors: Record<string, string> = {
    Bronze: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400',
    Silver: 'text-slate-500 bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400',
    Gold: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 dark:text-yellow-400',
  };

  const tier = loyalty?.tier || 'Bronze';
  const discountPercent = loyalty?.discountPercent || 0;
  const bonusPoints = loyalty?.bonusPoints ?? loyalty?.accumulatedBonuses ?? 0;
  const totalSpent = loyalty?.totalSpent || 0;

  const getProgress = () => {
    if (totalSpent < 10000) return { next: 'Silver', remaining: 10000 - totalSpent, percent: (totalSpent / 10000) * 100 };
    if (totalSpent < 50000) return { next: 'Gold', remaining: 50000 - totalSpent, percent: ((totalSpent - 10000) / 40000) * 100 };
    return { next: null, remaining: 0, percent: 100 };
  };

  const progress = getProgress();

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-white dark:bg-smartfix-darker rounded-xl border border-gray-100 dark:border-smartfix-medium/20 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Уровень программы</p>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${tierColors[tier] || tierColors.Bronze}`}>
            {tier}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-smartfix-darker rounded-xl border border-gray-100 dark:border-smartfix-medium/20 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Персональная скидка</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-smartfix-lightest mt-1">
            {discountPercent}%
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-smartfix-darker rounded-xl border border-gray-100 dark:border-smartfix-medium/20 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Доступные бонусы</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {bonusPoints} ₽
          </p>
        </div>
      </div>

      {/* Шкала прогресса */}
      {progress.next && (
        <div className="bg-white dark:bg-smartfix-darker p-4 rounded-xl border border-gray-100 dark:border-smartfix-medium/20 shadow-sm">
          <div className="flex justify-between items-end mb-2">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Прогресс до {progress.next}
            </p>
            <p className="text-xs text-gray-500 dark:text-smartfix-light/60">
              Осталось: <span className="font-bold text-gray-900 dark:text-white">{progress.remaining} ₽</span>
            </p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-smartfix-dark rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-medium px-1">
            <span>{tier}</span>
            <span>{progress.next}</span>
          </div>
        </div>
      )}
    </div>
  );
};