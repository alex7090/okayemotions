
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

require('./config/passport')(passport);

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/css')));
app.use(express.static(path.join(__dirname, 'public/images')));
app.set('views', [__dirname + '/views']);

app.use(express.json());

app.use(expressLayouts);
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', require('./routes/index'));
app.use('/user/', require('./routes/user'));



const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));