// src/config/api.js

export const API_BASE_URL = 'http://192.168.1.5:4000';

export const post = async (endpoint, body) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // handle non-200 responses safely
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || 'Request failed',
        status: response.status,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Server not reachable',
      error: error.message,
    };
  }
};

