// require('dotenv').config({path:'./env'}) //alternate
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js"

dotenv.config({
  path: "./.env",
});
connectDB()  //it return promise
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(` server is running at port ${process.env.PORT}`);
    })
    app.on("error",(error)=>{
      console.log("ERROR  in main file",error);
      throw error;
    })
  })
  .catch((error) => {
    console.log("MONGO DB connection failed !!!! ", error);
  });

/*
import express from "express";

const app = express()(async () => {
  try {
    mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERROR:", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(` App is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("ERROR", error);
    throw err;
  }
})
();
*/
