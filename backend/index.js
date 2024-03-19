const express = require("express");
const cors = require("cors");

const { generateFile } = require("./generateFile");

const Job = require("./models/Job");

const { executePython } = require("./executePython");

const app = express();

app.use(cors());
app.use(express.json());


app.post("/run", async (req, res) => {
  console.log("running...");
  const { language = "python", code, input = "" } = req.body;
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body" });
  }

  let job;

  try {
    const files = await generateFile(language, code, input);

    const [filepath, inputFilePath] = files;

    job = new Job({ language, filepath, inputFilePath });

    const jobId = job["id"];

    let output;
 
    output = await executePython([job.filepath, job.inputFilePath]);

    res.status(201).json({ success: true, jobId, output });
  } catch (err) {
    console.log("err", err);

    return res.status(500).json({ success: false, err: JSON.stringify(err) });
  }
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});

