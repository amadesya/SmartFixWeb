export const config = {
    apiUrl: import.meta.env.VITE_API_URL || '/api',
    get baseUrl() {
        return this.apiUrl.replace('/api', '');
    },
};

export const getAvatarUrl = (path: string | undefined | null): string | null => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/')) return config.baseUrl + path;
    return path;
};
