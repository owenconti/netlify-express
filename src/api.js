import express from "express";
import servless from "serverless-http";

const isProduction = process.env.NODE_ENV === "production";

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});

console.log("isProduction", isProduction);

app.use(`${isProduction ? "/.netlify/functions" : ""}/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
