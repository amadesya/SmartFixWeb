interface StatCardProps {
    label: string;
    value: string | number; 
    valueColor?: string;
}

export const StatCard = ({ label, value, valueColor = "" }: StatCardProps) => (
    <div className="bg-gray-50 dark:bg-smartfix-darker p-4 rounded-lg">
        <p className="text-sm text-gray-500  dark:text-smartfix-light mb-1">{label}</p>
        <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
    </div>
);