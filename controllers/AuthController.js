const express = require("express");
const dotenv = require("dotenv");
const helpers = require("../helpers/helpers");
const constants = require("../configs/constants");
dotenv.config();

module.exports = {
  login: async function (req, res) {
    res.render("login/login", { layout: false, csrfToken: req.csrfToken() });
  },
  auth: async function (req, res) {
    let Username = req.body.username;
    let Password = req.body.password;
    let error = {};
    if (!Username) {
      error.Username = "Nama Pengguna wajib diisi";
    }
    if (!Password) {
      error.Password = "Kata sandi wajib diisi";
    }
    if (Object.keys(error).length > 0) {
      return res.json({ error: error });
    }

    req.session.UserID = 1;
    req.session.Username = "cwh";
    req.session.WebsiteID = process.env.websiteID;
    return res.json({
      redirect: "/",
    });
  },
  logout: async function (req, res) {
    req.session.destroy();
    return res.redirect("/login");
  },
};
