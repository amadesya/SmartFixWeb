import React, { useState, useEffect } from 'react';
import { Search, Smartphone, Laptop, Monitor, Wrench, Zap, BookOpen, ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL, getAuthHeader } from '../services/api';
import { useAuth } from '@/components/auth/AuthContext';
import { Role } from '../types';
import { WikiEditor } from '@/components/wiki/WikiEditor';

const CATEGORIES = [
    { id: 'smartphones', name: 'Смартфоны', icon: Smartphone, desc: 'Замена экранов, батарей, настройка ОС' },
    { id: 'laptops', name: 'Ноутбуки', icon: Laptop, desc: 'Чистка от пыли, замена термопасты, апгрейд' },
    { id: 'pc', name: 'ПК и Мониторы', icon: Monitor, desc: 'Сборка, диагностика комплектующих' },
    { id: 'tools', name: 'Инструменты', icon: Wrench, desc: 'Как выбрать паяльник, отвертки и мультиметр' },
    { id: 'safety', name: 'Техника безопасности', icon: Zap, desc: 'Как не ударить себя током и не сжечь плату' },
    { id: 'faq', name: 'Частые вопросы', icon: BookOpen, desc: 'Ответы на самые популярные вопросы новичков' },
];

const POPULAR_ARTICLES = [
    { id: 1, title: 'Как правильно разобрать iPhone 13: пошаговое руководство', category: 'Смартфоны' },
    { id: 2, title: 'Почему ноутбук греется и шумит? Диагностика', category: 'Ноутбуки' },
    { id: 3, title: 'Топ-5 ошибок новичков при пайке контактов', category: 'Инструменты' },
    { id: 4, title: 'Что делать, если телефон упал в воду?', category: 'Смартфоны' },
];

export const WikiHomePage: React.FC = () => {
    const { user } = useAuth();
    const canEdit = user?.role === Role.Admin || user?.role === Role.Technician;

    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState<any[]>(CATEGORIES);
    const [popularArticles, setPopularArticles] = useState<any[]>(POPULAR_ARTICLES);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fetchWikiData = async () => {
        setIsLoading(true);
        try {
            // Подставляем ваш реальный эндпоинт, например /api/Wiki (или /api/WikiArticles)
            const response = await fetch(`${API_URL}/Wiki`, {
                    headers: getAuthHeader() as Record<string, string>
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setPopularArticles(data);
                }
                
                const catResponse = await fetch(`${API_URL}/Wiki/categories`, {
                    headers: getAuthHeader() as Record<string, string>
                });
                if (catResponse.ok) {
                    const catData = await catResponse.json();
                    if (catData.length > 0) {
                        const dynamicCategories = catData.map((dbCat: any) => {
                            const existingCat = CATEGORIES.find(c => c.name === dbCat.name);
                            if (existingCat) return { ...existingCat, id: dbCat.slug };
                            
                            return {
                                id: dbCat.slug,
                                name: dbCat.name,
                                icon: BookOpen,
                                desc: dbCat.description || `Материалы раздела "${dbCat.name}"`
                            };
                        });
                        setCategories(dynamicCategories);
                    }
                }
            } catch (error) {
                console.error("Ошибка при загрузке данных Wiki:", error);
            } finally {
                setIsLoading(false);
            }
        };

    useEffect(() => {
        fetchWikiData();
    }, []);

    const handleCreate = async (data: { title: string; category: string; body: string }) => {
        setIsSaving(true);
        try {
            const response = await fetch(`${API_URL}/Wiki`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(getAuthHeader() as Record<string, string>)
                },
                body: JSON.stringify({
                    title: data.title,
                    category: data.category,
                    body: data.body,
                    authorName: user?.name || 'Аноним',
                    createdAt: new Date().toISOString()
                })
            });

            if (!response.ok) throw new Error('Не удалось создать статью');
            
            await fetchWikiData();
            setIsCreating(false);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-12">
            
            {/* Hero Section & Search */}
            <section className="text-center pt-8 md:pt-16 px-4">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                    База знаний SmartFix
                </h1>
                <p className="text-lg text-gray-600 dark:text-smartfix-light/70 mb-8 max-w-2xl mx-auto">
                    Подробные инструкции, советы по ремонту и руководства по диагностике техники для новичков и профи.
                </p>
                
                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-4 md:text-lg border border-gray-200 dark:border-smartfix-medium/30 rounded-2xl bg-white dark:bg-smartfix-dark text-gray-900 dark:text-smartfix-lightest shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Найти инструкцию, например «замена батареи»..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </section>

            {canEdit && (
                <div className="px-4 flex justify-center mt-[-1rem] mb-8">
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                    >
                        {isCreating ? 'Отменить создание' : <><Plus size={20} /> Создать новую статью</>}
                    </button>
                </div>
            )}

            {isCreating && (
                <section className="px-4 mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-6 bg-white dark:bg-smartfix-darker border border-smartfix-medium/20 rounded-2xl shadow-sm">
                        <h2 className="text-2xl font-bold mb-6 border-b border-smartfix-medium/20 pb-2">Создание новой статьи</h2>
                        <WikiEditor 
                            onSave={handleCreate}
                            onCancel={() => setIsCreating(false)}
                            isSaving={isSaving}
                        />
                    </div>
                </section>
            )}

            {/* Categories Grid (Плиточный интерфейс) */}
            <section className="px-4">
                <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 dark:border-smartfix-medium/20 pb-2">Категории</h2>
                {isLoading ? (
                    <div className="text-center py-8 text-gray-500 dark:text-smartfix-light/60">Загрузка категорий...</div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <Link 
                                key={cat.id} 
                                to={`/wiki/category/${cat.id}`}
                                className="group block p-6 bg-white dark:bg-smartfix-dark border border-gray-100 dark:border-smartfix-medium/20 rounded-2xl hover:shadow-xl hover:border-blue-500/30 transition-all duration-300"
                            >
                                <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {cat.name}
                                </h3>
                                <p className="text-gray-500 dark:text-smartfix-light/60 text-sm leading-relaxed">
                                    {cat.desc}
                                </p>
                            </Link>
                        );
                    })}
                </div>
                )}
            </section>

            {/* Popular Articles */}
            <section className="px-4">
                <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 dark:border-smartfix-medium/20 pb-2">Популярные статьи</h2>
                {isLoading ? (
                    <div className="text-center py-8 text-gray-500 dark:text-smartfix-light/60">Загрузка статей...</div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {popularArticles
                        .filter((article) => 
                            !searchQuery || 
                            article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            article.category?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((article) => (
                        <Link 
                            key={article.id} 
                            to={`/wiki/article/${article.id}`}
                            className="flex items-start gap-4 p-4 bg-white dark:bg-smartfix-dark rounded-xl border border-gray-100 dark:border-smartfix-medium/20 hover:shadow-md transition-shadow group"
                        >
                            <div className="p-3 bg-gray-50 dark:bg-smartfix-darker rounded-lg text-gray-400 group-hover:text-blue-500 transition-colors">
                                <BookOpen size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-medium text-blue-500 uppercase tracking-wider mb-1">
                                    {article.category}
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-smartfix-lightest group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {article.title}
                                </h4>
                            </div>
                            <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight size={18} className="text-blue-500" />
                            </div>
                        </Link>
                    ))}
                </div>
                )}
            </section>

        </div>
    );
};

export default WikiHomePage;