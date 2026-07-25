import React, { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import StatusBadge from '@/components/ui/StatusBadge';
import { Role, RepairRequest, User, CommentDto } from '@/types';

import PriceEditor from '../requestsDetail/PriceEditor';
import CommentSection from '../requestsDetail/CommentSection';
import AdminControls from './AdminControls';
import RequestInfoSection from './RequestInfoSection';
import ReviewModal from './ReviewModal';
import { Tabs } from '../ui/Tabs';
import { createPayment, repairRequestsApi, clientsApi } from '../../services/api';
import { useRequestDetails } from '@/hooks/useRequestDetails';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import toast from 'react-hot-toast';

interface RequestDetailsModalProps {
    selectedRequest: RepairRequest | null;
    closeDetailsModal: () => void;
    user: User;
    technicians: User[];
    [key: string]: any;
    refreshList: () => void;
}

const RequestDetailsModal: React.FC<RequestDetailsModalProps> = (props) => {
    const {
        selectedRequest,
        closeDetailsModal,
        user,
        technicians,
        comments,
        isLoadingComments,
        newComment,
        setNewComment,
        submitNewComment,
        isPaymentLoading,
        handleDeleteRequest,
        handleUpdateRequest,
        refreshList,
        requestToDelete,
        confirmDeleteRequestAction,
        cancelDeleteReq,
        clientLoyalty,
        setClientLoyalty,
        handleApplyBonuses,
        bonusesSubtracted,
        setBonusesSubtracted
    } = props;
    const [request, setRequest] = useState<RepairRequest | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [useBonuses, setUseBonuses] = useState(false);
    const [clientBonusesToSubtract, setClientBonusesToSubtract] = useState<number | ''>('');


    const fetchRequest = async () => {
        if (!selectedRequest?.id || requestToDelete === selectedRequest?.id) return;
        try {
            const data = await repairRequestsApi.getById(selectedRequest.id);
            setRequest(data);
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        }
    };

    useEffect(() => {
        if (selectedRequest?.id && requestToDelete !== selectedRequest?.id) {
            fetchRequest();
        }
    }, [selectedRequest?.id, requestToDelete]);


    const [activeTab, setActiveTab] = useState<string | number>('overview');

    const isAdmin = user?.role === Role.Admin;
    const isStaff = isAdmin || user?.role === Role.Technician;
    const isClient = user?.role === Role.Client;

    const tabOptions = [
        { id: 'overview', label: 'Обзор' },
        { id: 'chat', label: 'Обсуждение' },
        { id: 'finance', label: 'Оплата' },
        ...(isStaff ? [{ id: 'manage', label: 'Управление' }] : []),
    ];

    const [isPaying, setIsPaying] = useState(false);

    const handlePayment = async () => {
        if (!selectedRequest?.id) return;

        setIsPaying(true);
        try {
            const bonuses = (useBonuses && clientBonusesToSubtract) ? Number(clientBonusesToSubtract) : 0;

            // Передаем id и бонусы в API создания платежа
            const paymentData = await createPayment(selectedRequest.id, bonuses);

            if (paymentData && paymentData.url) {
                window.location.href = paymentData.url;
            } else {
                toast.error("Платеж создан, но ссылка на оплату не получена.");
            }
        } catch (error: any) {
            console.error("Ошибка при оплате:", error);
            toast.error(error.message || "Не удалось инициализировать платеж");
        } finally {
            setIsPaying(false);
        }
    };

    // Обёртка для исправления бага с выбором "Не назначен" в AdminControls
    const handleSetSelectedTechnician = (value: string | number | null) => {
        const numValue = Number(value);
        if (!value || numValue === 0) {
            props.setSelectedTechnician(null);
        } else {
            props.setSelectedTechnician(numValue);
        }
    };

    const { handleAcceptRequest: handleAcceptRequestFromHook } = useRequestDetails(selectedRequest?.id, refreshList, user);

    const handleAcceptRequest = async (req: RepairRequest) => {
        await handleAcceptRequestFromHook(req);
        await fetchRequest();
        closeDetailsModal();
    };

    if (!selectedRequest) return null;

    const receiptServicesTotal = request?.repairServices?.reduce((sum: number, s: any) => sum + (s.priceAtTheTime ?? 0), 0) ?? 0;
    const receiptPartsTotal = request?.repairParts?.reduce((sum: number, p: any) => sum + (p.priceAtTheTime ?? 0), 0) ?? 0;
    const itemsTotal = receiptServicesTotal + receiptPartsTotal;
    const discountPercent = clientLoyalty?.discountPercent ?? 0;
    const dbPrice = request?.price ?? selectedRequest.price ?? 0;
    const calculatedPrice = itemsTotal > 0
        ? Math.round(itemsTotal * (1 - discountPercent / 100))
        : 0;
    const actualPrice = dbPrice > 0 ? dbPrice : calculatedPrice;

    const displayedPrice = (useBonuses && clientBonusesToSubtract)
        ? Math.max(0, actualPrice - Number(clientBonusesToSubtract))
        : actualPrice;

    return (
        <Modal
            isOpen={!!selectedRequest}
            onClose={closeDetailsModal}
            title={`Заявка #${selectedRequest.id} — ${selectedRequest.device}`}
        >
            <div className="flex flex-col h-[600px]">

                <div className="pr-2">
                    <Tabs
                        options={tabOptions}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {activeTab === 'overview' && (
                        <div className="animate-in fade-in duration-200">
                            <RequestInfoSection
                                request={request || selectedRequest}
                                onRefresh={fetchRequest}
                                handleAcceptRequest={handleAcceptRequest}
                                isClient={isClient}
                                isAdmin={isAdmin}
                                onAssignTechnicianClick={() => setActiveTab('manage')}
                                onLeaveReview={() => setIsReviewModalOpen(true)}
                            />
                        </div>
                    )}

                    {activeTab === 'finance' && (
                        <div className="animate-in fade-in duration-200 space-y-4">
                            {isClient && !(request?.isPaid ?? selectedRequest.isPaid) && clientLoyalty && clientLoyalty.bonusPoints > 0 && (
                                <div className="p-4 bg-emerald-50 dark:bg-smartfix-dark border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={useBonuses}
                                                onChange={(e) => {
                                                    setUseBonuses(e.target.checked);
                                                    if (!e.target.checked) setClientBonusesToSubtract('');
                                                }}
                                                className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                                                Списать бонусы
                                            </span>
                                        </label>
                                        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                                            Доступно для списания: {clientLoyalty.bonusPoints} ₽
                                        </span>
                                    </div>

                                    {useBonuses && (
                                        <div className="animate-in slide-in-from-top-2 duration-200 mt-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={Math.min(clientLoyalty.bonusPoints, actualPrice)}
                                                    value={clientBonusesToSubtract}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        const maxAllowed = Math.min(clientLoyalty.bonusPoints, actualPrice);
                                                        if (val > maxAllowed) {
                                                            setClientBonusesToSubtract(maxAllowed);
                                                        } else {
                                                            setClientBonusesToSubtract(val || '');
                                                        }
                                                    }}
                                                    className="flex-1 p-2.5 border border-emerald-200 dark:border-emerald-800 rounded-lg bg-white dark:bg-smartfix-darker text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                                                    placeholder="Количество баллов"
                                                />
                                                <button
                                                    onClick={async () => {
                                                        if (!selectedRequest?.id || !clientBonusesToSubtract || clientBonusesToSubtract <= 0) return;
                                                        try {
                                                            const result = await repairRequestsApi.applyBonusesToRequest(
                                                                selectedRequest.id,
                                                                Number(clientBonusesToSubtract)
                                                            );
                                                            toast.success("Бонусы списаны");
                                                            setUseBonuses(false);
                                                            setClientBonusesToSubtract('');
                                                            if (selectedRequest.clientId) {
                                                                const profile = await clientsApi.getProfile(selectedRequest.clientId);
                                                                setClientLoyalty(profile.loyalty);
                                                            }
                                                            setRequest(prev =>
                                                                prev && prev.id === selectedRequest.id
                                                                    ? { ...prev, price: result.price }
                                                                    : prev
                                                            );
                                                            await fetchRequest();
                                                            refreshList();
                                                        } catch (error: any) {
                                                            toast.error(error?.message || "Ошибка при списании бонусов");
                                                        }
                                                    }}
                                                    disabled={!clientBonusesToSubtract || clientBonusesToSubtract <= 0}
                                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-lg disabled:opacity-50 transition-colors text-sm whitespace-nowrap"
                                                >
                                                    Списать
                                                </button>
                                            </div>
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                                                Бонусы будут списаны сразу после нажатия кнопки.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {isStaff && !(request?.isPaid ?? selectedRequest.isPaid) && (
                                <div className="p-4 bg-blue-50 dark:bg-smartfix-dark border border-blue-100 dark:border-blue-900/30 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                            Списать бонусы клиента (админ/мастер)
                                        </label>
                                        <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                                            Доступно: {clientLoyalty?.bonusPoints || 0}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            max={clientLoyalty?.bonusPoints || 0}
                                            placeholder="Сумма к списанию"
                                            value={bonusesSubtracted}
                                            onChange={(e) => setBonusesSubtracted(e.target.value ? Number(e.target.value) : '')}
                                            className="flex-1 p-2 border border-blue-200 dark:border-blue-800 rounded-lg bg-white dark:bg-smartfix-darker text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                        <button
                                            onClick={async () => {
                                                const id = selectedRequest?.id || request?.id;
                                                if (!id) return;
                                                await handleApplyBonuses(id);
                                                await fetchRequest();
                                            }}
                                            disabled={!bonusesSubtracted || bonusesSubtracted <= 0}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-lg disabled:opacity-50 transition-colors text-sm whitespace-nowrap"
                                        >
                                            Списать
                                        </button>
                                    </div>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                                        Бонусы будут списаны сразу после нажатия кнопки.
                                    </p>
                                </div>
                            )}

                            <PriceEditor
                                price={displayedPrice}
                                canEdit={isStaff}

                                canPay={user?.role === 0 && !(request?.isPaid ?? selectedRequest.isPaid)}
                                onPay={handlePayment}
                                isPaying={isPaying}
                                onRefresh={fetchRequest}
                                request={request || selectedRequest}
                                discountPercent={clientLoyalty?.discountPercent}
                            />
                        </div>
                    )}

                    {activeTab === 'chat' && (
                        <div className="flex flex-col h-full max-h-[60vh] md:max-h-[70vh] animate-in fade-in duration-200">

                            {/* Список сообщений забирает всё пространство и имеет свой скролл */}
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-4">
                                <CommentSection
                                    comments={props.comments}
                                    user={user}
                                    isLoading={props.isLoadingComments}
                                    editingId={props.editingCommentId}
                                    setEditingId={props.setEditingCommentId}
                                    editText={props.editCommentText}
                                    setEditText={props.setEditCommentText}
                                    onUpdate={props.submitUpdate}
                                    onDelete={props.handleDeleteComment}
                                />
                            </div>

                            {/* Поле ввода всегда зафиксировано внизу контейнера */}
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-smartfix-medium/10">
                                <div className="flex flex-col gap-2">
                                    <textarea
                                        value={props.newComment}
                                        onChange={e => props.setNewComment(e.target.value)}
                                        placeholder="Напишите сообщение..."
                                        rows={2}
                                        className="w-full bg-gray-50 dark:bg-smartfix-darker p-3 rounded-lg border border-gray-200 dark:border-smartfix-medium text-gray-900 dark:text-smartfix-lightest focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light/30 outline-none transition-all text-sm resize-none"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            onClick={props.submitNewComment}
                                            disabled={!props.newComment.trim()}
                                            className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg disabled:opacity-50 transition-colors text-sm"
                                        >
                                            Отправить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'manage' && isStaff && (
                        <div className="animate-in slide-in-from-right-2 duration-200">
                            <AdminControls
                                isAdmin={isAdmin}
                                technicians={props.technicians}
                                selectedTechnician={props.selectedTechnician}
                                setSelectedTechnician={handleSetSelectedTechnician}
                                newStatus={props.newStatus}
                                setNewStatus={props.setNewStatus}
                                onSave={handleUpdateRequest}
                                onDelete={handleDeleteRequest}
                            />
                        </div>
                    )}
                </div>

                {/* Модальное окно для отзыва */}
                {isReviewModalOpen && selectedRequest && user && (
                    <ReviewModal
                        isOpen={isReviewModalOpen}
                        onClose={() => setIsReviewModalOpen(false)}
                        requestId={selectedRequest.id}
                        userId={user.id}
                        onSuccess={() => {
                            fetchRequest(); // Обновляем данные текущей заявки, чтобы исчезла кнопка
                            refreshList();  // Обновляем список на фоне
                        }}
                    />
                )}
            </div>

            <ConfirmationModal
                isOpen={requestToDelete !== null}
                title="Удаление заявки"
                message={`Вы уверены, что хотите удалить заявку #${selectedRequest.id}? Это действие невозможно отменить.`}
                onConfirm={confirmDeleteRequestAction}
                onCancel={cancelDeleteReq}
            />
        </Modal>
    );
};

const InfoBlock = ({ label, value }: { label: string, value: string }) => (
    <div>
        <span className="info-label text-gray-500 dark:text-smartfix-light/70">{label}</span>
        <p className="text-gray-900 dark:text-smartfix-lightest font-medium mt-0.5">{value}</p>
    </div>
);

const CommentInput = ({ value, onChange, onSubmit }: { value: string, onChange: (v: string) => void, onSubmit: () => void }) => (
    <div className="mt-4 flex flex-col gap-2">
        <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Напишите сообщение..."
            rows={2}
            className="w-full bg-gray-50 dark:bg-smartfix-darker p-3 rounded-lg border border-gray-200 dark:border-smartfix-medium text-gray-900 dark:text-smartfix-lightest focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light/30 outline-none transition-all text-sm"
        />
        <div className="flex justify-end">
            <button
                onClick={onSubmit}
                disabled={!value.trim()}
                className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg disabled:opacity-50 transition-colors text-sm"
            >
                Отправить
            </button>
        </div>
    </div>
);

export default RequestDetailsModal;