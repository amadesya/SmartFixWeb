import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, useAuth } from '@/components/auth/AuthContext';
import { RepairRequest, Role } from '../types';
import Calendar from '../components/ui/Calendar';
import Modal from '../components/ui/Modal';
import StatusBadge from '../components/ui/StatusBadge';
import { getTechnicianRequests } from '../services/api';
import RequestDetailsModal from '@/components/requestsDetail/RequestDetailsModal';
import { useRequestDetails } from '@/hooks/useRequestDetails';
import { useRequestsData } from '@/hooks/useRequestsData';

const SchedulePage: React.FC = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState<RepairRequest[]>([]);

    // Достаем данные из хуков
    const { technicians, isLoading, refresh } = useRequestsData(user);
    const {
        selectedRequest,
        openDetailsModal, // Используем эту функцию для выбора заявки
        modalProps
    } = useRequestDetails(undefined, refresh, user);

    useEffect(() => {
        const fetchRequests = async () => {
            if (!user?.id) return;

            try {
                // Если isLoading управляется внутри useRequestsData, 
                // ручной вызов setIsLoading здесь не нужен и вызовет ошибку.
                const data = await getTechnicianRequests(user.id, "all");
                setRequests(data);
            } catch (error) {
                console.error("Failed to load technician requests:", error);
            }
        };

        fetchRequests();
    }, [user]);

    return (
        <div>
            <h2 className="text-4xl font-bold text-black dark:text-smartfix-lightest mb-8">Мой календарь заявок</h2>
            <div className="max-w-5xl mx-auto">
                {isLoading ? (
                    <p className="text-center text-smartfix-light">Загрузка календаря...</p>
                ) : (
                    /* ИСПРАВЛЕНО: используем openDetailsModal вместо несуществующего setSelectedRequest */
                    <Calendar requests={requests} onSelectRequest={openDetailsModal} />
                )}
            </div>

            {selectedRequest && (
                <RequestDetailsModal
                    {...modalProps}
                    technicians={technicians}
                    refreshList={refresh}
                    actions={{
                        submitNewComment: modalProps.submitNewComment,
                        submitUpdateComment: modalProps.submitUpdate,
                        handleDeleteComment: modalProps.handleDeleteComment,
                        handlePriceUpdate: modalProps.handlePriceUpdate,
                        handleDeleteRequest: modalProps.handleDeleteRequest,
                        handlePayment: modalProps.handlePayment,
                        handleUpdateRequest: modalProps.handleUpdateRequest,
                    }}
                />
            )}
        </div>
    );
};
export default SchedulePage;
