const { default: axios } = require("axios");
const express = require("express");
const OkResponse = require("express-http-response/lib/http/OkResponse");
const router = express.Router();
const { promises: fs } = require("fs");
const path = require("path");
let auth = require("../auth");

// used the commented code to scrap entire data into one array and saved it in public folder as all_influencers_data.json
const filePath = path.join(
  "public",
  "uploads",
  "influencers",
  "extracted_files3",
);
//final endpoint
router.post("/scrapeFolderNames", async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://influocial-client.herokuapp.com');
  let nameListOfFolders = []; // array of all folder names
  let _res = [];
  let totalLikes, totalComments, reach;

  const files = await fs.readdir(filePath);

  files.forEach((file) => {
    nameListOfFolders.push(file);
  });

  console.log(nameListOfFolders);

  for (const file of nameListOfFolders) {
    // let _res = [];
    let obj = {};
    obj.profilePicture = `/uploads/influencers/extracted_files3/${file}/${file}.jpg`;

    const files = await fs.readFile(
      filePath + "/" + file + "/profile.json",
      "utf-8",
    );
    // obj.profileInfo = files;
    let readFile = JSON.parse(files);
    let posts = readFile.profile_data.profile_posts.posts;
    obj.totalLikes = posts.reduce((a, b) => a + b.post_likes, 0);
    obj.totalComments = posts.reduce((a, b) => a + b.post_comments, 0);
    obj.country = readFile.profile_data.profile_location_country;
    obj.continent = readFile.profile_data.profile_location_continent;
    obj.follower = readFile.profile_data.total_followers;
    obj.bio = readFile.profile_data.biography;
    obj.category = readFile.profile_data.category_name;
    obj.userName = readFile.profile_data.username;
    obj.totalPosts = readFile.profile_data.profile_posts.posts_count;
    obj.avgLikesPerPost = +Math.ceil((obj.totalLikes / obj.totalPosts) * 100);
    obj.avgCommentsPerPost = +Math.ceil(
      (obj.totalComments / obj.totalPosts) * 100,
    );

    //CALCULATE CPP
    if (obj.follower >= 1000 && obj.follower <= 10000) {
      obj.cppMin = 50;
      obj.cppMax = 150;
    } else if (obj.follower >= 10000 && obj.follower <= 20000) {
      obj.cppMin = 100;
      obj.cppMax = 300;
    } else if (obj.follower >= 20000 && obj.follower <= 30000) {
      obj.cppMin = 150;
      obj.cppMax = 400;
    } else if (obj.follower >= 30000 && obj.follower <= 50000) {
      obj.cppMin = 150;
      obj.cppMax = 500;
    } else if (obj.follower >= 50000 && obj.follower <= 100000) {
      obj.cppMin = 200;
      obj.cppMax = 600;
    } else if (obj.follower >= 100000 && obj.follower <= 250000) {
      obj.cppMin = 200;
      obj.cppMax = 800;
    } else if (obj.follower >= 250000 && obj.follower <= 500000) {
      obj.cppMin = 500;
      obj.cppMax = 2000;
    } else if (obj.follower >= 500000 && obj.follower <= 1000000) {
      obj.cppMin = 500;
      obj.cppMax = 50000;
    } else if (obj.follower >= 1000000) {
      obj.cppMin = 500;
      obj.cppMax = 20000;
    }

    const sum = obj.totalLikes + obj.totalComments;
    obj.avgEngagement = +(sum / obj.follower).toFixed(2);
    obj.reach = (sum / readFile.profile_data.total_followers) * 100;

    _res.push(obj);
    console.log(_res);
  }

  next(new OkResponse(_res));
});

router.get("/getFileName", async (req, res) => {
  console.log(filePath);
  let listOfAllFiles = [];
  let influencersData = [];
  let totalLikes, totalComments, reach;
  fs.readdirSync(filePath).forEach((file) => {
    listOfAllFiles.push(file);
  });
  for (const file of listOfAllFiles) {
    await new Promise(async (resolve) => {
      let readFile = fs.readFileSync(filePath + "/" + file, "utf8");
      readFile = JSON.parse(readFile);
      await new Promise((resolve) => {
        reach = 0;
        let posts = readFile.profile_data.profile_posts.posts;

        totalLikes = posts.reduce((a, b) => a + b.post_likes, 0);
        totalComments = posts.reduce((a, b) => a + b.post_comments, 0);
        const sum = totalLikes + totalComments;
        reach = (sum / readFile.profile_data.total_followers) * 100;
        if (reach != undefined) {
          readFile.profile_data.reach = reach;
          readFile.profile_data.totalLikes = totalLikes;
          readFile.profile_data.totalComments = totalComments;
          resolve(reach);
        }
      });
      influencersData.push(readFile);
      resolve(readFile);
    });
  }
  res.send({ result: influencersData });
});

router.post("/getImg", (req, res, next) => {
  const { url } = req.body;
  axios
    .get(
      "https://instagram.fisb6-2.fna.fbcdn.net/v/t51.2885-19/270010842_672820337427110_6605466419611716459_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fisb6-2.fna.fbcdn.net&_nc_cat=102&_nc_ohc=nVvSiu2OGoUAX__zrjm&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT9K55ySV3Fl89mC-lRKWLM8oQ5Zkyqc6A8Krg8LVummyQ&oe=62224B71&_nc_sid=7bff83",
    )
    .then((response) => {
      // console.log(response);
      res.send(response.data);
    });
});
router.get("/getInfluencers", auth.required, async (req, res, next) => {
  var file = require(path.join(
    process.cwd(),
    "server",
    "public",
    "uploads",
    "influencers",
    "all_influencers_data.json",
  ));
  return next(new OkResponse(file));
});

module.exports = router;
