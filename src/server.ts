import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();

app.use(cors());
app.use(express.json());

const prismaClient = new PrismaClient();

app.post("/", async (req, res) => {
  const { startTime, endTime, timeZone } = req.body;

  const availability = await prismaClient.availability.create({
    data: {
      endTime,
      startTime,
      timeZone,
    },
  });

  return res.status(201).json(availability);
});

app.get("/", async (req, res) => {
  const availabilities = await prismaClient.availability.findMany();

  return availabilities;
});

app.listen(3000, () => console.log("Server is running"));
