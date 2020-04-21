const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoConnect = require('./utils/database').mongoConnect;
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const csrf = require('csurf');
const config = require('./utils/config');

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

app = express();

const store = new MongoDBStore({uri:config.connectionString, collection:'sessions'});
const csrfProtection = csrf();

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:config.secretString, saveUninitialized:false, resave:false, store:store}));
app.use(csrfProtection);
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req, res, next) => {
	res.locals.csrfToken = req.csrfToken();
	next();
})

app.use(indexRoutes);
app.use(authRoutes);

mongoConnect(() => {
	app.listen(3000);
})