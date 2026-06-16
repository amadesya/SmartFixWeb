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

    // Состояние для управления модальным окном
    const [showAgreementModal, setShowAgreementModal] = useState(false);

    // Шаг 1: Форма валидна, открываем модальное окно
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setShowAgreementModal(true);
    };

    // Шаг 2: Пользователь принял соглашение, регистрируем
    const handleAcceptAndRegister = async () => {
        setShowAgreementModal(false);
        setIsLoading(true);
        try {
            const user = await register(name, email, password);
            if (!user) {
                setError('Пользователь с таким email уже существует.');
            } else {
                onSuccess();
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
        <div className="relative">
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

            {/* Модальное окно (стилизовано через Tailwind для интеграции с вашим UI) */}
            {showAgreementModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-smartfix-dark p-6 rounded-lg w-full max-w-md shadow-xl text-gray-900 dark:text-white">
                        <h3 className="text-xl font-bold mb-4">Лицензионное соглашение</h3>

                        <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-smartfix-medium p-4 rounded-md bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 space-y-4">

                            {/* Внутренний заголовок (можно убрать, если он уже есть снаружи окна) */}
                            <p className="font-bold text-base text-gray-900 dark:text-white mb-2">Лицензионное соглашение</p>

                            <div className="space-y-1">
                                <p className="font-semibold text-gray-900 dark:text-white">1. Общие положения</p>
                                <p>1.1. Настоящее Пользовательское соглашение (далее — «Соглашение») регламентирует отношения между администрацией сервиса Смартфикс (далее — «Администрация») и физическим лицом, использующим данный сервис (далее — «Пользователь»).</p>
                                <p>1.2. Нажимая кнопку «Принимаю» или «Зарегистрироваться», Пользователь подтверждает, что прочитал, понял и полностью согласен с условиями настоящего Соглашения.</p>
                            </div>

                            <div className="space-y-1">
                                <p className="font-semibold text-gray-900 dark:text-white">2. Предмет соглашения</p>
                                <p>2.1. Администрация предоставляет Пользователю неисключительное, непередаваемое право использования сервиса Смартфикс в личных, некоммерческих целях (если иное не предусмотрено отдельными тарифами).</p>
                                <p>2.2. Все права на дизайн, программный код и базы данных сервиса принадлежат Администрации.</p>
                            </div>

                            <div className="space-y-1">
                                <p className="font-semibold text-gray-900 dark:text-white">3. Регистрация и учетная запись</p>
                                <p>3.1. Для получения доступа к полному функционалу сервиса Пользователь обязан пройти процедуру регистрации, предоставив достоверную информацию.</p>
                                <p>3.2. Пользователь несет личную ответственность за сохранность своего пароля и безопасность своей учетной записи.</p>
                                <p>3.3. В случае обнаружения несанкционированного доступа к аккаунту Пользователь обязан незамедлительно уведомить об этом Администрацию.</p>
                            </div>

                            <div className="space-y-1">
                                <p className="font-semibold text-gray-900 dark:text-white">4. Права и обязанности Пользователя</p>
                                <ul className="list-disc pl-5 mt-1 space-y-2">
                                    <li><strong>Пользователь имеет право:</strong> использовать доступный функционал сервиса, обращаться в службу поддержки.</li>
                                    <li><strong>Пользователь обязуется:</strong> не использовать сервис для распространения вредоносного ПО, спама, оскорбительных материалов или информации, нарушающей законодательство. Не пытаться нарушить работоспособность сайта или приложения.</li>
                                </ul>
                            </div>

                            <div className="space-y-1">
                                <p className="font-semibold text-gray-900 dark:text-white">5. Конфиденциальность и персональные данные</p>
                                <p>5.1. Администрация обрабатывает персональные данные Пользователя (имя, email) исключительно в целях предоставления услуг сервиса.</p>
                                <p>5.2. Соглашаясь с настоящими условиями, Пользователь дает согласие на обработку своих персональных данных в соответствии с действующим законодательством РФ.</p>
                            </div>

                            <div className="space-y-1">
                                <p className="font-semibold text-gray-900 dark:text-white">6. Ограничение ответственности</p>
                                <p>6.1. Сервис предоставляется на условиях «как есть» (as is). Администрация не гарантирует, что сервис будет соответствовать специфическим ожиданиям Пользователя или работать абсолютно без сбоев.</p>
                                <p>6.2. Администрация не несет ответственности за потерю данных или убытки, возникшие в результате использования или невозможности использования сервиса.</p>
                            </div>

                            <div className="space-y-1">
                                <p className="font-semibold text-gray-900 dark:text-white">7. Изменение условий</p>
                                <p>7.1. Администрация оставляет за собой право вносить изменения в настоящее Соглашение в любой момент без предварительного личного уведомления.</p>
                                <p>7.2. Продолжение использования сервиса после внесения изменений означает согласие Пользователя с новой редакцией Соглашения.</p>
                            </div>

                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowAgreementModal(false)}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Отказаться
                            </button>
                            <button
                                onClick={handleAcceptAndRegister}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-lg font-bold bg-emerald-600 dark:bg-smartfix-light text-white dark:text-smartfix-darkest hover:bg-emerald-700 dark:hover:bg-opacity-80 transition-colors"
                            >
                                Принимаю
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegisterFlow;