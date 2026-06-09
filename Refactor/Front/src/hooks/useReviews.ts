import { useState, useEffect, useCallback, useMemo } from 'react';
import { reviewService } from '@/services/api';
import { Review, User } from '@/types';
import toast from 'react-hot-toast';
import { useConfirmation } from '@/hooks/useConfirmation';

const buildTree = (items: Review[], parentId: number | null = null): any[] => {
    return items
        .filter(item => item.parentId === parentId || item.ParentId === parentId)
        .map(item => ({
            ...item,
            replies: buildTree(items, item.id) // Ищем детей для текущего элемента
        }));
};

export const useReviews = (user: User | null) => {
    // Основные состояния (как в useEmployees)
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingReview, setEditingReview] = useState<Review | null>(null);

    // Состояния специфичные для формы отзывов
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(5);

    const { itemToDelete, confirm: confirmDelete, cancel: cancelDelete } = useConfirmation<number>();

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await reviewService.getAll();
            setReviews(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleEditClick = (review: Review) => {
        setEditingReview(review);
        // При желании можно сразу подставить текст в форму редактирования:
        // setNewComment(review.body);
        // setRating(review.rating);
        console.log("Открываем форму редактирования для отзыва:", review.id);
    };

    const handleUpdateReview = async (id: number, newData: { body: string; rating: number }) => {
        try {
            setIsSubmitting(true);
            await reviewService.update(id, newData);
            await loadData();
            setEditingReview(null);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Переименовали handleSubmit в handleAddReview для единообразия
    const handleAddReview = async () => {
        if (!user) {
            toast.error("Пожалуйста, войдите в систему, чтобы оставить отзыв.");
            return;
        }

        if (!newComment.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            await reviewService.create({
                userId: user.id,
                body: newComment,
                rating: rating
            });
            await loadData(); // Перезагружаем список с сервера, как в useEmployees
            setNewComment('');
            setRating(5);
        } catch (err: any) {
            toast.error(err.message || "Не удалось отправить отзыв.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddReply = async (parentId: number, text: string) => {
    if (!user) return;
    try {
        await reviewService.create({
            userId: user.id,
            body: text,
            rating: 5, // Для ответов рейтинг обычно не важен
            parentId: parentId
        });
        await loadData(); // Обновляем список, чтобы увидеть ответ
    } catch (err) {
        toast.error("Ошибка при отправке ответа");
    }
};

    const handleDeleteReview = (id: number) => {
        confirmDelete(id);
    };

    const confirmDeleteAction = async () => {
        if (itemToDelete === null) return;
        try {
            await reviewService.delete(itemToDelete);
            await loadData();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            cancelDelete();
        }
    };

    // 2. Создаем мемоизированное дерево
    const reviewTree = useMemo(() => {
        return buildTree(reviews);
    }, [reviews]); // Пересчитывать только если изменился плоский массив reviews

    return {
        reviews,
        reviewTree,
        loading,
        error,
        isSubmitting,
        newComment,
        setNewComment,
        rating,
        setRating,
        editingReview,
        setEditingReview,
        handleEditClick,
        handleUpdateReview,
        handleAddReview,
        handleDeleteReview,
        itemToDelete,
        confirmDeleteAction,
        cancelDelete,
        loadData,
        handleAddReply
    };
};