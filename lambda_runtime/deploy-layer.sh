#!/bin/sh

zip -r -9 runtime.zip bootstrap emojicode

aws lambda publish-layer-version --layer-name custom-runtime --zip-file fileb://runtime.zip