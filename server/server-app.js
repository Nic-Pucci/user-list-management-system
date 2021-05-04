const express = require('express');
const app = express();
const port = 8080;

var mysql = require('mysql');
var databaseName = "`user-management-system`";
var tableName = "`Users`";

var createTableSQL = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' ('
    + 'id INT NOT NULL AUTO_INCREMENT,'
    + 'PRIMARY KEY(id),'
    + 'name VARCHAR(30),'
    + 'email VARCHAR(30),'
    + 'age INT'
    + ')';
var getAllSQL = " SELECT * FROM ";
var postSQL = "INSERT INTO " + tableName + " (name, email, age) VALUES (?)";
var putSQL = "UPDATE " + tableName + " SET name = ?, email = ?, age = ? WHERE id = ?";
var deleteSQL = "DELETE FROM " + tableName + " WHERE id = ";

var cors = require('cors');
app.use(cors())

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var dbConfig = {
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    insecureAuth: true
};

var createCon;

app.use(function (err, req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

function handleDisconnect() {
    createCon = mysql.createConnection(dbConfig);

    createCon.connect(function (err) {
        if (err) {
            console.log('Error: Reconnecting to DB:', err);
            setTimeout(handleDisconnect, 2000);
        }
        else {
            console.log("Connected!");

            createCon.query("CREATE DATABASE IF NOT EXISTS " + databaseName, function (err, result) {
                if (err) throw err;
                console.log("Database created");
            });

            createCon.query('USE ' + databaseName, function (err) {
                if (err) throw err;
                createCon.query(createTableSQL, function (err) {
                    if (err) throw err;

                    console.log("Database table");
                });
            });
        }
    });

    createCon.on('error', function (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Resolving Lost Connection ...', err);
            handleDisconnect();
        }
        else {
            throw err;
        }
    });
};

handleDisconnect();

app.get('/users', (req, res) => {
    createCon.query('USE ' + databaseName, function (err) {
        createCon.query(getAllSQL + tableName, function (err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    });
});

app.post('/users', async (req, res) => {
    var values = [[req.body.name, req.body.email, req.body.age]];

    createCon.query(postSQL, values, function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        req.body.id = result.insertId;
        res.send(req.body);
    });
})

app.put('/users', (req, res) => {
    var values = [req.body.name, req.body.email, req.body.age, req.body.id];
    console.log("req.body.name = " + req.body.name);

    createCon.query(putSQL, values, function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        res.send(req.body);
    });
})

app.delete('/users/:userID', (req, res, next) => {
    console.log("in delete");
    var userID = req.params.userID;
    console.log("userID = " + userID);

    createCon.query(deleteSQL + userID, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
        res.send(userID);
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});