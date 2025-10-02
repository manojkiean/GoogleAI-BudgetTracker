
export const formatDate = (dateString: string | Date): string => {
    // The input can be a date string in "YYYY-MM-DD" format or a Date object.
    // To handle both and avoid timezone issues where the date might be off by one day,
    // we can parse the string and construct a new date using UTC values.
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // getUTCMonth is 0-indexed
    const day = date.getUTCDate();

    return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
};
