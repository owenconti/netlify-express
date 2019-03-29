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

app.use(`${isProduction ? "/.netlify/functions/" : ""}/api`, router);

exports.handler = servless(app);
