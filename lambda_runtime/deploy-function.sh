#!/bin/sh

# zip -r function.zip function.js bootstrap node-v16.16.0-linux-x64 Emojicode-1.0-beta.2-linux-x86_64
zip -FSr function.zip function.js bootstrap emojicode

# aws lambda create-function \
#     --function-name runtime_test \
#     --zip-file fileb://function.zip \
#     --handler function.handler \
#     --runtime provided \
#     --role arn:aws:iam::261810331311:role/general-lambda-role \
#     --layers arn:aws:lambda:us-east-1:261810331311:layer:custom-runtime:1

# aws lambda update-function-configuration --function-name runtime_test --layers arn:aws:lambda:us-east-1:261810331311:layer:custom-runtime:5

aws lambda update-function-code \
    --function-name runtime_test \
    --zip-file fileb://function.zip \