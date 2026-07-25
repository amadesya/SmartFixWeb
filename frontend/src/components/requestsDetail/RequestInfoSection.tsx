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

const RequestInfoSection: React.FC<RequestInfoSectionProps> = ({
    request,
    onRefresh,
    handleAcceptRequest,
    isClient,
    isAdmin,
    onAssignTechnicianClick,
    onLeaveReview
}) => {
    const [allServices, setAllServices] = useState<Service[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const isCompleted = request.status === 'Ready';
    const canLeaveReview = isClient && isCompleted && !request.hasReview;

    // Выносим рейтинг для удобства чтения
    const rating = (request as any).reviewRating || 5;

    return (
        <section>
            <div className="info-section-grid">
                <InfoBlock label="Клиент" value={request.clientName} />
                <InfoBlock label="Устройство" value={request.device} />
                <InfoBlock label="Мастер" value={request.technicianName || 'Не назначен'} />

                <div>
                    <span className="info-block-label">Статус</span>
                    <div className="mt-1">
                        <StatusBadge status={request.status} />
                    </div>
                </div>

                <div className="md:col-span-2 pt-2">
                    <span className="info-block-label">Описание проблемы</span>
                    <p className="info-block-value">{request.issueDescription}</p>
                </div>
            </div>

            {/* Блок действий под карточкой */}
            <div className="mt-4 flex gap-3">
                {/* Кнопка "Принять в работу / Назначить мастера" */}
                {!isClient && !request.technicianId && request.status === "New" && (
                    <button
                        onClick={isAdmin ? onAssignTechnicianClick : () => handleAcceptRequest(request)}
                        disabled={loading}
                        className="btn-action-accept"
                    >
                        {loading ? 'Обработка...' : (isAdmin ? 'Назначить мастера' : 'Принять заявку')}
                    </button>
                )}

                {/* Кнопка "Оставить отзыв" */}
                {canLeaveReview && (
                    <button onClick={onLeaveReview} className="btn-action-review">
                        Оценить работу мастера
                    </button>
                )}

                {/* Отображение уже оставленного отзыва */}
                {isClient && isCompleted && request.hasReview && (
                    <div className="review-display-container">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">✅ Ваш отзыв</span>
                            <span className="text-yellow-400 tracking-widest text-sm drop-shadow-md">
                                {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                            </span>
                        </div>
                        {(request as any).reviewBody && (
                            <p className="text-xs text-gray-600 dark:text-smartfix-lightest italic">
                                «{(request as any).reviewBody}»
                            </p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

// Стилизованный InfoBlock
const InfoBlock = ({ label, value }: { label: string; value: string }) => (
    <div>
        <span className="info-block-label">{label}</span>
        <p className="info-block-value">{value}</p>
    </div>
);

export default RequestInfoSection;