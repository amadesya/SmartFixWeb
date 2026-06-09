import React, { useState, useEffect } from 'react';
import { UserDto } from '@/services/api';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Button } from '../ui/Button';

interface EmployeeFormProps {
    isOpen: boolean;
    onClose: () => void;
    availableUsers?: UserDto[];
    onAdd?: (data: { userId: number; baseSalary: number; bonusPercentage: number }) => Promise<void>;
    employee?: any;
    onSave?: (id: number, data: { baseSalary: number; bonusPercentage: number }) => Promise<void>;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
    isOpen,
    onClose,
    availableUsers = [],
    onAdd,
    employee,
    onSave
}) => {
    const isEditMode = !!employee;

    const [userId, setUserId] = useState<string>('');
    const [baseSalary, setBaseSalary] = useState<string>('');
    const [bonusPercentage, setBonusPercentage] = useState<string>('');
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (employee) {
                setBaseSalary(employee.baseSalary.toString());
                setBonusPercentage(employee.bonusPercentage.toString());
            } else {
                setUserId('');
                setBaseSalary('');
                setBonusPercentage('');
            }
        }
    }, [isOpen, employee]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Предотвращаем повторные клики
        if (isPending) return;

        // Конвертируем значения, заменяя пустую строку на 0, чтобы избежать NaN
        const salary = parseFloat(baseSalary) || 0;
        const bonus = parseFloat(bonusPercentage) || 0;

        try {
            setIsPending(true);

            if (isEditMode && onSave && employee) {
                await onSave(employee.id, {
                    baseSalary: salary,
                    bonusPercentage: bonus,
                });
                // Важно: закрываем только ПОСЛЕ успешного await
                onClose();

            } else if (!isEditMode && onAdd) {
                const uId = parseInt(userId);
                if (!uId) {
                    alert("Выберите пользователя из списка!");
                    return;
                }
                await onAdd({
                    userId: uId,
                    baseSalary: salary,
                    bonusPercentage: bonus,
                });
                // Если при добавлении тоже нужно закрывать форму:
                onClose();
            }
        } catch (err: any) {
            // Ошибка оставит форму открытой, чтобы пользователь мог исправить данные
            console.error("Ошибка при сохранении:", err);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? `Редактирование: ${employee.userName}` : 'Добавить оклад'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">

                {!isEditMode && (
                    <Select
                        label="Сотрудник *"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    >
                        <option value="" disabled hidden>Выберите сотрудника</option>
                        {availableUsers.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name} {u.role === 1 ? '(Мастер)' : '(Админ)'}
                            </option>
                        ))}
                    </Select>
                )}

                <Input
                    label="Оклад (₽) *"
                    type="number"
                    step="0.01"
                    placeholder="Например, 50000"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(e.target.value)}
                    required
                />

                <Input
                    label="Премия (%) *"
                    type="number"
                    step="0.01"
                    placeholder="Например, 10"
                    value={bonusPercentage}
                    onChange={(e) => setBonusPercentage(e.target.value)}
                    required
                />

                {!isEditMode && availableUsers.length === 0 && (
                    <p className="mt-1 text-sm text-yellow-500/80">
                        Нет доступных пользователей для назначения зарплаты.
                    </p>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Отмена
                    </Button>

                    <Button
                        type="submit"
                        variant="default"
                        disabled={!isEditMode && availableUsers.length === 0}
                    >
                        {isEditMode ? 'Сохранить' : 'Добавить'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EmployeeForm;