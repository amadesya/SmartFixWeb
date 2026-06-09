import { useState } from 'react';
import { User, RepairRequest } from '@/types'; 
import { createRepairRequest } from '@/services/api';   

export const useNewRequestForm = (user: User, onSubmitted: (newRequest: RepairRequest) => void) => {
    const [deviceType, setDeviceType] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    const [urgency, setUrgency] = useState('standard');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!deviceType || !brand || !issueDescription) {
            alert('Пожалуйста, заполните все поля информации об устройстве и опишите проблему.');
            return;
        }

        setIsSubmitting(true);

        try {
            const deviceFullName = `${deviceType} ${brand} ${model}`.trim();
            const issueFullDescription = `Срочность: ${urgency === 'urgent' ? 'Срочно' : 'Стандартная'}. Проблема: ${issueDescription}`;

            const newRequest = await createRepairRequest(
                user.id,
                null,
                deviceFullName,
                issueFullDescription
            );

            onSubmitted(newRequest);
            
            setDeviceType('');
            setBrand('');
            setModel('');
            setIssueDescription('');
            setUrgency('standard');

        } catch (error) {
            console.error("Failed to create request:", error);
            alert('Не удалось создать заявку. Попробуйте снова.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        state: { deviceType, brand, model, issueDescription, urgency, isSubmitting },
        setters: { setDeviceType, setBrand, setModel, setIssueDescription, setUrgency },
        handleSubmit
    };
};