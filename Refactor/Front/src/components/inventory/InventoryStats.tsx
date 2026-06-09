import { Part } from '@/types';

interface Props {
    parts: Part[];
}

export const InventoryStats = ({ parts }: Props) => {
    const totalKinds = parts.length;

    const totalCapitalization = parts.reduce(
        (acc, p) => acc + (p.purchasePrice * p.stockQuantity),
        0
    );

    const lowStockCount = parts.filter(p => p.stockQuantity < 5).length;

    const totalItems = parts.reduce((acc, p) => acc + p.stockQuantity, 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-smartfix-dark/30 p-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm flex flex-col justify-center transition-colors">
                <span className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Всего видов</span>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{totalKinds}</span>
            </div>

            <div className="bg-white dark:bg-smartfix-dark/30 p-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm flex flex-col justify-center transition-colors">
                <span className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Общая капитализация</span>
                <span className="text-3xl font-bold text-emerald-600 dark:text-[#00FF88]">{totalCapitalization.toLocaleString()} ₽</span>
            </div>

            <div className="bg-white dark:bg-smartfix-dark/30 p-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm flex flex-col justify-center transition-colors">
                <span className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Низкий запас</span>
                <span className="text-3xl font-bold text-red-600 dark:text-red-400">{lowStockCount}</span>
            </div>

            <div className="bg-white dark:bg-smartfix-dark/30 p-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm flex flex-col justify-center transition-colors">
                <span className="text-sm font-medium text-gray-500 dark:text-smartfix-light/70 mb-2">Всего на складе</span>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{totalItems}</span>
            </div>
        </div>
    );
};