import React, { useEffect, useRef } from 'react';
import { User, Role, CommentDto } from '@/types';

interface CommentSectionProps {
    comments: CommentDto[];
    user: User;
    isLoading: boolean;
    editingId: number | null;
    setEditingId: (id: number | null) => void;
    editText: string;
    setEditText: (text: string) => void;
    onUpdate: (comment: CommentDto) => void;
    onDelete: (commentId: number, requestId: number) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
    comments,
    user,
    isLoading,
    editingId,
    setEditingId,
    editText,
    setEditText,
    onUpdate,
    onDelete,
}) => {
    if (isLoading) {
        return <p className="text-gray-500 dark:text-smartfix-light text-center py-10">Загрузка комментариев...</p>;
    }

    if (comments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-smartfix-light/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>Сообщений пока нет</p>
            </div>
        );
    }

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [comments]);

    return (
        /* Убрали max-h и overflow, чтобы скроллил родитель */
        <div className="space-y-4" ref={scrollRef}>
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUser={user}
                    isEditing={editingId === comment.id}
                    editText={editText}
                    onEditStart={() => {
                        setEditingId(comment.id);
                        setEditText(comment.text);
                    }}
                    onEditCancel={() => setEditingId(null)}
                    onEditSave={() => onUpdate(comment)}
                    onEditChange={setEditText}
                    onDelete={() => onDelete(comment.id, comment.repairRequestId)}
                />
            ))}
        </div>
    );
};

interface ItemProps {
    comment: CommentDto;
    currentUser: User;
    isEditing: boolean;
    editText: string;
    onEditStart: () => void;
    onEditCancel: () => void;
    onEditSave: () => void;
    onEditChange: (val: string) => void;
    onDelete: () => void;
}

const CommentItem = ({
    comment,
    currentUser,
    isEditing,
    editText,
    onEditStart,
    onEditCancel,
    onEditSave,
    onEditChange,
    onDelete
}: ItemProps) => {
    const isOwner = comment.userId === currentUser.id;
    const isAdmin = currentUser.role === Role.Admin;
    const canManage = isOwner || isAdmin;

    const formattedDate = comment.date
        ? new Date(comment.date).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
        : '...';

    return (
        <div className={`group p-4 bg-white dark:bg-smartfix-darker shadow-sm dark:shadow-none rounded-xl border-l-4 transition-all ${isOwner ? 'border-blue-500/50 bg-blue-50 dark:bg-blue-500/5' : 'border-gray-200 dark:border-smartfix-medium/30'
            }`}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                    <span className={`text-xs font-bold ${isOwner ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-700 dark:text-smartfix-lightest'}`}>
                        {comment.userName || `User #${comment.userId}`}
                        {isOwner && <span className="ml-2 text-[9px] bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-white px-1 rounded uppercase">Вы</span>}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-smartfix-light/50">{formattedDate}</span>
                </div>

                {canManage && !isEditing && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={onEditStart}
                            className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-md text-blue-600 dark:text-blue-400 transition-colors"
                            title="Редактировать"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-md text-red-600 dark:text-red-400 transition-colors"
                            title="Удалить"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="mt-2 space-y-2 animate-in slide-in-from-top-1 duration-200">
                    <textarea
                        className="w-full p-3 rounded-lg bg-gray-50 dark:bg-smartfix-dark text-gray-900 dark:text-white border border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 outline-none text-sm transition-all"
                        value={editText}
                        onChange={(e) => onEditChange(e.target.value)}
                        rows={3}
                        autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={onEditCancel}
                            className="text-[10px] uppercase font-bold px-4 py-2 text-gray-500 hover:text-gray-900 dark:text-smartfix-light dark:hover:text-white transition-colors"
                        >
                            Отмена
                        </button>
                        <button
                            onClick={onEditSave}
                            className="text-[10px] uppercase font-bold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all"
                        >
                            Обновить
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-800 dark:text-smartfix-lightest text-sm whitespace-pre-wrap leading-relaxed">
                    {comment.text}
                </p>
            )}
        </div>
    );
};

export default CommentSection;