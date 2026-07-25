import { useState } from "react";
import { RepairRequest, RequestStatus } from "../types";
import { importRepairRequests } from "../services/api"; 

export const useImportExport = (
    requests: RepairRequest[], 
    technicians: { id: number; name: string }[],
    onSuccess?: () => void
) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Вспомогательная функция для скачивания
    const download = (content: string, fileName: string, contentType: string) => {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportJSON = () => {
        const dataStr = JSON.stringify(requests, null, 2);
        download(dataStr, `report-${new Date().toISOString().split('T')[0]}.json`, "application/json");
    };

    const handleExportCSV = (statusLabels: Record<RequestStatus, string>) => {
        const headers = ["ID", "Клиент", "Устройство", "Мастер", "Статус", "Дата"];
        const rows = requests.map(req => {
            const tech = technicians.find(t => t.id === req.technicianId)?.name || "Не назначен";
            return [
                req.id,
                `"${req.clientName}"`,
                `"${req.device}"`,
                `"${tech}"`,
                statusLabels[req.status],
                new Date(req.createdAt).toLocaleDateString("ru-RU")
            ].join(",");
        });

        download([headers.join(","), ...rows].join("\n"), "report.csv", "text/csv;charset=utf-8;");
    };

    const handleImport = async (file: File) => {
        setIsProcessing(true);
        setMessage(null);

        try {
            const text = await file.text();
            let data: any[];

            if (file.name.endsWith(".json")) {
                data = JSON.parse(text);
            } else if (file.name.endsWith(".csv")) {
                const lines = text.split("\n").filter(l => l.trim());
                const headers = lines[0].split(",").map(h => h.trim());
                data = lines.slice(1).map(line => {
                    const values = line.split(",");
                    return headers.reduce((obj, h, i) => ({ ...obj, [h]: values[i] }), {});
                });
            } else {
                throw new Error("Неверный формат файла");
            }

            const result = await importRepairRequests(data);
            setMessage({ 
                type: 'success', 
                text: `Импортировано: ${result.imported}. Ошибок: ${result.errors.length}` 
            });
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || "Ошибка импорта" });
        } finally {
            setIsProcessing(false);
        }
    };

    return { handleExportJSON, handleExportCSV, handleImport, isProcessing, message };
};