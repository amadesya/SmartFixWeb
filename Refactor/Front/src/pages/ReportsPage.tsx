import React, { useRef, useMemo } from "react";
import { RequestStatus } from "../types";
import { PageHeader } from "@/components/ui/PageHeader";
import RequestsTable from "@/components/requests/RequestsTable";
import RequestsStats from "@/components/requests/RequestsStats";

import { useReportsData } from "../hooks/useReportsData";
import { useImportExport } from "../hooks/useImportExport";
import { PrintableReport } from "@/components/reports/PrintableReport";
import ReportsView from "@/components/reports/ReportsView";

const STATUS_LABELS: Record<RequestStatus, string> = {
  [RequestStatus.New]: "Новая",
  [RequestStatus.InProgress]: "В работе",
  [RequestStatus.Ready]: "Готова",
  [RequestStatus.Closed]: "Закрыта",
  [RequestStatus.Rejected]: "Отклонена",
};

const ReportsPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { requests, technicians, isLoading, refresh } = useReportsData();

  const {
    handleExportJSON,
    handleExportCSV,
    handleImport,
    message,
    isProcessing,
  } = useImportExport(requests, technicians, refresh);

  // 3. Оптимизированные вычисления статистики (useMemo)
  const stats = useMemo(() => {
    return requests.reduce(
      (acc, req) => {
        acc[req.status] = (acc[req.status] || 0) + 1;
        return acc;
      },
      {} as Record<RequestStatus, number>,
    );
  }, [requests]);

  // Конфигурация кнопок в шапке
  const headerActions = [
    { label: "Импорт", onClick: () => fileInputRef.current?.click() },
    { label: "Экспорт JSON", onClick: handleExportJSON },
    { label: "Экспорт CSV", onClick: () => handleExportCSV(STATUS_LABELS) },
    { label: "Печать", onClick: () => window.print() },
  ];

  return (
      <div >
        <div className="print:hidden">
        <PageHeader title="Отчёты и аналитика" actions={headerActions} />

        {message && (
            <div
            className={`print:hidden mb-6 p-4 rounded-lg border animate-in fade-in duration-300 ${
                message.type === "success"
                ? "bg-green-500/10 border-green-500/50 text-green-200"
                : "bg-red-500/10 border-red-500/50 text-red-200"
            }`}
            >
            <span className="font-bold">
                {message.type === "success" ? "✓ Успех: " : "⚠ Ошибка: "}
            </span>
            {message.text}
            </div>
        )}

        <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
            className="hidden"
            accept=".json,.csv"
        />

            <ReportsView />

            {/* Секция таблицы с оверлеем загрузки */}
              <div className="mt-8 border-gray-200 dark:border-white/5 rounded-xl overflow-hidden relative">
            {(isLoading || isProcessing) && (
                <div className="absolute inset-0 bg-white/40 dark:bg-smartfix-dark/40 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-smartfix-blue border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Загрузка данных...</span>
                </div>
                </div>
            )}
            
            <RequestsTable requests={requests} isLoading={isLoading} />
            </div>
        </div>

         <PrintableReport requests={requests} statusLabels={STATUS_LABELS} />

          <style dangerouslySetInnerHTML={{
              __html: `
                @media print {
                    body > *:not(.print\:block) {
                        display: none !important;
                    }

                    header, footer, nav, aside {
                        display: none !important;
                    }

                    .print\:block {
                        display: block !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        background: white;
                        z-index: 9999;
                    }
                    
                    body {
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                }
            `}} />
        </div>
  );
};

export default ReportsPage;
