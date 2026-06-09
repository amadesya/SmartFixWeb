import { Role } from '../types';

export type Page = 'requests' | 'services' | 'reports' | 'profile' | 'calendar' | 'users' | 'inventory' | 'employees' | 'reviews' | 'wiki';

export const NAV_LINKS: { page: Page; label: string; roles?: Role[] }[] = [
    { page: 'requests', label: 'Заявки' },
    { page: 'services', label: 'Услуги' },
    { page: 'reports', label: 'Отчёты', roles: [Role.Admin, Role.Technician] },
    { page: 'inventory', label: 'Склад', roles: [Role.Admin, Role.Technician] },
    { page: 'calendar', label: 'Мой график', roles: [Role.Technician] },
    { page: 'users', label: 'Пользователи', roles: [Role.Admin] },
    { page: 'employees', label: 'Сотрудники', roles: [Role.Admin] },
    { page: 'reviews', label: 'Отзывы' },
];