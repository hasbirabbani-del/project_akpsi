# WMS Prototype (Frontend Only)

Proyek ini adalah prototipe frontend untuk alur Warehouse QC & Packing (scan handling unit → verifikasi item → pilih/scan box → submit). Aplikasi ini hanya frontend, memakai mock/local state, dan menggunakan **CRACO** untuk override konfigurasi bawaan Create React App.

---

## 1. Prasyarat

- **Node.js**: disarankan versi LTS (16.x atau 18.x)
- **npm** sudah terpasang
- Jalankan semua perintah dari folder ini (folder yang ada `package.json`)


## 2. Step 1

npm install --legacy-peer-deps
npm install -D @craco/craco --legacy-peer-deps
npm install -D ajv@6.12.6 ajv-keywords@3.5.2 --legacy-peer-deps

## 3. Step 2

npm start
