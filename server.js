const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const flash = require("req-flash");
const dotenv = require("dotenv");
const { db } = require("./configs/db");
var methodOverride = require("method-override");
const path = require("path");
const con = require("./configs/db");
const expressLayouts = require("express-ejs-layouts");
const helpers = require("./helpers/helpers");
const { constants } = require("./configs/constants");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

const PORT = 3001;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(expressLayouts);
app.set("layout", "layout/layout");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
const timer = (ms) => new Promise((res) => setTimeout(res, ms));
const csrfProtection = csrf({ cookie: true });
const excludePaths = ["/api", "/save-setting"];

app.use(cookieParser());
app.use((req, res, next) => {
  res.locals.version = constants.version;
  req.con = con;
  if (!excludePaths.includes(req.path)) {
    csrfProtection(req, res, next);
  } else {
    next();
  }
});

app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    console.error("CSRF token error:", err.code);
    res.status(403).send("Form tampered with");
  } else {
    next(err);
  }
});

const index = require("./routes/route.js");
app.use("/", index);
app.listen(PORT);
