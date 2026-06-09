import React from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Table } from 'lucide-react';
import { PartTypeTable } from './PartTypeTable';
import { useInventory } from '@/hooks/useInventory';
import { PartType } from '@/types';

interface InventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    modalMode: 'part' | 'type';
    formData: any;
    setFormData: (data: any) => void;
    typeFormData: any;
    setTypeFormData: (data: any) => void;
    types: any[];
    handleSubmit: () => void;
    handleTypeSubmit: () => void;
}

const InventoryModal: React.FC<InventoryModalProps> = ({
    isOpen,
    onClose,
    modalMode,
    formData,
    setFormData,
    typeFormData,
    setTypeFormData,
    types,
    handleSubmit,
    handleTypeSubmit,
}) => {
    const { openEditPartTypeModal, handleTypeDelete } = useInventory();
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={modalMode === 'part' ? 'Оформить закупку' : 'Добавить тип запчасти'}
        >
            <div className="space-y-4">
                {modalMode === 'part' ? (
                    <>
                        <Input
                            label="Имя *"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        <Input
                            label="Количество на складе *"
                            type="number"
                            value={formData.stockQuantity}
                            onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                        />

                        <Input
                            label="Цена закупки *"
                            type="number"
                            value={formData.purchasePrice}
                            onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                        />

                        <Select
                            label="Тип запчасти *"
                            value={formData.typeId || 0}
                            onChange={(e) => setFormData({ ...formData, typeId: parseInt(e.target.value) })}
                        >
                            <option value={0} disabled hidden>Выберите тип...</option>
                            {types.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </Select>
                    </>
                ) : (
                    <>
                    <div className='flex items-end gap-2'>
                        <div className='flex-1'>
                            <Input
                                label="Название типа *"
                                type="text"
                                value={typeFormData.name}
                                onChange={(e) => setTypeFormData({ name: e.target.value })}
                            />
                        </div>
                        <Button
                            variant="default"
                            onClick={handleTypeSubmit}
                        >
                            Добавить
                        </Button>
                    </div>
                <div className='border border-gray-200 dark:border-smartfix-medium/30 rounded-xl overflow-hidden bg-white dark:bg-transparent shadow-sm'>
                        <PartTypeTable
                            partTypes={types}
                            onEdit={openEditPartTypeModal}
                            onDelete={handleTypeDelete}
                        />
                    </div>
                    </>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="secondary" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button
                        variant="default"
                        onClick={modalMode === 'part' ? handleSubmit : handleTypeSubmit}
                    >
                        Сохранить
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default InventoryModal;