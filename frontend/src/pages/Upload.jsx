import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, RefreshCw, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const FILE_TYPES = [
  "revenue",
  "expenses",
  "loans",
  "inventory",
  "bank_transactions",
];

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  // ---------- helpers ----------
  const flashRow = (index) => {
    setUploadedFiles((prev) => {
      const arr = [...prev];
      if (!arr[index]) return prev;
      arr[index] = { ...arr[index], flash: true };
      return arr;
    });
    setTimeout(() => {
      setUploadedFiles((prev) => {
        const arr = [...prev];
        if (!arr[index]) return prev;
        arr[index] = { ...arr[index], flash: false };
        return arr;
      });
    }, 900);
  };

  const getStatusBadge = (status) => {
    if (status === "active") return "bg-green-100 text-green-700";
    if (status === "updating") return "bg-yellow-100 text-yellow-700";
    if (status === "deleting") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const percent = (v) => Math.round(v * 100) + "%";

  // ---------- load list ----------
  const loadFiles = async () => {
    try {
      const res = await axios.get("http://localhost:8000/upload/list");
      const list = (res.data || []).map((f) => ({
        ...f,
        flash: false,
      }));
      setUploadedFiles(list);
    } catch {
      toast.error("Failed to load files");
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // ---------- select files ----------
  const handleFiles = (selected) => {
    const newFiles = Array.from(selected);
    setFiles((prev) => {
      const combined = [...prev];
      newFiles.forEach((file) => {
        const exists = combined.find((f) => f.name === file.name);
        if (!exists) combined.push(file);
      });
      return combined;
    });
  };

  const removeFile = (name) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  // ---------- upload ----------
  const handleUpload = async () => {
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      setUploading(true);

      const res = await axios.post(
        "http://localhost:8000/upload/financials",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const responseResults = res.data || [];
      setResults(responseResults);
      setFiles([]);
      await loadFiles();

      // ✔ SMART TOAST LOGIC
      const successCount = responseResults.filter(
        (r) => r.status !== "duplicate"
      ).length;

      const duplicateCount = responseResults.filter(
        (r) => r.status === "duplicate"
      ).length;

      if (successCount > 0 && duplicateCount === 0) {
        toast.success(`${successCount} file(s) uploaded successfully`);
      } else if (successCount > 0 && duplicateCount > 0) {
        toast(
          `Uploaded ${successCount}, Skipped ${duplicateCount} duplicate(s)`,
          { icon: "⚠️" }
        );
      } else if (successCount === 0 && duplicateCount > 0) {
        toast.error("All selected files already exist (duplicates)");
      }

    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ---------- rename ----------
  const renameFile = async (oldName, index) => {
    const newName = prompt("Enter new name:", oldName);
    if (!newName || newName === oldName) return;

    const isDuplicate = uploadedFiles.some(
      (f, i) => f.file_name === newName && i !== index
    );
    if (isDuplicate) {
      toast.error("File name already exists");
      return;
    }

    const updated = [...uploadedFiles];
    updated[index].status = "updating";
    setUploadedFiles(updated);

    try {
      await axios.put("http://localhost:8000/upload/rename", {
        old_name: oldName,
        new_name: newName,
      });

      updated[index] = {
        ...updated[index],
        file_name: newName,
        status: "active",
      };
      setUploadedFiles([...updated]);
      flashRow(index);
      toast.success("File renamed");
    } catch {
      toast.error("Rename failed");
      loadFiles();
    }
  };

  // ---------- replace ----------
  const replaceFile = async (oldName, file, index) => {
    if (!file) return;

    const newName = file.name.trim().toLowerCase();

    const nameExists = uploadedFiles.some(
      (f) => f.file_name.trim().toLowerCase() === newName
    );

    if (nameExists && newName !== oldName.trim().toLowerCase()) {
      toast.error("File already exists. Cannot replace.");
      return;
    }

    const updated = [...uploadedFiles];
    updated[index].status = "updating";
    setUploadedFiles(updated);

    try {
      const formData = new FormData();
      formData.append("files", file);

      const res = await axios.post(
        "http://localhost:8000/upload/financials",
        formData
      );

      const result = res.data?.[0];

      if (result?.status === "duplicate") {
        toast.error("File already exists. Replace cancelled.");
        updated[index].status = "active";
        setUploadedFiles([...updated]);
        return;
      }

      await axios.delete(`http://localhost:8000/upload/file/${oldName}`);

      updated[index] = {
        ...updated[index],
        file_name: file.name,
        detected_type: result?.detected_type,
        rows_extracted: result?.rows_extracted,
        status: "active",
        flash: true,
      };

      setUploadedFiles([...updated]);

      setTimeout(() => {
        updated[index].flash = false;
        setUploadedFiles([...updated]);
      }, 900);

      toast.success("File replaced successfully");
    } catch {
      toast.error("Replace failed");
      loadFiles();
    }
  };

  // ---------- delete ----------
  const deleteFile = async (name, index) => {
    if (!window.confirm("Delete file?")) return;

    const updated = [...uploadedFiles];
    updated[index].status = "deleting";
    setUploadedFiles(updated);

    setTimeout(async () => {
      try {
        await axios.delete(`http://localhost:8000/upload/file/${name}`);
        updated.splice(index, 1);
        setUploadedFiles([...updated]);
        toast.success("File deleted");
      } catch {
        toast.error("Delete failed");
        loadFiles();
      }
    }, 350);
  };

  // ---------- filters ----------
  const filteredFiles = uploadedFiles.filter((f) => {
    const matchSearch = f.file_name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchType =
      filterType === "all" || f.detected_type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="p-6">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">

        {/* Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition
          ${dragActive ? "border-blue-500 bg-blue-50/10" : "border-gray-400"}
          bg-white/40 backdrop-blur`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
        >
          <p className="text-lg font-medium mb-2">
            Drag & Drop Financial Files
          </p>
          <p className="text-sm text-gray-500 mb-4">
            CSV • Excel • Financial PDFs
          </p>

          <input
            type="file"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            id="fileUpload"
          />

          <label
            htmlFor="fileUpload"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl cursor-pointer shadow"
          >
            Select Files
          </label>
        </div>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Selected Files</h3>

            <div className="flex flex-wrap gap-3">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="px-4 py-2 bg-blue-100 rounded-xl flex items-center gap-3"
                >
                  <span className="text-sm">{f.name}</span>
                  <button
                    onClick={() => removeFile(f.name)}
                    className="text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl shadow"
            >
              {uploading ? "Uploading..." : `Upload ${files.length} Files`}
            </button>
          </div>
        )}

        {/* Upload Results */}
        {results.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">AI Ingestion Results</h2>

            {results.map((r, idx) => (
              <div key={idx} className="p-5 mb-3 bg-white rounded-xl shadow">
                <div className="font-semibold">{r.file_name}</div>

                {r.detected_type && r.rows_extracted > 0 && (
                  <div className="text-green-600 mt-2">
                    ✔ {r.detected_type} | {percent(r.confidence)} | Rows:{" "}
                    {r.rows_extracted}
                  </div>
                )}

                {r.status === "duplicate" && (
                  <div className="text-red-600 mt-2">
                    ⚠ Duplicate — rejected
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Uploaded Files Table */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-4">Uploaded Documents</h2>

          <div className="flex gap-4 mb-4">
            <input
              placeholder="Search file..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 rounded border w-64"
            />

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 rounded border"
            >
              <option value="all">All Types</option>
              {FILE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">SI/No</th>
                  <th className="p-3 text-left">File</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Rows</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredFiles.map((f, i) => (
                  <tr
                    key={i}
                    className={`border-t transition-all duration-500 hover:bg-gray-50
                      ${f.status === "updating" ? "opacity-50 scale-[0.98]" : ""}
                      ${f.status === "deleting" ? "opacity-0" : ""}
                      ${f.flash ? "bg-green-50" : ""}
                    `}
                  >
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3 font-medium">{f.file_name}</td>
                    <td className="p-3 capitalize">{f.detected_type}</td>
                    <td className="p-3">{f.rows_extracted}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          f.status
                        )}`}
                      >
                        {f.status}
                      </span>
                    </td>

                    <td className="p-3 flex gap-3">
                      <button
                        onClick={() => renameFile(f.file_name, i)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        {f.status === "updating" ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Pencil size={16} />
                        )}
                      </button>

                      <label className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                        {f.status === "updating" ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <RefreshCw size={16} />
                        )}
                        <input
                          type="file"
                          hidden
                          onChange={(e) =>
                            replaceFile(f.file_name, e.target.files[0], i)
                          }
                        />
                      </label>

                      <button
                        onClick={() => deleteFile(f.file_name, i)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white"
                      >
                        {f.status === "deleting" ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredFiles.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500">
                      No documents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
