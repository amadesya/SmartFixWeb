import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Service, ServiceDto, Role } from '../types';
import { useAuth } from '@/hooks/useAuth';
import { servicesApi, clientsApi } from '../services/api';
import ServiceModal from '../components/services/ServiceModal';
import { PageHeader } from '@/components/ui/PageHeader';
import ServiceItem from '../components/services/ServiceItem';
import ServiceCard from '@/components/services/ServiceCard';
import { Search } from '@/components/ui/Search';
import { getFullAvatarUrl } from '@/utils/avatarHelper';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import toast from 'react-hot-toast';

const ServicesPage: React.FC = () => {
    const { user } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newServiceName, setNewServiceName] = useState('');
    const [newServiceImageUrl, setNewServiceImageUrl] = useState('');
    const [newServiceDesc, setNewServiceDesc] = useState('');
    const [newServicePrice, setNewServicePrice] = useState('');
    const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [discount, setDiscount] = useState(user?.personalDiscount || 0);

    const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user?.id && user.role === Role.Client) {
            clientsApi.getProfile(user.id)
                .then(data => setDiscount(data.loyalty.discountPercent))
                .catch(console.error);
        }
    }, [user]);

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const data = await servicesApi.getAll();
            const mappedServices = data.map((s: Service) => ({
                ...s,
                imageUrl: getFullAvatarUrl(s.imageUrl) || ''
            }));
            setServices(mappedServices);
        } catch (error) {
            console.error("Failed to fetch services:", error);
            toast.error("Не удалось загрузить список услуг. Попробуйте позже.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const filteredServices = useMemo(() => {
        const search = searchQuery.toLowerCase().trim();

        return services.filter(service => {
            if (!search) return true;

            return (
                service.name.toLowerCase().includes(search) ||
                service.description?.toLowerCase().includes(search) ||
                service.id.toString() === search
            );
        });
    }, [services, searchQuery]);

    const handleOpenAddModal = () => {
        setEditingServiceId(null);
        setNewServiceName('');
        setNewServiceDesc('');
        setNewServicePrice('');
        setNewServiceImageUrl('');
        setSelectedImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (service: Service) => {
        setEditingServiceId(service.id);
        setNewServiceName(service.name);
        setNewServiceDesc(service.description || '');
        setNewServicePrice(service.price.toString());
        setNewServiceImageUrl(service.imageUrl || '');
        setSelectedImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingServiceId(null);
        setNewServiceName('');
        setNewServiceDesc('');
        setNewServicePrice('');
        setNewServiceImageUrl('');
        setSelectedImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSubmitService = async () => {
        if (!newServiceName || !newServicePrice) {
            alert("Пожалуйста, заполните обязательные поля.");
            return;
        }

        const formData = new FormData();
        formData.append('Name', newServiceName);
        formData.append('Description', newServiceDesc);
        formData.append('Price', newServicePrice.toString());

        if (selectedImageFile) {
            formData.append('ImageFile', selectedImageFile);
        } else if (newServiceImageUrl) {
            formData.append('ImageUrl', newServiceImageUrl);
        } else if (editingServiceId) {
            const service = services.find(s => s.id === editingServiceId);
            if (service?.imageUrl) formData.append('ImageUrl', service.imageUrl);
        }

        try {
            if (editingServiceId) {
                await servicesApi.update(editingServiceId, formData as any);
            } else {
                await servicesApi.create(formData as any);
            }

            await fetchServices();
            handleCloseModal();

        } catch (error) {
            console.error("Ошибка сохранения услуги:", error);
            toast.error("Не удалось сохранить услугу. Попробуйте снова.");
        }
    };

    const handleDeleteService = async (id: number) => {
        setServiceToDelete(id);
    };

    const confirmDelete = async () => {
        if (!serviceToDelete) return;
        try {
            await servicesApi.delete(serviceToDelete);
            await fetchServices();
            toast.success("Услуга успешно удалена");
        } catch (error) {
            console.error("Failed to delete service:", error);
            toast.error("Не удалось удалить услугу. Попробуйте снова.");
        } finally {
            setServiceToDelete(null);
        }
    };

    const headerActions = user?.role === Role.Admin
        ? [{ label: "Добавить услугу", onClick: handleOpenAddModal }]
        : [];

    const handleServiceUrlChange = (url: string) => {
        setNewServiceImageUrl(url);
        if (url.trim()) {
            setSelectedImageFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleServiceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImageFile(file);
            setNewServiceImageUrl('');
        }
    };

    return (
        <div>
            <PageHeader
                title="Прайс-лист услуг"
                actions={headerActions}
            />
            <Search
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
            />

            {user?.role === Role.Client && discount > 0 && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl flex items-start gap-3 animate-in fade-in duration-300">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H14a1 1 0 100-2H8.414l1.293-1.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-emerald-800 dark:text-emerald-300 font-medium text-sm">
                            Ваша персональная скидка {discount}% будет применена при расчете стоимости мастером.
                        </p>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-end gap-4 mb-6">
                <div className="flex bg-gray-100 dark:bg-smartfix-darkest p-1 rounded-xl border border-gray-200 dark:border-smartfix-medium/10 shadow-sm dark:shadow-none">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:text-smartfix-medium dark:hover:text-smartfix-lightest'}`}
                    >
                        Список
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:text-smartfix-medium dark:hover:text-smartfix-lightest'}`}
                    >
                        Сетка
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center text-gray-500 dark:text-smartfix-light py-20">Загрузка услуг...</div>
            ) : (
                <>
                    {viewMode === 'list' ? (
                        /* ТВОЯ СТАНДАРТНАЯ РАЗМЕТКА ДЛЯ СПИСКА */
                        <div className="bg-white dark:bg-smartfix-darker rounded-2xl shadow-sm dark:shadow-xl border border-gray-200 dark:border-smartfix-dark overflow-hidden">
                            <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-smartfix-dark">
                                {filteredServices.map((service) => (
                                    <ServiceItem
                                        key={service.id}
                                        service={service}
                                        isAdmin={user?.role === Role.Admin}
                                        onEdit={handleOpenEditModal}
                                        onDelete={handleDeleteService}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* НОВАЯ РАЗМЕТКА ДЛЯ СЕТКИ (GRID) */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredServices.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    isAdmin={user?.role === Role.Admin}
                                    onEdit={handleOpenEditModal}
                                    onDelete={handleDeleteService}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            <ServiceModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitService}
                editingServiceId={editingServiceId}
                name={newServiceName}
                setName={setNewServiceName}
                description={newServiceDesc}
                setDescription={setNewServiceDesc}
                price={newServicePrice}
                setPrice={setNewServicePrice}
                imageUrl={newServiceImageUrl}
                setImageUrl={handleServiceUrlChange}
                fileInputRef={fileInputRef}
                handleServiceFileChange={handleServiceFileChange}
            />

        <ConfirmationModal
            isOpen={serviceToDelete !== null}
            title="Удаление услуги"
            message="Вы уверены, что хотите удалить эту услугу из прайс-листа? Это действие невозможно отменить."
            onConfirm={confirmDelete}
            onCancel={() => setServiceToDelete(null)}
        />
        </div>
    );
};

export default ServicesPage;
