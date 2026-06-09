import React, { useState } from 'react';

type RegistrationStep = 'form' | 'pending_verification' | 'verified';

interface RegisterFlowProps {
    register: (name: string, email: string, password: string) => Promise<any>;
    onSuccess: () => void;
}

const RegisterFlow: React.FC<RegisterFlowProps> = ({ register, onSuccess }) => {
    const [step, setStep] = useState<RegistrationStep>('form');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const user = await register(name, email, password);
            if (!user) {
                setError('Пользователь с таким email уже существует.');
            } else {
                setStep('pending_verification');
            }
        } catch (err: any) {
            setError(err.message || 'Ошибка регистрации.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        setIsLoading(true);
        try {
            // Имитация API запроса
            setStep('verified');
            setVerificationMessage('Аккаунт успешно подтвержден!');
            setTimeout(() => {
                onSuccess(); 
            }, 3000);
        } catch (err: any) {
            setError('Не удалось подтвердить email.');
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 'pending_verification') {
        return (
            <div className="text-center p-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-smartfix-lightest mb-3">Подтвердите Email</h3>
                <p className="text-gray-600 dark:text-smartfix-light mb-6">Ссылка отправлена на <span className="font-semibold text-gray-900 dark:text-smartfix-lightest">{email}</span>.</p>
                <button onClick={handleVerify} disabled={isLoading} className="w-full bg-emerald-600 dark:bg-smartfix-light text-white dark:text-smartfix-darkest font-bold py-3 rounded-lg hover:bg-emerald-700 dark:hover:bg-opacity-80 transition-colors disabled:bg-gray-400 dark:disabled:bg-smartfix-medium">
                    {isLoading ? 'Подтверждение...' : 'Подтвердить (демо)'}
                </button>
                {error && <p className="text-red-500 dark:text-red-400 mt-4">{error}</p>}
            </div>
        );
    }

    if (step === 'verified') {
        return (
            <div className="text-center p-4">
                <h3 className="text-2xl font-bold text-emerald-600 dark:text-green-400 mb-3">Готово!</h3>
                <p className="text-gray-600 dark:text-smartfix-light">{verificationMessage}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-gray-700 dark:text-smartfix-light mb-1 font-medium">Имя</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white dark:bg-smartfix-dark text-gray-900 dark:text-white p-3 rounded-lg border border-gray-300 dark:border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light transition-colors" />
            </div>
            <div>
                <label className="block text-gray-700 dark:text-smartfix-light mb-1 font-medium">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white dark:bg-smartfix-dark text-gray-900 dark:text-white p-3 rounded-lg border border-gray-300 dark:border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light transition-colors" />
            </div>
            <div>
                <label className="block text-gray-700 dark:text-smartfix-light mb-1 font-medium">Пароль</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white dark:bg-smartfix-dark text-gray-900 dark:text-white p-3 rounded-lg border border-gray-300 dark:border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light transition-colors" />
            </div>
            {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 dark:bg-smartfix-light text-white dark:text-smartfix-darkest font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 dark:hover:bg-opacity-80 transition-colors disabled:bg-gray-400 dark:disabled:bg-smartfix-medium mt-2">
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
        </form>
    );
};

export default RegisterFlow;