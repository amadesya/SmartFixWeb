import React, { ReactNode, useState, useEffect } from 'react';
import { Pagination } from '@/components/ui/Pagination';

export interface Column<T> {
    header: string;
    render: (item: T) => ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading: boolean;
    rowKey: (item: T) => string | number;
    emptyMessage?: string;
    pageSize?: number;
}

function DataTable<T>({
    data,
    columns,
    isLoading,
    rowKey,
    emptyMessage = "Данные не найдены",
    pageSize = 0
}: DataTableProps<T>) {
    const [page, setPage] = useState(1);
    const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(data.length / pageSize)) : 1;
    const displayData = pageSize > 0 ? data.slice((page - 1) * pageSize, page * pageSize) : data;

    useEffect(() => {
        setPage(1);
    }, [data.length]);

    if (isLoading) {
        return <div className="text-center text-gray-500 dark:text-smartfix-light py-12 font-medium">Загрузка...</div>;
    }

    return (
        <div className="bg-white dark:bg-smartfix-darker rounded-2xl shadow-sm border border-gray-200 dark:border-smartfix-dark overflow-hidden transition-colors">
            <div className="p-4 md:p-0 overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="hidden md:table-header-group bg-gray-50 dark:bg-smartfix-dark border-b border-gray-200 dark:border-smartfix-dark/50">
                        <tr className="md:table-row">
                            {columns.map((col, idx) => {
                                const isActions = idx === columns.length - 1;
                                return (
                                    <th
                                        key={idx}
                                        className={`p-4 text-sm font-semibold text-gray-600 dark:text-smartfix-light ${
                                            isActions ? 'w-1 whitespace-nowrap md:text-right' : ''
                                            } ${col.className || ''}`}
                                    >
                                        {col.header}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody className="block md:table-row-group md:divide-y divide-gray-200 dark:divide-smartfix-dark space-y-4 md:space-y-0">
                        {displayData.length > 0 ? (
                            displayData.map((item) => (
                                <tr
                                    key={rowKey(item)}
                                    className="block md:table-row bg-white dark:bg-transparent border border-gray-200 dark:border-none rounded-xl md:rounded-none hover:bg-gray-50 dark:hover:bg-smartfix-dark transition-colors overflow-hidden"
                                >
                                    {columns.map((col, idx) => {
                                        const isActions = idx === columns.length - 1;
                                        return (
                                            <td
                                                key={idx}
                                                className={`flex flex-col md:table-cell p-4 border-b border-gray-100 dark:border-smartfix-dark/50 md:border-none last:border-b-0 gap-1 md:gap-0 align-middle ${isActions ? 'md:w-1 md:whitespace-nowrap' : ''
                                                    }`}
                                            >
                                                <span className="md:hidden text-xs font-semibold text-gray-500 dark:text-smartfix-light dark:opacity-60 uppercase tracking-wider mb-2">
                                                    {col.header}
                                                </span>

                                                <div className={`text-sm md:text-base ${isActions ? 'flex flex-wrap md:flex-nowrap items-center gap-2 md:justify-end md:min-w-max' : ''
                                                    } ${col.className || ''}`}>
                                                    {col.render(item)}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        ) : (
                            <tr className="block md:table-row">
                                <td colSpan={columns.length} className="block md:table-cell p-8 text-center text-gray-500 dark:text-smartfix-light font-medium">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {pageSize > 0 && (
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            )}
        </div>
    );
}

export default DataTable;