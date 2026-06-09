import React, { useState } from 'react';
import { Star, Reply, Send, User as UserIcon, Edit2, Trash2, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User, Review, Role } from '@/types';
import { getFullAvatarUrl } from '@/utils/avatarHelper';
import { Link } from 'react-router-dom';

interface ReviewItemProps {
    review: Review;
    currentUser: User | null;
    editingId: number | null;
    editText: string;
    onEditStart: (id: number, text: string) => void;
    onEditCancel: () => void;
    onEditSave: (id: number, rating: number) => void;
    onEditChange: (val: string) => void;
    onDelete: (id: number) => void;
    onReply: (parentId: number, text: string) => void;
    depth?: number;
    isDefaultExpanded?: boolean;
}

const MAX_VISIBLE_DEPTH = 3;

export const ReviewItem: React.FC<ReviewItemProps> = ({
    review, currentUser, editingId, editText,
    onEditStart, onEditCancel, onEditSave, onEditChange, onDelete, onReply,
    depth = 0,
    isDefaultExpanded = false
}) => {
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [replyText, setReplyText] = useState('');
    const marginClass = depth > 3 ? "ml-1" : "ml-3 sm:ml-10";
    const [isExpanded, setIsExpanded] = useState(isDefaultExpanded || depth > 0);
    const hasReplies = review.replies && review.replies.length > 0;
    const isEditing = editingId === review.id;

    // Логика прав: автор или админ
    const isOwner = Number(currentUser?.id) === Number(review.userId)
    const isAdmin = currentUser?.role === Role.Admin;
    const canManage = isOwner || isAdmin;

    const handleSendReply = () => {
        if (!replyText.trim()) return;
        onReply(review.id, replyText);
        setReplyText('');
        setIsReplyOpen(false);
    };

    const formattedDate = review.createdAt ? new Date(review.createdAt).toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    }) : '...';

    return (
        <div className="flex gap-2 sm:gap-4 group animate-in slide-in-from-bottom-2 duration-300 mb-4 sm:mb-6">
            <div className="shrink-0">
                <img
                    src={getFullAvatarUrl(review.authorAvatar) || undefined}
                    className="w-8 h-8 rounded-full object-cover border border-smartfix-medium/30"
                    alt="avatar"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                {!review.authorAvatar && (
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-smartfix-darker flex items-center justify-center border border-gray-200 dark:border-smartfix-medium/30">
                        <UserIcon className="w-5 h-5 text-gray-400 dark:text-smartfix-light/50" />
                    </div>
                )}
            </div>

            <div className="flex-1">
                <div className={cn(
                    "p-3 sm:p-4 rounded-xl relative transition-all border-l-4",
                    isOwner ? "bg-blue-50/50 dark:bg-smartfix-darker border-blue-500/50" : "bg-white dark:bg-smartfix-darker border-gray-200 dark:border-smartfix-medium/30 shadow-sm dark:shadow-none"
                )}>
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex flex-col">
                            <span className={cn("text-xs font-bold", isOwner ? "text-blue-400" : "text-gray-500 dark:text-smartfix-light/60")}>
                                {review.authorName}
                                {isOwner && <span className="ml-2 text-[9px] bg-blue-500/20 px-1 rounded uppercase">вы</span>}
                            </span>
                            <span className="text-[10px] dark:text-smartfix-light/40 text-gray-500 ">{formattedDate}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Рейтинг (скрываем при редактировании) */}
                            {depth === 0 && !isEditing && (
                                <div className="flex text-yellow-500/80">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} />
                                    ))}
                                </div>
                            )}

                            {/* Кнопки управления (видны при наведении) */}
                            {canManage && !isEditing && (
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onEditStart(review.id, review.body)}
                                        className="p-1 hover:bg-smartfix-medium/30 rounded text-smartfix-light/50 hover:text-blue-400 transition-colors"
                                        title="Редактировать"
                                    >
                                        <Edit2 size={12} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(review.id)}
                                        className="p-1 hover:bg-smartfix-medium/30 rounded text-smartfix-light/50 hover:text-red-400 transition-colors"
                                        title="Удалить"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ТЕКСТ ИЛИ ПОЛЕ РЕДАКТИРОВАНИЯ */}
                    {isEditing ? (
                        <div className="mt-2 space-y-2 animate-in fade-in duration-200">
                            <textarea
                                className="w-full p-3 rounded-lg bg-smartfix-dark text-white border border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all resize-none"
                                value={editText}
                                onChange={(e) => onEditChange(e.target.value)}
                                rows={3}
                                autoFocus
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={onEditCancel}
                                    className="text-[9px] uppercase font-bold text-smartfix-light hover:text-white flex items-center gap-1 transition-colors"
                                >
                                    <X size={10} /> Отмена
                                </button>
                                <button
                                    onClick={() => onEditSave(review.id, review.rating)}
                                    className="text-[9px] uppercase font-bold bg-blue-600/80 hover:bg-blue-600 px-3 py-1.5 rounded text-white flex items-center gap-1 transition-all"
                                >
                                    <Check size={10} /> Сохранить
                                </button>
                            </div>
                        </div>
                    ) : (
                            <p className="text-sm text-gray-900  dark:text-smartfix-lightest dark:text-smartfix-lightest leading-relaxed mt-2 whitespace-pre-wrap">
                            {review.body}
                        </p>
                    )}

                    {/* Вывод информации о заказе и устройстве */}
                    {review.repairRequestId && review.deviceName && (
                        <div className="mt-3 pt-2 border-t border-smartfix-medium/10">
                            <span className="text-[10px] sm:text-bold text-gray-500 dark:text-smartfix-light/60">
                                Отзыв к заказу <span className="font-bold dark:text-smartfix-light text-blue-400">#{review.repairRequestId}</span> — <span className="text-blue-400">{review.deviceName}</span>
                            </span>
                        </div>
                    )}
                </div>

                {/* Кнопка ответа (только если это не ответ на ответ) */}
                <div className="mt-2 ml-1">
                    <button
                        onClick={() => setIsReplyOpen(!isReplyOpen)}
                        className="text-[10px] uppercase font-bold text-gray-900 dark:text-smartfix-lightest hover:text-[#8EB69B] flex items-center gap-1 transition-colors"
                    >
                        <Reply size={12} /> {isReplyOpen ? 'Закрыть' : 'Ответить'}
                    </button>

                    {hasReplies && (
                        <Link
                            to={`/reviews/${review.id}`}
                            className="text-[10px] uppercase font-bold text-blue-400/60 hover:text-blue-400 transition-colors"
                        >
                            Открыть ветку
                        </Link>
                    )}

                    {isReplyOpen && (
                        <div className="mt-3 flex gap-2 animate-in slide-in-from-top-1 duration-200">
                            <input
                                className="flex-1 bg-smartfix-dark border border-smartfix-medium/20 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#8EB69B]/50"
                                placeholder="Ваш ответ..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                            />
                            <button
                                onClick={handleSendReply}
                                className="p-2 bg-smartfix-darker border border-smartfix-medium/20 rounded-lg text-[#8EB69B] hover:bg-[#8EB69B] hover:text-smartfix-darkest transition-all"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    )}

                    {review.replies && review.replies.length > 0 && isExpanded && (
                        <div className={cn(
                            "border-l border-smartfix-medium/10 mt-4",
                            // На мобилках отступ минимальный (8px), на десктопе — 40px.
                            // Это экономит место для текста на узких экранах.
                            "ml-2 sm:ml-10 pl-2 sm:pl-6"
                        )}>
                            {depth < 1 ? (
                                /* УРОВЕНЬ 1: Показываем ответы обычным списком */
                                review.replies.map((reply: Review) => (
                                    <ReviewItem
                                        key={reply.id}
                                        review={reply}
                                        depth={depth + 1}
                                        currentUser={currentUser}
                                        editingId={editingId}
                                        editText={editText}
                                        onEditStart={onEditStart}
                                        onEditCancel={onEditCancel}
                                        onEditSave={onEditSave}
                                        onEditChange={onEditChange}
                                        onDelete={onDelete}
                                        onReply={onReply}
                                        isDefaultExpanded={isDefaultExpanded}
                                    />
                                ))
                            ) : (
                                /* УРОВЕНЬ 2+: Вместо рекурсии показываем кнопку перехода в ветку */
                                <div className="py-2">
                                    <Link
                                        to={`/reviews/${review.id}`}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/10 text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-tight hover:bg-blue-500/10 transition-all group"
                                    >
                                        Продолжить ветку
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </Link>
                                    <span className="ml-3 text-[9px] text-smartfix-light/20 font-medium">
                                        {review.replies.length} ОТВЕТОВ СКРЫТО
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};