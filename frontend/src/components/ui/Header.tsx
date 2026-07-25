import React from 'react';
import {
    WrenchScrewdriverIcon,
    UserIcon,
    ArrowLeftStartOnRectangleIcon,
    Bars3Icon
} from '@heroicons/react/24/outline';
import { getFullAvatarUrl } from '@/utils/avatarHelper'; 
import ThemeToggle from '@/components/ui/ThemeToggle';
import { NotificationBell } from './NotificationBell';

interface HeaderProps {
    user?: any | null;
    onOpenMenu?: () => void;    
    onLogout?: () => void;
    showMenu?: boolean;
    onProfileClick?: () => void; 
    children?: React.ReactNode; 
    onLoginClick?: () => void;   
}

const Header: React.FC<HeaderProps> = ({
    user,
    onOpenMenu,
    onLogout,
    onProfileClick,
    onLoginClick,
    showMenu = true,
    children
}) => {

    const Logo = (
        // Добавляем shrink-0, чтобы логотип не сплющивался
        <div
            className="flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <WrenchScrewdriverIcon className="w-6 h-6 lg:w-8 lg:h-8 text-smartfix-lightest" />
            <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-smartfix-lightest hidden sm:block" style={{ fontFamily: "'Roboto', sans-serif" }}>
                SmartFix
            </h1>
        </div>
    );

    return (
        <header className="w-full bg-smartfix-darker p-3 flex items-center justify-between gap-4 border-b border-smartfix-medium/30 transition-colors duration-300">
            {/* 1. Левая часть: Кнопка меню и Лого */}

            <div className="flex items-center gap-3 shrink-0">
                {showMenu && (
                <button
                    onClick={onOpenMenu}
                    className="p-2 lg:hidden text-smartfix-lightest hover:bg-smartfix-medium rounded-lg transition-colors"
                >
                    <Bars3Icon className="w-7 h-7" />
                </button>
                )}
                {Logo}
            </div>

            {/* 2. Центральная часть: Навигация (теперь она не ломает верстку) */}
            <div className="hidden lg:flex flex-1 justify-center overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2">
                    {children}
                </div>
            </div>

            {/* 3. Правая часть: Профиль и Выход */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-auto">
                

                
                {user ? (
                    <>
                        <NotificationBell />
                        <ThemeToggle />
                        <button
                            onClick={onProfileClick}
                            className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-smartfix-medium transition-all max-w-[150px] sm:max-w-[200px]"
                        >
                            <div className="shrink-0">
                                {user.avatar ? (
                                    <img
                                        src={getFullAvatarUrl(user.avatar) || undefined}
                                        alt="Avatar"
                                        className="w-9 h-9 rounded-full object-cover border border-smartfix-light/20"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-smartfix-medium flex items-center justify-center">
                                        <UserIcon className="w-5 h-5 text-smartfix-lightest" />
                                    </div>
                                )}
                            </div>
                            <p className="font-medium text-sm text-smartfix-lightest truncate hidden md:block">
                                {user.name}
                            </p>
                        </button>

                        <button
                            onClick={onLogout}
                            title="Выход"
                            className="p-2 rounded-lg text-smartfix-light hover:bg-red-900/30 hover:text-red-400 transition-colors shrink-0"
                        >
                            <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={onLoginClick}
                        className="bg-smartfix-light hover:bg-opacity-90 text-smartfix-darkest font-bold py-2 px-6 rounded-lg transition-colors whitespace-nowrap"
                    >
                        Войти
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;