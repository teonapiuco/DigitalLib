const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors());

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const users = require("./db.json").user;

app.get("/user/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
});

const { user, roleaccess } = require("./db.json");

app.get("/roleaccess", (req, res) => {
  const role = req.query.role;
  const menu = req.query.menu;

  const roleAccess = roleaccess.find(
    (ra) => ra.role === role && ra.menu === menu
  );

  if (roleAccess) {
    res.json(roleAccess);
  } else {
    res.status(404).send("Role or menu not found");
  }
});

app.post("/user", (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).send("User registered");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
