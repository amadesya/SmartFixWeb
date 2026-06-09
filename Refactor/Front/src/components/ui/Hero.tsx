import React from 'react';

interface HeroProps {
    onActionClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onActionClick }) => {
    return (
        <main className="flex-grow flex flex-col md:flex-row items-center justify-between px-6 md:px-12 pt-24 pb-16 max-w-7xl mx-auto gap-12 bg-[#051F20]">
            {/* Левая колонка: Текст и кнопка */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left ">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-smartfix-lightest mb-6 leading-tight">
                    Ваша техника <br className="hidden md:block" /> в надежных руках
                </h1>
                <p className="text-lg md:text-xl leading-relaxed text-smartfix-light max-w-xl mb-10">
                    Можно починить что угодно. Даже утюг.
                </p>
                <button
                    onClick={onActionClick}
                    className="bg-smartfix-lightest text-smartfix-darkest font-bold py-4 px-10 rounded-lg text-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                    Создать заявку
                </button>
            </div>

            {/* Правая колонка: Изображение с виджетом */}
            <div className="flex-1 flex justify-center w-full relative group mt-8 md:mt-0">
                {/* Контейнер для картинки и карточки */}
                <div className="relative">
                    {/* Исправленное фоновое свечение: уменьшено и ослаблено */}
                    <div className="absolute inset-0 bg-smartfix-lightest/5 blur-[30px] rounded-full scale-100 transition-all duration-500 group-hover:bg-smartfix-lightest/10"></div>

                    <img
                        src="/resources/IPhone_4_29.webp"
                        alt="Смартфон в ремонте"
                        className="rounded-xl relative z-10 w-full max-w-sm md:max-w-md object-cover group-hover:-translate-y-2 transition-transform duration-500"
                    />

                    {/* Парящая карточка статуса */}
                    <div className="absolute -bottom-10 -left-4 md:-bottom-1 md:-left-12 z-20 bg-smartfix-darkest/80 backdrop-blur-md border border-smartfix-lightest/20 p-4 rounded-xl shadow-2xl flex items-center gap-4 hover:scale-105 transition-transform duration-300">
                        {/* Иконка */}
                        <div className="bg-smartfix-lightest/10 p-3 rounded-full flex items-center justify-center text-smartfix-lightest">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        {/* Текст карточки */}
                        <div>
                            <p className="text-sm text-smartfix-light font-medium mb-0.5">Заявка #1402</p>
                            <p className="text-base md:text-lg text-white font-bold flex items-center gap-2">
                                {/* Пульсирующая точка */}
                                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span>
                                Готово к выдаче
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Hero;