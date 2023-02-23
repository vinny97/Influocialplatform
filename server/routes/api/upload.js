var router = require("express").Router();
const path = require("path");
let httpResponse = require("express-http-response");
var cloudinary = require("cloudinary").v2;
let OkResponse = httpResponse.OkResponse;

var fs = require("fs");

const multer = require("multer");


  
// Creating uploads folder if not already present
// In "uploads" folder we will temporarily upload
// image before uploading to cloudinary
if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}
  
// Multer setup
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
  
var upload = multer({ storage: storage });
  
// Body parser configuration
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
  
// app.use(express.static(__dirname + "/public"));
// app.use("/uploads", express.static("uploads"));
  
cloudinary.config({
  cloud_name: 'influocial',
  api_key: '354897726584735',
  api_secret: '3pwWp25e_rRxeyrWkAtLSE7NOrM'
});

  
async function uploadToCloudinary(locaFilePath) {
  
    // locaFilePath: path of image which was just
    // uploaded to "uploads" folder
  
    var mainFolderName = "main";
    // filePathOnCloudinary: path of image we want
    // to set when it is uploaded to cloudinary
    var filePathOnCloudinary = 
        mainFolderName + "/" + locaFilePath;
  
    return cloudinary.uploader
        .upload(locaFilePath, { public_id: filePathOnCloudinary })
        .then((result) => {
  
            // Image has been successfully uploaded on
            // cloudinary So we dont need local image 
            // file anymore
            // Remove file from local uploads folder
            fs.unlinkSync(locaFilePath);
  
            return {
                message: "Success",
                url: result.url,
            };
        })
        .catch((error) => {
  
            // Remove file from local uploads folder
            fs.unlinkSync(locaFilePath);
            return { message: "Fail" };
        });
}
  
function buildSuccessMsg(urlList) {
  
    // Building success msg to display on screen
    return { url: urlList[0] };
}
  
router.post(
    "/",
    upload.single("file"),
    async (req, res, next) => {
  
        // req.file is the `profile-file` file
        // req.body will hold the text fields,
        // if there were any
  
        // req.file.path will have path of image
        // stored in uploads folder
        var locaFilePath = req.file.path;
  
        // Upload the local image to Cloudinary 
        // and get image url as response
        var result = await uploadToCloudinary(locaFilePath);
  
        // Generate html to display images on web page.
        var response = buildSuccessMsg([result.url]);
  
        return res.send(response);
    }
);






// var cpUpload = multer.fields([{ name: "file", maxCount: 1 }]);

// router.post("/", cpUpload, function (req, res, next) {
//   // console.log("cpUpload:  "+cpUpload);

//   var reader = new FileReader();
//   // reader.readAsDataURL(req.files["file"][0]);
//   // upload image to cloudinary
//   // send cloudinary image url in response.

//   // reader.onload = () => {
//   // console.log("File->", reader.result);
//   try {
//     cloudinary.uploader.upload(req.files["file"][0], {timeout:60000}).then(status => {

//       console.log("Upload status: " + status);
//       return res.json({ url: `/uploads/${req.files["file"][0].filename}` });
//     });
//   } catch (error) {
//     console.log(error);
//   }


//   // reader.onerror = (err) => {
//   //   console.log("err: " + err);
//   //   return res.json({ msg: "An error occurred" });
//   // }

//   return res.json({ err: "An error occured" });
// });


router.post("/delete", function (req, res, next) {
  if (req.body.url) {
    fs.unlink(
      path.join(process.cwd(), "public", req.body.url),
      function (err) {
        if (err) {
          return res.sendStatus(204);
        }
        // if no error, file has been deleted successfully
        return next(new OkResponse({ result: "File deleted..." }));
      },
    );
  } else {
    if (!event) return res.sendStatus(204);
  }
  // unlink the files
});

module.exports = router;
