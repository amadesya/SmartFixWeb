import React, { useState } from 'react';
import { reviewService } from '@/services/api';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    requestId: number;
    userId: number;
    onSuccess: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, requestId, userId, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [body, setBody] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!body.trim()) {
            alert("Пожалуйста, напишите текст отзыва");
            return;
        }

        setIsSubmitting(true);
        try {
            await reviewService.create({
                userId: userId,
                repairRequestId: requestId,
                rating: rating,
                body: body,
                parentId: null
            });

            onSuccess(); // Вызываем колбек при успехе (он обновит карточку заказа)
            onClose();   // Закрываем модалку
        } catch (error: any) {
            console.error("Ошибка отправки отзыва:", error);
            // axios оборачивает текст ошибки с бэкенда в error.response.data
            const errorMsg = error.response?.data || error.message || "Неизвестная ошибка";
            alert("Ошибка при сохранении отзыва: " + errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-smartfix-dark border border-gray-200 dark:border-smartfix-medium/20 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-gray-100 dark:border-smartfix-medium/10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Оцените работу мастера</h2>
                    <p className="text-sm text-gray-500 dark:text-smartfix-medium">Поделитесь вашими впечатлениями от ремонта</p>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm text-gray-500 dark:text-smartfix-medium mb-3 text-center">Ваша оценка</label>
                        <div className="flex gap-2 justify-center">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`text-4xl transition-all hover:scale-110 active:scale-95 ${
                                        rating >= star 
                                        ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' 
                                        : 'text-gray-300 dark:text-smartfix-medium/30 hover:text-gray-400 dark:hover:text-smartfix-medium/50'
                                    }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 dark:text-smartfix-medium mb-2">Ваш отзыв</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-smartfix-darker p-4 rounded-xl border border-gray-200 dark:border-smartfix-medium/20 text-gray-900 dark:text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none text-sm"
                            rows={4}
                            placeholder="Что вам понравилось или не понравилось в работе мастера?"
                        />
                    </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-smartfix-darker/30 border-t border-gray-100 dark:border-transparent flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-smartfix-medium/10 text-gray-700 dark:text-smartfix-medium hover:bg-gray-300 dark:hover:bg-smartfix-medium/20 transition-all font-bold"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !body.trim()}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-all font-bold shadow-lg shadow-blue-900/20"
                    >
                        {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;