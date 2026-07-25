import { useState, useEffect } from 'react';
import { getInventory, deletePart, createPart, updatePart, createTypePart, getTypePart, deleteTypePart } from '../services/api';

export const useInventory = () => {
    const [parts, setParts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalMode, setModalMode] = useState<'part' | 'type' | null>(null);
    const [types, setTypes] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: 0, name: '', stockQuantity: 0, purchasePrice: 0, typeId: 0 });
    const [typeFormData, setTypeFormData] = useState({ name: '' });

    useEffect(() => {
        loadInventory();
        loadTypes();
    }, []);

    const loadTypes = async () => {
        try {
            const data = await getTypePart();
            setTypes(data);
        } catch (error) {
            console.error("Ошибка при загрузке типов:", error);
        }
    };

    const loadInventory = async () => {
        setIsLoading(true);
        try {
            const data = await getInventory();
            setParts(data);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalMode(null);
        setFormData({ id: 0, name: '', stockQuantity: 0, purchasePrice: 0, typeId: 0 });
        setTypeFormData({ name: '' });
    };

    const openEditModal = (part: any) => {
        setFormData(part);
        setModalMode('part');
        setIsModalOpen(true);
    };

    const openEditPartTypeModal = (partType: any) => {
        setTypeFormData(partType);
        setModalMode('type');
        setIsModalOpen(true);
    };

    const handleAddPurchase = () => {
        setModalMode('part');
        setIsModalOpen(true);
    };

    const handleAddType = () => {
        setModalMode('type');
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Вы уверены, что хотите удалить запчасть?")) {
            const success = await deletePart(id);
            if (success) {
                setParts(prev => prev.filter(p => p.id !== id));
            } else {
                alert("Не удалось удалить запчасть в базе данных");
            }
        }
    };

    const handleTypeDelete = async (id: number) => {
        if (window.confirm("Вы уверены, что хотите удалить тип запчасти?")) {
            const success = await deleteTypePart(id);
            if (success) {
                setTypes(prev => prev.filter(t => t.id !== id));
            } else {
                alert("Не удалось удалить тип запчасти в базе данных");
            }
        }
    };

    const handleSubmit = async () => {
        const partToSave = {
            ...formData,
            stockQuantity: Number(formData.stockQuantity),
            purchasePrice: Number(formData.purchasePrice),
            typeId: Number(formData.typeId)
        };
        
        let success = false;
        if (partToSave.id > 0) {
            success = await updatePart(partToSave.id, partToSave);
        } else {
            success = await createPart(partToSave);
        }

        if (success) {
            await loadInventory();
            closeModal();
        } else {
            alert("Ошибка при сохранении запчасти");
        }
    };

    const handleTypeSubmit = async () => {
        if (!typeFormData.name.trim()) {
            alert("Введите название типа запчасти");
            return;
        }

        const success = await createTypePart(typeFormData);
        if (success) {
            await loadTypes(); 
            alert("Новый тип запчасти успешно добавлен");
        } else {
            alert("Ошибка при создании типа запчасти");
        }
    };

    const filteredParts = parts.filter(part =>
        part.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
        parts,
        isLoading,
        searchQuery,
        setSearchQuery,
        modalMode,
        types,
        isModalOpen,
        formData,
        setFormData,
        typeFormData,
        setTypeFormData,
        filteredParts,
        closeModal,
        openEditModal,
        openEditPartTypeModal,
        handleDelete,
        handleSubmit,
        handleTypeSubmit,
        handleTypeDelete,
        handleAddPurchase,
        handleAddType,
        loadInventory,
        loadTypes
    };
};