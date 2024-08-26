import dotenv from "dotenv";
import connectDb from "./src/db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`HTTP Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error: " + err);
  });
