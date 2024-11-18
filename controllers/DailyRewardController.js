const express = require("express");
const helpers = require("../helpers/helpers");
const dotenv = require("dotenv");
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
    return res.render("daily_reward/daily_reward", {
      menu,
      csrfToken: req.csrfToken(),
    });
  },
  saveData: async function (req, res) {
    let Username = req.session.Username;
    if (!Username) return res.redirect("/login");
    if (req.xhr) {
      console.log("AJAX request received");
    }
  },
};
