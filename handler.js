const serverless = require("serverless-http");
const { exec } = require("child_process");
const express = require("express");
const app = express();

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT']

app.get("/", (req, res, next) => {

  exec("./Emojicode-1.0-beta.2-Darwin-x86_64/emojicodec test.emojic && ./test", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return res.status(500).json({
          message: `error: ${error.message}`,
        });
      }
    if (stderr) {
      return res.status(500).json({
        message: `stderr: ${stderr}`,
      });
    }
    return res.status(200).json({
      message: `stdout: ${stdout}`,
    });
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);


