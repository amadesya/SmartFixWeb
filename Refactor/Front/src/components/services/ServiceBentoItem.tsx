import React, { useState } from 'react';
import { Service } from '@/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ServiceBentoItemProps {
    service: Service;
    index: number;
}

const ServiceBentoItem: React.FC<ServiceBentoItemProps> = ({ service, index }) => {
    const isLarge = index === 0 || index === 3;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={cn(
                "group relative overflow-hidden rounded-3xl bg-[#1a1a1a] border border-white/5 cursor-pointer isolate",
                isLarge ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1"
            )}
        >
            {/* Изображение */}
            <img
                src={service.imageUrl}
                alt={service.name}
                className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-110"
            />

            {/* Маска/Градиент в стиле Magic UI */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            {/* Контент */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                    <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {service.description}
                    </p>
                </div>

                {/* Декоративная подсветка при ховере */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white" />
            </div>
        </motion.div>
    );
};

export default ServiceBentoItem;