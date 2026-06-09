import { useState, useCallback } from 'react';

export function useConfirmation<T = any>() {
    const [itemToDelete, setItemToDelete] = useState<T | null>(null);

    const confirm = useCallback((item: T) => {
        setItemToDelete(item);
    }, []);

    const cancel = useCallback(() => {
        setItemToDelete(null);
    }, []);

    return {
        itemToDelete,
        confirm,
        cancel,
        isOpen: itemToDelete !== null,
    };
}