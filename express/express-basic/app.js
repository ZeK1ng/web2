const express = require("express");

const app = express();

/**
 * აქამდე რა გავაკეთე:
 *
 * npm init -y (პროექტის ინიცირება, ქმინის package.json-ს)
 * npm install express --save (express module-ის დაყენება)
 * package.json-ში scripts ველში ჩავამატე ეს ხაზი '"start": "node app.js",'
 */

/**
 * პროექტის გასაშვებად:
 *
 * npm install (package.json-ში dependencies ჩამონათვალში მოცემული მოდულების დაყენება)
 * npm start
 */

 /**
  * res.send და res.json მეთოდებით ვაბრუნებთ response-ს
  */

// request url example:
//   http://localhost:5000/

app.get("/", (req, res) => {
  res.json({
    name: "saxeli",
    age: "25",
    height: 175,
  });
});

// request url example:
//   http://localhost:5000/user/

app.get("/user", (req, res) => {
  res.send(`<p style="font-size: 30px; color: green">user HTTP GET request<p>`);
});

// request url example:
//   http://localhost:5000/user/11/

app.get("/user/:id", (req, res) => {
  const userId = req.params.id;

  console.log(userId);

  res.json({
    requestUrl: "/user/:id",
    userId: userId,
  });
});

// request url example:
//   http://localhost:5000/products/10/details/7

app.get("/products/:id/details/:detailsId", (req, res) => {
  const productId = req.params.id;
  const detailsId = req.params.detailsId;

  res.json({
    productId: productId,
    detailsId: detailsId,
    url: "/products/:id/details/:detailsId",
  });
});

app.listen(5000, () => {
  console.log("listening...");
});

module.exports = app;
