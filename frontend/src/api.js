// ============================================================
// GoSubsidy Backend API
// ============================================================

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function parseResponse(response, fallbackMessage) {
  let body = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    throw new Error(
      body?.message ||
      body?.error ||
      fallbackMessage ||
      `Request failed (${response.status})`
    );
  }

  return body;
}

function unwrap(body) {
  if (body?.data !== undefined) return body.data;
  return body;
}

// ============================================================
// GET ALL SCHEMES
// ============================================================

export async function fetchSubsidies() {
  const response = await fetch(`${API_BASE_URL}/schemes`);
  const body = await parseResponse(response, "Failed to fetch schemes");
  return unwrap(body);
}

// ============================================================
// GET SCHEME BY ID
// ============================================================

export async function fetchScheme(id) {
  if (!id) throw new Error("Scheme ID is required.");

  const response = await fetch(
    `${API_BASE_URL}/schemes/${encodeURIComponent(id)}`
  );

  const body = await parseResponse(
    response,
    "Scheme is not available on the public website"
  );

  return unwrap(body);
}

// ============================================================
// ADMIN SCHEME DETAILS — ALL REVIEW STATUSES
// ============================================================
export async function fetchAdminScheme(id) {
  if (!id) throw new Error("Scheme ID is required.");

  const response = await fetch(
    `${API_BASE_URL}/schemes/admin/${encodeURIComponent(id)}`
  );

  const body = await parseResponse(response, "Failed to fetch admin scheme");
  return unwrap(body);
}

// ============================================================
// PUBLIC SCHEME LIST — PUBLISHED ONLY
// ============================================================
export async function fetchPublicSchemes() {
  const response = await fetch(`${API_BASE_URL}/schemes`);
  const body = await parseResponse(response, "Failed to fetch published schemes");
  return unwrap(body);
}

export const fetchSchemeById = fetchScheme;

// ============================================================
// CREATE SCHEME
// ============================================================

export async function createScheme(payload) {
  const response = await fetch(`${API_BASE_URL}/schemes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return unwrap(
    await parseResponse(response, "Failed to create scheme")
  );
}

// ============================================================
// UPDATE SCHEME
// ============================================================

export async function updateScheme(id, payload) {
  if (!id) throw new Error("Scheme ID is required.");

  const response = await fetch(
    `${API_BASE_URL}/schemes/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  return unwrap(
    await parseResponse(response, "Failed to update scheme")
  );
}

// ============================================================
// DELETE SCHEME
// ============================================================

export async function deleteScheme(id) {
  if (!id) throw new Error("Scheme ID is required.");

  const response = await fetch(
    `${API_BASE_URL}/schemes/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );

  return unwrap(
    await parseResponse(response, "Failed to delete scheme")
  );
}

// ============================================================
// AI ELIGIBILITY CHECK
// ============================================================

export async function checkEligibility(formData) {
  const response = await fetch(`${API_BASE_URL}/ai/eligibility`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  return unwrap(
    await parseResponse(response, "Failed to check eligibility")
  );
}

// ============================================================
// GENERIC POST
// ============================================================

export async function post(endpoint, body) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return unwrap(await parseResponse(response, "Request failed"));
}
// ============================================================
// BULK IMPORT SCHEMES
// ============================================================

export function importSchemes(file, onProgress) {
  if (!file) {
    return Promise.reject(
      new Error("Scheme import file is required.")
    );
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      `${API_BASE_URL}/schemes/import`
    );

    xhr.responseType = "json";

    // -----------------------------------------------
    // UPLOAD PROGRESS
    // -----------------------------------------------

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round(
          (event.loaded / event.total) * 100
        );

        onProgress(percent);
      }
    };

    // -----------------------------------------------
    // SUCCESS
    // -----------------------------------------------

    xhr.onload = () => {
      const body =
        xhr.response || {};

      if (
        xhr.status >= 200 &&
        xhr.status < 300
      ) {
        resolve(body);
        return;
      }

      reject(
        new Error(
          body?.message ||
            body?.error ||
            `Import failed (${xhr.status})`
        )
      );
    };

    // -----------------------------------------------
    // NETWORK ERROR
    // -----------------------------------------------

    xhr.onerror = () => {
      reject(
        new Error(
          "Unable to connect to GoSubsidy backend."
        )
      );
    };

    // -----------------------------------------------
    // ABORT
    // -----------------------------------------------

    xhr.onabort = () => {
      reject(
        new Error(
          "Scheme import was cancelled."
        )
      );
    };

    // -----------------------------------------------
    // SEND FILE
    // -----------------------------------------------

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    xhr.send(formData);
  });
}