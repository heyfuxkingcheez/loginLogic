const express = require('express');
const goodsRouter = require('./routes/goods.js');
const cartsRouter = require('./routes/carts.js');
const usersRouter = require('./routes/users.js');
const connect = require('./schemas');

const app = express();
const port = 3000;

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('assets'));
app.use('/api', [(goodsRouter, cartsRouter, usersRouter)]);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log(3000, '포트로 서버가 열렸어요!');
});
