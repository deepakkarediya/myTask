const express = require("express");
const authController = require("../controllers/authController");
const multer = require("multer");
const router = express.Router();

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: Storage });
router.post(
  "/registration",
  upload.single("image"),
  authController.createRegis
);
router.post("/login", authController.createLogin);

module.exports = router;
