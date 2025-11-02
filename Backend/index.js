import express from "express";
import connectMongoDB from "./connect.js";
import useRoute from "./router/route.js";
import cors from "cors";

const PORT = 8000;
const app = express();

connectMongoDB("mongodb://localhost:27017/URL_Shortner")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection Error", error));

app.use(cors());
app.use(express.json());
app.use("/url", useRoute);

app.listen(PORT, console.log(`Sarver Started At http://localhost:${PORT}`));
