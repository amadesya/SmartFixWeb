import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@/types';

interface ReviewFormProps {
    user: User | null;
    newComment: string;
    setNewComment: (val: string) => void;
    rating: number;
    setRating: (val: number) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
    user, newComment, setNewComment, rating, setRating, onSubmit, isSubmitting
}) => {
    if (!user) return null;

    return (
        <div className="p-4 bg-white dark:bg-smartfix-darker rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-smartfix-medium/20 mb-8 animate-in fade-in duration-500">
            <textarea
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-smartfix-dark text-gray-900 dark:text-white border border-gray-200 dark:border-smartfix-medium/30 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#8EB69B]/30 outline-none text-sm transition-all resize-none min-h-[100px]"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Напишите ваш отзыв..."
            />
            <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-smartfix-light/50">Оценка:</span>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={16}
                                onClick={() => setRating(star)}
                                className={cn(
                                    "cursor-pointer transition-colors",
                                    star <= rating ? "fill-yellow-500 text-yellow-500" : "text-smartfix-medium/50"
                                )}
                            />
                        ))}
                    </div>
                </div>
                <button
                    onClick={onSubmit}
                    disabled={isSubmitting || !newComment.trim()}
                    className="bg-[#8EB69B]/80 hover:bg-[#8EB69B] text-smartfix-darkest text-[10px] uppercase font-black px-6 py-2 rounded-lg transition-all disabled:opacity-50"
                >
                    Отправить
                </button>
            </div>
        </div>
    );
};