# QR Code Generator

A full-stack application for generating, managing, and tracking QR codes. Supports URL, Plain Text, Email, Phone Number, and WiFi QR codes with customizable colors and sizes.

![Vue.js](https://img.shields.io/badge/Vue.js_3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/qr-code-manager.git
cd qr-code-manager

# Install all dependencies
npm run install-all
```

---

## Environment Variables

Create a `.env` file in the **server** directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qr-code-manager
```

Create a `.env` file in the **client** directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running the App

```bash
# Start both frontend and backend
npm run dev
```

Open at: http://localhost:5173