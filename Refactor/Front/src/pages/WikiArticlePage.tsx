import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, Info, AlertTriangle, Edit, Trash, ArrowRight, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { API_URL, getAuthHeader } from '../services/api';
import { useAuth } from '@/hooks/useAuth';
import { useConfirmation } from '@/hooks/useConfirmation';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import toast from 'react-hot-toast';
import { Role } from '../types';
import { WikiEditor, markdownComponents } from '@/components/wiki/WikiEditor';

// Тип для статьи
interface WikiArticle {
    id: number;
    title: string;
    category: string;
    categorySlug?: string;
    createdAt: string;
    readTime: string;
    authorName: string;
    body: string;
}

export const WikiArticlePage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState<WikiArticle | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
    
    const { user } = useAuth();
    const canEdit = user?.role === Role.Admin || user?.role === Role.Technician;

    const { itemToDelete, confirm, cancel } = useConfirmation<boolean>();

    useEffect(() => {
        const fetchArticle = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/Wiki/${id}`, {
                    headers: getAuthHeader() as Record<string, string>
                });
                if (!response.ok) {
                    throw new Error('Не удалось загрузить статью');
                }
                const data = await response.json();
                setArticle(data);

                // Загружаем связанные статьи из той же категории
                if (data.categorySlug) {
                    const relatedRes = await fetch(`${API_URL}/Wiki/category/${data.categorySlug}`, {
                        headers: getAuthHeader() as Record<string, string>
                    });
                    if (relatedRes.ok) {
                        const relatedData = await relatedRes.json();
                        setRelatedArticles(relatedData.filter((a: any) => a.id !== data.id).slice(0, 4));
                    }
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchArticle();
        }
    }, [id]);

    const handleSave = async (data: { title: string; category: string; body: string }) => {
        setIsSaving(true);
        try {
            const response = await fetch(`${API_URL}/Wiki/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(getAuthHeader() as Record<string, string>)
                },
                body: JSON.stringify({
                    title: data.title,
                    category: data.category,
                    body: data.body
                })
            });
            if (!response.ok) throw new Error('Не удалось сохранить статью');
            setArticle(prev => prev ? { ...prev, ...data } : null);
            setIsEditing(false);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        confirm(true);
    };

    const confirmAction = async () => {
        try {
            const response = await fetch(`${API_URL}/Wiki/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader() as Record<string, string>
            });
            
            if (!response.ok) throw new Error('Не удалось удалить статью');
            
            navigate('/wiki', { replace: true });
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            cancel();
        }
    };

    // Генерация динамического оглавления (TOC) на основе Markdown-заголовков
    const toc = useMemo(() => {
        if (!article) return [];
        const regex = /^(#{1,3})\s+(.+)$/gm;
        const headings = [];
        let match;
        while ((match = regex.exec(article.body)) !== null) {
            const level = match[1].length;
            const title = match[2].trim();
            // Алгоритм генерации ID совпадает с тем, что в WikiEditor (поддерживает кириллицу)
            const id = title.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-');
            headings.push({ level, title, id });
        }
        return headings;
    }, [article]);

    if (isLoading) return <div className="max-w-7xl mx-auto py-16 text-center text-gray-500 dark:text-smartfix-lightest">Загрузка статьи...</div>;
    if (error) return <div className="max-w-7xl mx-auto py-16 text-center text-red-500">Ошибка: {error}</div>;
    if (!article) return <div className="max-w-7xl mx-auto py-16 text-center text-gray-500 dark:text-smartfix-lightest">Статья не найдена</div>;

    return (
        <div className="max-w-7xl mx-auto pb-16 animate-in fade-in duration-500">
            
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-smartfix-light/60 mb-8 overflow-x-auto whitespace-nowrap py-2">
                <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"><Home size={14} /> Главная</Link>
                <ChevronRight size={14} />
                <Link to="/wiki" className="hover:text-blue-600 dark:hover:text-blue-400">База знаний</Link>
                <ChevronRight size={14} />
                <Link to={`/wiki/category/${article.categorySlug || 'uncategorized'}`} className="hover:text-blue-600 dark:hover:text-blue-400">{article.category}</Link>
                <ChevronRight size={14} />
                <span className="text-gray-900 dark:text-smartfix-lightest font-medium truncate">{article.title}</span>
            </nav>

            {isEditing ? (
                <div className="mt-8 animate-in fade-in duration-300">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Редактирование статьи</h1>
                    <WikiEditor 
                        initialTitle={article.title}
                        initialCategory={article.category}
                        initialBody={article.body}
                        onSave={handleSave}
                        onCancel={() => setIsEditing(false)}
                        isSaving={isSaving}
                    />
                </div>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                
                {/* Main Content Area */}
                <article className="lg:col-span-3">
                    <header className="mb-10">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                            {article.title}
                        {canEdit && (
                            <>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="ml-4 inline-flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors align-middle"
                                >
                                    <Edit size={16} /> Редактировать
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className="ml-2 inline-flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors align-middle"
                                >
                                    <Trash size={16} /> Удалить
                                </button>
                            </>
                        )}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-smartfix-light/60">
                            <span>Автор: <span className="font-medium text-gray-700 dark:text-smartfix-light">{article.authorName}</span></span>
                            <span>&bull;</span>
                            <span>
                                {new Date(article.createdAt).toLocaleDateString('ru-RU', {
                                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </span>
                            <span>&bull;</span>
                            <span>{article.readTime}</span>
                        </div>
                    </header>

                    {/* Рендер Markdown. Класс "prose" обеспечивает правильные отступы и размеры шрифтов */}
                    <div className="prose prose-blue dark:prose-invert prose-lg max-w-none text-gray-800 dark:text-smartfix-lightest font-sans leading-relaxed">
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={markdownComponents}
                        >
                            {article.body}
                        </ReactMarkdown>
                    </div>

                    {/* Related Articles Footer */}
                    <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-smartfix-medium/30">
                        <h3 className="text-xl font-bold mb-6">Связанные статьи</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {isLoading ? (
                                        <div className="text-center py-8 text-gray-500 dark:text-smartfix-light/60">Загрузка статей...</div>
                                    ) : (
                                        <>
                                            {relatedArticles.length > 0 ? (
                                                relatedArticles.map((relArticle) => (
                                                    <Link
                                                        key={relArticle.id}
                                                        to={`/wiki/article/${relArticle.id}`}
                                                        className="flex items-start gap-4 p-4 bg-white dark:bg-smartfix-dark rounded-xl border border-gray-100 dark:border-smartfix-medium/20 hover:shadow-md transition-shadow group"
                                                    >
                                                        <div className="p-3 bg-gray-50 dark:bg-smartfix-darker rounded-lg text-gray-400 group-hover:text-blue-500 transition-colors">
                                                            <BookOpen size={20} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-xs font-medium text-blue-500 uppercase tracking-wider mb-1">
                                                                {relArticle.category}
                                                            </div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-smartfix-lightest group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                {relArticle.title}
                                                            </h4>
                                                        </div>
                                                        <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <ArrowRight size={18} className="text-blue-500" />
                                                        </div>
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="col-span-1 sm:col-span-2 text-center py-4 text-gray-500 text-sm">
                                                    В этой категории пока нет других статей.
                                                </div>
                                            )}
                                        </>
                                    )}
                        </div>
                    </footer>
                </article>

                {/* Sticky Sidebar (Оглавление) */}
                <aside className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-24">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-smartfix-light/50 mb-4">
                            Оглавление
                        </h4>
                        {toc.length > 0 ? (
                            <nav className="flex flex-col space-y-3">
                                {toc.map((item, idx) => (
                                    <a key={idx} href={`#${item.id}`} className={`text-sm text-gray-600 dark:text-smartfix-light/80 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-l-2 border-transparent hover:border-blue-500 ${item.level === 1 ? 'pl-2 font-semibold' : item.level === 2 ? 'pl-4' : 'pl-6 text-xs'}`}>
                                        {item.title}
                                    </a>
                                ))}
                            </nav>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-smartfix-light/50">В статье нет оглавления</p>
                        )}
                        
                        {canEdit && (
                            <div className="mt-8 p-4 bg-gray-50 dark:bg-smartfix-dark rounded-xl border border-gray-100 dark:border-smartfix-medium/10">
                                <p className="text-xs text-gray-500 dark:text-smartfix-light/70 mb-3">
                                    Нашли ошибку в статье или метод устарел?
                                </p>
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => setIsEditing(true)} className="w-full flex items-center justify-center gap-2 text-xs font-medium py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg hover:shadow-sm transition-all">
                                        <Edit size={14} /> Редактировать
                                    </button>
                                    <button onClick={handleDelete} className="w-full flex items-center justify-center gap-2 text-xs font-medium py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg hover:shadow-sm transition-all">
                                        <Trash size={14} /> Удалить
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

            </div>
            )}
            
            <ConfirmationModal
                isOpen={itemToDelete !== null}
                title="Удаление статьи"
                message="Вы уверены, что хотите удалить эту статью? Действие необратимо."
                onConfirm={confirmAction}
                onCancel={cancel}
            />
        </div>
    );
};

export default WikiArticlePage;