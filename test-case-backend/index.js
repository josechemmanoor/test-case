const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

// PostgreSQL connection config (local DB inside container)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',     // Postgres inside same container
  database: 'test-case_db',
  password: 'Jose@220',
  port: 5432,
});

// API endpoint to insert test cases
app.post('/api/testcases', async (req, res) => {
  try {
    const {
      test_scenario,
      testcase_description,
      prerequisite,
      steps_to_reproduce,
      expected_result,
      actual_result,
      test_result = 'not-tested', 
      status = 'not-tested',
      comments,
      test_suite
    } = req.body;

    const insertQuery = `
      INSERT INTO master_table
      (test_scenario, testcase_description, prerequisite, steps_to_reproduce, expected_result,
       actual_result, test_result, status, comments, test_suite)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;

    const values = [
      test_scenario,
      testcase_description,
      prerequisite,
      steps_to_reproduce,
      expected_result,
      actual_result,
      test_result,
      status,
      comments,
      test_suite
    ];

    const result = await pool.query(insertQuery, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting test case:", err);
    res.status(500).json({ error: "Server error while inserting test case" });
  }
});

// Serve frontend build folder (React static files)
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for all other routes (React Router support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the backend server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
