require('dotenv').config();
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://root:Clb%232022@cluster0.ygedpug.mongodb.net/influocial?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).catch(err => {
  console.log(err.stack);
  process.exit(1);
})
  .then(() => {
    console.log("connected to db in development environment");
  });;


// User.collection.drop();
require('./models/User');

const users = require('./seeder/users');
const seedSettings = require('./seeder/settings');

users.map(async (u, index) => {
  await u.save((err, result) => {
    if (err) {
      
    }
    if (index === users.length - 1) {
      console.log("DONE!");
    }
  });
});

seedSettings();