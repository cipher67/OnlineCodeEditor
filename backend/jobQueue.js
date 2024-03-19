const Queue = require("bull");
const Job = require("./models/Job");
const { executeCpp } = require("./executeCpp");
const { executePython } = require("./executePython");
const { findById } = require("./DB");

const jobQueue = new Queue("job-queue");

const WORKERS = 5;

jobQueue.process(WORKERS, async ({ data }) => {
  console.log("processing   ", data);
  const { id: jobId } = data;
  const job = await findById(jobId);
  if (job === undefined) {
    throw Error("Job not found");
  } else {
    let output;
    try {
      job["startedAt"] = new Date();
      job["status"] = "Running";
      if (job.language === "python") {
        output = await executePython([job.filepath, job.inputFilePath]);
      }

      job["completedAt"] = new Date();
      job["status"] = "Success";
      job["output"] = output;

      console.log("output", output);

    } catch (err) {
      job["completedAt"] = new Date();
      job["status"] = "Error";
      job["output"] = JSON.stringify(err);

    }

    return true;
  }
});

jobQueue.on("failed", (error) => {
  console.log(error.data.id, "failed", error.failedReason);
});

const addJobToQueue = async (jobId) => {
  console.log("added to q");
  await jobQueue.add({ id: jobId });
};

module.exports = {
  addJobToQueue,
};
