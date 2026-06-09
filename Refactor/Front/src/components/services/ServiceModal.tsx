import React from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    editingServiceId: string | number | null;
    name: string;
    setName: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    price: string | number;
    imageUrl: string;
    setPrice: (value: string) => void;
    setImageUrl: (value: string) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleServiceFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    editingServiceId,
    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,
    imageUrl,
    setImageUrl,
    fileInputRef,
    handleServiceFileChange
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingServiceId ? "Редактировать услугу" : "Добавить новую услугу"}
        >
            <div className="space-y-4">

                <Input
                    label="Название услуги"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Textarea
                    label="Описание"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />

                <Input
                    label="Цена (₽)"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <Input
                    label="Изображение (URL или файл)"
                    type="text"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="mb-3"
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleServiceFileChange}
                    className="w-full text-smartfix-light text-sm 
                        file:mr-4 file:py-2 file:px-4 
                        file:rounded-lg file:border-0 
                        file:text-sm file:font-semibold 
                        file:bg-smartfix-medium file:text-white 
                        hover:file:bg-smartfix-light cursor-pointer"
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="secondary" onClick={onClose}>
                        Отмена
                    </Button>

                    <Button variant="default" onClick={onSubmit}>
                        {editingServiceId ? "Сохранить изменения" : "Добавить"}
                    </Button>
                </div>

            </div>
        </Modal>
    );
};

export default ServiceModal;