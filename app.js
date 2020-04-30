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
const User = require('./models/user');
const Activity = require('./models/activity');
const Action = require('./models/action');

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activities');
const userRoutes = require('./routes/user');
const milestoneRoutes = require('./routes/milestones');

app = express();

const store = new MongoDBStore({uri:config.connectionString, collection:'sessions'});
const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
	destination:(req, file, cb) => {
		const url = req.url;

		if(url.includes('avatar')) {
			cb(null, path.join('images','users'));
		}

		if(url.includes('activity')) {
			cb(null, path.join('images','activities'));
		}

		if(url.includes('milestone')) {
			cb(null, path.join('images','milestones'));
		}
	},
	filename:(req, file, cb) => {
		cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);		
	}
})

const fileFilter = (req, file, cb) => {
	const mimeType = file.mimetype.toLowerCase();

	if(mimeType == 'image/png' || mimeType == 'image/jpg' || mimeType == 'image/jpeg') {
		return cb(null, true);
	}

	return cb(null, false);
}

app.use(bodyParser.urlencoded({ extended:false }));
app.use(multer({ storage:fileStorage, fileFilter:fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:config.secretString, saveUninitialized:false, resave:false, store:store}));
app.use(csrfProtection);
app.use(flash());
app.use(res_back());

app.set('view engine', 'ejs');
app.set('views', 'views');

// setting the authenticated user in the request object
app.use((req, res, next) => {
	if(req.session.userId) {
		User.findById(req.session.userId)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => {
			console.log(err);
		})
	}
	else {
		next();
	}
})

app.use((req, res, next) => {
	res.locals.csrfToken = req.csrfToken();
	res.locals.page = null;

	if(req.session.userId) {
		res.locals.user = req.user;

		Activity.getAll(req.session.userId)
		.then(activities => {
			res.locals.activityCount = activities.length;
			return activities;
		})
		.then(activities => {
			
			res.locals.milestonesCount = 0;
			activities.forEach(activity => {
				res.locals.milestonesCount += activity.milestones.length;
			})
		})
		.then(() => {

			Action.getCount(req.session.userId)
			.then(result => {
				res.locals.actionCount = result;
				next();
			})
		})
		.catch(err => {
			console.log(err);
		})
	} else {
		next();
	}
})

app.use(indexRoutes);
app.use(authRoutes);
app.use(activityRoutes);
app.use(userRoutes);
app.use(milestoneRoutes);

mongoConnect(() => {
	app.listen(3000);
})
