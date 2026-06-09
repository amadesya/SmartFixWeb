import React, { useEffect, useState } from 'react';
import { promotionsApi, Promotion } from '@/services/api';
import { Gift, Clock, Percent } from 'lucide-react';

const PromotionsBlock: React.FC = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);

    useEffect(() => {
        promotionsApi.getAll()
            .then(data => setPromotions(data.filter(p => p.isActive)))
            .catch(console.error);
    }, []);

    if (promotions.length === 0) return null;

    const getDaysLeft = (endDate: string) => {
        const diffTime = new Date(endDate).getTime() - new Date().getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    return (
        <div className="w-full mb-8">
            <div className="flex items-center gap-2 mb-4">
                <Gift className="text-emerald-500" size={24} />
                <h2 className="text-2xl font-black text-slate-800 dark:text-white">
                    Специальные предложения
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {promotions.map(promo => (
                    <div 
                        key={promo.id} 
                        className="relative overflow-hidden rounded-2xl p-6 bg-white shadow-md dark:shadow-none dark:bg-[#0B1A15] border border-emerald-500/20 hover:border-emerald-500 transition-all duration-300"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Percent size={80} className="text-emerald-500" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-1 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-4">
                                <Percent size={12} />
                                Скидка {promo.discountPercent}%
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-emerald-50 mb-2">
                                {promo.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-emerald-100/70 mb-6 line-clamp-2">
                                {promo.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                <Clock size={14} />
                                {getDaysLeft(promo.endDate)} дней до конца акции
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PromotionsBlock;