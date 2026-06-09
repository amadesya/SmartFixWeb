import React, { useEffect, useState } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import { RepairRequest, RequestStatus, Service } from '@/types';
import { servicesApi, repairRequestsApi } from '@/services/api';

interface RequestInfoSectionProps {
    request: RepairRequest;
    onRefresh: () => void;
    handleAcceptRequest: (requestToAccept: RepairRequest) => Promise<void>;
    isClient?: boolean;
    isAdmin?: boolean;
    onAssignTechnicianClick?: () => void;
    onLeaveReview?: () => void;
}

const RequestInfoSection: React.FC<RequestInfoSectionProps> = ({ request, onRefresh, handleAcceptRequest, isClient, isAdmin, onAssignTechnicianClick, onLeaveReview }) => {
    const [allServices, setAllServices] = useState<Service[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const isCompleted = request.status === 'Ready';
    const canLeaveReview = isClient && isCompleted && !request.hasReview;

    return (
        <section>
            <div className="grid grid-cols-1 rounded-xl border border-smartfix-medium/20 shadow-xl md:grid-cols-2 gap-4 p-4">
                <InfoBlock label="Клиент" value={request.clientName} />
                <InfoBlock label="Устройство" value={request.device} />
                <InfoBlock label="Мастер" value={request.technicianName || 'Не назначен'} />

                <div>
                    <span className="info-label text-gray-400 dark:text-smartfix-light/70 text-xs font-bold uppercase tracking-wider">Статус</span>
                    <div className="mt-1">
                        <StatusBadge status={request.status} />
                    </div>
                </div>

                <div className="md:col-span-2 pt-2">
                    <span className="info-label text-gray-400 dark:text-smartfix-light/70 text-xs font-bold uppercase tracking-wider">Описание проблемы</span>
                    <p className="text-gray-900 dark:text-smartfix-lightest font-medium mt-0.5">
                        {request.issueDescription}
                    </p>
                </div>



            </div>
            {/* Размещаем кнопку под описанием проблемы или рядом с кнопкой обновления */}
            <div className="mt-4 flex gap-3">
                {/* Кнопка "Принять в работу" видна только если мастер не назначен */}
                {!isClient && !request.technicianId && request.status === "New" && (
                    <button
                        onClick={isAdmin ? onAssignTechnicianClick : () => handleAcceptRequest(request)}
                        disabled={loading}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-lg font-bold transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Обработка...' : (isAdmin ? 'Назначить мастера' : 'Принять заявку')}
                    </button>
                )}

                {/* Кнопка "Оставить отзыв" для клиента */}
                {canLeaveReview && (
                    <button
                        onClick={onLeaveReview}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg font-bold transition-colors shadow-lg shadow-blue-900/20"
                    >
                        Оценить работу мастера
                    </button>
                )}

                {/* Сообщение, если отзыв уже оставлен */}
                {isClient && isCompleted && request.hasReview && (
                    <div className="flex-1 dark:bg-smartfix-darker border border-emerald-500/30 py-3 px-4 rounded-lg flex flex-col gap-2 justify-center">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">✅ Ваш отзыв</span>
                            <span className="text-yellow-400 tracking-widest text-sm drop-shadow-md">
                                {'★'.repeat((request as any).reviewRating || 5)}{'☆'.repeat(5 - ((request as any).reviewRating || 5))}
                            </span>
                        </div>
                        {(request as any).reviewBody && (
                            <p className="text-xs text-gray-600 dark:text-smartfix-lightest italic">«{(request as any).reviewBody}»</p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

const InfoBlock = ({ label, value }: { label: string; value: string }) => (
    <div>
        <span className="info-label text-gray-500 dark:text-smartfix-light/70 text-xs font-bold uppercase tracking-wider">{label}</span>
        <p className="text-gray-900 dark:text-smartfix-lightest font-medium mt-0.5">{value}</p>
    </div>
);

export default RequestInfoSection;