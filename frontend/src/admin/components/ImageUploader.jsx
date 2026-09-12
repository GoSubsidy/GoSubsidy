import React, { useRef, useState } from "react";
import {
  FaCloudUploadAlt,
  FaTrash,
  FaImage,
} from "react-icons/fa";

export default function ImageUploader({
  label = "Upload Image",
  value = null,
  onChange,
  accept = "image/*",
}) {
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(
    value || null
  );

  function handleFile(file) {
    if (!file) return;

    // Validate image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    // Max Size 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Maximum image size is 5MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);

    if (onChange) {
      onChange(file);
    }
  }

  function handleDrop(e) {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    handleFile(file);
  }

  function handleRemove() {
    setPreview(null);

    if (onChange) {
      onChange(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

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
            cursor: "pointer",
            background: "#fafafa",
          }}

          onClick={() =>
            fileInputRef.current.click()
          }

          onDragOver={(e) => e.preventDefault()}

          onDrop={handleDrop}
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="img-fluid rounded"
              style={{
                maxHeight: "250px",
                objectFit: "contain",
              }}
            />
          ) : (
            <>
              <FaCloudUploadAlt
                size={50}
                className="text-primary mb-3"
              />

              <h5>Click or Drag Image</h5>

              <p className="text-muted mb-0">

                JPG • PNG • WEBP

                <br />

                Max Size 5MB

              </p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept={accept}
          onChange={(e) =>
            handleFile(e.target.files[0])
          }
        />

        <div className="mt-3 d-flex gap-2">

          <button
            type="button"
            className="btn btn-outline-primary"

            onClick={() =>
              fileInputRef.current.click()
            }
          >
            <FaImage className="me-2" />

            Choose Image
          </button>

          {preview && (
            <button
              type="button"
              className="btn btn-outline-danger"

              onClick={handleRemove}
            >
              <FaTrash className="me-2" />

              Remove
            </button>
          )}

        </div>

      </div>

    </div>
  );
}