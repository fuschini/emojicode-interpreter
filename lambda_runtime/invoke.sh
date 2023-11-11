#!/bin/sh

aws lambda invoke --function-name runtime_test --payload '{"text":"Hello"}' response.txt --cli-binary-format raw-in-base64-out