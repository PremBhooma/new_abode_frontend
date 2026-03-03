import { create } from 'zustand';
import Projectapi from '../api/Projectapi.jsx';

export const useProjectDetails = create((set, get) => ({
    projectData: null,
    hasFetched: false,
    isLoading: false,

    fetchProjectData: async () => {
        set({ isLoading: true });

        try {
            const response = await Projectapi.get("get-project", {
                headers: { "Content-Type": "application/json" },
            });

            const data = response.data;

            if (data.status === "error") {
                set({ projectData: null });
            } else {
                set({ hasFetched: true, projectData: data?.data || null, isLoading: false });
            }
        } catch (error) {
            console.error("Error fetching project data:", error);
            set({ projectData: null, isLoading: false });
        }
    },

    resetProjectData: () => {
        set({ projectData: null, hasFetched: false });
    }
}));
