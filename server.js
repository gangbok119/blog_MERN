const express = require("express");
const mongoose = require("mongoose");
const usersRoutes = require('./routes/api/users');
const profileRoutes = require('./routes/api/profile');
const postsRoutes = require("./routes/api/posts");


const app = express();

// db
const db = require('./config/keys').mongoURI;

mongoose
    .connect(db, {
        useNewUrlParser:true,
        useCreateIndex:true
    })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

app.get('/', (req,res) => res.send('Hello World'));

app.use('/users', usersRoutes);
app.use('/profile', profileRoutes);
app.use('/posts',postsRoutes);


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));