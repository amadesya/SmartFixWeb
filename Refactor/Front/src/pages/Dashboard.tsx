import React, { useState, useContext, useCallback } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AuthContext } from '@/components/auth/AuthContext';
import Header from '@/components/ui/Header';
import { NavLinks } from '@/components/ui/NavLinks';
import MobileMenu from '@/components/ui/MobileMenu';
import { Page } from '@/hooks/navConfig';
import { useAuth } from '@/hooks/useAuth';

const DashboardLayout: React.FC = () => {
    const { user, logout, isLoading } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const activePage = (location.pathname.split('/')[1] || 'requests') as Page;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-smartfix-darkest flex items-center justify-center text-gray-900 dark:text-smartfix-lightest">
                Загрузка интерфейса...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Функция смены страницы теперь просто меняет адрес в браузере
    const handlePageChange = useCallback((page: Page) => {
        navigate(`/${page}`);
        setIsMobileMenuOpen(false);
    }, [navigate]);

    if (!user) return <Navigate to="/" replace />;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-smartfix-darkest text-gray-900 dark:text-smartfix-lightest transition-colors duration-300">
            {/* ШАПКА: Всегда сверху, не меняется при переходах */}
            <Header
                user={user}
                onOpenMenu={() => setIsMobileMenuOpen(true)}
                onLogout={logout}
                onProfileClick={() => handlePageChange('profile')}
            >
                <NavLinks
                    activePage={activePage}
                    userRole={user.role}
                    onPageChange={handlePageChange}
                    variant="horizontal"
                />
            </Header>

            {/* МОБИЛЬНОЕ МЕНЮ */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                activePage={activePage}
                userRole={user.role}
                onPageChange={handlePageChange}
            />

            {/* ОСНОВНОЙ КОНТЕНТ */}
            <main className="flex-1 p-3 md:p-4 lg:p-6 overflow-y-auto custom-scrollbar">
                <div className="w-full xl:max-w-7xl mx-auto">
                    <div className="animate-in fade-in duration-500">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;