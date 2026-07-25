import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '../types';

export type Page = 'requests' | 'services' | 'reports' | 'profile' | 'calendar' | 'users' | 'inventory' | 'employees' | 'reviews';

export const useDashboard = () => {
    const { user, logout } = useAuth();
    const [activePage, setActivePage] = useState<Page>('requests');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = (state: boolean) => setIsMobileMenuOpen(state);
    
    const navigateTo = (page: Page) => {
        setActivePage(page);
        setIsMobileMenuOpen(false);
    };

    // Проверка прав доступа для пунктов меню
    const canSee = {
        reports: user?.role === Role.Admin || user?.role === Role.Technician,
        inventory: user?.role === Role.Admin || user?.role === Role.Technician,
        calendar: user?.role === Role.Technician,
        management: user?.role === Role.Admin
    };

    return {
        user,
        logout,
        activePage,
        isMobileMenuOpen,
        navigateTo,
        toggleMobileMenu,
        canSee
    };
};