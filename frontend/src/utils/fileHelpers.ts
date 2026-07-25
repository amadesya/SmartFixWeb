export const downloadFile = (content: string, fileName: string, contentType: string): void => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    
    document.body.appendChild(link);
    link.click();
    
    // Очистка памяти
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 100);
};

export const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim());
    if (lines.length < 2) return [];

    const splitPattern = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

    const headers = lines[0].split(splitPattern).map((h) => h.trim().replace(/^"|"$/g, ""));

    return lines.slice(1).map((line) => {
        const values = line.split(splitPattern).map((v) => v.trim().replace(/^"|"$/g, ""));
        const obj: Record<string, string> = {};
        
        headers.forEach((header, index) => {
            obj[header] = values[index] || "";
        });
        
        return obj;
    });
};

export const convertToCSV = (data: any[], headers: string[], keys: string[]): string => {
    const csvRows = [headers.join(",")];

    data.forEach((item) => {
        const row = keys.map((key) => {
            const value = item[key] ?? "";
            const escaped = String(value).replace(/"/g, '""'); 
            return `"${escaped}"`; 
        });
        csvRows.push(row.join(","));
    });

    return csvRows.join("\n");
};

export const validateImportData = (data: any[], requiredFields: string[]): boolean => {
    if (!Array.isArray(data) || data.length === 0) return false;
    
    return data.every(item => 
        requiredFields.every(field => Object.prototype.hasOwnProperty.call(item, field))
    );
};

export const getTimestampFilename = (prefix: string, extension: string): string => {
    const date = new Date().toISOString().split("T")[0];
    return `${prefix}-${date}.${extension}`;
};