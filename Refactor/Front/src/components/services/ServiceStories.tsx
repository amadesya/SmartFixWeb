import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Service } from "@/types";
import { cn } from "@/lib/utils";

interface ServiceStoriesProps {
    services: Service[];
    isLoading?: boolean;
}

const ServiceStories: React.FC<ServiceStoriesProps> = ({ services, isLoading }) => {
    const [index, setIndex] = useState(0);

    // Автопереключение слайдов (5 секунд на каждый)
    useEffect(() => {
        if (services.length === 0) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % services.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [services.length, index]);

    if (isLoading || services.length === 0) {
        return <div className="text-white text-center py-10">Загрузка историй...</div>;
    }

    const currentService = services[index];

    return (
        <div className="relative h-[600px] w-full max-w-[450px] mx-auto overflow-hidden rounded-[2.5rem] bg-black shadow-2xl isolate border border-white/10">

            {/* Изображение с анимацией появления */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentService.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src={currentService.imageUrl || 'https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc9?q=80&w=800&auto=format&fit=crop'}
                        alt={currentService.name}
                        className="h-full w-full object-cover"
                    />
                    {/* Градиентный слой для читаемости текста */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Индикаторы прогресса (Stories Bars) */}
            <div className="absolute top-6 left-0 right-0 flex gap-1.5 px-6 z-20">
                {services.map((_, i) => (
                    <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
                        <motion.div
                            className="h-full bg-white"
                            initial={{ width: "0%" }}
                            animate={{
                                width: i === index ? "100%" : i < index ? "100%" : "0%"
                            }}
                            transition={{
                                duration: i === index ? 5 : 0,
                                ease: "linear"
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Контентная часть */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-8 pb-12 flex flex-col">
                <motion.div
                    key={`info-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-white text-3xl font-black leading-tight mb-3">
                        {currentService.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-6 line-clamp-3">
                        {currentService.description || "Профессиональное обслуживание и быстрый ремонт вашего устройства."}
                    </p>

                    <div className="flex items-center justify-between mb-8">
                        <span className="text-2xl font-bold text-white">{currentService.price} ₽</span>
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-white uppercase tracking-wider">
                            SmartFix Quality
                        </span>
                    </div>
                </motion.div>

                <button className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
                    Записаться на ремонт
                </button>
            </div>

            {/* Зоны клика (Лево / Право) */}
            <div className="absolute inset-0 z-30 flex">
                <div
                    className="w-1/3 h-full cursor-pointer"
                    onClick={() => setIndex((prev) => (prev - 1 + services.length) % services.length)}
                    title="Назад"
                />
                <div
                    className="w-2/3 h-full cursor-pointer"
                    onClick={() => setIndex((prev) => (prev + 1) % services.length)}
                    title="Вперед"
                />
            </div>
        </div>
    );
};

export default ServiceStories;