import { create } from 'zustand';
import Settingsapi from '../api/Settingsapi.jsx';

let saveTimeout;

export const useColumnStore = create((set, get) => ({
    storedColumns: {}, // { [page_name]: string[] }
    hasFetched: {},    // { [page_name]: boolean }

    fetchColumns: async (employee_id, page_name) => {
        try {
            const params = { employee_id, page_name };
            const response = await Settingsapi.get("/get-column-store", {
                params,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = response.data;
            if (data.status === "success") {
                set((state) => ({
                    storedColumns: {
                        ...state.storedColumns,
                        [page_name]: data.data || []
                    },
                    hasFetched: {
                        ...state.hasFetched,
                        [page_name]: true
                    }
                }));
            } else {
                set((state) => ({
                    storedColumns: {
                        ...state.storedColumns,
                        [page_name]: []
                    },
                    hasFetched: {
                        ...state.hasFetched,
                        [page_name]: true
                    }
                }));
            }
        } catch (error) {
            console.error("Error fetching columns:", error);
            set((state) => ({
                storedColumns: {
                    ...state.storedColumns,
                    [page_name]: []
                },
                hasFetched: {
                    ...state.hasFetched,
                    [page_name]: true
                }
            }));
        }
    },

    handleColumnStore: (updatedColumns, employee_id, page_name) => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
            const visibleColumnNames = Object.keys(updatedColumns).filter(
                (col) => updatedColumns[col]
            );

            try {
                await Settingsapi.post("/column-store", {
                    page_name,
                    employee_id,
                    columns: visibleColumnNames
                });

                set((state) => ({
                    storedColumns: {
                        ...state.storedColumns,
                        [page_name]: visibleColumnNames
                    }
                }));
            } catch (error) {
                console.error("Error saving columns:", error);
            }
        }, 300);
    }
}));
