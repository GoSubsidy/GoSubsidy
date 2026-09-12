import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaCloudUploadAlt,
  FaFileExcel,
  FaFileCsv,
  FaTrash,
  FaDownload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUpload,
} from "react-icons/fa";

import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

import { API_BASE_URL } from "../../api";

export default function UploadSchemes() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ======================================================
  // STATE
  // ======================================================

  const [file, setFile] = useState(null);

  const [uploading, setUploading] =
    useState(false);

  const [dragActive, setDragActive] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [progress, setProgress] =
    useState(0);

  const [importResult, setImportResult] =
    useState(null);

  // ======================================================
  // FILE VALIDATION
  // ======================================================

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      return false;
    }

    const fileName =
      selectedFile.name.toLowerCase();

    const allowedExtensions = [
      ".csv",
      ".xls",
      ".xlsx",
    ];

    const isAllowed =
      allowedExtensions.some((extension) =>
        fileName.endsWith(extension)
      );

    if (!isAllowed) {
      setErrorMessage(
        "Only CSV, XLS and XLSX files are allowed."
      );

      return false;
    }

    // Maximum 20 MB
    const maxSize =
      20 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setErrorMessage(
        "File size must be less than 20 MB."
      );

      return false;
    }

    return true;
  };

  // ======================================================
  // SELECT FILE
  // ======================================================

  const handleFile = (selectedFile) => {
    setErrorMessage("");
    setSuccessMessage("");
    setImportResult(null);
    setProgress(0);

    if (!validateFile(selectedFile)) {
      return;
    }

    setFile(selectedFile);
  };

  // ======================================================
  // FILE INPUT
  // ======================================================

  const handleFileChange = (event) => {
    const selectedFile =
      event.target.files?.[0];

    handleFile(selectedFile);
  };

  // ======================================================
  // DRAG & DROP
  // ======================================================

  const handleDragOver = (event) => {
    event.preventDefault();

    if (uploading) return;

    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();

    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setDragActive(false);

    if (uploading) return;

    const droppedFile =
      event.dataTransfer.files?.[0];

    handleFile(droppedFile);
  };

  // ======================================================
  // REMOVE FILE
  // ======================================================

  const removeFile = () => {
    if (uploading) return;

    setFile(null);
    setProgress(0);
    setErrorMessage("");
    setSuccessMessage("");
    setImportResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ======================================================
  // FORMAT FILE SIZE
  // ======================================================

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return "0 KB";
    }

    const mb =
      bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }

    const kb =
      bytes / 1024;

    return `${kb.toFixed(2)} KB`;
  };

  // ======================================================
  // FILE ICON
  // ======================================================

  const getFileIcon = () => {
    if (!file) {
      return (
        <FaFileExcel
          size={40}
          className="text-success"
        />
      );
    }

    if (
      file.name
        .toLowerCase()
        .endsWith(".csv")
    ) {
      return (
        <FaFileCsv
          size={40}
          className="text-primary"
        />
      );
    }

    return (
      <FaFileExcel
        size={40}
        className="text-success"
      />
    );
  };

  // ======================================================
  // REAL BULK IMPORT
  // ======================================================

  const handleImport = async () => {
    if (!file) {
      setErrorMessage(
        "Please select a CSV or Excel file first."
      );

      return;
    }

    try {
      setUploading(true);

      setErrorMessage("");
      setSuccessMessage("");
      setImportResult(null);
      setProgress(5);

      // ==================================================
      // XHR IS USED INSTEAD OF FETCH
      // ==================================================
      //
      // Reason:
      // XMLHttpRequest provides real upload progress.
      // ==================================================

      const result =
        await new Promise(
          (resolve, reject) => {
            const xhr =
              new XMLHttpRequest();

            xhr.open(
              "POST",
              `${API_BASE_URL}/schemes/import`
            );

            xhr.responseType = "json";

            // --------------------------------------------
            // UPLOAD PROGRESS
            // --------------------------------------------

            xhr.upload.onprogress = (
              event
            ) => {
              if (
                event.lengthComputable
              ) {
                const uploadPercent =
                  Math.round(
                    (event.loaded /
                      event.total) *
                      100
                  );

                // Reserve final 15% for
                // backend processing.
                const displayPercent =
                  Math.min(
                    85,
                    Math.max(
                      5,
                      Math.round(
                        uploadPercent *
                          0.85
                      )
                    )
                  );

                setProgress(
                  displayPercent
                );
              }
            };

            // --------------------------------------------
            // SUCCESS / PARTIAL SUCCESS
            // --------------------------------------------

            xhr.onload = () => {
              const body =
                xhr.response || {};

              // 200 = complete success
              // 207 = partial success
              if (
                xhr.status >= 200 &&
                xhr.status < 300
              ) {
                setProgress(100);

                resolve(body);

                return;
              }

              reject(
                new Error(
                  body?.message ||
                    "Scheme import failed."
                )
              );
            };

            // --------------------------------------------
            // NETWORK ERROR
            // --------------------------------------------

            xhr.onerror = () => {
              reject(
                new Error(
                  "Unable to connect to the GoSubsidy backend."
                )
              );
            };

            // --------------------------------------------
            // ABORT
            // --------------------------------------------

            xhr.onabort = () => {
              reject(
                new Error(
                  "Scheme import was cancelled."
                )
              );
            };

            // --------------------------------------------
            // SEND FILE
            // --------------------------------------------

            const formData =
              new FormData();

            formData.append(
              "file",
              file
            );

            xhr.send(formData);
          }
        );

      // ==================================================
      // STORE RESULT
      // ==================================================

      setImportResult(result);

      // ==================================================
      // READ BACKEND COUNTS
      // ==================================================

      const totalRows =
        result?.totalRows ??
        result?.summary?.totalRows ??
        0;

      const imported =
        result?.imported ??
        result?.summary?.imported ??
        0;

      const duplicates =
        result?.duplicates ??
        result?.summary?.duplicates ??
        0;

      const invalid =
        result?.invalid ??
        result?.summary?.invalid ??
        0;

      const failed =
        result?.failed ??
        result?.summary?.failed ??
        0;

      // ==================================================
      // SUCCESS MESSAGE
      // ==================================================

      if (imported > 0) {
        setSuccessMessage(
          `${imported} scheme${
            imported === 1
              ? ""
              : "s"
          } imported successfully.`
        );
      } else if (
        duplicates > 0 &&
        invalid === 0 &&
        failed === 0
      ) {
        setSuccessMessage(
          "Import completed. All uploaded schemes already exist."
        );
      } else if (
        totalRows === 0
      ) {
        setSuccessMessage(
          "Import completed."
        );
      } else {
        setSuccessMessage(
          "Scheme import completed with some rejected rows."
        );
      }

    } catch (error) {
      console.error(
        "Scheme import error:",
        error
      );

      setProgress(0);

      setImportResult(null);

      setErrorMessage(
        error?.message ||
          "Unable to import schemes."
      );
    } finally {
      setUploading(false);
    }
  };

  // ======================================================
  // DOWNLOAD TEMPLATE
  // ======================================================

  const downloadTemplate = () => {
    const headers = [
      "scheme_name",
      "short_name",
      "category",
      "ministry",
      "department",
      "sector",
      "beneficiary",
      "description",
      "status",
      "official_website",
      "apply_link",
      "state",
      "last_verified",
    ];

    const example = [
      "Example Government Scheme",
      "EGS",
      "Agriculture",
      "Ministry of Agriculture",
      "Department Name",
      "Agriculture",
      "Farmers",
      "Example scheme description",
      "Draft",
      "https://example.gov.in",
      "https://example.gov.in/apply",
      "All India",
      "2026-08-01",
    ];

    const csvContent = [
      headers.join(","),

      example
        .map((value) =>
          `"${String(value).replace(
            /"/g,
            '""'
          )}"`
        )
        .join(","),
    ].join("\n");

    const blob =
      new Blob(
        [csvContent],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "gosubsidy-scheme-import-template.csv";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(url);
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <Layout>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">

        <PageHeader
          title="Import Government Schemes"
          subtitle="Bulk upload schemes using CSV or Excel files"
        />

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() =>
            navigate("/admin/schemes")
          }
          disabled={uploading}
        >
          <FaArrowLeft className="me-2" />

          Back to Schemes
        </button>

      </div>

      {/* =================================================
          SUCCESS
      ================================================= */}

      {successMessage && (
        <div
          className="alert alert-success d-flex align-items-center"
          role="alert"
        >
          <FaCheckCircle className="me-2" />

          <div>
            {successMessage}
          </div>
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {errorMessage && (
        <div
          className="alert alert-danger d-flex align-items-start"
          role="alert"
        >
          <FaExclamationTriangle
            className="me-2 mt-1"
          />

          <div>
            {errorMessage}
          </div>
        </div>
      )}

      {/* =================================================
          IMPORT SUMMARY
      ================================================= */}

      {importResult && (
        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body p-4">

            <h5 className="fw-bold mb-3">
              Import Summary
            </h5>

            <div className="row g-3">

              {/* TOTAL */}

              <div className="col-md-3">

                <div className="border rounded-3 p-3 h-100">

                  <div className="text-muted small">
                    Total Rows
                  </div>

                  <div className="fs-4 fw-bold">
                    {importResult?.totalRows ??
                      importResult?.summary?.totalRows ??
                      0}
                  </div>

                </div>

              </div>

              {/* IMPORTED */}

              <div className="col-md-3">

                <div className="border border-success rounded-3 p-3 h-100">

                  <div className="text-success small">
                    Imported
                  </div>

                  <div className="fs-4 fw-bold text-success">
                    {importResult?.imported ??
                      importResult?.summary?.imported ??
                      0}
                  </div>

                </div>

              </div>

              {/* DUPLICATES */}

              <div className="col-md-3">

                <div className="border border-warning rounded-3 p-3 h-100">

                  <div className="text-warning small">
                    Duplicates
                  </div>

                  <div className="fs-4 fw-bold text-warning">
                    {importResult?.duplicates ??
                      importResult?.summary?.duplicates ??
                      0}
                  </div>

                </div>

              </div>

              {/* INVALID / FAILED */}

              <div className="col-md-3">

                <div className="border border-danger rounded-3 p-3 h-100">

                  <div className="text-danger small">
                    Invalid / Failed
                  </div>

                  <div className="fs-4 fw-bold text-danger">
                    {(
                      importResult?.invalid ??
                      importResult?.summary?.invalid ??
                      0
                    ) +
                      (
                        importResult?.failed ??
                        importResult?.summary?.failed ??
                        0
                      )}
                  </div>

                </div>

              </div>

            </div>

            {/* ==========================================
                ROW ERRORS
            ========================================== */}

            {Array.isArray(
              importResult?.errors
            ) &&
              importResult.errors.length >
                0 && (
                <div className="mt-4">

                  <h6 className="fw-bold">
                    Import Details
                  </h6>

                  <div
                    className="table-responsive"
                    style={{
                      maxHeight:
                        "300px",
                    }}
                  >

                    <table className="table table-sm align-middle">

                      <thead>
                        <tr>
                          <th>
                            Row
                          </th>

                          <th>
                            Scheme
                          </th>

                          <th>
                            Issue
                          </th>
                        </tr>
                      </thead>

                      <tbody>

                        {importResult.errors.map(
                          (
                            item,
                            index
                          ) => (
                            <tr
                              key={`${item.row}-${index}`}
                            >
                              <td>
                                {item.row ??
                                  "-"}
                              </td>

                              <td>
                                {item.scheme_name ||
                                  "-"}
                              </td>

                              <td className="text-danger">
                                {item.error ||
                                  "Unable to import row."}
                              </td>
                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>
              )}

          </div>

        </div>
      )}

      <div className="row g-4">

        {/* =================================================
            UPLOAD AREA
        ================================================= */}

        <div className="col-lg-8">

          <div className="card border-0 shadow-sm">

            <div className="card-header bg-white border-0 pt-4 px-4">

              <h5 className="fw-bold mb-1">
                Upload Scheme Data
              </h5>

              <p className="text-muted small mb-0">
                Select a CSV or Excel file containing
                Government Scheme records.
              </p>

            </div>

            <div className="card-body p-4">

              {/* =========================================
                  DROP AREA
              ========================================= */}

              <div
                className={`border border-2 rounded-4 p-5 text-center ${
                  dragActive
                    ? "border-primary bg-light"
                    : "border-secondary-subtle"
                }`}
                style={{
                  cursor: uploading
                    ? "default"
                    : "pointer",
                  transition:
                    "all 0.2s ease",
                }}
                onDragOver={
                  handleDragOver
                }
                onDragLeave={
                  handleDragLeave
                }
                onDrop={
                  handleDrop
                }
                onClick={() => {
                  if (!uploading) {
                    fileInputRef.current?.click();
                  }
                }}
              >

                <FaCloudUploadAlt
                  size={58}
                  className="text-primary mb-3"
                />

                <h5 className="fw-bold">
                  Drag & Drop your file here
                </h5>

                <p className="text-muted mb-3">
                  or click to browse your computer
                </p>

                <button
                  type="button"
                  className="btn btn-primary px-4"
                  onClick={(event) => {
                    event.stopPropagation();

                    if (!uploading) {
                      fileInputRef.current?.click();
                    }
                  }}
                  disabled={uploading}
                >
                  Choose File
                </button>

                <div className="small text-muted mt-3">
                  Supported formats: CSV, XLS, XLSX
                  <br />
                  Maximum file size: 20 MB
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept=".csv,.xls,.xlsx"
                  onChange={
                    handleFileChange
                  }
                />

              </div>

              {/* =========================================
                  SELECTED FILE
              ========================================= */}

              {file && (
                <div className="border rounded-4 p-3 mt-4">

                  <div className="d-flex align-items-center justify-content-between gap-3">

                    <div className="d-flex align-items-center gap-3">

                      {getFileIcon()}

                      <div>

                        <div className="fw-semibold">
                          {file.name}
                        </div>

                        <small className="text-muted">
                          {formatFileSize(
                            file.size
                          )}
                        </small>

                      </div>

                    </div>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={
                        removeFile
                      }
                      disabled={
                        uploading
                      }
                    >
                      <FaTrash />
                    </button>

                  </div>

                </div>
              )}

              {/* =========================================
                  PROGRESS
              ========================================= */}

              {progress > 0 && (
                <div className="mt-4">

                  <div className="d-flex justify-content-between mb-2">

                    <small className="fw-semibold">
                      {progress < 100
                        ? "Uploading & processing..."
                        : "Import complete"}
                    </small>

                    <small>
                      {progress}%
                    </small>

                  </div>

                  <div
                    className="progress"
                    style={{
                      height: "8px",
                    }}
                  >

                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${progress}%`,
                      }}
                      aria-valuenow={
                        progress
                      }
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />

                  </div>

                </div>
              )}

              {/* =========================================
                  ACTIONS
              ========================================= */}

              <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={
                    removeFile
                  }
                  disabled={
                    !file ||
                    uploading
                  }
                >
                  Clear
                </button>

                <button
                  type="button"
                  className="btn btn-success"
                  onClick={
                    handleImport
                  }
                  disabled={
                    !file ||
                    uploading
                  }
                >

                  {uploading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />

                      Processing...
                    </>
                  ) : (
                    <>
                      <FaUpload className="me-2" />

                      Import Schemes
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            IMPORT GUIDE
        ================================================= */}

        <div className="col-lg-4">

          {/* ===============================================
              TEMPLATE
          =============================================== */}

          <div className="card border-0 shadow-sm mb-4">

            <div className="card-body p-4">

              <h5 className="fw-bold mb-3">
                Import Template
              </h5>

              <p className="text-muted small">
                Download the standard GoSubsidy
                template before preparing your
                scheme data.
              </p>

              <button
                type="button"
                className="btn btn-outline-success w-100"
                onClick={
                  downloadTemplate
                }
                disabled={uploading}
              >
                <FaDownload className="me-2" />

                Download CSV Template
              </button>

            </div>

          </div>

          {/* ===============================================
              GUIDELINES
          =============================================== */}

          <div className="card border-0 shadow-sm">

            <div className="card-body p-4">

              <h5 className="fw-bold mb-3">
                Import Guidelines
              </h5>

              <ol className="text-muted small ps-3 mb-0">

                <li className="mb-2">
                  Download the GoSubsidy import
                  template.
                </li>

                <li className="mb-2">
                  Enter one Government Scheme
                  per row.
                </li>

                <li className="mb-2">
                  Do not change the column
                  names.
                </li>

                <li className="mb-2">
                  Scheme Name should not be
                  empty.
                </li>

                <li className="mb-2">
                  Use Draft or Published for
                  status.
                </li>

                <li>
                  Upload the completed CSV or
                  Excel file.
                </li>

              </ol>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}