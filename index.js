var express = require('express');
var app = express();                      // to create an express app

// we configure our app by setting up an event handler or a callback function
app.use('/', (req, res) => {              // specifying that the URI '/' will trigger an event
                                          // the event is invoke the callback function that takes the request object and the response object
  res.send('Hello World!');
});

app.listen(3000, () => {                  // configure the app so that it's listening on the port 3000
  console.log('Listening on port 3000');  // log the fact that it's listening once it starts listening
});