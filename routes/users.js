const express = require("express");
const router = express.Router();
const http = require("http");

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});

router.get("/help", function (req, res, next) {
    http.get("http://localhost:3000/users", (response) => {
        const { statusCode } = response;
        const contentType = response.headers['content-type'];
        res.send("hmm");
    });

    res.send("respond with a resource");
});

module.exports = router;
