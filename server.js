import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import aiRouter from './routes/aiRoutes.js';
import sql from "./configs/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

const initDB = async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS image_metadata (
        id SERIAL PRIMARY KEY,
        file_name TEXT,
        format TEXT,
        width INT,
        height INT,
        bit_depth TEXT,
        color_space TEXT,
        compression TEXT,
        resolution_unit TEXT,
        horizontal_resolution TEXT,
        vertical_resolution TEXT,
        dominant_r INT,
        dominant_g INT,
        dominant_b INT,
        has_alpha BOOLEAN,
        density TEXT,
        ai_summary TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ image_metadata table is ready");
  } catch (err) {
    console.error("❌ Failed to initialize DB:", err);
  }
};

initDB();


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send("Server is live!"));

app.use('/ai', aiRouter);

// Only start local server when not in Vercel

  app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));

export default app;