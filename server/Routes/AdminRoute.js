import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const router = express.Router();

router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * from admin Where username = ? and password = ?";
  con.query(sql, [req.body.username, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const username = result[0].username;
      const token = jwt.sign(
        {
          role: "admin",
          username: username,
        },
        "moja_tajna_sifra",
        { expiresIn: "1d" }
      );
      res.cookie("token", token);
      return res.json({ loginStatus: true });
    } else {
      return res.json({
        loginStatus: false,
        Error: "Wrong username or password ",
      });
    }
  });
});

router.post("/addUser", (req, res) => {
  const sql =
    "INSERT INTO user (username, password, name, orders, imageUrl, dateOfBirth) VALUES (?)";

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      console.error("Bcrypt error:", err);
      return res.json({ Status: false, Error: "Hashing error" });
    }

    const values = [
      req.body.username,
      hash,
      req.body.name,
      req.body.orders,
      req.body.imageUrl,
      req.body.dateOfBirth,
    ];

    console.log("Executing query with values:", values); // Log the values being inserted

    con.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Query error:", err); // Log the error
        return res.json({ Status: false, Error: "Query error" });
      }
      console.log("User added successfully:", result);
      return res.json({ Status: true });
    });
  });
});

router.get("/user", (req, res) => {
  const sql = "SELECT * FROM user";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// Fetch single user by ID
router.get("/user/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM user WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    if (result.length > 0) {
      return res.json({ Status: true, Result: result[0] });
    } else {
      return res.json({ Status: false, Error: "User not found" });
    }
  });
});

// Update user details
router.put("/updateUser/:id", (req, res) => {
  const { id } = req.params;
  const { username, name, orders, imageUrl, dateOfBirth } = req.body;
  const sql =
    "UPDATE user SET username = ?, name = ?, orders = ?, imageUrl = ?, dateOfBirth = ? WHERE id = ?";
  con.query(
    sql,
    [username, name, orders, imageUrl, dateOfBirth, id],
    (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });
      return res.json({ Status: true, Result: result });
    }
  );
});

// Update user details to block them
router.put("/blockUser/:id", (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE user SET status = 'blocked' WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

export { router as adminRouter };
