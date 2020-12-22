'use strict';

var mysql = require('mysql');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const PATH = __dirname + '/pages/';
app.use(express.static(__dirname + '/javascript/'));
app.use(bodyParser.urlencoded({extended: true}));

var con = mysql.createConnection({
    host: 'localhost',
    port: '777',
    user: 'root',
    password: ''
});

con.connect(function(err){
    if(err){
        throw err;
    } else{
        console.log("connected");
    }
});

app.get('/end', (req, res)=>{
    con.end(function(err){
        if(err) throw err;
        else{
            console.log("connection ended");
        }
    });
    res.send("ok");
});

app.get('/createDB', (req, res) =>{
    var sql = "CREATE DATABASE IF NOT EXISTS cmpt353_projecta;"
    con.query(sql, (err)=>{
        if(err){
            throw err;
        }else{

            console.log("database created");
        }
    });

    sql = "USE cmpt353_projecta;"
    con.query(sql, (err)=>{
        if(err){
            throw err;
        }else{
            console.log("database selected");
        }
    });
    res.send("ok");
});

app.get('/create', (req, res)=>{
    var sql = "CREATE TABLE IF NOT EXISTS menu (menuID INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ";
    sql += "item VARCHAR(50) NOT NULL UNIQUE, price FLOAT NOT NULL);"

    con.query(sql, function(err, result){
        if(err) {throw err};
    });

    sql = "CREATE TABLE IF NOT EXISTS orders (orderID INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ";
    sql += "totalPrice FLOAT NOT NULL, isCompleted BOOLEAN NOT NULL, orderDetail JSON NOT NULL, timestamp DATETIME NOT NULL);";

    con.query(sql, function(err, result){
        if(err) {throw err};
    });
    res.send("ok")
});

app.get('/dropTables', (req, res)=>{
    var sql1 = "DROP TABLE IF EXISTS menu";
    var sql2 = "DROP TABLE IF EXISTS orders";
    con.query(sql1, function(err, result){
        if(err) throw err;
        console.log("menu dropped");
    });
    con.query(sql2, function(err, result){
        if(err) throw err;
        console.log("orders dropped");
    });
    res.send("ok");
})

app.get('/', (req, res)=>{
    res.sendFile(PATH + 'index.html');
});

app.get('/customer', (req,res)=>{
    res.sendFile(PATH + 'customer.html');
})

app.get('/employee', (req,res)=>{
    res.sendFile(PATH + 'employee.html');
})

app.get('/orders', (req,res)=>{
    res.sendFile(PATH + 'orders.html');
})

app.get('/orderDisplay', (req, res)=>{
    res.sendFile(PATH + 'orderDisplay.html');
});

app.get('/editMenu', (req, res)=>{
    res.sendFile(PATH + 'editMenu.html');
})

app.get('/selectMenu', (req, res)=>{
    var sql = 'SELECT * FROM menu';
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.json(result);
    });
})

app.post('/insertMenu', (req, res)=>{
    var sql = "INSERT INTO menu(item, price) VALUES ?";
    var values = [[req.body.item, req.body.price]]
    con.query(sql, [values], function(err, result){
        if(err) throw err;
        res.send("ok");
    })
});

app.post('/insertOrders', (req, res)=>{
    var timestamp = new Date();
    var sql = 'INSERT INTO orders (totalPrice, isCompleted, orderDetail, timestamp) VALUES ?';

    var values = [[req.body.total, req.body.isCompleted, req.body.detail, timestamp]];
    con.query(sql, [values], function(err, result){
        if(err) throw err;
        res.send(result.insertId + "");
    });
});

app.get('/selectOrders', (req, res)=>{
    var sql = 'SELECT * FROM orders ORDER BY timestamp ASC';
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.json(result);
    });
});

app.get('/selectOrdersNotComplete', (req, res)=>{
    var sql = 'SELECT * FROM orders WHERE isCompleted = 0 ORDER BY timestamp ASC';
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.json(result);
    });
});

app.put('/updateOrdersCompleted/:id', (req, res)=>{
    var sql = 'UPDATE orders SET isCompleted=1 WHERE orderID = ?';
    var values = [req.params.id];
    con.query(sql, values, function(err, result, fields){
        if(err) throw err;
        res.send("updated");
    });
});

app.get('/getOrderStatus/:id', (req, res)=>{
    var id = req.params.id;
    var sql = "SELECT isCompleted from orders WHERE orderID=?";
    con.query(sql, [id], (err, result)=>{
        if(err) throw err;
        res.json(result);
    })
});

app.post('/deleteOrder/:id', (req, res)=>{
    var id = req.params.id;
    var sql = "DELETE FROM orders WHERE orderID=?";
    con.query(sql, [id], (err, result)=>{
        if (err)
        throw err;

        res.send(result.affectedRows + "");
    })
});

app.put('/updateItemInMenu/:id/:price', (req, res)=>{
    var sql = 'UPDATE menu SET price=? WHERE menuID = ?';
    var values = [req.params.price, req.params.id];
    con.query(sql, values, function(err, result, fields){
        if(err) throw err;
        res.send("updated");
    });
})

app.post('/deleteItemInMenu/:id', (req, res)=>{
    var id = req.params.id;
    var sql = "DELETE FROM menu WHERE menuID=?";
    con.query(sql, [id], (err, result)=>{
        if (err)
        throw err;

        res.send(result.affectedRows + "");
    })
})

app.listen('80', '0.0.0.0');
console.log('up and running');
