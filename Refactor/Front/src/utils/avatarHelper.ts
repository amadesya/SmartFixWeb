/**
 * Преобразует путь аватарки в полный URL
 * Если это относительный путь, преобразует в полный URL
 * Если это уже полный URL, возвращает как есть
 */
export const getFullAvatarUrl = (avatarPath: string | undefined | null): string | null => {
    if (!avatarPath) {
        return null;
    }

    // Если это уже полный URL (начинается с http:// или https://), вернуть как есть
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
        return avatarPath;
    }

    // Если это относительный путь, преобразовать в полный URL
    if (avatarPath.startsWith('/')) {
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        const baseUrl = apiUrl.replace('/api', '');
        return baseUrl + avatarPath;
    }

    // Base64 данные или другие форматы - вернуть как есть
    return avatarPath;
};
