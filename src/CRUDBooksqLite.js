const express = require("express");   // import ไลบรารี Express เข้ามาใช้
const sqlite3 = require("sqlite3");
const app = express();   // สร้างแอปพลิเคชัน Express

const db = new sqlite3.Database('./Database/book.sqlite');


//
app.use(express.json());  // ใช้ middleware เพื่อแปลงข้อมูล JSON ที่รับเข้ามาในคำขอให้เป็นวัตถุ JavaScript


// สร้างตาราง books ถ้ายังไม่มี
db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY ,
    title TEXT,
    author TEXT
)`);

app.get('/books', (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(rows);
        }
    });
});

// ดึงข้อมูลหนังสือตามไอดี
app.get("/books/:id", (req, res) => {  
    db.get('SELECT * FROM books WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!row) {
                res.status(404).send('Book not found');
            } else {
                res.json(row);
            }
        }
    });
}); 


app.post("/books", (req, res) => {  // เพิ่มหนังสือใหม่
    const book = req.body;
    db.run('INSERT INTO books (title, author) VALUES (?, ?)', [book.title, book.author], function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            book.id = this.lastID;
            res.send(book);
        }
    });
}); 

app.put("/books/:id", (req, res) => {
    const book = req.body;
    db.run('UPDATE books SET title = ?, author = ? WHERE id = ?', [book.title, book.author, req.params.id], function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(book);
        }  
    });
});

// ลบหนังสือตามไอดี

app.delete("/books/:id", (req, res) => {
    db.get('SELECT * FROM books WHERE id = ?', req.params.id, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {    
            res.send({});
        }
    });
});


const PORT = process.env.PORT || 7000;  // กำหนดพอร์ตที่แอปพลิเคชันจะฟังคำขอ
app.listen(PORT, () =>  console.log(`Server is running on http://localhost:${PORT}`));  // เริ่มต้นเซิร์ฟเวอร์และแสดงข้อความเมื่อเซิร์ฟเวอร์เริ่มทำงาน

