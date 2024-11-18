const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

async function runSQLFile() {
    const sqlFilePath = path.join(__dirname, "insert-movies.sql");
    const sql = fs.readFileSync(sqlFilePath, "utf8");

    while (true) {
        const client = new Client({
            user: process.env.DB_USERNAME,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        });

        try {
            console.log("Checking database connection...");
            await client.connect();
            console.log("Connected to the database!");

            console.log("Checking if table 'movie_entity' exists...");
            const res = await client.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'movie_entity'
                );
            `);

            if (res.rows[0].exists) {
                console.log("Table 'movie_entity' exists. Running SQL script...");
                await client.query(sql);
                console.log("SQL script executed successfully!");
                break;
            } else {
                console.log("Table 'movie_entity' does not exist. Retrying in 5 seconds...");
            }
        } catch (err) {
            console.error("Error during database initialization:", err.message);
        } finally {
            await client.end();
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
    }
}

runSQLFile();