// in this file, we're going to create our schema for MongoDB
// then we'll export it so that other files can use it

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myDatabase');

var Schema = mongoose.Schema;

var personSchema = new Schema( {
  name: {type: String, required: true, unique: true},
  age: Number
} );

// we're going to export this model as the Person class
// that is, in other files, for instance index.js, we'll just create a new Person,
//  which is really an instance of personSchema
module.exports = mongoose.model('Person', personSchema);
