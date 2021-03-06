const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const usersRoutes = require('./routes/api/users');
const profileRoutes = require('./routes/api/profile');
const postsRoutes = require("./routes/api/posts");



const app = express();

app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());

// db
const db = require('./config/keys').mongoURI;

mongoose
    .connect(db, {
        useNewUrlParser:true,
        useCreateIndex:true
    })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

app.use(passport.initialize());
mongoose.set('useFindAndModify', false);
require('./config/passport')(passport);

app.use('/users', usersRoutes);
app.use('/profile', profileRoutes);
app.use('/posts',postsRoutes);


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));