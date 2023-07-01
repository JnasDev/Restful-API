const express = require("express");
const mysql = require("mysql");

const app = express();
app.use(express.json());

// connection = database ใน phpmyadmin(ไม่ไช่ columns)
// MySQL Connection
const connection = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "root",
   database: "mysql_nodejs",
});

connection.connect((err) => {
   if (err) {
      console.log("Error connecting to MySQL database =", err);
      return;
   }
   console.log("MySQL connected successfully.");
});

// Create Routes

app.post("/create", async (req, res) => {
   const { email, name, password } = req.body; //destructoring // ต้องเรียงตามตารางใน MySQL (ไม่สามารถตั้งfullข้างหน้าได้เลยตั้งเป็น "name")

   try {
      connection.query(
         "INSERT INTO users(email, fullname, password) VALUES (?, ?, ?)", // ต้องเรียงตามตารางใน MySQL
         [email, name, password], // ต้องเรียงตามตารางใน MySQL (ไม่สามารถตั้งfullข้างหน้าได้เลยตั้งเป็น "name")
         (err, result, fields) => {
            if (err) {
               console.log(
                  "Error while inserting a user into the database",
                  err
               );
               return res.status(400).send();
            }
            res.status(201).json({ message: "New user successfully created" });
         }
      );
   } catch (error) {
      console.log("Something went wrong: ", error);
      return res.status(500).send();
   }
});

// READ
app.get("/read", (req, res) => {
   try {
      connection.query("SELECT * FROM users", (err, result, fields) => {
         if (err) {
            console.log(err);
            return res.status(400).send();
         }
         res.status(200).json(result);
      });
   } catch (error) {
      console.log(err);
      return res.status(500).send();
   }
});

// READ Single user from database
app.get("/read/single/:id", (req, res) => {
   const id = req.params.id;

   try {
      connection.query(
         "SELECT * FROM users WHERE id = ?",
         [id],
         (err, result, fields) => {
            if (err) {
               console.log(err);
               return res.status(400).send();
            }
            res.status(200).json(result);
         }
      );
   } catch (error) {
      console.log(err);
      return res.status(500).send();
   }
});

// Update Data
app.patch("/update/:id", async (req, res) => {
   const id = req.params.id;
   const newPassword = req.body.newPassword;

   try {
      connection.query(
         "UPDATE users SET password = ? WHERE id = ?",
         [newPassword, id],
         (err, result, fields) => {
            if (err) {
               console.log(err);
               return res.status(400).send();
            }
            res.status(200).json({
               message: "user password has been updated!",
            });
         }
      );
   } catch (error) {
      console.log(err);
      return res.status(500).send();
   }
});

// DELETE
app.delete("/delete/:id", async (req, res) => {
   const id = req.params.id;

   try {
      connection.query(
         "DELETE FROM users WHERE id = ?",
         [id],
         (err, result, fields) => {
            if (err) {
               console.log(err);
               return res.status(400).send();
            }
            if (result.affectedRows === 0) {
               return res
                  .status(404)
                  .json({ message: "No user with that id!" });
            }
            return res.status(200).json({ message: "User has been deleted!" });
         }
      );
   } catch (error) {
      console.log(err);
      return res.status(500).send();
   }
});

app.listen(4000, () => {
   console.log("Server is running on port: 4000");
});
