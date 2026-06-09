import React, { useEffect } from 'react';
import { X, Quote } from 'lucide-react';
import { Review } from '@/types';

interface ReviewCardDetailModalProps {
    review: Review;
    onClose: () => void;
}

const ReviewCardDetailModal: React.FC<ReviewCardDetailModalProps> = ({ review, onClose }) => {
    // Блокируем скролл основной страницы при открытии модалки
    useEffect(() => {
        if (review) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [review]);

    if (!review) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 ">
            {/* Анимированный оверлей */}
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Контентное окно */}
            <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden">

                {/* Кнопка закрытия */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-500 hover:text-slate-900 transition-all rounded-full border border-slate-100 shadow-sm"
                >
                    <X size={18} />
                </button>

                <div className="relative bg-smartfix-dark">
                    {/* Декоративный фон сверху */}
                    <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 w-full" />

                    <div className="px-8 pb-8">
                        {/* Аватарка, выходящая за пределы */}
                        <div className="relative -mt-12 mb-4">
                            <div className="inline-block p-1.5 bg-smartfix-darkest rounded-3xl shadow-xl">
                                <img
                                    src={review.authorAvatar || '/default-avatar.png'}
                                    className="w-24 h-24 object-cover rounded-2xl"
                                    alt={review.authorName}
                                />
                            </div>
                        </div>

                        {/* Инфо о пользователе */}
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-slate-100 leading-tight">
                                {review.authorName}
                            </h3>
                            <p className="text-slate-100 font-medium text-sm">
                                {review.authorEmail}
                            </p>
                        </div>

                        {/* Текст отзыва с иконкой кавычек */}
                        <div className="relative">
                            <Quote className="absolute -top-2 -left-2 text-slate-100 w-12 h-12 -z-10" />
                            <p className="text-smartfix-lightest text-lg leading-relaxed italic">
                                «{review.body}»
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewCardDetailModal;