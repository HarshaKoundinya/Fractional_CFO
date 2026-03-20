CREATE TABLE documents (
  id            SERIAL PRIMARY KEY,
  file_name     TEXT NOT NULL,
  file_path     TEXT NOT NULL,
  extracted_text TEXT,
  preview       TEXT,
  uploaded_at   TIMESTAMP DEFAULT NOW()
);

-- Example insert (replace with your actual files):
-- INSERT INTO documents (file_name, file_path, extracted_text, preview)
-- VALUES (
--   'example.pdf',
--   'C:\Users\Laptops Garage\Documents\iskcon\example.pdf',
--   'full extracted text here...',
--   'Short description of what this document is about.'
-- );
