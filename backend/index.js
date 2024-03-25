const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user_routes");

const app = express();

app.use(express.json());
app.use("/api", userRouter);

mongoose
  .connect(
    "mongodb+srv://dhiru7321r:1102@cluster0.3tjtv3v.mongodb.net/react_auth?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(5000);
    console.log("Connected to database && Listening to port 5000");
  })
  .catch((e) => {
    console.log(e);
  });
