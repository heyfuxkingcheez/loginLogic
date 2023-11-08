const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const connect = () => {
    mongoose
        .set('strictQuery', true)
        .connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@woogi.zmmpqdy.mongodb.net/?retryWrites=true&w=majority`,
            {
                dbName: `${process.env.DB_NAME}`,
            }
        )
        .then(() => console.log('MongoDB 연결이 성공하였습니다.'))
        .catch((err) => console.log('MongoDB 연결에 실패하였습니다', err));
};

mongoose.connection.on('error', (err) => {
    console.error('몽고디비 연결 에러', err);
});

module.exports = connect;
