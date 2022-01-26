import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());

type Availability = {
  startTime: Date;
  endTime: Date;
  timezone: string;
};

const availabilities: Availability[] = [];

app.post("/", (req, res) => {
  const { startTime, endTime, timezone } = req.body;

  availabilities.push({ startTime, endTime, timezone });
});

app.get("/", (req, res) => {
  res.json(availabilities);
});

app.listen(3000, () => console.log("Server is running"));
