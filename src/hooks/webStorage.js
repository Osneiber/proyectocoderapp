// Utilidades para manejar el almacenamiento en web
export const webStorage = {
    setItem: (key, value) => {
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    },

    getItem: (key) => {
        try {
            if (typeof window !== 'undefined') {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            }
            return null;
        } catch (error) {
            return null;
        }
    },

    removeItem: (key) => {
        try {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(key);
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }
};
