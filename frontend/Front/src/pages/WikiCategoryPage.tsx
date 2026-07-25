import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, ArrowRight, Home, ChevronRight } from 'lucide-react';
import { API_URL, getAuthHeader } from '../services/api';

export const WikiCategoryPage: React.FC = () => {
    const { slug } = useParams();
    const [articles, setArticles] = useState<any[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryArticles = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/Wiki/category/${slug}`, {
                    headers: getAuthHeader() as Record<string, string>
                });
                if (response.ok) {
                    const data = await response.json();
                    setArticles(data);
                    if (data.length > 0) {
                        setCategoryName(data[0].category || slug);
                    }
                }
            } catch (error) {
                console.error("Ошибка при загрузке статей категории:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (slug) fetchCategoryArticles();
    }, [slug]);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12 pt-8 px-4">
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-smartfix-light/60 mb-4">
                <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"><Home size={14} /> Главная</Link>
                <ChevronRight size={14} />
                <Link to="/wiki" className="hover:text-blue-600 dark:hover:text-blue-400">База знаний</Link>
                <ChevronRight size={14} />
                <span className="text-gray-900 dark:text-smartfix-lightest font-medium capitalize">{categoryName || slug?.replace('-', ' ')}</span>
            </nav>

            <h1 className="text-3xl font-bold mb-6 capitalize border-b border-gray-200 dark:border-smartfix-medium/20 pb-4">
                Категория: {categoryName || slug?.replace('-', ' ')}
            </h1>

            {isLoading ? (
                <div className="text-center py-8 text-gray-500">Загрузка...</div>
            ) : articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {articles.map((article) => (
                        <Link 
                            key={article.id} 
                            to={`/wiki/article/${article.id}`}
                            className="flex items-start gap-4 p-4 bg-white dark:bg-smartfix-dark rounded-xl border border-gray-100 dark:border-smartfix-medium/20 hover:shadow-md transition-shadow group"
                        >
                            <div className="p-3 bg-gray-50 dark:bg-smartfix-darker rounded-lg text-gray-400 group-hover:text-blue-500 transition-colors">
                                <BookOpen size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-smartfix-lightest group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                                    {article.title}
                                </h4>
                                <div className="text-xs text-gray-500">Автор: {article.authorName}</div>
                            </div>
                            <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight size={18} className="text-blue-500" />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500">В этой категории пока нет статей.</div>
            )}
        </div>
    );
};

export default WikiCategoryPage;