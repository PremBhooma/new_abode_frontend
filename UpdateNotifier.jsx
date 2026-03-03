// import React, { useEffect, useState } from "react";

// export default function UpdateNotifier() {
//     const [status, setStatus] = useState("idle");
//     const [progress, setProgress] = useState(0);
//     const [message, setMessage] = useState("");

//     useEffect(() => {
//         const api = window.electronAPI;

//         api.onUpdateChecking(() => {
//             setStatus("checking");
//             setMessage("Checking for updates...");
//         });

//         api.onUpdateAvailable(() => {
//             setStatus("available");
//             setMessage("A new update is available. Do you want to download it?");
//         });

//         api.onUpdateNotAvailable(() => {
//             setStatus("none");
//             setMessage("Your app is up to date!");
//             setTimeout(() => setStatus("idle"), 3000);
//         });

//         api.onUpdateError((msg) => {
//             setStatus("error");
//             setMessage("Update error: " + msg);
//         });

//         api.onUpdateProgress((data) => {
//             setStatus("downloading");
//             setProgress(Math.round(data.percent));
//             setMessage(`Downloading update... ${Math.round(data.percent)}%`);
//         });

//         api.onUpdateDownloaded(() => {
//             setStatus("downloaded");
//             setMessage("Update downloaded! Click 'Install' to restart.");
//         });
//     }, []);

//     if (status === "idle") return null;

//     return (
//         <div
//             style={{
//                 position: "fixed",
//                 bottom: 20,
//                 right: 20,
//                 background: "#fff",
//                 border: "1px solid #ccc",
//                 borderRadius: 10,
//                 padding: 16,
//                 boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
//                 zIndex: 9999,
//                 width: 320,
//                 fontFamily: "sans-serif",
//             }}
//         >
//             <p style={{ marginBottom: 8 }}>{message}</p>

//             {status === "available" && (
//                 <button
//                     onClick={() => window.electronAPI.confirmDownload()}
//                     style={{
//                         background: "#0078d4",
//                         color: "white",
//                         border: "none",
//                         padding: "8px 12px",
//                         borderRadius: 6,
//                         cursor: "pointer",
//                     }}
//                 >
//                     Download Update
//                 </button>
//             )}

//             {status === "downloading" && (
//                 <div>
//                     <progress
//                         value={progress}
//                         max="100"
//                         style={{ width: "100%", height: "10px" }}
//                     />
//                 </div>
//             )}

//             {status === "downloaded" && (
//                 <button
//                     onClick={() => window.electronAPI.installUpdate()}
//                     style={{
//                         background: "#28a745",
//                         color: "white",
//                         border: "none",
//                         padding: "8px 12px",
//                         borderRadius: 6,
//                         cursor: "pointer",
//                     }}
//                 >
//                     Install & Restart
//                 </button>
//             )}

//             {status === "error" && (
//                 <button
//                     onClick={() => setStatus("idle")}
//                     style={{
//                         background: "#dc3545",
//                         color: "white",
//                         border: "none",
//                         padding: "8px 12px",
//                         borderRadius: 6,
//                         cursor: "pointer",
//                     }}
//                 >
//                     Close
//                 </button>
//             )}
//         </div>
//     );
// }


import React, { useEffect, useState } from "react";

export default function UpdateNotifier() {
    const [status, setStatus] = useState("idle");
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [isDownloadClicked, setIsDownloadClicked] = useState(false);
    const [isInstallClicked, setIsInstallClicked] = useState(false);
    const [isOffline, setIsOffline] = useState(!navigator.onLine); // 👈 track online status

    useEffect(() => {
        const api = window.electronAPI;

        // Listen for online/offline events
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        api.onUpdateChecking(() => {
            setStatus("checking");
            setMessage("Checking for updates...");
        });

        api.onUpdateAvailable(() => {
            setStatus("available");
            setMessage("A new update is available. Do you want to download it?");
            setIsDownloadClicked(false);
        });

        api.onUpdateNotAvailable(() => {
            setStatus("none");
            setMessage("Your app is up to date!");
            setTimeout(() => setStatus("idle"), 3000);
        });

        api.onUpdateError((msg) => {
            setStatus("error");
            setMessage("Update error: " + msg);
            setIsDownloadClicked(false);
            setIsInstallClicked(false);
        });

        api.onUpdateProgress((data) => {
            setStatus("downloading");
            setProgress(Math.round(data.percent));
            setMessage(`Downloading update... ${Math.round(data.percent)}%`);
        });

        api.onUpdateDownloaded(() => {
            setStatus("downloaded");
            setMessage("Update downloaded! Click 'Install' to restart.");
            setIsInstallClicked(false);
        });

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (status === "idle") return null;

    return (
        <div
            style={{
                position: "fixed",
                bottom: 20,
                right: 20,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: 10,
                padding: 16,
                boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                zIndex: 9999,
                width: 320,
                fontFamily: "sans-serif",
            }}
        >
            <p style={{ marginBottom: 8 }}>{isOffline ? "No Internet Connection" : message}</p>

            {status === "available" && (
                <button
                    onClick={() => {
                        setIsDownloadClicked(true);
                        window.electronAPI.confirmDownload();
                    }}
                    disabled={isDownloadClicked || isOffline} // disable if clicked or offline
                    style={{
                        background: isDownloadClicked || isOffline ? "#999" : "#0078d4",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: 6,
                        cursor: isDownloadClicked || isOffline ? "not-allowed" : "pointer",
                        opacity: isDownloadClicked || isOffline ? 0.7 : 1,
                        transition: "all 0.2s ease",
                    }}
                >
                    {isDownloadClicked ? "Downloading..." : "Download Update"}
                </button>
            )}

            {status === "downloading" && (
                <div>
                    <progress
                        value={progress}
                        max="100"
                        style={{ width: "100%", height: "10px" }}
                    />
                </div>
            )}

            {status === "downloaded" && (
                <button
                    onClick={() => {
                        setIsInstallClicked(true);
                        window.electronAPI.installUpdate();
                    }}
                    disabled={isInstallClicked || isOffline} // disable if clicked or offline
                    style={{
                        background: isInstallClicked || isOffline ? "#999" : "#28a745",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: 6,
                        cursor: isInstallClicked || isOffline ? "not-allowed" : "pointer",
                        opacity: isInstallClicked || isOffline ? 0.7 : 1,
                        transition: "all 0.2s ease",
                    }}
                >
                    {isInstallClicked ? "Installing..." : "Install & Restart"}
                </button>
            )}

            {status === "error" && (
                <button
                    onClick={() => setStatus("idle")}
                    style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: 6,
                        cursor: "pointer",
                    }}
                >
                    Close
                </button>
            )}
        </div>
    );
}
