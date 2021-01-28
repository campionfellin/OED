const { Client } = require('pg');

const pgclient = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
});

pgclient.connect();

const table = 'CREATE TABLE student(id SERIAL PRIMARY KEY, firstName VARCHAR(40) NOT NULL, lastName VARCHAR(40) NOT NULL, age INT, address VARCHAR(80), email VARCHAR(40))'
const text = 'INSERT INTO student(firstname, lastname, age, address, email) VALUES($1, $2, $3, $4, $5) RETURNING *'
const values = ['Mona the', 'Octocat', 9, '88 Colin P Kelly Jr St, San Francisco, CA 94107, United States', 'octocat@github.com']
const createUser = "CREATE USER test WITH PASSWORD 'postgres'"
const createDB = "CREATE DATABASE travis_ci_test"
const extension = "CREATE EXTENSION IF NOT EXISTS btree_gist;"
const sudo = "ALTER USER test WITH SUPERUSER;"

pgclient.query(table, (err, res) => {
    if (err) throw err
});

pgclient.query(text, values, (err, res) => {
    if (err) throw err
});

pgclient.query(createUser, (err, res) => {
  if (err) throw err
});

pgclient.query(createDB, (err, res) => {
  if (err) throw err
});

pgclient.query(sudo, (err, res) => {
  if (err) throw err
});

const pgclient2 = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: 'postgres',
  password: 'postgres',
  database: 'travis_ci_test'
});

pgclient2.query(extension, (err, res) => {
  if (err) throw err
});

pgclient2.query(sudo, (err, res) => {
  if (err) throw err
});

pgclient.query('SELECT * FROM student', (err, res) => {
    if (err) throw err
    console.log(err, res.rows) // Print the data in student table
    pgclient.end()
});
