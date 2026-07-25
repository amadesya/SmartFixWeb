import { Review } from '@/types';

export const buildTree = (items: Review[], parentId: number | null = null): any[] => {
    return items
        .filter(item => item.parentId === parentId || item.ParentId === parentId)
        .map(item => ({
            ...item,
            replies: buildTree(items, item.id)
        }));
};