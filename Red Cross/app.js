const express = require('express');

let app = express();
let credentials = require('./credentials.js');
let auth = require('./auth.js');
let User = require('./models/user.js');
let Report = require('./models/report.js');


//bcrypt for hashing is implemented but does not work properly, hence commented out.
//already in nodeModules and package.json

let handlebars = require('express-handlebars')
	.create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);


app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));
app.use(require("body-parser").urlencoded({extended: true}));
app.use(require('cookie-parser')(credentials.cookieSecret));

app.use(require('express-session')({
    resave:false,
    saveUninitialized:false,
    secret:credentials.cookieSecret,
}));

var mongoose = require('mongoose');
mongoose.connection.openUri(auth.mongo.connectionString);

app.get('/', function(req, res) {
	res.render('home');
});

app.post('/', function(req, res) {
  //console.log(req.body);
  Report.find({'firstName': req.body.firstName, 'lastName':req.body.lastName, 'phone':req.body.areaCode+req.body.threeDigit+req.body.fourDigit},function(err, report) {
          if (err) {
              console.log(err);
              throw err;
          }
          console.log(report);
          res.render('results',{report});
        });
});
app.get('/login', function(req, res) {
	res.render('login');
});

//attach everything query object returns to the session object, then pass in the session to the template
app.post('/user', function(req, res){
    //console.log("/user" + req.body);
    User.findOne({'username': req.body.username, 'password': req.body.pw}, function(err, user) {
      if (err) {
          console.log(err);
          throw err;
      }

      
     // console.log(user);//query the db to see if user exists
      if(user.access === 'user'){
        //console.log("user has been found");
        req.session.user = user;
        //console.log(req.session);
        Report.find({'uid': user.uid}, function(err, report) {
          //console.log(report);//query the db and see if report exists
          if (err) {
              console.log(err);
              throw err;
          }
          req.session.report = report;
          res.render('user', req.session);
        });
      }
      
      
      // look into promise.all
      else if(user.access === 'admin'){
        console.log("admin has been found");
        req.session.user = user;//add admin to the session
        
        	Report.count({disasterId: '1'},function(err, c) {
          if (err) {
              console.log(err);
              throw err;
          }
          //console.log(c); // count function
          req.session.d1 = c;
        });
        	Report.count({disasterId: '2'},function(err, c) {
          if (err) {
              console.log(err);
              throw err;
          }
          //console.log(c); // count function
          req.session.d2 = c;
        });
        	Report.count({disasterId: '3'},function(err, c) {
          if (err) {
              console.log(err);
              throw err;
          }
          //console.log(c); // count function
          req.session.d3 = c;
        });
        	Report.count({disasterId: '4'},function(err, c) {
          if (err) {
              console.log(err);
              throw err;
          }
          console.log(c); // count function
          req.session.d4 = c;
          res.render('admin',req.session);
        });
      }
      
  /*
        user.comparePassword(req.body.pw, function(err, isMatch){
        if(err){
          console.log(err);
          throw err;
        }
        if(isMatch){
          req.session.password = req.body.pw;
        }
        
   */     
        
      });
      
      
    });

//middleware using sessions to control user activity.  User is attached to the session and this app.use checks the session to see if user exists
app.use(function(req,res,next){
    if(req.session.user !== undefined){
      console.log("middleware: user found");
      next();//next must be called to pass onto the rest of the project
    }
    else{
      console.log("middleware: user not found");
      res.render('login');
    }
});
//display report
app.get('/report', function(req, res) {
	res.render('report', req.session);
});
//get data from form, then render home after
app.post('/report', function(req, res) {
  //console.log(req.body);
	//console.log(req.session);
	var today = new Date();
	let r = new Report({
	  uid: req.session.user.uid,
    disasterId: req.body.disaster,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.areaCode + req.body.threeDigit + req.body.fourDigit,
    currentLocation: req.body.currentLocation,
    status: req.body.status,
    message: req.body.message,
    date: today
	}).save();
	res.render('home');
});

app.post('/admin', function(req, res){
  console.log(req.body);
  	console.log('Before report');
  	let u = new User({
	//  uid: "777",
    username: req.body.username,
    password: req.body.pw,
    access: req.body.type  
	}).save();
	res.render('home');
});


app.get('/detail', function(req,res){
  var id = req.query.id;
  
  if(req.query._id !== ''){
    Report.find({"_id":req.query._id}).remove().exec();
  }
  Report.find({'disasterId': id}, function(err, report) {
          //console.log(report);//query the db and see if report exists
          if (err) {
              console.log(err);
              throw err;
          }
          console.log(report);
          req.session.report = report;
          res.render('detail', req.session);
  });
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});
// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});
//
app.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});