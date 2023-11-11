# Emojicode Custom Lambda Runtime

## Background

This is an experiment attempting to use the emojicode compiler directly in the lambda environment, replacing the EC2 approach currently implemented to minimize cost.

## Methodology

The approach was to create a [custom lambda runtime](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-walkthrough.html) with the emojicode binary in it and run the code sent by the user in the bootstrap script (without using Node).

The "runtime" is the `bootstrap` script itself. It's a bask script that initializes the environment and then listens from events from an endpoint.

There are some auxiliary scripts to deploy and update the funcion. I tried using the runtime as a layer, but it adds steps to the process. Currently you can deploy a function with the runtime just using `deploy-function.sh`.

## Conclusion

I tried using the prebuilt binary but ended up with the error `sh: c++: command not found` and I couldn't figure it out at the time. Lambda's environment apparently doesn't handle custom instalations well.

I had an idea of maybe using a C++ runtime and adding the prebuilt binary as a layer, then create a cpp funcion to handle the event and call the binary from the layer. Don't feel like setting up a C++ env to develop this. So I'll drop this project for now and hope some day in the future I can get it working.

But I did end up learning how to create a custom lambda runtime, so that was cool.