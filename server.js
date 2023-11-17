require('dotenv').config(); //allows to use in any file
require('express-async-errors');
const express = require('express');
const app = express();
const path = require('path');
const { logger, logEvents } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorhandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500; //if portno saved in env variables


connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json()); //ability to process json in application

app.use(cookieParser());  //3rd  party middleware

app.use(express.urlencoded({extended: true}));

app.use('/', express.static(path.join(__dirname, 'public'))); //middleware

app.use('/', require('./routes/root'));
app.use('/user-auth', require('./routes/authRoutes/userAuthRoutes'));  //login, logout
app.use('/doctor-auth', require('./routes/authRoutes/doctorAuthRoutes'));
app.use('/auth', require('./routes/authRoutes/refreshRoutes')); //refresh
//Admin only
app.use('/userlogins', require('./routes/userRoutes'));
app.use('/doctorlogins', require('./routes/doctorRoutes'));
//users and admin
app.use('/userinfos', require('./routes/api/users'));
app.use('/doctorinfos', require('./routes/api/doctors'));
app.use('/posts', require('./routes/api/posts'));

app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')) {
        res.json({message: '404 Not Found'});
    } else {
        res.type('txt').send('404 Not Found');
    }
})

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
})
