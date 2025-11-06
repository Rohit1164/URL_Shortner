import express from "express";
import connectMongoDB from "./connect.js";
import useRoute from "./router/route.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const PORT = 8000;
const app = express();

connectMongoDB(process.env.MONGO_DB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection Error", error));

app.use(cors());
app.use(express.json());
app.use("/url", useRoute);

app.listen(PORT, console.log(`Sarver Started At http://localhost:${PORT}`));
