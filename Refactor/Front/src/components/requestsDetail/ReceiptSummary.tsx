import React from 'react';
import { usePriceEditor } from '@/hooks/usePriceEditor';
import { Check, X, Edit2 } from 'lucide-react';

type EditorType = ReturnType<typeof usePriceEditor>;

export const ReceiptSummary = ({ price, editor, canEdit, discountPercent }: { price: number | null, editor: EditorType, canEdit: boolean, discountPercent?: number }) => {
    const { state, actions } = editor;

    // Вычисляем цену со скидкой
    const hasDiscount = !!discountPercent && discountPercent > 0 && price !== null && price > 0;
    const finalPrice = hasDiscount ? price! * (1 - discountPercent / 100) : price;

    return (
        <div className="mt-auto shrink-0 bg-gray-50 dark:bg-smartfix-dark border-t border-gray-200 dark:border-white/5 pt-4 pb-2 flex flex-col gap-4 w-full">
            <div className="flex flex-col w-full">
                <div className="flex justify-between items-center pt-2">
                    <div className="flex flex-col">
                        <span className="info-label text-gray-500 dark:text-smartfix-lightest text-xs font-bold uppercase tracking-wider">Итого к оплате</span>
                        {hasDiscount && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase mt-0.5 tracking-wider">Ваша скидка {discountPercent}%</span>
                        )}
                    </div>
                    <div className="flex items-center shrink-0">
                        {state.isEditingTotalPrice ? (
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="relative flex items-center shrink-0">
                                    <input
                                        type="number"
                                        value={state.localTotalPrice !== '' ? Math.round(Number(state.localTotalPrice)) : ''}
                                        onChange={(e) => actions.setLocalTotalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-24 bg-transparent text-emerald-400 outline-none text-right font-black tabular-nums border-b border-emerald-500/50 focus:border-emerald-400 text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="text-xl font-black text-emerald-400 ml-1">₽</span>
                                </div>
                                <button onClick={actions.handleSaveTotalPrice} disabled={state.isSavingTotal} className="text-emerald-400 hover:text-emerald-300 ml-1"><Check size={20} /></button>
                                <button onClick={() => actions.setIsEditingTotalPrice(false)} className="text-red-400 hover:text-red-300"><X size={20} /></button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 shrink-0 group">
                                <div className="flex flex-col items-end">
                                    {hasDiscount && (
                                        <span className="text-gray-400 dark:text-smartfix-light/50 text-sm line-through tabular-nums leading-none mb-1">
                                            {actions.formatPrice(price)} ₽
                                        </span>
                                    )}
                                    <span className={`text-emerald-600 dark:text-emerald-400 font-black tabular-nums leading-none ${finalPrice !== null && finalPrice > 999999 ? 'text-2xl' : 'text-3xl'}`}>
                                        {actions.formatPrice(finalPrice)} ₽
                                    </span>
                                </div>
                                {canEdit && (
                                    <button onClick={() => { actions.setIsEditingTotalPrice(true); actions.setLocalTotalPrice(price || 0); }} className="text-gray-400 hover:text-gray-900 dark:text-smartfix-light/30 dark:hover:text-white opacity-30 group-hover:opacity-100 transition-all shrink-0">
                                        <Edit2 size={16} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};