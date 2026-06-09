// ModalActions.tsx
interface ModalActionsProps {
    isStaff: boolean;
    isClient: boolean;
    isPaymentLoading: boolean;
    canPay: boolean;
    onDelete: () => void;
    onPayment: () => void;
    onSave: () => void;
    onClose: () => void;
}

const ModalActions: React.FC<ModalActionsProps> = ({
    isStaff, isClient, isPaymentLoading, canPay, onDelete, onPayment, onSave, onClose
}) => (
    <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-smartfix-medium/20">
        {isStaff && (
            <button onClick={onDelete} className="btn-danger-outline">
                Удалить заявку
            </button>
        )}

        {isClient && (
            <button
                onClick={onPayment}
                disabled={isPaymentLoading || !canPay}
                className="btn-success"
            >
                {isPaymentLoading ? 'Проверка...' : 'Оплатить'}
            </button>
        )}

        <div className="flex gap-3 ml-auto">
            <button onClick={onClose} className="btn-secondary">
                Закрыть
            </button>
            {isStaff && (
                <button onClick={onSave} className="btn-primary">
                    Сохранить изменения
                </button>
            )}
        </div>
    </div>
);