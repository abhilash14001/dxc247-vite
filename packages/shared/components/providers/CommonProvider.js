import {CommonContext} from "../../contexts/CommonContext";

export const CommonProvider = (props) => {

    // Handles ISO strings like '-000001-11-29T18:06:32.000000Z'
    const formatDateTime = (dateInput) => {
        if (!dateInput) return '';
        let dateObj;
        if (typeof dateInput === 'string') {
            // Try to parse the string manually
            // Example: '-000001-11-29T18:06:32.000000Z'
            const match = dateInput.match(/^(?:-?\d+)-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
            if (match) {
                const [, month, day, hour, minute, second] = match;
                // Format as DD/MM/YYYY HH:MM:SS
                return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/2025 ${hour}:${minute}:${second}`;
            }
            // fallback to Date if possible
            dateObj = new Date(dateInput);
        } else {
            dateObj = dateInput;
        }
        if (dateObj instanceof Date && !isNaN(dateObj)) {
            const day = dateObj.getDate().toString().padStart(2, '0');
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const year = dateObj.getFullYear();
            const hours = dateObj.getHours().toString().padStart(2, '0');
            const minutes = dateObj.getMinutes().toString().padStart(2, '0');
            const seconds = dateObj.getSeconds().toString().padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        }
        return '';
    }

    return (
        <CommonContext.Provider value={{formatDateTime}}>
            {props.children}
        </CommonContext.Provider>
    );
};