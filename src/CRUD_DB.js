require("dotenv").config();   //โหลดค่าจากไฟล์ .envทำให้เราใช้ process.env.PORT ได้

const express = require("express");   // import ไลบรารี Express เข้ามาใช้
const app = express();   // สร้างแอปพลิเคชัน Express

app.use(express.json());  // ใช้ middleware เพื่อแปลงข้อมูล JSON ที่รับเข้ามาในคำขอให้เป็นวัตถุ JavaScript

let books = [   // สร้างข้อมูลหนังสือตัวอย่าง
    {id: 1,   // id ของหนังสือ
    title: "Book 1 ",    // ชื่อหนังสือ
    author: "Author 1" }, // ชื่อผู้แต่ง
    { id: 2, 
    title: "Book 2 ", 
    author: "Author 2" },
    { id: 3, 
    title: "Author 3", 
    author: "Author 3" }

    
];
app.get("/", (req, res) => {
     res.send("Hello World!"); });

app.get("/books", (req, res) => {  //ต้องพิมbooksในเว็ปไซน์ ดึงข้อมูลหนังสือทั้งหมด
    res.json(books);  //    ส่งข้อมูลหนังสือในรูปแบบ JSON ตอบกลับไปยังลูกค้า
});

app.get("/books/:id", (req, res) => {  // ดึงข้อมูลหนังสือตามไอดี
    const book = books.find(b => b.id === parseInt(req.params.id));  // ค้นหาหนังสือตามไอดีที่ส่งมาในพารามิเตอร์
    if (!book) res.status(404).send('Book not found');   // ถ้าไม่พบหนังสือ ส่งสถานะ 404 พร้อมข้อความ 'Book not found'
    res.json(book);  // ถ้าพบหนังสือ ส่งข้อมูลหนังสือในรูปแบบ JSON ตอบกลับไปยังลูกค้า
});
    

app.post("/books", (req, res) => {  // เพิ่มหนังสือใหม่
    const newBook = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author
    };
    books.push(newBook);
    res.send(newBook)  // ส่งสถานะ 201 พร้อมข้อมูลหนังสือใหม่ในรูปแบบ JSON ตอบกลับไปยังลูกค้า
});

app.put("/books/:id", (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) res.status(404).send('Book not found');

    book.title = req.body.title;
    book.author = req.body.author;
    res.json(book);
});

app.delete("/books/:id", (req, res) => {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) res.status(404).send('Book not found');
    const index = books.indexOf(book);  // หา index ของหนังสือในอาเรย์
    books.splice(index, 1);  // ลบหนังสือออกจากอาเรย์
    res.send(book);  // ส่งหนังสือที่ถูกลบกลับไปยังลูกค้า
}); 


const port = process.env.PORT || 7000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);  // ใช้รัน
});