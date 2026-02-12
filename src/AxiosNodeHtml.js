//
//

const express = require("express");   // import ไลบรารี Express เข้ามาใช้
const axios = require("axios");
const app = express();   // สร้างแอปพลิเคชัน Express
var bodyParser = require("body-parser");
const path = require("path");
const { title } = require("process");

//
//
// const base_url = "http://api.example.com";  // กำหนด URL พื้นฐานของ API ที่จะเรียกใช้
const base_url =  "http://localhost:3000";  // กำหนด URL พื้นฐานของ API ที่จะเรียกใช้";

// set the template engine
app.set("views", path.join(__dirname, "/public/views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(`${base_url}/books`);  // เรียกใช้ API เพื่อดึงข้อมูลหนังสือทั้งหมด
        res.render("books", { books: response.data });  // แสดงผลข้อมูลหนังสือโดยใช้เทมเพลต EJS
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
}); 

// route to create a new book
app.get("/books/:id", async (req, res) => {
    try {
        const response = await axios.get(base_url + "/books/" + req.params.id);  // เรียกใช้ API เพื่อดึงข้อมูลหนังสือตามไอดี
        res.render("book", { book: response.data });  // แสดงผลข้อมูลหนังสือตามไอดีโดยใช้เทมเพลต EJS
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }  
});    

// route to update a book
app.get("/create", (req, res) => {
    res.render("create");  // แสดงฟอร์มสร้างหนังสือใหม่
});

app.post("/create", async (req, res) => {
    try {
        const data = {title: req.body.title, author: req.body.author};
        await axios.post(base_url + "/books", data);
        res.redirect("/");  // เปลี่ยนเส้นทางกลับไปยังหน้าหลักหลังจากสร้างหนังสือใหม่
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
});

app.get("/update/:id", async (req, res) => {
    try {
        const response = await axios.get(
            base_url + "/books/" + req.params.id);
            res.render("update", { book: response.data });  // แสดงฟอร์มอัปเดตหนังสือตามไอดี
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    
    }
});
app.post("/update/:id", async (req, res) => {
    try {
        const data = { title: req.body.title, author: req.body.author };
        await axios.put(base_url + "/books/" + req.params.id, data);
        res.redirect("/");  // เปลี่ยนเส้นทางกลับไปยังหน้าหลักหลังจากอัปเดตหนังสือตามไอดี
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
});

app.get("/delete/:id", async (req, res) => {
    try {
        await axios.delete(base_url + "/books/" + req.params.id);
        res.redirect("/");  // เปลี่ยนเส้นทางกลับไปยังหน้าหลักหลังจากลบหนังสือตามไอดี
    }   catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
});


// start the server
const port = process.env.port || 4000;
app.listen(port, () =>  console.log(`Server is running on http://localhost:${port}`));
