import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ReviewItem } from '@/components/reviews/ReviewItem';
import { useReviews } from '@/hooks/useReviews';
import { User, Review } from '@/types';
import { buildTree } from '@/utils/treeHelper';
import { useAuth } from '@/hooks/useAuth';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export const ReviewThreadPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
        const { user } = useAuth();

    // Получаем все данные и методы из твоего хука
    const {
        reviews,
        loading,
        handleUpdateReview,
        handleDeleteReview,
        handleAddReply,
        itemToDelete,
        confirmDeleteAction,
        cancelDelete
    } = useReviews(user);

    // Состояния для редактирования внутри этой страницы
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');

    // 1. Находим "голову" обсуждения
    const threadRoot = useMemo(() => {
        return reviews.find(r => r.id === Number(id));
    }, [reviews, id]);

    // 2. Строим дерево только для этой ветки
    const threadTree = useMemo(() => {
        if (!threadRoot) return null;
        return {
            ...threadRoot,
            replies: buildTree(reviews, threadRoot.id)
        };
    }, [reviews, threadRoot]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-smartfix-darkest">
                <div className="text-gray-900 dark:text-smartfix-lightest text-xl animate-pulse">Загрузка обсуждения...</div>
            </div>
        );
    }

    if (!threadRoot || !threadTree) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-smartfix-darkest gap-4">
                <div className="text-gray-900 dark:text-smartfix-lightest text-xl">Обсуждение не найдено</div>
                <button
                    onClick={() => navigate(-1)} // -1 заставляет браузер вернуться на шаг назад
                    className="flex items-center gap-2 text-sm dark:text-smartfix-light/50 text-gray-500 dark:hover:text-white hover:text-gray-900 mb-6 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Вернуться назад
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-smartfix-darkest dark:text-smartfix-lightest text-black">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">

                {/* Кнопка назад в стиле Reddit */}
                <button
                    onClick={() => navigate(-1)} // -1 заставляет браузер вернуться на шаг назад
                    className="flex items-center gap-2 text-sm dark:text-smartfix-light/50 text-gray-500 dark:hover:text-white hover:text-gray-900 mb-6 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Вернуться назад
                </button>

                <header className="mb-10 border-b border-gray-200 dark:border-smartfix-medium/10 pb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ветка обсуждения</h1>
                    <p className="dark:text-smartfix-light/40 text-gray-600 text-sm mt-1">
                        Просмотр отдельного комментария и ответов на него
                    </p>
                </header>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <ReviewItem
                        review={threadTree as Review}
                        currentUser={user}
                        depth={0}

                        editingId={editingId}
                        editText={editText}

                        // Пропс для автоматического раскрытия (нужно добавить в ReviewItem)
                        isDefaultExpanded={true}

                        // Обработчики действий
                        onEditStart={(id, text) => {
                            setEditingId(id);
                            setEditText(text);
                        }}
                        onEditCancel={() => setEditingId(null)}
                        onEditChange={setEditText}
                        onEditSave={(id, rating) => {
                            handleUpdateReview(id, {
                                body: editText,
                                rating: rating
                            });
                            setEditingId(null);
                        }}
                        onDelete={(id) => {
                            handleDeleteReview(id);
                        }}
                        onReply={handleAddReply}
                    />
                </div>
            </div>

            <ConfirmationModal
                isOpen={itemToDelete !== null}
                title="Удаление комментария"
                message="Вы уверены, что хотите удалить этот комментарий? Действие необратимо."
                onConfirm={confirmDeleteAction}
                onCancel={cancelDelete}
            />
        </div>
    );
};