import { useState } from 'react';
import toast from 'react-hot-toast';

import { 
    updateRepairRequest, 
    createComment, 
    deleteComment, 
    getComments, 
    deleteRepairRequest, 
    updateComment, 
    createPayment, 
    updateRepairRequestPrice,
    repairRequestsApi,
    clientsApi,
    CommentDto
} from "../services/api";

import { 
    RepairRequest, 
    RequestStatus, 
    Role, 
    User
} from '../types';
import { useConfirmation } from './useConfirmation';

export const useRequestDetails = (
    id: number | undefined, 
    refreshList: (() => void | Promise<void>) | undefined, // Делаем опциональным
    user: any // Добавляем пользователя третьим аргументом
) => {
    // === СТЕЙТЫ МОДАЛКИ ===
    const [selectedRequest, setSelectedRequest] = useState<RepairRequest | null>(null);
    const [selectedTechnician, setSelectedTechnician] = useState<string>('');
    const [newStatus, setNewStatus] = useState<RequestStatus | ''>('');
    const [loading, setLoading] = useState(false);
    
    // === СТЕЙТЫ КОММЕНТАРИЕВ ===
    const [comments, setComments] = useState<CommentDto[]>([]); 
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editCommentText, setEditCommentText] = useState<string>("");
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    
    // === СТЕЙТЫ ЦЕНЫ И ОПЛАТЫ ===
    const [newPrice, setNewPrice] = useState<number | ''>('');
    const [isPriceSaving, setIsPriceSaving] = useState(false);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const [bonusesSubtracted, setBonusesSubtracted] = useState<number | ''>('');
    const [clientLoyalty, setClientLoyalty] = useState<any>(null);
    
    const { itemToDelete: requestToDelete, confirm: confirmDeleteReq, cancel: cancelDeleteReq } = useConfirmation<number>();

    // === ФУНКЦИИ УПРАВЛЕНИЯ МОДАЛКОЙ ===
    const openDetailsModal = async (request: any) => {
        setSelectedRequest(request);
        setNewStatus(request.status);
        setSelectedTechnician(request.technicianId?.toString() || '');
        setNewComment('');
        setNewPrice(request.price || '');
        setBonusesSubtracted('');
        setClientLoyalty(null);

        setIsLoadingComments(true);
        try {
            const fetchedComments = await getComments(request.id);
            setComments(fetchedComments || []);
        } catch (error) {
            console.error('Failed to load comments:', error);
            setComments([]);
        } finally {
            setIsLoadingComments(false);
        }

        // Подтягиваем профиль клиента для получения баланса бонусов и персональной скидки
        if (request.clientId) {
            try {
                const profile = await clientsApi.getProfile(request.clientId);
                setClientLoyalty(profile.loyalty);
            } catch (error) {
                console.error('Failed to fetch client loyalty:', error);
            }
        }
    };

    const closeDetailsModal = () => {
        setSelectedRequest(null);
        setNewComment('');
        setComments([]);
        setNewPrice('');
        setEditingCommentId(null);
        setBonusesSubtracted('');
        setClientLoyalty(null);
    };

    // === ЛОГИКА КОММЕНТАРИЕВ ===
    const fetchComments = async (requestId: number) => {
        setIsLoadingComments(true);
        try {
            const data = await getComments(requestId);
            setComments(data);
        } catch (error: any) {
            console.error("Ошибка при загрузке комментариев:", error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    // 1. В интерфейсе обработчиков (если он есть)
const handleDeleteComment = async (commentId: number) => {
    // 1. Сразу убираем из интерфейса (Оптимистично)
    const backupComments = [...comments]; // сохраняем на случай ошибки
    setComments(prev => prev.filter(c => c.id !== commentId));

    try {
        await deleteComment(commentId, user.id, user.role);
        // Если всё ок, ничего не делаем, он уже удален из стейта
    } catch (error: any) {
        // 2. Если реально произошла ошибка (не 404), возвращаем назад
        setComments(backupComments);
        toast.error("Не удалось удалить: " + error.message);
    }
};
    const submitUpdate = async (comment: any) => {
        if (!editCommentText.trim()) return;
        const updatedComment = { ...comment, text: editCommentText };
        
        try {
            await updateComment(comment.id, updatedComment);
            await fetchComments(updatedComment.repairRequestId);
            setEditingCommentId(null);
            setEditCommentText("");
        } catch (error) {
        toast.error(error instanceof Error ? "Ошибка при обновлении: " + error.message : "Произошла ошибка при обновлении");
        }
    };

    const submitNewComment = async () => {
        if (!newComment.trim() || !selectedRequest || !user) return;
        try {
            await createComment({
                repairRequestId: selectedRequest.id,
                text: newComment,
                userId: user.id
            });
            setNewComment("");
            await fetchComments(selectedRequest.id);
        } catch (error) {
        toast.error("Ошибка при отправке комментария");
        }
    };
const handleUpdateRequest = async () => {
    if (!selectedRequest || !user) return;

    // 1. Статус берем из стейта, если он пустой - оставляем старый
    const updatedStatus = newStatus || selectedRequest.status;

    // Если там undefined, запишем null
    let updatedTechnicianId: number | null = selectedRequest.technicianId ?? null;

    if (user.role === 2) { 
        // Если выбран вариант "Не назначен", передаем null, иначе - число
        updatedTechnicianId = selectedTechnician === "" ? null : Number(selectedTechnician);
    }

    try {
            // Если статус переходит в "Готово" и введены бонусы для списания
            if (updatedStatus === RequestStatus.Ready && bonusesSubtracted !== '') {
                await repairRequestsApi.completeRepair(
                    selectedRequest.id,
                    (selectedRequest as any).repairServices || [],
                    (selectedRequest as any).repairParts || [],
                    Number(bonusesSubtracted)
                );
                toast.success("Ремонт завершен, бонусы списаны");
            } else {
                const response = await updateRepairRequest(
                    selectedRequest.id, 
                    updatedTechnicianId, 
                    selectedRequest.device, 
                    selectedRequest.issueDescription, 
                    updatedStatus
                );

                if (response?.partsReturned) {
                    toast.success("Статус обновлен, запчасти возвращены на склад");
                } else {
                    toast.success("Заявка успешно обновлена");
                }
        }

        // Работа с комментариями
        if (newComment.trim()) {
            await createComment({ 
                repairRequestId: selectedRequest.id, 
                userId: user.id, 
                text: newComment.trim() 
            });
            const updatedComments = await getComments(selectedRequest.id);
            setComments(updatedComments || []);
            setNewComment('');
        }

        await refreshList?.();
        closeDetailsModal();
        } catch (error: any) {
        console.error("Failed to update request:", error);
            toast.error(error.message || "Не удалось обновить заявку. Попробуйте снова.");
    }
};

const handleAcceptRequest = async (requestToAccept: RepairRequest) => {
    // В логах теперь должно быть видно данные из аргумента
    console.log("User:", user?.id, "Request:", requestToAccept);

    // Обязательно проверяем именно requestToAccept!
    if (!requestToAccept || !user) return;

    try {
        setLoading(true); // Теперь это вызовет настоящий стейт, а не ошибку
        await updateRepairRequest(
            requestToAccept.id, // Используем ID из аргумента
            user.id,
            requestToAccept.device,
            requestToAccept.issueDescription,
            "InProgress"
        );
        
        await refreshList?.();
        // Если хочешь закрывать модалку сразу:
        // closeDetailsModal(); 
    } catch (error) {
        console.error(error);
        toast.error("Не удалось принять заявку");
    } finally {
        setLoading(false);
    }
};
    const handleDeleteRequest = () => {
        if (!selectedRequest || !user) return;

        // Проверка прав: удалять может только админ (роль 2) или владелец
        if (user.role !== 2 && selectedRequest.clientId !== user.id) {
            toast.error('У вас нет прав для удаления этой заявки');
            return;
        }

        confirmDeleteReq(selectedRequest.id);
    };

    const confirmDeleteRequestAction = async () => {
        if (!requestToDelete) return;
        try {
            await deleteRepairRequest(requestToDelete);
            toast.success('Заявка успешно удалена');
            closeDetailsModal();
            await refreshList?.();
        } catch (error: any) {
            console.error("Failed to delete request:", error);
            if (error?.status === 404 || error?.message?.includes("404")) {
                toast.success('Заявка уже была удалена');
                closeDetailsModal();
                await refreshList?.();
            } else {
                toast.error("Не удалось удалить заявку.");
            }
        } finally {
            cancelDeleteReq();
        }
    };

    // === ФИНАНСЫ И ЦЕНА ===
    const handlePriceUpdate = async () => {
        if (!selectedRequest || newPrice === '' || Number(newPrice) < 0) {
            toast.error('Пожалуйста, укажите корректную цену');
            return;
        }

        setIsPriceSaving(true);
        try {
            await updateRepairRequestPrice(selectedRequest.id, Number(newPrice));
            setSelectedRequest({ ...selectedRequest, price: Number(newPrice) });
            await refreshList?.();
            toast.success('Цена успешно установлена');
            setNewPrice('');
        } catch (error) {
            console.error("Failed to update price:", error);
            toast.error("Не удалось установить цену.");
        } finally {
            setIsPriceSaving(false);
        }
    };

    const handlePayment = async (id: number) => {
        if (!id) return;
        setIsPaymentLoading(true);
        try {
            const response = await createPayment(Number(id));
            if (response && response.url) {
                window.location.href = response.url;
            } else {
                toast.error("Не удалось получить ссылку");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ошибка: мастер еще не установил стоимость или произошел сбой");
        } finally {
            setIsPaymentLoading(false);
        }
    };

    // Собираем все пропсы, которые нужны для компонента RequestDetailsModal
    const modalProps = {
        selectedRequest,
        closeDetailsModal,
        user,
        isLoadingComments,
        comments,
        editingCommentId,
        setEditingCommentId,
        editCommentText,
        setEditCommentText,
        submitUpdate,
        handleDeleteComment,
        newComment,
        setNewComment,
        submitNewComment,
        newPrice,
        setNewPrice,
        handlePriceUpdate,
        isPriceSaving,
        selectedTechnician,
        setSelectedTechnician,
        newStatus,
        setNewStatus,
        handleDeleteRequest,
        handlePayment,
        isPaymentLoading,
        handleUpdateRequest,
        handleAcceptRequest,
        requestToDelete,
        confirmDeleteRequestAction,
        cancelDeleteReq,
        bonusesSubtracted,
        setBonusesSubtracted,
        clientLoyalty
    };

    return {
        selectedRequest,
        openDetailsModal,
        closeDetailsModal,
        handleAcceptRequest,
        modalProps
    };
};
