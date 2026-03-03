import React, { useState, useRef } from "react";

function Backup() {
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null); // Ref for clearing file input

  const handleBackupDownload = () => {
    const link = document.createElement("a");
    link.href = "http://localhost:5001/general/get-data-backup";
    link.setAttribute("download", "database_backup.zip");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const handleBackupUpload = async () => {
    if (!uploadFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      setUploading(true);
      const res = await fetch("http://localhost:5001/general/restore-backup", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data?.status === "success") {
        setUploadFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clears the file input
        }
        alert(data.message || "Backup restored successfully!");
      }
    } catch (err) {
      alert("Error uploading backup.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Database Backup & Restore</h1>

      {/* Backup Section */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg mb-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Click to Backup Data</h2>
        <button
          onClick={handleBackupDownload}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
        >
          Download Backup
        </button>
      </div>

      {/* Restore Section */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg text-center">
        <h2 className="text-xl font-semibold mb-4">Upload Backup File</h2>
        <input
          type="file"
          accept=".zip"
          ref={fileInputRef} // Attach ref here
          onChange={handleFileChange}
          className="block w-full text-gray-300 bg-gray-700 rounded-lg p-2 mb-4"
        />
        <button
          onClick={handleBackupUpload}
          disabled={uploading}
          className={`px-6 py-3 rounded-lg font-medium transition ${uploading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
            }`}
        >
          {uploading ? "Uploading..." : "Upload & Restore"}
        </button>
      </div>
    </div>
  );
}

export default Backup;
