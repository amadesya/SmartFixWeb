import React, { useState } from 'react';
import EmployeeForm from '../components/employees/EmployeeForm';
import EmployeesTable from '../components/employees/EmployeesTable';
import { useEmployees } from '@/hooks/useEmployees';
import { PageHeader } from '@/components/ui/PageHeader';
import { ViewSwitcher } from '@/components/ui/ViewSwitcher';
import EmployeeCard from '@/components/employees/EmployeeCard';

const EmployeesPage: React.FC = () => {
    const {
        employees,
        availableUsers,
        loading,
        error,
        editingEmployee,
        setEditingEmployee,
        handleEditClick,
        handleUpdateEmployee,
        handleAddEmployee,
        handleDeleteEmployee
    } = useEmployees();

    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    

    if (loading) return <div className="p-6 text-gray-900 dark:text-smartfix-lightest">Загрузка...</div>;
    if (error) return <div className="p-6 text-red-500">Ошибка: {error}</div>;

    return (
        <div>
            <PageHeader
                title="Сотрудники"
                actions={[
                    { label: 'Добавить сотрудника', onClick: () => setIsAdding(true) }
                ]}
            />
            <div className="flex items-center justify-end gap-4 mb-6">
                <ViewSwitcher
                    options={[
                        { id: 'table', label: 'Список' },
                        { id: 'grid', label: 'Сетка' }
                    ]}
                    activeView={viewMode}
                    onChange={(id) => setViewMode(id as 'grid' | 'table')}
                />
            </div>
            {loading ? (
                <div className="text-center text-gray-500 dark:text-smartfix-light py-20">Загрузка услуг...</div>
            ) : (
                <>
                    {viewMode === 'table' ? (
                        <EmployeesTable
                            employees={employees}
                            onDelete={handleDeleteEmployee}
                            onEdit={handleEditClick}
                        />

                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {employees.map((emp) => (
                                        <EmployeeCard
                                            key={emp.id}
                                            employee={emp}
                                            onEdit={handleEditClick}
                                            onDelete={handleDeleteEmployee}
                                        />
                                    ))}
                        </div>
                    )}
                </>
            )}
            {/* --- ТАБЛИЦА С СОТРУДНИКАМИ --- */}

            {/* --- МОДАЛЬНОЕ ОКНО ДОБАВЛЕНИЯ --- */}
            <EmployeeForm
                isOpen={isAdding}
                onClose={() => setIsAdding(false)}
                availableUsers={availableUsers}
                onAdd={async (data) => {
                    await handleAddEmployee(data);
                    setIsAdding(false);
                }}
            />

            {/* --- МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ --- */}
            <EmployeeForm
                isOpen={!!editingEmployee}
                onClose={() => setEditingEmployee(null)}
                employee={editingEmployee}
                onSave={handleUpdateEmployee}
            />

        </div>
    );
};

export default EmployeesPage;