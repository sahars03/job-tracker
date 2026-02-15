import express from "express";
import cors from "cors";

const formRoutes = require("./routes/formRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/form", formRoutes);

// server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});