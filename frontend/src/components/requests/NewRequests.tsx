import React, { useEffect, useState } from 'react';
import { User, RepairRequest } from '@/types';
import { useNewRequestForm } from '@/hooks/useNewRequestForm';
import { clientsApi } from '@/services/api';

interface NewRequestFormProps {
    user: User;
    onSubmitted: (newRequest: RepairRequest) => void;
    onCancel: () => void;
    onSubmit: (data: any) => void;
}

const NewRequestForm: React.FC<NewRequestFormProps> = ({ user, onSubmitted, onCancel, onSubmit }) => {
    const { state, setters, handleSubmit } = useNewRequestForm(user, onSubmitted);
    const [discount, setDiscount] = useState(user.personalDiscount || 0);

    useEffect(() => {
        if (user?.id && user.role === 0) {
            clientsApi.getProfile(user.id)
                .then(data => setDiscount(data.loyalty.discountPercent))
                .catch(console.error);
        }
    }, [user]);

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-smartfix-darker p-6 rounded-2xl border border-gray-200 dark:border-smartfix-dark max-w-3xl mx-auto shadow-sm dark:shadow-none">
            
            {user.role === 0 && discount > 0 && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl flex items-start gap-3">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H14a1 1 0 100-2H8.414l1.293-1.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-emerald-800 dark:text-emerald-300 font-medium text-sm">
                            Ваша персональная скидка {discount}% будет применена при расчете стоимости мастером.
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-8">
                <fieldset className="p-4 border border-gray-200 dark:border-smartfix-dark rounded-lg">
                    <legend className="px-2 font-semibold text-gray-900 dark:text-smartfix-lightest">Информация об устройстве</legend>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div>
                            <label className="block text-gray-700 dark:text-smartfix-light mb-1 text-sm font-medium">Тип устройства</label>
                            <input
                                type="text"
                                value={state.deviceType}
                                onChange={e => setters.setDeviceType(e.target.value)}
                                placeholder="Телефон"
                                className="w-full bg-white dark:bg-smartfix-dark p-2 rounded-lg border border-gray-300 dark:border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light text-gray-900 dark:text-smartfix-lightest transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-smartfix-light mb-1 text-sm font-medium">Бренд</label>
                            <input
                                type="text"
                                value={state.brand}
                                onChange={e => setters.setBrand(e.target.value)}
                                placeholder="Apple"
                                className="w-full bg-white dark:bg-smartfix-dark p-2 rounded-lg border border-gray-300 dark:border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light text-gray-900 dark:text-smartfix-lightest transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-smartfix-light mb-1 text-sm font-medium">Модель</label>
                            <input
                                type="text"
                                value={state.model}
                                onChange={e => setters.setModel(e.target.value)}
                                placeholder="iPhone 14 Pro"
                                className="w-full bg-white dark:bg-smartfix-dark p-2 rounded-lg border border-gray-300 dark:border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light text-gray-900 dark:text-smartfix-lightest transition-colors"
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="p-4 border border-gray-200 dark:border-smartfix-dark rounded-lg">
                    <legend className="px-2 font-semibold text-gray-900 dark:text-smartfix-lightest">Описание проблемы</legend>
                    <textarea
                        value={state.issueDescription}
                        onChange={e => setters.setIssueDescription(e.target.value)}
                        placeholder="Например: разбит экран, не включается..."
                        rows={4}
                        className="mt-2 w-full bg-white dark:bg-smartfix-dark p-2 rounded-lg border border-gray-300 dark:border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light text-gray-900 dark:text-smartfix-lightest transition-colors resize-none"
                    />
                </fieldset>

                <fieldset className="p-4 border border-gray-200 dark:border-smartfix-dark rounded-lg">
                    <legend className="px-2 font-semibold text-gray-900 dark:text-smartfix-lightest">Срочность</legend>
                    <select
                        value={state.urgency}
                        onChange={e => setters.setUrgency(e.target.value)}
                        className="mt-2 w-full bg-white dark:bg-smartfix-dark p-2 rounded-lg border border-gray-300 dark:border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light text-gray-900 dark:text-smartfix-lightest transition-colors"
                    >
                        <option value="standard">Стандартная</option>
                        <option value="urgent">Срочный ремонт</option>
                    </select>
                </fieldset>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={state.isSubmitting}
                        className="bg-emerald-600 dark:bg-smartfix-light text-white dark:text-smartfix-darkest font-bold py-3 px-8 rounded-lg hover:bg-emerald-700 dark:hover:bg-opacity-80 transition-colors disabled:bg-gray-400 dark:disabled:bg-smartfix-medium"
                    >
                        {state.isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default NewRequestForm;