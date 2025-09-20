const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// load aboutUs.json
const aboutUsPath = path.join(__dirname, "aboutUs.json");
const aboutUsData = JSON.parse(fs.readFileSync(aboutUsPath, "utf8"));

// load error.json
const errorPath = path.join(__dirname, "error.json");
const errorData = JSON.parse(fs.readFileSync(errorPath, "utf8"));

// route: /aboutus/:id
router.get("/:id", (req, res) => {
  const id = req.params.id.toLowerCase();
  const user = aboutUsData[id];
  const error = errorData.error;

  if (user) {
    res.send(`${user.name}\n${user.nim}`);
  } else {
    res.send(`${error.code}<br>${error.message}`);
  }
});


module.exports = router;
