import React from 'react';
import { RepairRequest } from '@/types';
import { useInventory } from '@/hooks/useInventory';
import { usePriceEditor } from '@/hooks/usePriceEditor';
import { ViewMode } from './ViewMode';
import { EditMode } from './EditMode';

interface PriceEditorProps {
    request: RepairRequest | null;
    price: number | null;
    canEdit: boolean;
    canPay?: boolean;
    onPay?: () => void;
    isPaying?: boolean;
    onRefresh: () => void;
    discountPercent?: number;
}

const PriceEditor: React.FC<PriceEditorProps> = ({
    price,
    canEdit,
    canPay = false,
    onPay,
    isPaying = false,
    onRefresh,
    request,
    discountPercent
}) => {
    useInventory();
    const editor = usePriceEditor({ onRefresh, request });

    if (!request) return null;

    return (
    <section>
        <div className="rounded-xl border border-gray-200 dark:border-smartfix-medium/20 shadow-sm dark:shadow-xl md:grid-cols-2 gap-4 p-4 bg-white dark:bg-transparent">

            {/* РЕЖИМ ПРОСМОТРА / ЧЕК */}
            {String(request.status).toLowerCase() !== "inprogress" && (price !== null || canEdit) && (
                <ViewMode
                    request={request}
                    editor={editor}
                    price={price}
                    canEdit={canEdit}
                    canPay={canPay}
                    onPay={onPay}
                    isPaying={isPaying}
                    discountPercent={discountPercent}
                />
            )}

            {/* РЕЖИМ РЕДАКТИРОВАНИЯ МАСТЕРОМ */}
            {canEdit && String(request.status).toLowerCase() === "inprogress" && (
                <EditMode editor={editor} />
            )}

            {/* Заявка ожидает оценки */}
            {!canEdit && price === null && String(request.status).toLowerCase() !== "inprogress" && (
                <div className="text-center p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <span className="text-amber-400 font-medium">Заявка ожидает обработки и оценки мастером</span>
                </div>
            )}
        </div>
        </section>
    );
};

export default PriceEditor;