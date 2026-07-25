import React from 'react';
import { usePriceEditor } from '@/hooks/usePriceEditor';
import { ReceiptServices } from './ReceiptServices';
import { ReceiptParts } from './ReceiptParts';
import { ReceiptSummary } from './ReceiptSummary';

type EditorType = ReturnType<typeof usePriceEditor>;

export const ViewMode = ({ request, editor, price, canEdit, canPay, onPay, isPaying, discountPercent }: any) => {
    return (
        <div className="animate-in slide-in-from-bottom-2 flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {((request.repairServices?.length ?? 0) > 0 || (request.repairParts?.length ?? 0) > 0) ? (
                    <div className="flex flex-col pb-6">
                        {request.repairServices && request.repairServices.length > 0 && <ReceiptServices request={request} editor={editor} canEdit={canEdit} />}
                        {request.repairParts && request.repairParts.length > 0 && <ReceiptParts request={request} editor={editor} canEdit={canEdit} />}
                    </div>
                ) : (
                    <div className="text-center p-6 bg-gray-50 dark:bg-smartfix-darker/60 border border-gray-200 dark:border-smartfix-medium/10 rounded-xl">
                        <span className="text-gray-500 dark:text-smartfix-light">Детализация пуста</span>
                    </div>
                )}
            </div>
            <ReceiptSummary price={price} editor={editor} canEdit={canEdit} discountPercent={discountPercent} />
            {!canEdit && canPay && onPay && (
                <button onClick={onPay} disabled={isPaying} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-[0.98]">
                    {isPaying ? 'Подготовка...' : 'Перейти к оплате онлайн'}
                </button>
            )}
        </div>
    );
};