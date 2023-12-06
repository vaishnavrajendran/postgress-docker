const express = require("express");
const pool = require("./db");

const app = express();

app.use(express.json());

app.get("/createUser", async (req, res) => {
  try {
    const createTableQuery = `CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )`;
    const data = await pool.query(createTableQuery);
    res.status(200).send(data);
  } catch (error) {
    console.log("ERROR", error);
  }
});

app.get("/createTodo", async (req, res) => {
  try {
    const createTodosQuery = `
        CREATE TABLE todos (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            user_id INTEGER REFERENCES users(id),
            done BOOLEAN DEFAULT FALSE
        )`;
    const data = await pool.query(createTodosQuery);
    res.status(200).send(data);
  } catch (error) {
    console.log("ERROR", error);
  }
});

app.post("/insertUser", async (req, res) => {
  try {
    const insertQuery = `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id`;
    const userValues = [req.body.email, req.body.password];
    const data = await pool.query(insertQuery, userValues);
    res.status(200).send(data);
  } catch (error) {
    console.log("ERROR", error);
  }
});

app.post("/insertTodo", async (req, res) => {
  try {
    const insertQuery = `INSERT INTO todos (title, description, user_id, done) VALUES ($1, $2, $3, $4) RETURNING id`;
    const todoValues = [
      req.body.title,
      req.body.description,
      req.body.user_id,
      req.body.done,
    ];
    const data = await pool.query(insertQuery, todoValues);
    res.status(200).send(data);
  } catch (error) {
    console.log("ERROR", error);
  }
});

app.post("/getToDo", async (req, res) => {
  try {
    const getQuery = `SELECT * FROM todos WHERE user_id = $1`;
    const getValues = [req.body.id];
    const data = await pool.query(getQuery, getValues);
    res.status(200).send(data);
  } catch (error) {
    console.log("ERROR", error);
  }
});

app.post("/updateToDo", async (req, res) => {
  try {
    const updateQuery = `UPDATE todos SET done = $1 WHERE id = $2`;
    const todoValues = [req.body.done, req.body.id];
    const data = await pool.query(updateQuery, todoValues);
    res.status(200).send(data);
  } catch (error) {
    console.log("ERROR", error);
  }
});

app.listen(3000, () => {
  console.log("Connected to express server");
});
