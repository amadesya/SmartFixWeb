import React from 'react';
import DataTable, { Column } from '@/components/ui/DataTable';
import { RepairRequest, RequestStatusLabels } from '@/types'; 

interface RequestsTableProps {
    requests: RepairRequest[];
    isLoading?: boolean;
}

const RequestsTable: React.FC<RequestsTableProps> = ({
    requests,
    isLoading = false
}) => {
    const columns: Column<RepairRequest>[] = [
        {
            header: 'ID',
            render: (req) => <span className="text-gray-900 dark:text-smartfix-lightest">{req.id}</span>
        },
        {
            header: 'Клиент',
            render: (req) => <span className="text-gray-900 dark:text-smartfix-lightest">{req.clientName}</span>
        },
        {
            header: 'Устройство',
            render: (req) => <span className="text-gray-900 dark:text-smartfix-lightest">{req.device}</span>
        },
        {
            header: 'Мастер',
            // Используем готовое поле technicianName из вашего типа
            render: (req) => <span className="text-gray-900 dark:text-smartfix-lightest"> {req.technicianName ? req.technicianName : 'Не назначен'}</span>
        },
        {
            header: 'Статус',
            // Берем лейблы напрямую из вашего файла типов
            render: (req) => <span className="text-gray-900 dark:text-smartfix-lightest">{RequestStatusLabels[req.status] || req.status}</span>
        },
        {
            header: 'Дата создания',
            render: (req) => <span className="text-gray-900 dark:text-smartfix-lightest">{new Date(req.createdAt).toLocaleDateString('ru-RU')}</span>
        },
        {
            header: 'Цена',
            render: (req) => <span className="text-gray-900 dark:text-smartfix-lightest">{req.price ? `${req.price.toLocaleString('ru-RU')} ₽` : '-'}</span>
        }
    ];

    return (
        <DataTable
            data={requests}
            columns={columns}
            isLoading={isLoading}
            rowKey={(req) => req.id}
            emptyMessage="Заявки не найдены"
        />
    );
};

export default RequestsTable;