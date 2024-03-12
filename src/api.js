const express = require("express");
const serverless = require("serverless-http");
const os = require('os');
const si = require('systeminformation');



const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});

router.get("/sysinfo", (req, res) => {
  res.json({

// Get the serial number of the machine
const serialNumber = os.cpus()[0].serial;

// Display the serial number to the user
console.log(`Your serial number is: ${serialNumber}`);

  });
});


router.get("/sysinformation", (req, res) => {
  res.json({
// Get the serial number of the machine
     si.system().then(data => {
    const serialNumber = data.serial;
    // Display the serial number to the user
    console.log(`Your serial number is: ${serialNumber}`);
}).catch(error => {
    console.error(`Error retrieving serial number: ${error}`);
});


  });
});


app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
