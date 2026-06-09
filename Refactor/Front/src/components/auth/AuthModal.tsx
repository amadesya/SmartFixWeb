import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom'; // 1. Импортируем хук навигации
import Modal from '../ui/Modal';
import LoginForm from './LoginForm';
import RegisterFlow from './RegisterFlow';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { login, register } = useAuth(); // setUser здесь больше не нужен для логина
    const navigate = useNavigate(); // 2. Инициализируем навигацию

    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const resetFormState = () => {
        setError('');
        setName('');
        setEmail('');
        setPassword('');
    };

    useEffect(() => {
        if (!isOpen) {
            resetFormState();
            setIsLoginView(true);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLoginView) {
                const success = await login(email, password);

                if (success) {
                    onClose(); // Закрываем модалку
                    navigate('/requests'); // 3. ПЕРЕНАПРАВЛЯЕМ В ЛИЧНЫЙ КАБИНЕТ
                } else {
                    setError('Неверный email или пароль.');
                }
            } else {
                // Логика регистрации
                const user = await register(name, email, password);
                if (user) {
                    onClose();
                    navigate('/requests'); // Перенаправляем после регистрации
                } else {
                    setError('Пользователь с таким email уже существует.');
                }
            }
        } catch (err: any) {
            setError(err.message || 'Произошла ошибка. Попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Личный кабинет">
            {/* Переключатель Вход / Регистрация */}
            <div className="mb-6 border-b flex">
                <button
                    onClick={() => { setIsLoginView(true); resetFormState(); }}
                    className={`flex-1 pb-3 text-center font-semibold transition-colors ${isLoginView
                        ? 'text-black dark:text-smartfix-lightest border-b-2 border-smartfix-lightest'
                        : 'text-gray-500 dark:text-smartfix-light'
                        }`}
                >
                    Вход
                </button>
                <button
                    onClick={() => { setIsLoginView(false); resetFormState(); }}
                    className={`flex-1 pb-3 text-center font-semibold transition-colors ${!isLoginView
                        ? 'text-black dark:text-smartfix-lightest border-b-2 border-smartfix-lightest'
                        : 'text-gray-500 dark:text-smartfix-light'
                        }`}
                >
                    Регистрация
                </button>
            </div>

            <div className="max-w-md mx-auto">
                {isLoginView ? (
                    <LoginForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                        error={error}
                    />
                ) : (
                    <RegisterFlow
                        register={register}
                        onSuccess={() => setIsLoginView(true)}
                    />
                )}
            </div>
        </Modal>
    );
};

export default AuthModal;