const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 8080;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

const memoryRouter = require("./routes/memoryGame");
app.use("/memory", memoryRouter);

const lightsoutRouter = require("./routes/lightsoutGame");
app.use("/lightsout", lightsoutRouter);

const simonRouter = require("./routes/simonGame");
app.use("/simon", simonRouter);

app.listen(PORT, () =>
  console.log(`API is live and ready on http://localhost:${PORT}`)
);
