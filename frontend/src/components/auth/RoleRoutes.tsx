import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Для любых авторизованных пользователей
export const PrivateRoute = () => {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) return <div>Загрузка...</div>;

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export const AdminRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-smartfix-darkest text-smartfix-lightest">
                Проверка прав доступа...
            </div>
        );
    }

    return user && user.role !== 0 ? <Outlet /> : <Navigate to="/requests" replace />;
};