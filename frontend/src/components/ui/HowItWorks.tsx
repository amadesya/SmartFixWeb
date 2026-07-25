import React from 'react';
import {
    DocumentTextIcon,
    MagnifyingGlassIcon,
    ChartPieIcon,
    SparklesIcon
} from './icons';

const STEPS = [
    {
        icon: <DocumentTextIcon className="w-8 h-8" />,
        title: "1. Создайте заявку",
        description: "Заполните простую форму, описав проблему с вашим устройством."
    },
    {
        icon: <MagnifyingGlassIcon className="w-8 h-8" />,
        title: "2. Диагностика",
        description: "Наш мастер проведет диагностику и определит причину неисправности."
    },
    {
        icon: <ChartPieIcon className="w-8 h-8" />,
        title: "3. Отслеживание",
        description: "Следите за статусом ремонта в вашем личном кабинете в реальном времени."
    },
    {
        icon: <SparklesIcon className="w-8 h-8" />,
        title: "4. Готово!",
        description: "Получите уведомление о готовности и заберите ваше исправное устройство."
    }
];

const HowItWorksCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 text-center shadow-md transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
        {/* Кружок для иконки — делаем его светло-зеленым */}
        <div className="mx-auto bg-smartfix-lightest/50 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-smartfix-darkest">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Roboto', sans-serif" }}>
            {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
            {description}
        </p>
    </div>
);
const HowItWorks: React.FC = () => {
    return (
        <section className="py-24 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black text-center text-smartfix-darkest mb-16">
                    Как это работает?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {STEPS.map((step, index) => (
                        <HowItWorksCard
                            key={index}
                            icon={step.icon}
                            title={step.title}
                            description={step.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;