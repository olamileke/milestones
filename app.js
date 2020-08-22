const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoConnect = require('./utils/database').mongoConnect;
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const csrf = require('csurf');
const multer = require('multer');
const config = require('./utils/config');
const res_back = require('express-back');

const middlewares = require('./middlewares/middlewares');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activities');
const userRoutes = require('./routes/user');
const milestoneRoutes = require('./routes/milestones');
const errorController = require('./controllers/errors');

app = express();

const store = new MongoDBStore({uri:config.connectionString, collection:'sessions'});
const csrfProtection = csrf();

app.use(bodyParser.urlencoded({ extended:false }));

app.use(multer({ storage:multer.memoryStorage(), fileFilter:middlewares.fileFilter }).single('image'));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:config.secretString, saveUninitialized:false,
resave:false, store:store, cookie:{ maxAge:(30 * 60 * 1000) }}));

app.use(csrfProtection);

app.use(flash());

app.use(res_back());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// prevents the browser from caching content
app.use((req, res, next) => {
	res.set('Cache-Control', 'no-store');
	next();
})

// checking if the session has expired
app.use(middlewares.checkSessionExpiry);

// refreshing the session
app.use(middlewares.refreshSessionExpiry);

// setting the authenticated user in the request object
app.use(middlewares.setUser);

// fetching data to be sent to every view
app.use(middlewares.fetchData);

// app routes
app.use(indexRoutes);
app.use(authRoutes);
app.use(activityRoutes);
app.use(userRoutes);
app.use(milestoneRoutes);

// 404 routes
app.use('/', errorController.get404);

app.use((error, req, res, next) => {
    console.log(error);	
    const statusCode = error.statusCode || 500;
	res.status(statusCode).render('error', {pageTitle:statusCode});
})

mongoConnect(() => {
	app.listen(4000);
})
