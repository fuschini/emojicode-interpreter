const serverless = require("serverless-http");
const { exec } = require("child_process");
const express = require("express");
const SSH = require('simple-ssh');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
var cors = require('cors');
const fs = require("fs");
const app = express();

app.use(bodyParser.json());
app.use(cors());

function getSessionId() {
  return uuidv4();
}

app.post("/test", async (req, res, next) => {
  console.log(req.body);
  return res.status(200).json({
    message: req.body
  });
})

app.post("/emojicode", async (req, res, next) => {
  
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
      output: '',
      compileError: '',
      executionError: '',
      cleaningLogs: '',
      timeoutError: false
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
        stderr = stderr.replace('emojicodec: /lib64/libtinfo.so.5: no version information available (required by emojicodec)\n', '')
        output.logs += stderr;
        output.compileError += stderr;
      }
    }).exec(`timeout 15 ./input/${sessionId}`, {
      out: function(stdout) {
        output.logs += stdout;
        output.output += stdout;
      },
      err: function(stderr) {
        output.logs += stderr.replace(/bash: \.\/input\/[0-9a-zA-z\-]+: No such file or directory/g, '');
        output.executionError += stderr;
      },
      exit: function(code) {
        console.log(`execution exit code: ${code}`);
        if (code == 124) {
          output.logs += 'Operation timeout after 15s\n';
          output.timeoutError = true;
        }
      }
    }).exec(`rm input/${sessionId} && rm input/${sessionId}.o && rm input/${sessionId}.emojic`, {
      exit: function() {
        console.log('About to resolve with output:');
        console.log(output);
        resolve(output);
      },
      out: function(stdout) {
        output.cleaningLogs += stdout;
      },
      err: function(stderr) {
        output.cleaningLogs += stderr;
      }
    }).start({
      success: function() {
        console.log("successful connection!");
      },
      fail: function(e) {
        console.log("failed connection, boo");
        console.log(e);
        output.logs += `Connection failed\n${e.message}`
        resolve(output);
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


