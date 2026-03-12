import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import useSWR from 'swr';
import Generalapi from '../api/Generalapi';
import { useEmployeeDetails } from '../zustand/useEmployeeDetails';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const location = useLocation();

    // Permission Syncing Logic
    const updatePermissions = useEmployeeDetails(state => state.updatePermissions);
    const fetcher = url => Generalapi.get(url).then(res => res.data);

    // Poll every 4 seconds
    const { data } = useSWR('get-current-users-permissions', fetcher, {
        refreshInterval: 50000,
        revalidateOnFocus: true,
    });

    React.useEffect(() => {
        if (data?.status === 'success' && data?.permissionsData) {
            // Updating store only if data is successfully fetched
            // We could add a check to see if deep equal to avoid re-renders, 
            // but zustand might handle simple object replacements or we can rely on React processing.
            // For now, simply updating.
            updatePermissions(data.permissionsData);
        }
    }, [data, updatePermissions]);

    // Close sidebar on route change (mobile)
    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-100">
            {/* Sidebar - Persistent on Desktop, Toggable on Mobile */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full w-full min-w-0 relative">
                <Header toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-4">
                    <div className="mx-auto w-full max-w-[1800px]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
