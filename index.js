var express = require('express');
var app = express();                      // to create an express app

// we configure our app by setting up an event handler or a callback function
app.use('/', (req, res) => {              // specifying that the URI '/' will trigger an event
                                          // the event is invoke the callback function that takes the request object and the response object
  var method = req.method;  // HTTP verb
  var url = req.url;        // the resource that is being requested
  var agent = req.headers['user-agent'];
  agent = req.get('User-Agent'); // generally recommended to use the get function to request a specific header field, one of the reasons is that it's case insensitive

  res.status(200);  // set the status
  res.type('html'); // set the response type
  res.write('Hello world!');  // the response is a stream and we can continually write to that stream
  res.write('<p>');
  res.write('<b>Have a nice day</b>');
  res.end();  // this will send the HTTP response and close the connection

  // res.send('Hello World!');
});

app.listen(3000, () => {                  // configure the app so that it's listening on the port 3000
  console.log('Listening on port 3000');  // log the fact that it's listening once it starts listening
});