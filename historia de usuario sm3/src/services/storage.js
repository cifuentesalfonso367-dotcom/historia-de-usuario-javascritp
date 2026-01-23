const KEY = "notas"

export const storage = {
    save (data) {
        localStorage.setItem(KEY, JSON.stringify(data));
    },
    get() {
        const data = localStorage.getItem(KEY);
        return data ? JSON.parse (data) : []
    }
};