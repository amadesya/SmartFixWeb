import React, { useEffect, useState } from 'react';
import Header from '../components/ui/Header';
import Hero from '@/components/ui/Hero';
import HowItWorks from '@/components/ui/HowItWorks.tsx';
import AuthModal from '@/components/auth/AuthModal';
import { useServices } from '../hooks/useServices';
import ServiceCarouselGrid from '@/components/services/ServiceCarouselGrid';
import { Reviews3D } from '@/components/ui/Reviews3D';
import { useNavigate } from 'react-router-dom';
// ✅ Правильный импорт
import { useAuth } from "@/hooks/useAuth";


const LoginPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { services, isLoadingServices } = useServices();
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    // Принудительно светлая тема на странице входа
    useEffect(() => {
        const root = document.documentElement;
        const wasDark = root.classList.contains('dark');
        root.classList.remove('dark');
        root.classList.add('light');
        return () => {
            // Восстанавливаем тему только если пользователь уходит на защищённые роуты
            // (на случай если logout не был вызван)
            if (wasDark) {
                root.classList.remove('light');
                root.classList.add('dark');
            }
        };
    }, []);

    useEffect(() => {
        // Если загрузка из памяти закончилась И пользователь авторизован
        if (!isLoading && isAuthenticated) {
            // Мгновенно перекидываем его в заявки!
            navigate('/requests', { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate]);

    // Если данные еще грузятся, можно показать пустой экран, 
    // чтобы форма логина не мелькала на долю секунды
    if (isLoading) {
        return <div className="min-h-screen bg-smartfix-darkest"></div>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#051F20]">
            <Header onLoginClick={() => setIsModalOpen(true)} showMenu={false} />

            <Hero onActionClick={() => setIsModalOpen(true)} />

            <HowItWorks />

            <ServiceCarouselGrid
                services={services}
                isLoading={isLoadingServices}
            />

            <AuthModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <Reviews3D />
        </div>
    );
};

export default LoginPage;