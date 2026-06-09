import React from 'react';
import { usePriceEditor } from '@/hooks/usePriceEditor';
import { Plus, X, ChevronDown } from 'lucide-react';

type EditorType = ReturnType<typeof usePriceEditor>;

export const ServiceList = ({ editor }: { editor: EditorType }) => {
    const { state, actions } = editor;
    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300 shrink-0">
            <div
                className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-white/5 transition-colors cursor-pointer group hover:bg-gray-50 dark:hover:bg-white/[0.02] rounded-xl-xl"
                onClick={() => actions.setIsServicesExpanded(!state.isServicesExpanded)}
            >
                <div className="flex items-center gap-2 m-2 ml-1">
                    <span className="text-gray-900 dark:text-smartfix-lightest text-sm font-bold">
                        Выполненные работы {state.selectedServices.length > 0 ? `(${state.selectedServices.length})` : ''}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-smartfix-light transition-transform duration-300 ${state.isServicesExpanded ? 'rotate-180' : ''}`} />
                </div>
                {!state.isAddingSvc && (
                    <button onClick={(e) => { e.stopPropagation(); actions.setIsAddingSvc(true); actions.setIsServicesExpanded(true); }} className="info-label text-sm font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"><Plus size={12} /> Новая услуга</button>
                )}
            </div>

            {state.isServicesExpanded && (
                <div className="flex flex-col pt-0 animate-in fade-in duration-200">
                    {state.isAddingSvc && (
                        <div className="flex flex-col sm:flex-row gap-2 mb-4 bg-smartfix-dark/50 p-2.5 rounded-xl-xl border border-emerald-500/30 shadow-inner">
                            <input value={state.newSvcName} onChange={e => actions.setNewSvcName(e.target.value)} placeholder="Название услуги" className="flex-1 min-w-0 text-sm p-2 rounded-xl bg-smartfix-dark text-white outline-none border border-smartfix-medium/20 focus:border-emerald-500/50" />
                            <div className="flex gap-2 shrink-0">
                                <div className="relative flex items-center bg-smartfix-dark px-2 py-1 rounded-xl-xl border border-smartfix-medium/20 focus-within:border-emerald-500/50 shrink-0">
                                    <input value={state.newSvcPrice} type="number" onChange={e => actions.setNewSvcPrice(e.target.value)} placeholder="Цена" className="min-w-[100px] w-24 px-2 py-1 pr-7 text-sm bg-transparent text-white outline-none text-right tabular-nums shrink-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                    <span className="absolute right-2 text-xs text-smartfix-medium pointer-events-none">₽</span>
                                </div>
                               <button onClick={() => actions.handleAddService()} disabled={!state.newSvcName || !state.newSvcPrice} className="bg-emerald-600 disabled:opacity-50 text-white px-3 rounded-xl hover:bg-emerald-500 font-bold text-sm transition-colors">ОК</button>
                                <button onClick={() => actions.setIsAddingSvc(false)} className="text-red-400 px-2 rounded-xl-xl hover:bg-red-500/20 transition-colors"><X size={16} /></button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-2 gap-y-1 mt-1 md:grid-cols-2 ">
                        {state.filteredServices.map(service => {
                            const selected = state.selectedServices.find(s => s.id === service.id);
                            const isSelected = !!selected;
                            return (
                                <div
                                    key={`srv-${service.id}`}
                                    onClick={() => actions.handleToggleService(service)}
                                    className="flex justify-between items-center py-3 border border-white/5 transition-colors cursor-pointer group hover:bg-white/[0.02] px-2 rounded-xl bg-smartfix-darker/50"
                                >
                                    <div className='m-1'>
                                        <span className={`text-sm leading-tight break-words whitespace-normal transition-colors ${isSelected
                                            ? 'text-emerald-400 font-bold'
                                            : 'text-smartfix-lightest/70 group-hover:text-white'
                                            }`}>
                                            {service.name}
                                        </span>
                                    </div>
                                    <div className="shrink-0 text-right" onClick={(e) => e.stopPropagation()}>
                                        {isSelected ? (
                                            <div className="relative flex items-center shrink-0">
                                                <input
                                                    type="number"
                                                    value={selected.price === 0 ? '' : Math.round(selected.price)}
                                                    onChange={(e) => actions.handleServicePriceChange(service.id, Number(e.target.value))}
                                                    placeholder="0"
                                                    /* Убрали лишнее двоеточие и причесали шрифт */
                                                    className="w-20 bg-transparent text-emerald-400 outline-none text-right font-bold text-sm tabular-nums border-b border-emerald-500/30 focus:border-emerald-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                                <span className="text-sm font-bold text-emerald-400 ml-1">₽</span>
                                            </div>
                                        ) : (
                                            /* Здесь меняем цвет на изумрудный только при наведении, либо заменяем на постоянный */
                                            <span className="text-sm font-bold tabular-nums group-hover:text-emerald-400 transition-colors text-smartfix-lightest/70">
                                                {actions.formatPrice(service.price)} ₽
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};