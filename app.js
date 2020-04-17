const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(indexRoutes);
app.use(authRoutes);

app.listen(3000);