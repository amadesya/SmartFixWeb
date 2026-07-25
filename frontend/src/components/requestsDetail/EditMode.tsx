import React, { useState } from 'react';
import { usePriceEditor } from '@/hooks/usePriceEditor';
import { ServiceList } from './ServiceList';
import { PartList } from './PartList';
import { EditSummary } from './EditSummary';
import { Tabs } from '../ui/Tabs';
import { Role } from '@/types';
import { Search } from '../ui/Search';

type EditorType = ReturnType<typeof usePriceEditor>;

export const EditMode = ({ editor }: { editor: EditorType }) => {
    const { state, actions } = editor;
    const editTabs = [
        { id: 'services', label: `Работы (${state.selectedServices.length})` },
        { id: 'parts', label: `Запчасти (${state.selectedParts.length})` },
    ];

    return (
        <div>
            <div>
                <Tabs
                    options={editTabs}
                    activeTab={state.activeEditTab}
                    onTabChange={(tabId) => {
                        actions.setActiveEditTab(tabId);
                        actions.setSearchQuery('');
                    }}
                    className="justify-center w-full"
                />
                <Search
                    value={state.searchQuery}
                    onChange={(val) => actions.setSearchQuery(val)}
                    placeholder="Поиск услуг или запчастей..."
                />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col mb-4 min-h-0">
                {state.activeEditTab === 'services' && <ServiceList editor={editor} />}
                {state.activeEditTab === 'parts' && <PartList editor={editor} />}
            </div>

            <EditSummary editor={editor} />
        </div>
    );
};