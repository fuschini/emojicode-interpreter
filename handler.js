const serverless = require("serverless-http");
const { exec } = require("child_process");
const express = require("express");
const SSH = require('simple-ssh');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const fs = require("fs");
const app = express();

app.use(bodyParser.json({ strict: false }));

function getSessionId() {
  return uuidv4();
}

app.post("/test", async (req, res, next) => {
  console.log(req.body);
  return res.status(200).json({
    message: req.body,
  });
})

app.post("/ec2", async (req, res, next) => {
  
  if (!req.body.code) {
    return res.status(400).json({
      message: "Missing parameter code",
    });
  }
  const input = req.body.code
  console.log("starting session with code:");
  console.log(input);

  const sessionId = getSessionId()
  console.log(`sessionId: ${sessionId}`);
  
  const pemfile = 'emojicode_ec2.pem';
  const user = 'ec2-user';
  const host = 'ec2-54-205-146-180.compute-1.amazonaws.com';

  const ssh = new SSH({
    host: host,
    user: user,
    key: fs.readFileSync(pemfile)
  });

  let prom = new Promise(function(resolve, reject) {

    let output = {
      logs: '',
      output: ''
    };

    ssh.exec(`echo "${input}" > ./input/${sessionId}.emojic`, {
      err: function(stderr) {
        output.logs += stderr;
      },
      out: function(stdout) {
        output.logs += stdout;
      }
    }).exec(`emojicodec ./input/${sessionId}.emojic`, {
      out: function(stdout) {
        output.logs += stdout;
      },
      err: function(stderr) {
        output.logs += stderr;
      }
    }).exec(`./input/${sessionId}`, {
      out: function(stdout) {
        output.logs += stdout;
        output.output += stdout;
      },
      err: function(stderr) {
        output.logs += stderr;
      }
    }).exec(`rm input/${sessionId} && rm input/${sessionId}.o`, {
      exit: function() {
        resolve(output);
      },
      out: function(stdout) {
        output.logs += stdout;
      },
      err: function(stderr) {
        output.logs += stderr;
      }
    }).start({
      success: function() {
        console.log("successful connection!");
      },
      fail: function(e) {
        console.log("failed connection, boo");
        console.log(e);
      }
    });

  });

  const response = await prom;

  return res.status(200).json({
    message: response,
  });
  
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);


