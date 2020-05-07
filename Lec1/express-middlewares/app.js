const express = require("express");

const app = express();

/**
 * პროექტის გასაშვებად
 * 
 * npm install
 * npm start
 * 
 * middleware-ების დანიშნულებაა:
 *  request-ის ავტორიზაცია (უფლება აქვს თუ არა რაიმე მოქმედების, რამეზე წვდომა აქვს თუ არა, წაშლის, დამატების..)
 *  request-ის ვალიდაციის (მაგალითად სწორად ავსებს რამე ფორმას იუზერი )
 *  request-ის ქეშირებისთვის (თუ რამე არ შეცვლილა, დაქეშილი რესფონსი გავუგზავნოთ კლიენტს )
 * 
 * დავაკვირდეთ კონსოლ log-ში რა იბეჭდება
 */

 // ყველა request გაივლის ამ common middlewares-ს
app.use((req, res, next) => {
  console.log('-----------------')
  console.log("Common middleware");
  next();
});

// მხოლოდ /users და /products როუტებზე (endpoint-ებზე) შემოსული request-ები გაივლის ამ middleware-ს
const middlewareForUserAndProducts = (req, res, next) => {
  console.log("Users and Products middleware");
  next();
};

// მხოლოდ /users და /payments როუტებზე (endpoint-ებზე) შემოსული request-ები გაივლის ამ middleware-ს
const middlewareForUsersAndPayments = (req, res, next) => {
  console.log("Users and Payments middleware");
  next();
};

// მხოლოდ /orders როუტზე (endpoint-ზე) შემოსული request-ები გაივლის ამ middleware-ს
const middlewareForOrders = (req, res, next) => {
  console.log("Orders middleware");
  next();
};

// url - http://localhost:4000/users
app.get(
  "/users",
  middlewareForUserAndProducts,
  middlewareForUsersAndPayments,
  (req, res) => {
    res.json('OK')
  }
);

// url - http://localhost:4000/products
app.get("/products", middlewareForUserAndProducts, (req, res) => {
  res.json('OK')
});

// url - http://localhost:4000/payments
app.get("/payments", middlewareForUsersAndPayments, (req, res) => {
  res.json('OK')
});

// url - http://localhost:4000/orders
app.get("/orders", middlewareForOrders, (req, res) => {
  res.json('OK')
});

app.listen(4000, () => {
  console.log('Listening on port 4000');
})

module.exports = app;
