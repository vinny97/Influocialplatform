let faker = require("faker");
const User = require("../models/User");

let users = [];

// for (let i = 1; i < 50; i += 2) {
//   let user = new User();

//   user.email = faker.internet.email();
//   user.firstName = faker.name.findName();
//   user.lastName = faker.name.findName();
//   user.role = 2;
//   user.setPassword("Asdf123");
//   user.isEmailVerified = true;
//   users.push(user);
// }
// for (let i = 1; i < 50; i += 2) {
//   let user = new User();

//   user.email = faker.internet.email();
//   user.firstName = faker.name.findName();
//   user.lastName = faker.name.findName();
//   user.role = 3;
//   user.setPassword("Asdf123");
//   user.isEmailVerified = true;
//   users.push(user);
// }

let agency = new User();
agency.email = "agency@gmail.com";
agency.firstName = "agency";
agency.lastName = "seeder";
agency.role = 4;
agency.setPassword("Asdf123");
agency.isEmailVerified = true;
users.push(agency);

let influencer = new User();
influencer.email = "influencer@gmail.com";
influencer.firstName = "influencer";
influencer.lastName = "seeder";
influencer.role = 2;
influencer.setPassword("Asdf123");
influencer.isEmailVerified = true;
users.push(influencer);

let brand = new User();
brand.email = "brand@gmail.com";
brand.firstName = "brand";
brand.lastName = "seeder";
brand.role = 3;
brand.setPassword("Asdf123");
brand.isEmailVerified = true;
users.push(brand);

let adminUser = new User();
adminUser.email = "support@influocial.co.uk";
adminUser.firstName = "Super";
adminUser.lastName = "Admin";
adminUser.role = 1;
adminUser.setPassword("Clb#2021");
adminUser.isEmailVerified = true;
users.push(adminUser);

module.exports = users;
