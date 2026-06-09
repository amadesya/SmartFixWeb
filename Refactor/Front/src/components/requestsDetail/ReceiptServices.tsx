import React from 'react';
import { RepairRequest } from '@/types';
import { usePriceEditor } from '@/hooks/usePriceEditor';
import { Check, X, Edit2, Trash2 } from 'lucide-react';

type EditorType = ReturnType<typeof usePriceEditor>;

export const ReceiptServices = ({ request, editor, canEdit }: { request: RepairRequest, editor: EditorType, canEdit: boolean }) => {
    const { state, actions } = editor;
    return (
        <div className="mb-2">
            <span className="info-label text-gray-500 dark:text-smartfix-light/70 text-xs font-bold uppercase tracking-wider">Работы</span>
            <div className="flex flex-col">
                {request.repairServices?.map((rs: any) => (
                    <div key={rs.id} className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-white/5 last:border-0 group hover:bg-gray-50 dark:hover:bg-white/[0.02] px-2 -mx-2 rounded transition-colors">
                        <div className="flex-1 min-w-0 pr-4">
                            <span className="text-gray-900 dark:text-smartfix-lightest font-medium mt-0.5">
                                {rs.service?.name || 'Услуга'}
                            </span>
                        </div>
                        {state.editingSvcId === rs.id ? (
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="relative flex items-center shrink-0">
                                    <input
                                        type="number"
                                        value={state.editSvcPrice !== '' ? Math.round(Number(state.editSvcPrice)) : ''}
                                        onChange={(e) => actions.setEditSvcPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                        placeholder="0"
                                        className="w-20 bg-transparent text-emerald-400 outline-none text-right font-bold tabular-nums border-b border-emerald-500/30 focus:border-emerald-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="text-xs font-bold text-emerald-400 ml-1">₽</span>
                                </div>
                                <button onClick={() => actions.handleSaveSvcPrice(rs.id)} className="text-emerald-400 hover:text-emerald-300 ml-1"><Check size={16} /></button>
                                <button onClick={() => actions.setEditingSvcId(null)} className="text-red-400 hover:text-red-300"><X size={16} /></button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="text-gray-900 dark:text-white font-bold whitespace-nowrap tabular-nums">{rs.priceAtTheTime === 0 ? <span className="text-[10px] uppercase text-gray-500 dark:text-smartfix-medium tracking-wider">Включено</span> : `${actions.formatPrice(rs.priceAtTheTime)} ₽`}</span>
                                {canEdit && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => { actions.setEditingSvcId(rs.id); actions.setEditSvcPrice(rs.priceAtTheTime); }} className="text-gray-400 hover:text-gray-900 dark:text-smartfix-light/50 dark:hover:text-white" title="Изменить цену">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => actions.handleRemoveService(rs.id)} className="text-red-500/50 hover:text-red-500" title="Удалить услугу из заказа">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};