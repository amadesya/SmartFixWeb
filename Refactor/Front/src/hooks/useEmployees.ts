import { useState, useEffect, useCallback } from 'react';
import { EmployeeDto, employeesApi, UserDto, usersApi} from '@/services/api';

export const useEmployees = () => {
    const [employees, setEmployees] = useState<EmployeeDto[]>([]);
    const [availableUsers, setAvailableUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingEmployee, setEditingEmployee] = useState<EmployeeDto | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [empData, usersData] = await Promise.all([
                employeesApi.getAll(),
                usersApi.getAll()
            ]);
            setEmployees(empData);

            const existingIds = empData.map(e => e.userId);
            const eligible = usersData.filter(u =>
                (u.role === 1 || u.role === 2) && !existingIds.includes(u.id)
            );
            setAvailableUsers(eligible);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleEditClick = (emp: EmployeeDto) => {
        setEditingEmployee(emp);
        console.log("Открываем форму редактирования для:", emp.userName);
    };

    const handleUpdateEmployee = async (id: number, newData: { baseSalary: number; bonusPercentage: number }) => {
        try {
            await employeesApi.update(id, newData); 
            await loadData();
            setEditingEmployee(null); 
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleAddEmployee = async (data: { userId: number; baseSalary: number; bonusPercentage: number }) => {
        try {
            await employeesApi.create(data);
            await loadData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDeleteEmployee = async (id: number) => {
        if (!window.confirm('Удалить данные о зарплате?')) return;
        try {
            await employeesApi.delete(id);
            await loadData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return {
        employees,
        availableUsers,
        loading,
        error,
        editingEmployee,
        setEditingEmployee, 
        handleEditClick,
        handleUpdateEmployee,
        handleAddEmployee,
        handleDeleteEmployee,
        loadData
    };
};