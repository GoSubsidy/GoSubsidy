import React, { useMemo, useState } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";

import StatusBadge from "./StatusBadge";

export default function DataTable({
  columns = [],
  data = [],
  loading = false,

  selectedRows = [],
  onSelectRow = () => {},
  onSelectAll = () => {},

  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) {
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const sortedData = useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const valueA = a[sortField] ?? "";
      const valueB = b[sortField] ?? "";

      if (typeof valueA === "string") {
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return sortDirection === "asc"
        ? valueA - valueB
        : valueB - valueA;
    });
  }, [data, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field)
      return <FaSort className="ms-1 text-muted" />;

    return sortDirection === "asc"
      ? <FaSortUp className="ms-1 text-primary" />
      : <FaSortDown className="ms-1 text-primary" />;
  };

  if (loading) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body text-center py-5">

          <div className="spinner-border text-primary" />

          <p className="mt-3 mb-0">
            Loading schemes...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">

      <div className="table-responsive">

        <table className="table table-hover align-middle mb-0">

          <thead className="table-light">

            <tr>

              <th width="45">
                <input
                  type="checkbox"
                  checked={
                    data.length > 0 &&
                    selectedRows.length === data.length
                  }
                  onChange={onSelectAll}
                />
              </th>

              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {renderSortIcon(col.key)}
                </th>
              ))}

              <th width="170">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {sortedData.length === 0 ? (
              <tr>

                <td
                  colSpan={columns.length + 2}
                  className="text-center py-5 text-muted"
                >
                  No records found.
                </td>

              </tr>
            ) : (
              sortedData.map((row) => (
                <tr key={row.id}>

                  <td>

                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => onSelectRow(row.id)}
                    />

                  </td>

                  {columns.map((col) => (
                    <td key={col.key}>

                      {col.key === "status" ? (
                        <StatusBadge status={row.status} />
                      ) : (
                        row[col.key]
                      )}

                    </td>
                  ))}

                  <td>

                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      title="View"
                      onClick={() => onView(row)}
                    >
                      <FaEye />
                    </button>

                    <button
                      className="btn btn-sm btn-outline-warning me-2"
                      title="Edit"
                      onClick={() => onEdit(row)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      title="Delete"
                      onClick={() => onDelete(row)}
                    >
                      <FaTrash />
                    </button>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}