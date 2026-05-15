import express, {} from "express";
import { Pool } from "pg";
import config from "./config";
const app = express();
const port = config.port;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const pool = new Pool({
    connectionString: config.connection_string,
});
const initDB = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(50),
      email VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(50) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      age INT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `);
        console.log("Database connected successfully");
    }
    catch (error) {
        console.log(error);
    }
};
initDB();
app.get("/", (req, res) => {
    //   res.send("Express server is running");
    return res.status(200).json({
        message: "Express Server",
        author: "Saifullah Kabir",
    });
});
//* create user
app.post("/api/users", async (req, res) => {
    try {
        const { name, email, password, age } = req.body;
        const result = await pool.query(`
    INSERT INTO  users(name, email, password, age) VALUES($1, $2, $3, $4) 
    RETURNING *
    `, [name, email, password, age]);
        return res.status(201).json({
            success: true,
            message: "User Created Successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
//* get all users
app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT * FROM users
      `);
        return res.status(200).json({
            success: true,
            message: "Users retrived successfully",
            data: result.rows,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
//* get single user
app.get("/api/users/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query(`
      SELECT * FROM users WHERE id=$1
      `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User retrived successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
//* update user data
app.put("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, password, age, is_active } = req.body;
    try {
        const result = await pool.query(`
      UPDATE users SET 
      name=COALESCE($1, name), 
      password=COALESCE($2, password), 
      age=COALESCE($3, age), 
      is_active=COALESCE($4, is_active) 
      
      WHERE id=$5 RETURNING *
      `, [name, password, age, is_active, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
//* delete user
app.delete("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
      DELETE FROM users WHERE id=$1
      `, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=server.js.map