//ใช้สอบไฟน่อน
//
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
app = express();

// กำหนดการเชื่อมต่อฐานข้อมูล SQLite
app.use(express.json());
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './Database/book.sqlite' // ที่เก็บไฟล์ฐานข้อมูล SQLite
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

// ซิงค์โมเดลกับฐานข้อมูล
sequelize.sync();   

// ดึงข้อมูลหนังสือทั้งหมด
app.get('/books',(req, res) => {
    Book.findAll().then(books => {
        res.json(books);
    }).catch(err => {
        res.status(500).send(err);
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ${port}...'));//เหมือนจะผิด