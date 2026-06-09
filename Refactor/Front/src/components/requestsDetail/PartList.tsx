import React from 'react';
import { usePriceEditor } from '@/hooks/usePriceEditor';
import { Plus, X, ChevronDown } from 'lucide-react';

type EditorType = ReturnType<typeof usePriceEditor>;

export const PartList = ({ editor }: { editor: EditorType }) => {
    const { state, actions } = editor;
    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-right-2 duration-300 shrink-0">
            {/* Шапка секции - теперь идентична первой */}
            <div
                className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-white/5 transition-colors cursor-pointer group hover:bg-gray-50 dark:hover:bg-white/[0.02] rounded-xl"
                onClick={() => actions.setIsPartsExpanded(!state.isPartsExpanded)}
            >
                <div className="flex items-center gap-2 m-2 ml-1">
                    <span className="text-gray-900 dark:text-smartfix-lightest text-sm font-bold">
                        Использованные запчасти {state.selectedParts.length > 0 ? `(${state.selectedParts.length})` : ''}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-smartfix-light transition-transform duration-300 ${state.isPartsExpanded ? 'rotate-180' : ''}`} />
                </div>
                {!state.isAddingPart && (
                    <button
                        onClick={(e) => { e.stopPropagation(); actions.setIsAddingPart(true); actions.setIsPartsExpanded(true); }}
                        className="info-label text-sm font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
                    >
                        <Plus size={12} /> Новая запчасть
                    </button>
                )}
            </div>

            {state.isPartsExpanded && (
                <div className="flex flex-col pt-0 animate-in fade-in duration-200">
                    {/* Форма добавления новой запчасти */}
                    {state.isAddingPart && (
                        <div className="flex flex-col gap-2 mt-2 mb-4 bg-smartfix-dark/50 p-2.5 rounded-xl border border-blue-500/30 shadow-inner">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    value={state.newPartName}
                                    onChange={e => actions.setNewPartName(e.target.value)}
                                    placeholder="Название запчасти"
                                    className="flex-1 min-w-0 text-sm p-2 rounded-xl bg-smartfix-dark text-white outline-none border border-smartfix-medium/20 focus:border-blue-500/50"
                                />
                                <div className="flex gap-2 shrink-0">
                                    <div className="relative flex items-center bg-smartfix-dark px-2 py-1 rounded-xl border border-smartfix-medium/20 focus-within:border-blue-500/50 shrink-0">
                                        <input
                                            value={state.newPartPrice}
                                            type="number"
                                            onChange={e => actions.setNewPartPrice(e.target.value)}
                                            placeholder="Цена"
                                            className="min-w-[100px] w-24 px-2 py-1 pr-7 text-sm bg-transparent text-white outline-none text-right tabular-nums shrink-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <span className="absolute right-2 text-xs text-smartfix-medium pointer-events-none">₽</span>
                                    </div>
                                    <select
                                        value={state.category}
                                        onChange={e => actions.handleCategoryChange(e.target.value)}
                                        className="text-sm p-2 rounded-xl bg-smartfix-dark text-white outline-none border border-smartfix-medium/20 focus:border-blue-500/50 max-w-[120px]"
                                    >
                                        <option value="">Категория</option>
                                        {state.partTypes.map((t) => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                        <option value="new">+ Новая...</option>
                                    </select>
                                        <button onClick={() => actions.handleAddPart()} disabled={!state.newPartName || !state.newPartPrice || !state.category} className="bg-blue-600 disabled:opacity-50 text-white px-3 rounded-xl hover:bg-blue-500 font-bold text-sm transition-colors">ОК</button>
                                    <button onClick={() => actions.setIsAddingPart(false)} className="text-red-400 px-2 rounded-xl hover:bg-red-500/20 transition-colors"><X size={16} /></button>
                                </div>
                            </div>

                            {state.isAddingNewCategory && (
                                <div className="flex flex-col sm:flex-row gap-2 mt-1">
                                    <input value={state.newCategoryName} onChange={e => actions.setNewCategoryName(e.target.value)} placeholder="Название новой категории" className="flex-1 text-sm p-2 rounded-xl bg-smartfix-dark text-white outline-none border border-smartfix-medium/20 focus:border-blue-500/50" />
                                    <div className="flex gap-2 shrink-0">
                                        <button onClick={actions.handleAddCategory} disabled={!state.newCategoryName} className="bg-emerald-600 disabled:opacity-50 text-white px-4 py-1.5 rounded-xl hover:bg-emerald-500 font-bold text-sm transition-colors">Сохранить</button>
                                        <button onClick={() => actions.setIsAddingNewCategory(false)} className="bg-smartfix-dark px-4 py-1.5 rounded-xl hover:bg-smartfix-medium/30 transition-colors text-white text-sm border border-smartfix-medium/20">Отмена</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Сетка запчастей - теперь grid 1/2 как в услугах */}
                    <div className="grid grid-cols-1 gap-2 gap-y-1 mt-1 md:grid-cols-2">
                        {state.filteredParts.map(part => {
                            const selected = state.selectedParts.find(p => p.id === part.id);
                            const isSelected = !!selected;
                            const isOutOfStock = part.stockQuantity <= 0;
                            return (
                                <div
                                    key={`prt-${part.id}`}
                                    onClick={isOutOfStock && !isSelected ? undefined : () => actions.handleTogglePart(part)}
                                    className={`flex flex-col py-3 border border-white/5 transition-colors px-2 rounded-xl bg-smartfix-darker/50 ${
                                        isOutOfStock && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group hover:bg-white/[0.02]'
                                    }`}
                                >
                                    <div className="flex justify-between items-center w-full m-1">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <span className={`text-sm leading-tight break-words whitespace-normal transition-colors ${isSelected
                                                ? (selected.isHidden ? 'text-smartfix-medium line-through' : 'text-blue-400 font-bold')
                                                : 'text-smartfix-lightest/70 group-hover:text-white'}`}>
                                                {part.name}{part.stockQuantity !== 1 && part.stockQuantity > 0 ? ` (${part.stockQuantity} шт.)` : ''}
                                                {isOutOfStock && !isSelected && <span className="text-red-400 text-xs ml-2 font-bold whitespace-nowrap">Нет в наличии</span>}
                                            </span>
                                        </div>
                                        <div className="shrink-0 text-right" onClick={(e) => e.stopPropagation()}>
                                            {isSelected ? (
                                                <div className="flex items-center shrink-0">
                                                    {!selected.isHidden && (
                                                        <>
                                                            <input
                                                                type="number"
                                                                value={selected.price === 0 ? '' : Math.round(selected.price)}
                                                                onChange={(e) => actions.handlePartPriceChange(part.id, Number(e.target.value))}
                                                                placeholder="0"
                                                                className="w-20 bg-transparent text-blue-400 outline-none text-right font-bold text-sm tabular-nums border-b border-blue-500/30 focus:border-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                            />
                                                            <span className="text-sm font-bold text-blue-400 ml-1">₽</span>
                                                        </>
                                                    )}
                                                    {selected.isHidden && <span className="text-[10px] uppercase text-smartfix-medium font-bold tracking-wider">Скрыто</span>}
                                                </div>
                                            ) : (
                                                <span className="text-sm font-bold tabular-nums group-hover:text-blue-400 transition-colors text-smartfix-lightest/70">
                                                    {actions.formatPrice(part.purchasePrice || part.price)} ₽
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {/* Чекбокс скрытия - только если выбрано */}
                                    {isSelected && (
                                        <div className="mt-1 ml-1" onClick={(e) => e.stopPropagation()}>
                                            <label className="flex items-center gap-2 cursor-pointer group/label w-fit">
                                                <input type="checkbox" className="accent-blue-500 w-3.5 h-3.5 rounded cursor-pointer" checked={selected.isHidden} onChange={() => actions.handleToggleHidePart(part.id)} />
                                                <span className="text-[10px] text-gray-500 dark:text-smartfix-medium uppercase tracking-wide font-medium group-hover/label:text-blue-600 dark:group-hover/label:text-blue-300 transition-colors">Скрыть цену в чеке</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};