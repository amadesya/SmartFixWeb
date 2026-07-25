import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { User } from './types';
import { login, register } from './services/api';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import { AuthContext, AuthProvider } from '@/components/auth/AuthContext';
import { AuthResponseDto } from './types';
import { ReviewThreadPage } from './pages/ReviewThreadPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import ServicesPage from './pages/ServicesPage';
import ReviewsPage  from './pages/ReviewsPage';
import EmployeesPage from './pages/EmployeesPage';
import RequestsPage from './pages/RequestsPage';
import ReportsPage from './pages/ReportsPage';
import SchedulePage from './pages/SchedulePage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import { InventoryPage } from './pages/InventoryPage';
import { DashboardLayout } from './pages/DashboardLayout.tsx';
import { AdminRoute, PrivateRoute } from './components/auth/RoleRoutes.tsx';
import AdminControls from './components/requestsDetail/AdminControls.tsx';
import { useTheme } from '@/hooks/useTheme';
import WikiHomePage from './pages/WikiHomePage';
import WikiArticlePage from './pages/WikiArticlePage';
import WikiCategoryPage from './pages/WikiCategoryPage';
import { Toaster } from 'react-hot-toast';


const App: React.FC = () => {
    const [user, setUser] = useState<AuthResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Инициализируем переключение темы (применяет класс dark к тегу <html>)
    useTheme();

    useEffect(() => {
        const storedUser = localStorage.getItem('smartfix_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const loginUser = useCallback(async (email: string, password: string) => {
        try {
            const authResponse = await login(email, password);
            if (authResponse) {
                const loggedInUser: AuthResponseDto = {
                    id: authResponse.id,
                    name: authResponse.name,
                    email: authResponse.email,
                    role: authResponse.role,
                    isVerified: authResponse.isVerified,
                    phone: authResponse.phone,
                    avatar: authResponse.avatar,
                    token: authResponse.token, 
                };
                setUser(loggedInUser);
                localStorage.setItem('smartfix_user', JSON.stringify(loggedInUser));
                localStorage.setItem('token', authResponse.token); 
                return loggedInUser;
            }
            return null;
        } catch (error) {
            console.error("Login error:", error);
            return null;
        }
    }, []);

    const logoutUser = useCallback(() => {
        setUser(null);
        localStorage.removeItem('smartfix_user');
        localStorage.removeItem('token');
    }, []);

    const registerUserFn = useCallback(async (name: string, email: string, password: string) => {
        try {
            const newUser = await register(name, email, password);
            return newUser;
        } catch (error) {
            console.error("Register error:", error);
            return null;
        }
    }, []);

    // Функция для обновления пользователя
    const updateUser = useCallback((updatedUser: AuthResponseDto | null) => {
        setUser(updatedUser);
        if (updatedUser) {
            localStorage.setItem('smartfix_user', JSON.stringify(updatedUser));
        } else {
            localStorage.removeItem('smartfix_user');
        }
    }, []);

    const authContextValue = useMemo(() => ({
        user,
        setUser: updateUser,
        login: loginUser,
        logout: logoutUser,
        register: registerUserFn,
    }), [user, updateUser, loginUser, logoutUser, registerUserFn]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-smartfix-darkest">
                <div className="text-gray-900 dark:text-smartfix-lightest text-2xl">Загрузка...</div>
            </div>
        );
    }

    return (
        <AuthProvider>
            <div className="min-h-screen bg-[#DCDCDC] text-gray-900 dark:bg-smartfix-darkest dark:text-smartfix-lightest transition-colors duration-300">
                <Toaster 
                    position="bottom-right"
                    toastOptions={{
                        className: 'dark:bg-smartfix-darker dark:text-white bg-white text-gray-900 border dark:border-smartfix-medium/30 border-gray-200 shadow-lg',
                        style: {
                            borderRadius: '12px',
                            padding: '16px',
                        },
                    }}
                />
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route element={<DashboardLayout />}>

                    <Route element={<PrivateRoute />}>
                        <Route path="/requests" element={<RequestsPage />} />
                        <Route path="/services" element={<ServicesPage />} />
      
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/users" element={<UsersPage />} />

                        <Route path="/reviews" element={<ReviewsPage/>} />
                        <Route path="/reviews/:id" element={<ReviewThreadPage />} />
                        
                        <Route path="/wiki" element={<WikiHomePage />} />
                        <Route path="/wiki/article/:id" element={<WikiArticlePage />} />
                        <Route path="/wiki/category/:slug" element={<WikiCategoryPage />} />
                    </Route>

                    <Route element={<AdminRoute/>}>
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/inventory" element={<InventoryPage />} />
                        <Route path="/employees" element={<EmployeesPage />} />
                    </Route>

                    <Route element={<AdminRoute />}>
                        <Route path="/calendar" element={<SchedulePage />} />
                    </Route>
                    </Route>
                </Routes>
            </div>
        </AuthProvider>
    );
};

export default App;