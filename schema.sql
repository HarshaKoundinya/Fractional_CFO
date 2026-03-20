CREATE TABLE documents (
  id            SERIAL PRIMARY KEY,
  file_name     TEXT NOT NULL,
  file_path     TEXT NOT NULL,
  extracted_text TEXT,
  preview       TEXT,
  uploaded_at   TIMESTAMP DEFAULT NOW()
);

INSERT INTO documents (file_name, file_path, extracted_text, preview) VALUES (
  '2024 ISKCON I&E.xlsx',
  'C:\Users\Laptops Garage\Documents\iskcon\2024 ISKCON I&E.xlsx',
  '',
  'ISKCON income and expenditure report for the full year 2024.'
);

INSERT INTO documents (file_name, file_path, extracted_text, preview) VALUES (
  '2025 ISKCON DC Non-Operating I&E (by month).xlsx',
  'C:\Users\Laptops Garage\Documents\iskcon\2025 ISKCON DC Non-Operating I&E (by month).xlsx',
  '',
  'ISKCON DC non-operating income and expenditure breakdown by month for 2025.'
);

INSERT INTO documents (file_name, file_path, extracted_text, preview) VALUES (
  '2025 ISKCON DC Operating I&E (by month).xlsx',
  'C:\Users\Laptops Garage\Documents\iskcon\2025 ISKCON DC Operating I&E (by month).xlsx',
  '',
  'ISKCON DC operating income and expenditure breakdown by month for 2025.'
);
