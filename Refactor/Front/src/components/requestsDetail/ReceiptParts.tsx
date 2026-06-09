import React from 'react';
import { RepairRequest } from '@/types';
import { usePriceEditor } from '@/hooks/usePriceEditor';
import { Check, X, Edit2, Trash2 } from 'lucide-react';

type EditorType = ReturnType<typeof usePriceEditor>;

export const ReceiptParts = ({ request, editor, canEdit }: { request: RepairRequest, editor: EditorType, canEdit: boolean }) => {
    const { state, actions } = editor;
    return (
        <div>
            <span className="info-label text-gray-500 dark:text-smartfix-light/70 text-xs font-bold uppercase tracking-wider">Запчасти</span>
            <div className="flex flex-col">
                {request.repairParts?.map((rp: any) => (
                    <div key={rp.id} className="flex flex-col py-3 border-b border-white/5 last:border-0 group hover:bg-white/[0.02] px-2 -mx-2 rounded transition-colors">
                        <div className="flex justify-between items-center w-full">
                            <div className="flex-1 min-w-0 pr-4">
                                <span className="text-gray-900 dark:text-smartfix-lightest font-medium mt-0.5">
                                    {rp.sparePart?.name || 'Деталь'}{rp.quantity !== 1 ? ` (${rp.quantity} шт.)` : ''}
                                </span>
                            </div>
                            {state.editingPartId === rp.id ? (
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="relative flex items-center shrink-0">
                                        <input
                                            type="number"
                                            value={state.editPartPrice !== '' ? Math.round(Number(state.editPartPrice)) : ''}
                                            onChange={(e) => actions.setEditPartPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                            placeholder="0"
                                            className="w-20 bg-transparent text-blue-400 outline-none text-right font-bold tabular-nums border-b border-blue-500/30 focus:border-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <span className="text-xs font-bold text-blue-400 ml-1">₽</span>
                                    </div>
                                    <button onClick={() => actions.handleSavePartPrice(rp.id)} className="text-blue-400 hover:text-blue-300 ml-1"><Check size={16} /></button>
                                    <button onClick={() => actions.setEditingPartId(null)} className="text-red-400 hover:text-red-300"><X size={16} /></button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-blue-600 dark:text-blue-200 font-bold whitespace-nowrap tabular-nums">
                                        {rp.priceAtTheTime === 0 ? <span className="text-[10px] uppercase text-gray-500 dark:text-smartfix-medium tracking-wider"></span> : `${actions.formatPrice(rp.priceAtTheTime)} ₽`}
                                    </span>
                                    {canEdit && (
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => { actions.setEditingPartId(rp.id); actions.setEditPartPrice(rp.priceAtTheTime); }} className="text-gray-400 hover:text-gray-900 dark:text-smartfix-light/50 dark:hover:text-white" title="Изменить цену">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => actions.handleRemovePart(rp.id)} className="text-red-500/50 hover:text-red-500" title="Удалить запчасть из заказа">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {canEdit && state.editingPartId !== rp.id && (
                            <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                                <label className="flex items-center gap-2 cursor-pointer group/label w-fit">
                                    <input
                                        type="checkbox"
                                        className="accent-blue-500 w-3.5 h-3.5 rounded cursor-pointer"
                                        checked={rp.priceAtTheTime === 0}
                                        onChange={() => actions.handleToggleHidePartInDetails(rp.id, rp.priceAtTheTime, rp.sparePart?.purchasePrice || rp.sparePart?.price || 0)}
                                    />
                                    <span className="info-label text-gray-500 dark:text-smartfix-light/60 text-xs font-bold uppercase tracking-wider">Скрыть цену в чеке</span>
                                </label>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};