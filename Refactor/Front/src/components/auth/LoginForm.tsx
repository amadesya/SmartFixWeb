import React, { FormEvent } from 'react';

interface LoginFormProps {
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    isLoading,
    error
}) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-gray-700 dark:text-smartfix-light mb-1 font-medium">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-smartfix-dark text-gray-900 dark:text-white p-3 rounded-lg border border-gray-300 dark:border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light transition-colors"
                />
            </div>
            <div>
                <label className="block text-gray-700 dark:text-smartfix-light mb-1 font-medium">Пароль</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-smartfix-dark text-gray-900 dark:text-white p-3 rounded-lg border border-gray-300 dark:border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light transition-colors"
                />
            </div>

            {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 dark:bg-smartfix-light text-white dark:text-smartfix-darkest font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 dark:hover:bg-opacity-80 transition-colors disabled:bg-gray-400 dark:disabled:bg-smartfix-medium"
                >
                    {isLoading ? 'Вход...' : 'Войти'}
                </button>
            </div>
        </form>
    );
};

export default LoginForm;