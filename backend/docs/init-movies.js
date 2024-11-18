const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

async function runSQLFile() {
    const client = new Client({
        user: process.env.DB_USERNAME,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    const sqlFilePath = path.join(__dirname, "insert-movies.sql");
    const sql = fs.readFileSync(sqlFilePath, "utf8");

    try {
        await client.connect();
        console.log("Connected to the database!");

        await client.query(sql);
        console.log("SQL script executed successfully!");
    } catch (err) {
        console.error("Error executing SQL script:", err);
    } finally {
        await client.end();
    }
}

runSQLFile();
