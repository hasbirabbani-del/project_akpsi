// src/api/wmsApi.js
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

async function handleResponse(res) {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      data?.detail ||
      data?.message ||
      data?.error ||
      "Terjadi kesalahan pada server";
    throw new Error(message);
  }

  return data;
}

export async function packerLoginApi(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/packer-login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  return handleResponse(res);
}

export async function getWorkstationsApi(accessToken) {
  const res = await fetch(`${API_BASE_URL}/auth/workstations/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(res);
}

export async function assignWorkstationApi(
  accessToken,
  workstationId,
  packerUsername // boleh null
) {
  const payload = {
    workstation_id: workstationId,
  };

  if (packerUsername) {
    payload.packer_username = packerUsername;
  }

  const res = await fetch(`${API_BASE_URL}/auth/assign-workstation/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

export async function scanHandlingUnitApi(
  accessToken,
  huCode,
  username,
  workstationId
) {
  const res = await fetch(`${API_BASE_URL}/api/qc/scan-hu/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      handling_unit_code: huCode,
      username,
      workstation_id: workstationId,
    }),
  });

  return handleResponse(res);
}

export async function verifyItemApi(token, payload) {
  const res = await fetch(`${API_BASE}/api/qc/verify-item/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Gagal verifikasi item");
  }

  // kalau backend balikin json, ambil; kalau kosong, balikin object kosong
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function recommendBoxApi(accessToken, huCode) {
  const res = await fetch("http://127.0.0.1:8000/api/qc/recommend-box/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ hu_code: huCode }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.hu_code || "Gagal mendapatkan rekomendasi box");
  }

  return res.json();
}