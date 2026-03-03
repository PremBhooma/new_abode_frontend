import { create } from 'zustand';
import Projectapi from '../api/Projectapi.jsx';

export const useAllocatedProjectDetails = create((set, get) => ({
    allocatedProjectData: [],
    hasFetched: false,
    isLoading: false,

    fetchAllocatedProjectData: async () => {
        set({ isLoading: true });

        try {
            const response = await Projectapi.get("get-my-allocated-projects", {
                headers: { "Content-Type": "application/json" },
            });

            const data = response.data;

            if (data.status === "error") {
                set({ allocatedProjectData: [] });
            } else {
                set({ hasFetched: true, allocatedProjectData: data?.data || [], isLoading: false });
            }
        } catch (error) {
            console.error("Error fetching allocated project data:", error);
            set({ allocatedProjectData: [], isLoading: false });
        }
    },

    resetAllocatedProjectData: () => {
        set({ allocatedProjectData: [], hasFetched: false });
    }
}));
