const express=require("express");
const pool = require('pg');
const morgan=  require('morgan');
const authRoutes=require('./routes/auth.routes');
const taskRoutes = require('./routes/tasks.routes');
const cookieParser = require('cookie-parser');

const app=express()

app.use(morgan("dev"));
app.use(express.json( ))
app.use(cookieParser());

app.use('/api',authRoutes)
app.use('/api',taskRoutes)

module.exports=app;
