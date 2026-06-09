import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {NavLinks} from '@/components/ui/NavLinks';
import { Page } from '@/components/ui/NavLinks';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    activePage: Page;
    userRole: number;
    onPageChange: (page: Page) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
    isOpen,
    onClose,
    activePage,
    userRole,
    onPageChange,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative flex flex-col w-64 h-full bg-smartfix-darker shadow-2xl animate-slide-in-left">
                <div className="flex items-center justify-between p-4 border-b border-smartfix-dark">
                    <span className="text-xl font-bold text-smartfix-light">Меню</span>
                    <button onClick={onClose} className="p-2 text-smartfix-lightest hover:bg-smartfix-dark rounded-lg">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto">
                    <NavLinks
                        activePage={activePage}
                        userRole={userRole}
                        onPageChange={(page: Page) => { 
                            onPageChange(page);
                            onClose();
                        }}
                        variant="vertical"
                    />
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;