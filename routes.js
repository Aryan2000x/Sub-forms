const {PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

let router = require("express").Router();
let ctrl = require("./controllers");
const multer = require('multer');
const path = require('path')

const storage = multer.memoryStorage();
const upload = multer({storage: storage})

router.get("/submission", ctrl.form);
router.post("/submit", upload.single('fileUpload'), ctrl.submit);

router.get('/', (req,res) => {
  console.log("GET /")
  res.render('lookup');
});

router.get("/search", ctrl.search);

module.exports = router;