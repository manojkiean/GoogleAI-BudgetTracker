
export const formatDate = (dateString: string | Date, format: 'DD-MM-YYYY' | 'YYYY-MM-DD' = 'YYYY-MM-DD'): string => {
    if (!dateString) {
        return '';
    }

    let date: Date;

    if (typeof dateString === 'string') {
        // Handles YYYY-MM-DD, DD-MM-YYYY, and ISO strings
        const isoString = dateString.includes('T') ? dateString : `${dateString}T00:00:00.000Z`;
        let parts = dateString.split('T')[0].split('-').map(Number);

        if (parts.length === 3) {
            const [p1, p2, p3] = parts;
            if (p1 > 1000) { // YYYY-MM-DD
                date = new Date(Date.UTC(p1, p2 - 1, p3));
            } else { // DD-MM-YYYY
                date = new Date(Date.UTC(p3, p2 - 1, p1));
            }
        } else {
            date = new Date(dateString); // Fallback for other formats
        }
    } else {
        date = new Date(dateString);
    }

    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    if (format === 'DD-MM-YYYY') {
        return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
    }
    
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};
