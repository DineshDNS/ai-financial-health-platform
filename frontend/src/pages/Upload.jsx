import React, { useState } from "react";
import axios from "axios";

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

  // ADD files instead of replacing
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

      setResults(res.data);
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const percent = (v) => Math.round(v * 100) + "%";

  const getState = (r) => {
    if (!r.detected_type && r.confidence === 0 && r.rows_extracted === 0)
      return "INVALID";

    if (r.detected_type && r.rows_extracted === 0)
      return "PDF_WARNING";

    if (r.detected_type && r.confidence >= 0.5 && r.rows_extracted > 0)
      return "PERFECT";

    if (r.detected_type && r.confidence < 0.5 && r.rows_extracted > 0)
      return "LOW_CONF";

    if (!r.detected_type && r.rows_extracted > 0)
      return "NEEDS_TYPE";

    return "UNKNOWN";
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl font-semibold mb-6">
          Financial Data Upload
        </h1>

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

        {/* Selected Files Preview */}
        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Selected Files</h3>

            <div className="flex flex-wrap gap-3">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center gap-3"
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
              {uploading ? "Processing..." : `Upload ${files.length} Files`}
            </button>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">AI Ingestion Results</h2>

            <div className="space-y-4">
              {results.map((r, idx) => {
                const state = getState(r);

                return (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-white/60 backdrop-blur shadow"
                  >
                    <div className="font-semibold">{r.file_name}</div>

                    {state === "PERFECT" && (
                      <div className="text-green-600 mt-2">
                        ✔ Perfect Match — {r.detected_type} <br />
                        Confidence: {percent(r.confidence)} | Rows: {r.rows_extracted}
                      </div>
                    )}

                    {state === "LOW_CONF" && (
                      <div className="text-yellow-600 mt-2">
                        ⚠ Low confidence ({percent(r.confidence)})
                        <div className="mt-2">
                          Confirm Type:
                          <select className="ml-2 p-1 rounded bg-gray-200 dark:bg-gray-700">
                            {FILE_TYPES.map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {state === "NEEDS_TYPE" && (
                      <div className="text-yellow-600 mt-2">
                        ⚠ Type not detected | Rows: {r.rows_extracted}
                        <div className="mt-2">
                          Select Type:
                          <select className="ml-2 p-1 rounded bg-gray-200 dark:bg-gray-700">
                            {FILE_TYPES.map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {state === "PDF_WARNING" && (
                      <div className="text-orange-500 mt-2">
                        📄 Recognized as {r.detected_type} <br />
                        Confidence: {percent(r.confidence)} <br />
                        No structured rows found
                      </div>
                    )}

                    {state === "INVALID" && (
                      <div className="text-red-600 mt-2">
                        ❌ Invalid financial file
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
