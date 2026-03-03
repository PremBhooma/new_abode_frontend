// import React, { useEffect, useState } from "react";

// export default function UpdateNotifier() {
//     const [status, setStatus] = useState("idle");
//     const [progress, setProgress] = useState(0);
//     const [message, setMessage] = useState("");

//     useEffect(() => {
//         window.electronAPI.onUpdateChecking(() => {
//             setStatus("checking");
//             setMessage("Checking for updates...");
//         });

//         window.electronAPI.onUpdateAvailable(() => {
//             setStatus("available");
//             setMessage("Update available. Would you like to download?");
//         });

//         window.electronAPI.onUpdateNotAvailable(() => {
//             setStatus("none");
//             setMessage("Your app is up to date!");
//         });

//         window.electronAPI.onUpdateError((msg) => {
//             setStatus("error");
//             setMessage("Error while updating: " + msg);
//         });

//         window.electronAPI.onUpdateProgress((data) => {
//             setStatus("downloading");
//             setProgress(Math.round(data.percent));
//             setMessage(`Downloading update... ${Math.round(data.percent)}%`);
//         });

//         window.electronAPI.onUpdateDownloaded(() => {
//             setStatus("downloaded");
//             setMessage("Update downloaded! Click 'Install' to restart.");
//         });
//     }, []);

//     if (status === "idle" || status === "none") return null;

//     return (
//         <div
//             style={{
//                 position: "fixed",
//                 bottom: 20,
//                 right: 20,
//                 background: "#fff",
//                 border: "1px solid #ccc",
//                 borderRadius: 8,
//                 padding: 16,
//                 boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
//                 zIndex: 9999,
//                 width: 300,
//             }}
//         >
//             <p style={{ marginBottom: 8 }}>{message}</p>

//             {status === "available" && (
//                 <button onClick={() => window.electronAPI.confirmDownload()}>
//                     Download
//                 </button>
//             )}

//             {status === "downloading" && (
//                 <div>
//                     <progress value={progress} max="100" />
//                 </div>
//             )}

//             {status === "downloaded" && (
//                 <button onClick={() => window.electronAPI.installUpdate()}>
//                     Install & Restart
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

    useEffect(() => {
        const api = window.electronAPI;

        api.onUpdateChecking(() => {
            setStatus("checking");
            setMessage("Checking for updates...");
        });

        api.onUpdateAvailable(() => {
            setStatus("available");
            setMessage("A new update is available. Do you want to download it?");
        });

        api.onUpdateNotAvailable(() => {
            setStatus("none");
            setMessage("Your app is up to date!");
            setTimeout(() => setStatus("idle"), 3000);
        });

        api.onUpdateError((msg) => {
            setStatus("error");
            setMessage("Update error: " + msg);
        });

        api.onUpdateProgress((data) => {
            setStatus("downloading");
            setProgress(Math.round(data.percent));
            setMessage(`Downloading update... ${Math.round(data.percent)}%`);
        });

        api.onUpdateDownloaded(() => {
            setStatus("downloaded");
            setMessage("Update downloaded! Click 'Install' to restart.");
        });
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
            <p style={{ marginBottom: 8 }}>{message}</p>

            {status === "available" && (
                <button
                    onClick={() => window.electronAPI.confirmDownload()}
                    style={{
                        background: "#0078d4",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: 6,
                        cursor: "pointer",
                    }}
                >
                    Download Update
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
                    onClick={() => window.electronAPI.installUpdate()}
                    style={{
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: 6,
                        cursor: "pointer",
                    }}
                >
                    Install & Restart
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
