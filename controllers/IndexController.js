const express = require("express");
const helpers = require("../helpers/helpers");

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
    return res.render("index", {
      menu,
    });
  },
};
