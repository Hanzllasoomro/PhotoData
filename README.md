# 📸 PhotoData – Intelligent Image Metadata Extractor

PhotoData is a powerful **Node.js + Express API** that extracts deep **technical details** from uploaded images — including resolution, bit depth, color space, compression, RGB values, and more.  
It also uses **Google Gemini AI** to generate a **human-readable summary** of the image’s technical properties.  
All extracted data is stored in a **PostgreSQL (Neon)** database for persistent access and analysis.

---

## 🚀 Features

- ✅ Extracts key image metadata using `sharp` and `ExifReader`
- 🎨 Detects **dominant RGB colors** and alpha channel
- 🧠 Uses **Gemini AI** for intelligent metadata summarization
- 🗄️ Saves metadata records to a **Neon PostgreSQL** database
- ☁️ Supports image uploads with `multer`

---

## 🧩 Tech Stack

| Component | Technology |
|------------|-------------|
| **Backend** | Node.js, Express |
| **AI Engine** | Google Gemini (via OpenAI SDK) |
| **Database** | Neon (PostgreSQL Serverless) |
| **Image Processing** | Sharp, ExifReader |
| **File Uploads** | Multer |

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/PhotoData.git
cd PhotoData
```
### 2. Install Dependencies

```bash
npm install
```
### 3. Create a .env File

```bash
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
PORT=3000

GEMINI_API_KEY=<your-gemini-api-key>

CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```
⚠️ Replace placeholders (<user>, <password>, <host>, etc.) with your actual credentials.

