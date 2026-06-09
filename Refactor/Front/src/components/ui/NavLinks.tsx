import React from 'react';
import { Page } from '@/hooks/navConfig';
import { Role } from '../../types'; 

interface NavLinksProps {
    activePage: Page;
    userRole?: number;
    onPageChange: (page: Page) => void;
    variant: 'horizontal' | 'vertical';
}

export const NavLinks: React.FC<NavLinksProps> = ({
    activePage,
    userRole,
    onPageChange, 
    variant
}) => {
    const canSee = {
        reports: userRole === Role.Admin || userRole === Role.Technician,
        inventory: userRole === Role.Admin || userRole === Role.Technician,
        calendar: userRole === Role.Technician,
        management: userRole === Role.Admin
    };

    const NavItem = ({ page, label }: { page: Page; label: string }) => (
        <button
            onClick={() => onPageChange(page)} // Используем onPageChange
            className={`px-2 xl:px-4 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap
                ${variant === 'vertical' ? 'w-full text-left' : 'w-auto text-center'}
                ${activePage === page
                    ? 'bg-smartfix-light text-smartfix-darkest shadow-sm'
                    : 'text-smartfix-lightest hover:bg-smartfix-dark hover:text-smartfix-lightest'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className={`flex items-center ${variant === 'vertical' ? 'flex-col gap-2' : 'flex-row gap-1 xl:gap-2'}`}>
            <NavItem page="requests" label="Заявки" />
            <NavItem page="services" label="Услуги" />
            <NavItem page="reviews" label="Отзывы" />
            <NavItem page="wiki" label="Вики" />

            {canSee.reports && <NavItem page="reports" label="Отчёты" />}
            {canSee.inventory && <NavItem page="inventory" label="Склад" />}
            {canSee.calendar && <NavItem page="calendar" label="Мой график" />}

            {canSee.management && (
                <>
                    <NavItem page="users" label="Пользователи" />
                    <NavItem page="employees" label="Сотрудники" />
                </>
            )}
        </div>
    );
};

export type { Page };
