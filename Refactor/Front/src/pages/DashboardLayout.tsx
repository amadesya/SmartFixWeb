import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/ui/Header';
import { NavLinks } from '@/components/ui/NavLinks';
import RequestsPage from './RequestsPage';
import ServicesPage from './ServicesPage';
import ReportsPage from './ReportsPage';
import ProfilePage from './ProfilePage';
import SchedulePage from './SchedulePage';
import UsersPage from './UsersPage';
import { InventoryPage } from './InventoryPage';
import EmployeesPage from './EmployeesPage';
import { Page } from '@/hooks/navConfig';
import MobileMenu from '@/components/ui/MobileMenu';
import ReviewsPage from './ReviewsPage';
import { useNavigate, useLocation, Outlet, Navigate } from 'react-router-dom';


export const DashboardLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Определяем "активную страницу" на основе URL для подсветки в меню
    const activePage = (location.pathname.split('/')[1] || 'requests') as Page;

    if (!user) return <Navigate to="/" replace />;

    return (
        <div className="flex flex-col min-h-screen bg-[#ededed] text-gray-900 dark:bg-smartfix-darkest dark:text-smartfix-lightest transition-colors duration-300">
            <Header
                user={user}
                onOpenMenu={() => setIsMobileMenuOpen(true)}
                onLogout={logout}
                onProfileClick={() => navigate('/profile')}
            >
                <NavLinks
                    activePage={activePage}
                    userRole={user.role}
                    // Теперь мы не меняем стейт, а просто переходим по ссылке
                    onPageChange={(page) => navigate(`/${page}`)}
                    variant="horizontal"
                />
            </Header>

            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                activePage={activePage}
                userRole={user.role}
                onPageChange={(page) => navigate(`/${page}`)}
            />

            <main className="flex-1 p-3 md:p-4 lg:p-6 overflow-y-auto">
                <div className="w-full xl:max-w-7xl mx-auto">
                    <div className="animate-in fade-in duration-500">
                        {/* ВАЖНО: Outlet — это место, куда будут "вставляться" 
                           твои страницы: RequestsPage, ReviewsPage и т.д.
                        */}
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;