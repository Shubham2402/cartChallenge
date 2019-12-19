const mongoose=require('mongoose');
const conn=mongoose.createConnection('mongodb://127.0.0.1:27017/cartChallengeDb',{useUnifiedTopology: true, useNewUrlParser: true });
exports.mongoose=mongoose;
exports.conn=conn;                  