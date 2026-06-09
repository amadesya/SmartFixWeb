import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
// @ts-ignore
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Button } from '@/components/ui/Button';
import { Edit3, Eye, Image as ImageIcon, Info } from 'lucide-react';
import { API_URL, getAuthHeader } from '../../services/api';

// Хелперы для генерации якорных ссылок (ID) из текста заголовков
const flatten = (text: string, child: any): string => {
    return typeof child === 'string' ? text + child : React.Children.toArray(child?.props?.children).reduce(flatten, text);
};
const generateId = (children: any) => {
    const text = React.Children.toArray(children).reduce(flatten, '');
    return text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-');
};

// Кастомные компоненты для стилизации Markdown
export const markdownComponents: any = {
    h1: ({node, children, ...props}: any) => <h1 id={generateId(children)} className="text-3xl font-extrabold mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-smartfix-medium/30" {...props}>{children}</h1>,
    h2: ({node, children, ...props}: any) => <h2 id={generateId(children)} className="text-2xl font-bold mt-8 mb-4" {...props}>{children}</h2>,
    h3: ({node, children, ...props}: any) => <h3 id={generateId(children)} className="text-xl font-bold mt-6 mb-3" {...props}>{children}</h3>,
    blockquote: ({node, children, ...props}: any) => (
        <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg my-6 flex gap-3 items-start" {...props}>
            <Info className="text-blue-500 flex-shrink-0 mt-1" size={20} />
            <div className="text-gray-700 dark:text-smartfix-lightest italic m-0">{children}</div>
        </blockquote>
    ),
    table: ({node, children, ...props}: any) => (
        <div className="overflow-x-auto my-6 rounded-xl border border-gray-200 dark:border-smartfix-medium/30 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-smartfix-medium/30 text-left" {...props}>{children}</table>
        </div>
    ),
    th: ({node, children, ...props}: any) => <th className="px-6 py-3 bg-gray-50 dark:bg-smartfix-darker text-xs font-semibold text-gray-500 uppercase tracking-wider" {...props}>{children}</th>,
    td: ({node, children, ...props}: any) => <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-smartfix-lightest border-b border-gray-100 dark:border-smartfix-medium/20" {...props}>{children}</td>,
    img: ({node, src, alt, ...props}: any) => (
        <span className="block my-6">
            <img src={src} alt={alt} className="rounded-xl shadow-md max-w-full h-auto mx-auto" {...props} />
            {alt && <span className="block text-center text-sm text-gray-500 mt-2">{alt}</span>}
        </span>
    ),
    a: ({node, children, ...props}: any) => <a className="text-blue-500 hover:text-blue-600 underline underline-offset-2" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
};

interface WikiEditorProps {
    initialTitle?: string;
    initialCategory?: string;
    initialBody?: string;
    onSave: (data: { title: string; category: string; body: string }) => void;
    onCancel: () => void;
    isSaving?: boolean;
}

export const WikiEditor: React.FC<WikiEditorProps> = ({ 
    initialTitle = '', 
    initialCategory = '', 
    initialBody = '', 
    onSave, 
    onCancel,
    isSaving = false 
}) => {
    const [title, setTitle] = useState(initialTitle);
    const [category, setCategory] = useState(initialCategory);
    const [body, setBody] = useState(initialBody);
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Подгружаем существующие категории для выпадающего списка
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_URL}/Wiki/categories`, {
                    headers: getAuthHeader() as Record<string, string>
                });
                if (res.ok) {
                    const data = await res.json();
                    setAvailableCategories(data.map((c: any) => c.name));
                }
            } catch (e) { console.error(e); }
        };
        fetchCategories();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            // Вставляем изображение в формате Markdown
            setBody(prev => prev + `\n!${file.name}\n`);
        };
        reader.readAsDataURL(file);

        // Сбрасываем input, чтобы можно было загрузить ту же картинку еще раз
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col border border-smartfix-medium/30 rounded-xl overflow-hidden bg-white dark:bg-smartfix-dark shadow-sm">
            {/* Tabs */}
            <div className="flex items-center justify-between px-2 pt-2 bg-gray-50 dark:bg-smartfix-darker border-b border-smartfix-medium/20">
                <div className="flex items-center gap-2">
                    <button
                    onClick={() => setActiveTab('write')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'write' ? 'bg-white dark:bg-smartfix-dark text-blue-600 dark:text-blue-400 border-t border-x border-smartfix-medium/20 -mb-[1px]' : 'text-gray-500 hover:text-gray-900 dark:text-smartfix-light/60 dark:hover:text-smartfix-light'}`}
                >
                    <Edit3 size={16} /> Редактирование
                </button>
                <button
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'preview' ? 'bg-white dark:bg-smartfix-dark text-blue-600 dark:text-blue-400 border-t border-x border-smartfix-medium/20 -mb-[1px]' : 'text-gray-500 hover:text-gray-900 dark:text-smartfix-light/60 dark:hover:text-smartfix-light'}`}
                >
                    <Eye size={16} /> Предпросмотр
                </button>
                </div>
                {activeTab === 'write' && (
                    <div className="flex items-center pr-2 pb-1">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-smartfix-light hover:bg-gray-200 dark:hover:bg-smartfix-medium/30 rounded-lg transition-colors"
                            title="Вставить картинку"
                        >
                            <ImageIcon size={16} /> Картинка
                        </button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-4 min-h-[400px] flex flex-col">
                {activeTab === 'write' ? (
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        type="text"
                        className="w-full bg-transparent border-b border-smartfix-medium/30 outline-none pb-2 text-xl font-bold text-gray-900 dark:text-smartfix-lightest placeholder-gray-400 dark:placeholder-smartfix-light/40"
                        placeholder="Заголовок статьи"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        list="wiki-category-list"
                        className="w-full bg-transparent border-b border-smartfix-medium/30 outline-none pb-2 text-gray-900 dark:text-smartfix-lightest placeholder-gray-400 dark:placeholder-smartfix-light/40"
                        placeholder="Категория (например, Смартфоны, Ноутбуки)"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                    <datalist id="wiki-category-list">
                        {availableCategories.map((cat, idx) => (
                            <option key={idx} value={cat} />
                        ))}
                    </datalist>
                    <textarea
                        className="flex-1 w-full h-full bg-transparent resize-y outline-none text-gray-900 dark:text-smartfix-lightest placeholder-gray-400 dark:placeholder-smartfix-light/40"
                        placeholder="Введите текст статьи в формате Markdown... (Используйте # для заголовков, * для списков, > для цитат)"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                </div>
                ) : (
                    <div className="flex-1 prose prose-blue dark:prose-invert max-w-none">
                    {body ? (
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={markdownComponents}
                        >{body}</ReactMarkdown>
                        ) : (
                            <p className="text-gray-400 italic">Предпросмотр пуст...</p>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-gray-50 dark:bg-smartfix-darker border-t border-smartfix-medium/20 flex justify-end gap-3">
                <Button variant="secondary" onClick={onCancel}>Отмена</Button>
                <Button variant="default" onClick={() => onSave({ title, category, body })} disabled={isSaving || !title.trim() || !body.trim()}>
                    {isSaving ? 'Сохранение...' : 'Сохранить статью'}
                </Button>
            </div>
        </div>
    );
};