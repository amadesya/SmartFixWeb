import React, { useState, useEffect, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { notificationsApi, getNotificationHubUrl } from '@/services/api';
import * as signalR from '@microsoft/signalr';

export const NotificationBell: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const data = await notificationsApi.getAll();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        
        const hubUrl = getNotificationHubUrl();
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl)
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .build();

        connection.on('ReceiveNotification', () => {
            fetchNotifications();
        });

        const startConnection = async () => {
            try {
                await connection.start();
                console.log('Успешно подключено к SignalR Hub:', hubUrl);
            } catch (err) {
                console.error('Ошибка подключения к SignalR:', err);
            }
        };

        startConnection();

        connection.onreconnected(() => {
            console.log('SignalR переподключён');
        });

        return () => {
            connection.stop();
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationsApi.markAsRead(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsApi.markAllAsRead();
            setNotifications([]);
            setIsOpen(false);
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    return (
        <div className="relative shrink-0" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg text-smartfix-lightest hover:bg-smartfix-medium transition-colors"
                title="Уведомления"
            >
                <BellIcon className="w-6 h-6" />
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-smartfix-darker">
                        {notifications.length > 99 ? '99+' : notifications.length}
                    </span>
                )}
            </button>

{isOpen && (
    <>
        {/* Задний фон-затемнение (overlay) для мобилок, чтобы закрывать по клику мимо */}
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden" 
            onClick={() => setIsOpen(false)} // Замените на вашу функцию закрытия
        />

        <div className="
            /* Мобильные стили: фиксируем на весь экран или как шторку */
            fixed inset-x-4 top-20 bottom-4 mx-auto 
            md:absolute md:inset-auto md:right-0 md:top-full md:bottom-auto md:mt-2 md:w-80 
            bg-smartfix-dark rounded-lg shadow-xl border border-smartfix-medium/30 
            overflow-hidden z-50 flex flex-col
        ">
            {/* Шапка */}
            <div className="p-3 border-b border-smartfix-medium/30 flex justify-between items-center bg-smartfix-darker shrink-0">
                <h3 className="font-bold text-smartfix-lightest">Уведомления</h3>
                {notifications.length > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-smartfix-light hover:underline"
                    >
                        Прочитать все
                    </button>
                )}
            </div>
            
            {/* Список уведомлений */}
            <div className="overflow-y-auto flex-1 max-h-none md:max-h-96">
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-smartfix-light">
                        Нет новых уведомлений
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {notifications.map(notification => (
                            <div 
                                key={notification.id} 
                                className="p-3 border-b border-smartfix-medium/10 hover:bg-smartfix-medium/20 transition-colors group relative"
                            >
                                <p className="text-sm text-smartfix-lightest pr-8">
                                    {notification.message}
                                </p>
                                <span className="text-[10px] text-smartfix-light mt-1 block">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </span>
                                
                                {/* Кнопка "Удалить/Прочитать" на мобилках должна быть видимой сразу, а не по hover */}
                                <button
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="absolute top-3 right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 text-smartfix-light hover:text-smartfix-lightest transition-opacity p-1"
                                    title="Пометить как прочитанное"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </>
)}
        </div>
    );
};