import React from 'react';
import { usePriceEditor } from '@/hooks/usePriceEditor';

type EditorType = ReturnType<typeof usePriceEditor>;

export const EditSummary = ({ editor }: { editor: EditorType }) => {
    const { state, actions } = editor;
    return (
        <div className="mt-2 ml-1 shrink-0 bg-white dark:bg-smartfix-dark border-t-2 border-white/5 pt-4 pb-2 flex flex-col gap-2 w-full">
            <div className="flex flex-col w-full">
                <div className="flex justify-between items-center pt-2">
                    <span className="info-label text-black dark:text-smartfix-lightest text-xs font-bold uppercase tracking-wider">Итого к оплате</span>
                    <span className={`font-bold mr-4 text-emerald-400 text-right shrink-0 tabular-nums ${state.total > 999999 ? 'text-2xl' : 'text-3xl'}`}>
                        {actions.formatPrice(state.total)} ₽
                    </span>
                </div>
            </div>
            <button
                onClick={actions.handleComplete}
                disabled={state.loading || (state.selectedServices.length === 0 && state.selectedParts.length === 0)}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white font-bold py-3 px-6 md:px-8 rounded-xl transition-all shadow-lg active:scale-[0.98] shrink-0"
            >
                {state.loading ? 'Сохранение...' : 'Завершить ремонт'}
            </button>
        </div>
    );
};