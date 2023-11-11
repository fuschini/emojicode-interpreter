exports.handler = async (event) => {
    console.log('Received event:', event);

    // Your custom logic here
    const responseMessage = 'Hello from your Node.js Lambda function!';

    return responseMessage;
};