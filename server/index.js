import express from "express";
import cors from "cors";
import { adminRouter } from "./Routes/AdminRoute.js";
import { authRouter } from "./Routes/AuthRouter.js"; // Adjust path as needed

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth", adminRouter);
app.use("/auth", authRouter);

app.listen(3000, () => {
  console.log("Server is running");
});
