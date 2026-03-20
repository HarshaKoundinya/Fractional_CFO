import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Get all documents (metadata only)
app.get('/api/documents', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, file_name, file_path, preview, uploaded_at FROM documents ORDER BY uploaded_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Get extracted text for a specific document
app.get('/api/documents/:id/text', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT extracted_text FROM documents WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Document not found' });
    res.json({ extracted_text: result.rows[0].extracted_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch extracted text' });
  }
});

app.listen(3001, () => console.log('API server running on http://localhost:3001'));
