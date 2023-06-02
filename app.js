const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
require('dotenv').config();
require('./helpers/init.mongodb')
const AuthRoute = require('./Routes/Auth.route');

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/auth', AuthRoute);
const {verifyAccessToken} = require('./helpers/jwt')



app.get('/',verifyAccessToken, async (req, res, next) => {
 
  res.send('Hello');
});

app.use((req, res, next) => {
  next(createError.NotFound()); 
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
