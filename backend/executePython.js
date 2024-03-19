const { exec } = require("child_process");

const executePython = ([filepath, inputFilePath]) => {
  const cmdToExecute = `python ${filepath} ${inputFilePath}`;

  console.log("executePython ", cmdToExecute);

  return new Promise((resolve, reject) => {
    exec(cmdToExecute, (error, stdout, stderr) => {
      if (error) reject({ error, stderr });
      if (stderr) reject({ stderr });
      resolve(stdout);
    });
  });
};

module.exports = {
  executePython,
};
