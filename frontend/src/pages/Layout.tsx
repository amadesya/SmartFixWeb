import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar'; // Твое меню
import { Header } from './Header';   // Твоя шапка

export const Layout = ({ user }) => {
    return (
        <div className="min-h-screen bg-smartfix-darkest flex">
            {/* Твой сайдбар теперь всегда на месте */}
            <Sidebar user={user} />

            <div className="flex-1 flex flex-col">
                {/* Твоя шапка тоже всегда на месте */}
                <Header user={user} />

                <main className="p-4 sm:p-6 overflow-y-auto">
                    {/* Сюда будут подставляться твои страницы */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};