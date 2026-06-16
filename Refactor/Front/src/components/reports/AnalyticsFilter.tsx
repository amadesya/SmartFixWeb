import React from "react";
import type { PresetId } from "@/hooks/useAnalyticsFilter";

interface AnalyticsFilterProps {
    presets: { id: PresetId; label: string }[];
    activePreset: PresetId | null;
    showCustom: boolean;
    customFrom: string;
    customTo: string;
    onPreset: (id: PresetId) => void;
    onToggleCustom: () => void;
    onCustomFromChange: (v: string) => void;
    onCustomToChange: (v: string) => void;
    onCustomApply: () => void;
}

const AnalyticsFilter: React.FC<AnalyticsFilterProps> = ({
    presets,
    activePreset,
    showCustom,
    customFrom,
    customTo,
    onPreset,
    onToggleCustom,
    onCustomFromChange,
    onCustomToChange,
    onCustomApply,
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex flex-wrap items-center gap-1">
                {presets.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => onPreset(p.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                            activePreset === p.id
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : "bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                        }`}
                    >
                        {p.label}
                    </button>
                ))}

                <button
                    onClick={onToggleCustom}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                        showCustom
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                    }`}
                >
                    Свой
                </button>
            </div>

            {showCustom && (
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={customFrom}
                        onChange={(e) => onCustomFromChange(e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-gray-400">–</span>
                    <input
                        type="date"
                        value={customTo}
                        onChange={(e) => onCustomToChange(e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                        onClick={onCustomApply}
                        disabled={!customFrom || !customTo}
                        className="px-3 py-1.5 text-xs font-semibold rounded-md border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Применить
                    </button>
                </div>
            )}
        </div>
    );
};

export default AnalyticsFilter;
