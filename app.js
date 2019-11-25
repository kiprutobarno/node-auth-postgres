require("dotenv").config();
const express = require("express");
const { User } = require("./controllers/users");
const { Activity } = require("./controllers/activities");
const { Auth } = require("./middleware/Auth");

const app = express();

app.use(express.json());
app.get("/api/v1/user", Auth.verifyToken, User.welcome);

app.post("/api/v1/users/register", User.register);
app.post("/api/v1/users/login", User.login);

app.post(
  "/api/v1/activities/create",
  Auth.verifyToken,
  Activity.createActivity
);
app.get("/api/v1/activities", Auth.verifyToken, Activity.getAllActivities);
app.get("/api/v1/activities/:id", Auth.verifyToken, Activity.getOneActivity);
app.put(
  "/api/v1/activities/update/:id",
  Auth.verifyToken,
  Activity.updateActivity
);
app.delete(
  "/api/v1/activities/delete/:id",
  Auth.verifyToken,
  Activity.deleteActivity
);

app.listen(process.env.PORT, () => {
  console.log(`....server running on port ${process.env.PORT}....`);
});
