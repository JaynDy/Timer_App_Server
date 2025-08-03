import express from "express";
import fs from "fs";
import cors from "cors";
const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;
const FILE_PATH = "./store.json";

app.use(cors());
app.use(express.json());

app.get("/timers", (req, res) => {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      return res.json([]);
    }

    const rawData = fs.readFileSync(FILE_PATH);
    const data = rawData ? JSON.parse(rawData) : {};
    res.json(data.timer || []);
  } catch (error) {
    console.error("Error reading timers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/timers", (req, res) => {
  const newTimers = req.body;
  const data = fs.existsSync(FILE_PATH)
    ? JSON.parse(fs.readFileSync(FILE_PATH))
    : {};
  data.timer = newTimers;
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  res.sendStatus(200);
});

app.get("/sound", (req, res) => {
  if (!fs.existsSync(FILE_PATH)) return res.json({ isSoundEnabled: true });
  const data = JSON.parse(fs.readFileSync(FILE_PATH));
  res.json({ isSoundEnabled: data.isSoundEnabled ?? true });
});

app.post("/sound", (req, res) => {
  const { isSoundEnabled } = req.body;
  const data = fs.existsSync(FILE_PATH)
    ? JSON.parse(fs.readFileSync(FILE_PATH))
    : {};
  data.isSoundEnabled = isSoundEnabled;
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});