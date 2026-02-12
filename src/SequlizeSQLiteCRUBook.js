//ใช้สอบไฟน่อน
//
const express = require('express');
const  Sequelize  = require('sequelize');
const app = express();

// กำหนดการเชื่อมต่อฐานข้อมูล SQLite
app.use(express.json());
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost', // คือ โฮสต์ของฐานข้อมูล
    dialect: 'sqlite', // คุยยกับฐานข้อมูล SQLite
    storage: './Database/SQbook.sqlite' // ที่เก็บไฟล์ฐานข้อมูล SQLite 
    //คือการสร้างที่เก็บข้อมูล'./Database/SQbook.sqlite'
}); 
// กำหนดโมเดลสำหรับตารางหนังสือ
const Book = sequelize.define('Book', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true    
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

app.get("/", (req, res) => {
     res.send("Hello World!"); });

// ซิงค์โมเดลกับฐานข้อมูล
sequelize.sync();   // สร้างตารางถ้ายังไม่มี

// ดึงข้อมูลหนังสือทั้งหมด
app.get('/books',(req, res) => {  //ต้องพิมbooksในเว็ปไซน์ ดึงข้อมูลหนังสือทั้งหมด
    Book.findAll().then(books => {  // ดึงข้อมูลหนังสือทั้งหมดจากฐานข้อมูล
        res.json(books);   // ส่งข้อมูลหนังสือในรูปแบบ JSON ตอบกลับไปยังลูกค้า
    }).catch(err => {               // จัดการข้อผิดพลาด
        res.status(500).send(err);   // ส่งสถานะ 500 พร้อมข้อความข้อผิดพลาด
    });
}); 
// ดึงข้อมูลหนังสือตามไอดี
app.get('/books/:id', (req, res) => {
    Book.findByPk(res.params.id).then(book => {
        if(!book){
            res.status(404).send('Book not found'); 
        } else {
            res.json(book);
        }
    }).catch(err => {
        res.status(500).send(err);
    }); 
});

// เพิ่มหนังสือใหม่
app.post('/books', (req, res) => {
    Book.create(req.body).then(book => {
        res.send(book);
    }).catch(err => {
        res.status(500).send(err);
    });
});

// อัปเดตหนังสือตามไอดี
app.put('/books/:id', (req, res) => {
    Book.findByPk(req.params.id).then(book => {
        if(!book){
            res.status(404).send('Book not found');
        } else {   
            book.update(req.body).then(() => {
                res.json(book);
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
}); 


app.delete('/books/:id', (req, res) => {
    Book.findByPk(req.params.id).then(book => {
        if(!book){
            res.status(404).send('Book not found');
        } else {
            book.destroy().then(() => {
                res.send({});
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
}); 

//start the server

const PORT = process.env.PORT || 3000;  // กำหนดพอร์ตที่แอปพลิเคชันจะฟังคำขอ
app.listen(PORT, () =>  console.log(`Listening on port http://localhost:${PORT}...`));  // เริ่มต้นเซิร์ฟเวอร์และแสดงข้อความเมื่อเซิร์ฟเวอร์เริ่มทำงาน