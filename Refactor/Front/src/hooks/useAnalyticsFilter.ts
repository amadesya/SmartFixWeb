import { useState, useCallback, useEffect } from "react";

export type PresetId = "current-month" | "prev-month" | "current-quarter" | "year" | "all";

interface DateFilter {
    preset: PresetId | null;
    from: string;
    to: string;
}

const PRESETS: { id: PresetId; label: string }[] = [
    { id: "current-month", label: "Текущий месяц" },
    { id: "prev-month", label: "Прошлый месяц" },
    { id: "current-quarter", label: "Текущий квартал" },
    { id: "year", label: "Год" },
    { id: "all", label: "Всё время" },
];

function today(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// 1. Добавляем новую функцию для расчёта завтрашнего дня
function tomorrow(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// 2. Обновленная функция (замените вашу старую функцию getPresetRange этой)
function getPresetRange(preset: PresetId): { from: string; to: string } {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();

    switch (preset) {
        case "current-month": {
            const from = `${y}-${String(m + 1).padStart(2, "0")}-01`;
            const d = new Date(Date.UTC(y, m + 1, 1));
            const to = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
            return { from, to };
        }
        case "prev-month": {
            const d = new Date(Date.UTC(y, m - 1, 1));
            const from = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
            const d2 = new Date(Date.UTC(y, m, 1));
            const to = `${d2.getFullYear()}-${String(d2.getMonth() + 1).padStart(2, "0")}-01`;
            return { from, to };
        }
        case "current-quarter": {
            const q = Math.floor(m / 3) * 3;
            const d = new Date(Date.UTC(y, q, 1));
            const from = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
            const d2 = new Date(Date.UTC(y, q + 3, 1));
            const to = `${d2.getFullYear()}-${String(d2.getMonth() + 1).padStart(2, "0")}-01`;
            return { from, to };
        }
        case "year": {
            return { from: `${y}-01-01`, to: `${y + 1}-01-01` };
        }
        // Здесь мы исправили 'today()' на 'tomorrow()', чтобы захватывать сегодняшний день целиком
        default: {
            return { from: "2000-01-01", to: tomorrow() };
        }
    }
}

export function useAnalyticsFilter(onFetch: (from: string, to: string) => void) {
    const [dateFilter, setDateFilter] = useState<DateFilter>(() => {
        const range = getPresetRange("current-month");
        return { preset: "current-month", ...range };
    });

    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");
    const [showCustom, setShowCustom] = useState(false);

    const stableFetch = useCallback(onFetch, [onFetch]);

    useEffect(() => {
        stableFetch(dateFilter.from, dateFilter.to);
    }, [stableFetch, dateFilter.from, dateFilter.to]);

    const handlePreset = useCallback((preset: PresetId) => {
        setShowCustom(false);
        const range = getPresetRange(preset);
        setDateFilter({ preset, ...range });
    }, []);

    const handleCustomApply = useCallback(() => {
        if (!customFrom || !customTo) return;
        setDateFilter({ preset: null, from: customFrom, to: customTo });
    }, [customFrom, customTo]);

    return {
        PRESETS,
        dateFilter,
        customFrom,
        customTo,
        showCustom,
        setCustomFrom,
        setCustomTo,
        setShowCustom,
        handlePreset,
        handleCustomApply,
    };
}
