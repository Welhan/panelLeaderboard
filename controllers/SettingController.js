const express = require("express");
const helpers = require("../helpers/helpers");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

module.exports = {
  index: async function (req, res) {
    let Username = req.session.Username;
    if (!Username) return res.redirect("/login");
    let menu = await helpers.generateMenu();
    menu = await Promise.all(
      menu.map(async (item) => {
        item.submenu = await helpers.generateSubmenu(item.ID);
        return item;
      })
    );
    return res.render("settings/settings", {
      menu,
      csrfToken: req.csrfToken(),
    });
  },
  saveSetting: async function (req, res) {
    let image = req.file.filename;
    let websiteName = req.body.websiteName;
    let websiteURL = req.body.websiteURL;
    let telegramURL = req.body.telegramURL;
    let TOBronze = req.body.TOBronze;
    let TOSilver = req.body.TOSilver;
    let TOGold = req.body.TOGold;
    let TOPlatinum = req.body.TOPlatinum;
    let TODiamond = req.body.TODiamond;
    let data = {
      image: process.env.base_url + "uploads/images/" + image,
      websiteName,
      websiteURL,
      telegramURL,
    };
    let config = ["Link Main", "Link Telegram", "Website"];
    return console.log(data);
    db.query(`INSERT INTO config `);
    await axios.post(process.env.url_api + "/save_setting", {});
    console.log(req.body, req.file);
  },
};
