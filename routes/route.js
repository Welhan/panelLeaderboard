const express = require("express");
const router = express.Router();
const IndexController = require("../controllers/IndexController");
const AuthController = require("../controllers/AuthController");
const DailyRewardController = require("../controllers/DailyRewardController");
const SettingController = require("../controllers/SettingController");
const { uploadImage, uploadXlsx } = require("../configs/multer");

router.get("/", IndexController.index);
router.get("/login", AuthController.login);
router.post("/auth", AuthController.auth);
router.get("/logout", AuthController.logout);

//routing page
router.get("/daily-rewards", DailyRewardController.index);
router.get("/settings", SettingController.index);

router.post(
  "/save-setting",
  uploadImage.single("image"),
  SettingController.saveSetting
);
router.post("/daily_rewardNew", DailyRewardController.saveData);

module.exports = router;
