const express = require('express');

let app = express();

// global variables
	let total = 0;
	let subtotal = 0;
	let totalPrice = "totalPrice";
	let quantity = "quantity";
	let tax = 0;


// getting the depencies
const eventService = require('./lib/eventService.js');


app.use(require("body-parser").urlencoded({extended:true}));


// set up handlebars view engine
let handlebars = require('express-handlebars')
	.create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));


//The admin page endpoint
app.get('/admin', function(req, res) {
		res.render('admin', {
			events: eventService.getEvents()
	});
});

// the admin page that will remove the event by the id
app.get('/admin/remove/:id', function(req, res){
	res.render('admin', {
		events: eventService.removeEvent()
	});
});

app.post('/admin/add', function(req, res){
		let event = eventService.addEvent(req.params.id)
		
	res.render('admin', {
		events: event
	});
});

//The index page endpoint
app.get('/', function(req, res) {
	res.render('index');
});


// The events page endpoint
app.get('/events', function(req, res) {
	res.render('events', {
			events: eventService.getEvents(),
		});
});

// The buy page endpoint
app.get('/buy', function(req, res) {
	res.render('buy', {
			events: eventService.getEvents()
		});
});



// buy id page that will show the selection of the tickets for a given event
app.get('/selection/:id', function(req, res) {
		// Renders the selection page with the buy data
		res.render('selection', {
			events: eventService.getEventById(req.params.id)
		});
	});


// checkout page that will give you the total and let you order your tickets
app.post('/selection/:id/checkout', function(req, res) {

		let event = eventService.getEventById(req.params.id)
		

		for(let e = 0; e < event.levels.length; e++){
		if(req.body[quantity+e] > 0){
			event.levels[e].quantity = req.body[quantity+e]; // places the appro. quantity in checkout page
			
			event.levels[e].totalPrice = req.body[quantity+e] * event.levels[e].price; // renders the price for proper quantity
		//	event.levels[e].price = event.levels[e].price.toFixed(2); // fixes the price to 2 digits after decimal
			subtotal+=  event.levels[e].totalPrice; // calculates the subtotal
		}
		
			tax = subtotal * 0.0775; //calculates the total sales tax
			total = subtotal + tax;  //calulates the total price
		}
		res.render('checkout', {
			events: event,
			total: total.toFixed(2),
			totalPrice: totalPrice,
			
		subtotal: subtotal
			
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

app.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});

