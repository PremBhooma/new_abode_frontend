import React, { useEffect, useState } from "react";

export default function UpdateNotifier() {
    const [status, setStatus] = useState("idle");
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [isStartingDownload, setIsStartingDownload] = useState(false);

    useEffect(() => {
        const api = window.electronAPI;

        api.onUpdateChecking(() => {
            setStatus("checking");
            setMessage("Checking for updates...");
        });

        api.onUpdateAvailable(() => {
            setStatus("available");
            setIsStartingDownload(false); // Reset in case it becomes available again
            setMessage("A new update is available. Do you want to download it?");
        });

        api.onUpdateNotAvailable(() => {
            setStatus("none");
            setMessage("Your app is up to date!");
            setTimeout(() => setStatus("idle"), 3000);
        });

        api.onUpdateError((msg) => {
            setStatus("error");
            setIsStartingDownload(false); // Reset on error
            setMessage("Update error: " + msg);
        });

        api.onUpdateProgress((data) => {
            setStatus("downloading");
            setIsStartingDownload(false); // Progress started, no longer just "starting"
            setProgress(Math.round(data.percent));
            setMessage(`Downloading update... ${Math.round(data.percent)}%`);
        });

        api.onUpdateDownloaded(() => {
            setStatus("downloaded");
            setMessage("Update downloaded! Click 'Install' to restart.");
        });
    }, []);

    if (status === "idle") return null;

    const handleDownloadClick = () => {
        setIsStartingDownload(true);
        window.electronAPI.confirmDownload();
    };

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
                    onClick={handleDownloadClick}
                    disabled={isStartingDownload}
                    style={{
                        background: isStartingDownload ? "#6c757d" : "#0078d4",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: 6,
                        cursor: isStartingDownload ? "not-allowed" : "pointer",
                        opacity: isStartingDownload ? 0.8 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    {isStartingDownload ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Starting Download...
                        </>
                    ) : (
                        "Download Update"
                    )}
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
