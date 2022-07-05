const express = require('express');
const mysql = require('mysql');
require('dotenv').config();
const cors = require('cors');
const bcrpyt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const SECRETKEY = process.env.SECRETKEY;
const app = express();
app.use(cors());
app.use(express.json());

// connect to mysql database
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})

// res.send({ status: ('ok' | 'error'), message: 'some message'})

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/users', (req, res) => {
  db.query('SELECT * FROM Users', (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send({message: 'ok', data: result});
  })
})

app.post('/register', (req, res) => {
  const username = req.body.name;
  const password = req.body.password;

  // connected to database
  // use select to check whether this user is already register or not
  db.query('SELECT * FROM Users WHERE username = ?', [username], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      console.log('User already exists')
      res.sendStatus(409);
      return;
    }
    // if user is not register put the value to db
    // encrypt password with bcrpyt
    bcrpyt.hash(password, 10, (err, hash) => {
      if (err) throw err;

      db.query('INSERT INTO Users (username, password) VALUES (?,?)', [username, hash], (err, result) => {
        if (err) throw err;
        console.log('User added to database');
        res.status(201).send('User added to database');
      })
    });    
  });

});

app.post('/login', jsonParser, (req, res) => {
  const username = req.body.name;
  const password = req.body.password;

  // check if username is in database
  db.query('SELECT * FROM Users WHERE username = ?', [username], (err, data) => {
    if (err) throw err;
    if (data.length == 0) {
      res.send({status: 'error', message: 'Username not found'});
      return;
    }

    // if user exists check if password is correct
    bcrpyt.compare(password, data[0].password, (err, isLogin) => {
      if (err) throw err;
      if (isLogin) {
        // sent token from jwt to client
        const token = jwt.sign({ username: data[0].username, userId: data[0].id }, SECRETKEY)
        res.json({ status: 'ok', message: 'Login sucessfully', token});
      } else {
        res.json({ status: 'error', message: 'Password is incorrect' });
      }
    });
    

  })
})

app.post('/authen', jsonParser, (req, res) => {
  // verify if token is valid
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, SECRETKEY);
    res.send({ status: 'ok', decoded});
    
  } catch (err) {
    res.send({ status: 'error', error: err.message});
  }

})

app.post('/addPost', (req, res) => {
  const userId = req.body.id;
  const post = req.body.message;

  db.query('INSERT INTO Posts (userId, post) VALUES (?,?)', [userId, post], (err, result) => {
    if (err) throw err;
    // send the posts back to client
    db.query('SELECT * FROM Posts INNER JOIN Users ON Posts.userId = Users.id', (err, data) => {
      if (err) throw err;
      res.json(data); 
    })
  })

})

app.get('/getPost', (req, res) => {
  db.query('SELECT * FROM Posts INNER JOIN Users ON Posts.userId = Users.id', (err, data) => {
    if (err) throw err;
    res.json(data); 
  })
})

app.delete('/deletePost/:id', (req, res) => {
  const postId = req.params.id;
  db.query('DELETE FROM Posts WHERE postId = ?', postId, (err, result) => {
    if (err) throw err;
    res.send({ status: 'ok', message: 'Post deleted', result })
  })  
})

app.listen(8080, () => {
  console.log('Server started on port 8080');
})  
