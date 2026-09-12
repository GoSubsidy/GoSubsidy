import React, { useRef, useState, useEffect } from "react";
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileAlt,
  FaTrash,
  FaDownload,
} from "react-icons/fa";

export default function FileUploader({
  label = "Upload File",
  value = null,
  onChange,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.csv",
  maxSize = 10, // MB
}) {
  const inputRef = useRef(null);

  const [fileInfo, setFileInfo] = useState(null);

  useEffect(() => {
    if (value instanceof File) {
      setFileInfo({
        file: value,
        url: URL.createObjectURL(value),
      });
    } else if (typeof value === "string" && value !== "") {
      setFileInfo({
        file: {
          name: value.split("/").pop(),
        },
        url: value,
      });
    } else {
      setFileInfo(null);
    }
  }, [value]);

  const getIcon = (name) => {
    const ext = name.toLowerCase();

    if (ext.endsWith(".pdf"))
      return <FaFilePdf size={45} className="text-danger" />;

    if (
      ext.endsWith(".doc") ||
      ext.endsWith(".docx")
    )
      return <FaFileWord size={45} className="text-primary" />;

    if (
      ext.endsWith(".xls") ||
      ext.endsWith(".xlsx") ||
      ext.endsWith(".csv")
    )
      return <FaFileExcel size={45} className="text-success" />;

    return <FaFileAlt size={45} className="text-secondary" />;
  };

  const processFile = (file) => {
    if (!file) return;

    const allowed = [
      "application/pdf",

      "application/msword",

      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

      "application/vnd.ms-excel",

      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "text/csv",
    ];

    if (!allowed.includes(file.type)) {
      alert("Unsupported file format.");
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      alert(`Maximum file size is ${maxSize} MB.`);
      return;
    }

    setFileInfo({
      file,
      url: URL.createObjectURL(file),
    });

    if (onChange) {
      onChange(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    processFile(e.dataTransfer.files[0]);
  };

  const removeFile = () => {
    setFileInfo(null);

    if (onChange) {
      onChange(null);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="card shadow-sm border-0">

      <div className="card-body">

        <label className="form-label fw-bold">
          {label}
        </label>

        <div
          className="border border-2 rounded-4 p-4 text-center"
          style={{
            borderStyle: "dashed",
            background: "#fafafa",
            cursor: "pointer",
          }}
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {fileInfo ? (
            <>
              {getIcon(fileInfo.file.name)}

              <h5 className="mt-3">
                {fileInfo.file.name}
              </h5>

              <small className="text-muted">
                Ready to upload
              </small>
            </>
          ) : (
            <>
              <FaCloudUploadAlt
                size={50}
                className="text-primary mb-3"
              />

              <h5>
                Click or Drag File Here
              </h5>

              <p className="text-muted mb-0">
                PDF • DOC • DOCX
                <br />
                XLS • XLSX • CSV
                <br />
                Max {maxSize} MB
              </p>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          hidden
          accept={accept}
          onChange={(e) =>
            processFile(e.target.files[0])
          }
        />

        <div className="mt-3 d-flex gap-2 flex-wrap">

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() =>
              inputRef.current.click()
            }
          >
            Choose File
          </button>

          {fileInfo && (
            <>
              <a
                href={fileInfo.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-success"
              >
                <FaDownload className="me-2" />
                Open
              </a>

              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={removeFile}
              >
                <FaTrash className="me-2" />
                Remove
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  );
}