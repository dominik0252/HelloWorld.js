var express = require('express');
var app = express();                      // to create an express app

app.set('view engine', 'ejs'); // set EJS as the default rendering method

var logger = (req, res, next) => {
  var url = req.url;
  var time = new Date();
  console.log('Received request for ' + url + ' at ' + time);
  next();
}

var nameFinder = (req, res, next) => {
  var name = req.query.name;
  if (name) req.username = name.toUpperCase();
  else req.username = 'Guest';
  next();
}

var greeter = (req, res, next) => {
  res.status(200).type('html');
  res.write('Hello, ' + req.username);
  next();
}

var adminName = (req, res, next) => {
  req.username = 'Admin';
  next();
}

var header = (req, res, next) => {
  next();
}

var footer = (req, res, next) => {
  next();
}

var commonRoute = express.Router();
commonRoute.use(header, greeter, footer);

// app.use(logger); // will be invoked on any HTTP request

app.use('/about', (req, res) => {
  res.send('This is the about page.');
});

app.use('/login', (req, res) => {
  res.send('This is the login page.');
});

app.use('/public', logger, express.static('files')); // we can have any number of middleware functions specified in the app.use function

app.use('/welcome', logger, nameFinder, (req, res) => {
  res.render('welcome', { username: req.username, isAdmin: true });
});

app.use('/admin', logger, adminName, commonRoute, (req, res) => {
  res.end();
});

/*
// we configure our app by setting up an event handler or a callback function
app.use('/', (req, res) => {              // specifying that the URI '/' will trigger an event
                                          // the event is invoke the callback function that takes the request object and the response object
  // var method = req.method;  // HTTP verb
  // var url = req.url;        // the resource that is being requested
  // var agent = req.headers['user-agent'];
  // agent = req.get('User-Agent'); // generally recommended to use the get function to request a specific header field, one of the reasons is that it's case insensitive

  // res.status(200);  // set the status
  // res.type('html'); // set the response type
  // res.write('Hello world!');  // the response is a stream and we can continually write to that stream
  // res.write('<p>');
  // res.write('<b>Have a nice day</b>');
  // res.end();  // this will send the HTTP response and close the connection

  var name = req.query.name;

  res.status(200).type('html');

  if(name) {
    res.write('Hi ' + name + ", it's nice to see you.");
  } else {
    res.write('Welcome, guest!');
  }

  res.end();

  // res.send('Hello World!');
});
*/

app.use('/name/:userName/location/:userLocation', (req, res) => {
  var params = req.params;
  console.log(params);

  var name = params.userName;
  var location = params.userLocation;

  var length = Object.keys(params).length;

  res.send('Hello ' + name + ' from ' + location + '!');
});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/handleForm', (req, res) => {
  var name = req.body.username;
  var animals = [].concat(req.body.animal); // this is an array
  res.render('showAnimals', { name: name, animals: animals });
});
/*
app.use('/', (req, res) => {
  var query = req.query;
  console.log(query);

  var name = query.name;
  var location = query.location;

  var length = Object.keys(query).length;

  res.send('Hello ' + name + ' from ' + location + '!');
});
*/
var Person = require('./Person.js');
const { render } = require('ejs');

app.use('/create', (req, res) => {
  var newPerson = new Person({
    name: req.body.name,
    age: req.body.age
  });

  newPerson.save( (err) => {
    if(err) {
      res.type('html').status(500);
      res.send('Error: ' + err);
    } else {
      res.render('created', { person: newPerson });
    }
  });
});

app.use('/all', (req, res) => {
  Person.find( (err, allPeople) => { // allPeople - the array of all people found in the db
    if (err) {
      res.type('html').status(500);
      res.send('Error: ' + err);
    } else if (allPeople.length == 0) {
      res.type('html').status(200);
      res.send('There are no people');
    } else {
      res.render('showAll', { people: allPeople });
    }
  });
});

app.use('/person', (req, res) => {
  var searchName = req.query.name;
  Person.findOne( { name: searchName }, (err, person) => {
    if(err) {
      res.type('html').status(500);
      res.send('Error: ' + err);
    } else if (!person) {
      res.type('html').status(200);
      res.send('No person named ' + searchName);
    } else {
      res.render('personInfo', { person: person });
    }
  });
});

app.use('/update', (req, res) => {
  var updateName = req.body.username;
  Person.findOne( {name: updateName}, (err, person) => {
    if(err) {
      res.type('html').status(500);
      res.send('Error: ' + err);
    } else if (!person) {
      res.type('html').status(200);
      res.send('No person named ' + searchName);
    } else {
      person.age = req.body.age;
      person.save( (err) => {
        if(err) {
          res.type('html').status(500);
          res.send('Error: ' + err);
        } else {
          res.render('updated', { person: person });
        }
      });
    }
  });
});

var Book = require('./Book.js');

app.use('/createBook', (req, res) => {
  console.log(req.body);
  var newBook = new Book(req.body);

  newBook.save( (err) => {
    if (err) {
      res.type('html').status(500);
      res.send('Error: ' + err);
    } else {
      res.render('bookCreated', { book: newBook });
    }
  });
});

app.use('/search', (req, res) => {
  if(req.body.searchmethod == 'all') {
    searchAll(req, res);
  } else if (req.body.searchmethod == 'any') {
    searchAny(req, res);
  } else {
    searchAll(req, res);
  }
});

function searchAll(req, res) {
  var query = {};

  if(req.body.title) query.title = req.body.title;
  if(req.body.year) query.year = req.body.year;
  if(req.body.author) query['authors.name'] = req.body.author;

  console.log(query);

  Book.find( query, (err, books) => {
    if(err) {
      res.type('html').status(500);
      res.send('Error: ' + err);
    } else {
      res.render('books', { books: books });
    }
  });
}

function searchAny(req, res) {
  var terms = [];
  if (req.body.title) terms.push({ title: { $regex: req.body.title } }); // $regex to retrieve books which have req.body.title as part of the title
  if (req.body.year) terms.push({ year: req.body.year });
  if (req.body.author) terms.push({ 'authors.name': req.body.author });

  var query = { $or : terms };

  console.log(query);

  Book.find( query, (err, books) => {
    if(err) {
      res.type('html').status(500);
      res.send('Error: ' + err);
    } else {
      res.render('books', { books: books });
    }
  }).sort( { 'title' : 'asc'} ); // will be called before the callback function that renders the result
}

app.use('/', (req, res) => {
  res.redirect('/public/personform.html');
});

app.use(/*default*/ (req, res) => {
  res.status(404).sendFile(__dirname + '/404.html'); // __dirname specifies the location where we've installed our Node.js app
});

app.listen(3000, () => {                  // configure the app so that it's listening on the port 3000
  console.log('Listening on port 3000');  // log the fact that it's listening once it starts listening
});