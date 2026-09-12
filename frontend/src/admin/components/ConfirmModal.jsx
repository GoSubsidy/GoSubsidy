import React from "react";

export default function ConfirmModal({
  show,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block">

        <div className="modal-dialog modal-dialog-centered">

          <div className="modal-content">

            <div className="modal-header">

              <h5 className="modal-title">
                {title}
              </h5>

              <button
                className="btn-close"
                onClick={onCancel}
              ></button>

            </div>

            <div className="modal-body">

              <p>{message}</p>

            </div>

            <div className="modal-footer">

              <button
                className="btn btn-secondary"
                onClick={onCancel}
              >
                {cancelText}
              </button>

              <button
                className="btn btn-danger"
                onClick={onConfirm}
              >
                {confirmText}
              </button>

            </div>

          </div>

        </div>

      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}