import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { User } from '@/types';
import { useReviews } from '@/hooks/useReviews';
import { ReviewForm } from '@/components/reviews/ReviewsForm';
import { ReviewItem } from '@/components/reviews/ReviewItem';
import { useAuth } from '@/hooks/useAuth';
import { PageHeader } from '@/components/ui/PageHeader';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export const ReviewsPage: React.FC = () => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const { user } = useAuth();

    const {
        reviewTree,
        loading,
        newComment,
        setNewComment,
        rating,
        setRating,
        isSubmitting,
        handleAddReview,
        handleUpdateReview,
        handleDeleteReview,
        handleAddReply,
        itemToDelete,
        confirmDeleteAction,
        cancelDelete
    } = useReviews(user);

    return (
        <div className="max-w-4xl mx-auto  px-4">
            <PageHeader title="Отзывы" />

            {/* <ReviewForm
                user={user}
                newComment={newComment}
                setNewComment={setNewComment}
                rating={rating}
                setRating={setRating}
                onSubmit={handleAddReview}
                isSubmitting={isSubmitting}
            /> */}

            <div className="space-y-6 mt-10">
                {loading ? (
                    <p className="text-center text-smartfix-light/30 text-sm py-10 animate-pulse">
                        Загрузка отзывов...
                    </p>
                ) : reviewTree.length === 0 ? (
                    <div className="text-center py-20 opacity-20 flex flex-col items-center">
                        <Star className="mb-2" size={32} />
                        <p>Отзывов пока нет</p>
                    </div>
                ) : (
                    reviewTree.map((review) => (
                        <ReviewItem
                            key={review.id}
                            review={review}
                            depth={0}
                            currentUser={user}
                            editingId={editingId}
                            editText={editText}
                            onEditStart={(id, text) => {
                                setEditingId(id);
                                setEditText(text);
                            }}
                            onEditCancel={() => setEditingId(null)}
                            onEditSave={(id, rating) => {
                                handleUpdateReview(id, { body: editText, rating: rating });
                                setEditingId(null);
                            }}
                            onEditChange={setEditText}
                            onDelete={(id) => handleDeleteReview(id)}
                            onReply={handleAddReply}
                        />
                    ))
                )}
            </div>

            <ConfirmationModal
                isOpen={itemToDelete !== null}
                title="Удаление отзыва"
                message="Вы уверены, что хотите навсегда удалить этот отзыв?"
                onConfirm={confirmDeleteAction}
                onCancel={cancelDelete}
            />
        </div>
    );
};

export default ReviewsPage;