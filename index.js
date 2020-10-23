var express = require('express');
var app = express();                      // to create an express app

var logger = (req, res, next) => {
  var url = req.url;
  var time = new Date();
  console.log('Received request for ' + url + ' at ' + time);
  next();
}

// app.use(logger); // will be invoked on any HTTP request

app.use('/about', (req, res) => {
  res.send('This is the about page.');
});

app.use('/login', (req, res) => {
  res.send('This is the login page.');
});

app.use('/public', logger, express.static('files')); // we can have any number of middleware functions specified in the app.use function
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
app.use(/*default*/ (req, res) => {
  res.status(404).sendFile(__dirname + '/404.html'); // __dirname specifies the location where we've installed our Node.js app
});

app.listen(3000, () => {                  // configure the app so that it's listening on the port 3000
  console.log('Listening on port 3000');  // log the fact that it's listening once it starts listening
});