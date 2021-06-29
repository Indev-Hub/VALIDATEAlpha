var aws = require('aws-sdk');
var ddb = new aws.DynamoDB();

exports.handler = async (event, context) => {

    let date = new Date();

    if (event.request.userAttributes.sub) {

        let params = {
            Item: {
                'id': {S: event.request.userAttributes.sub},
                '__typename': {S: 'User'},
                'email': {S: event.request.userAttributes.email},
                'createdAt': {S: date.toISOString()},
                'updatedAt': {S: date.toISOString()},
            },
            TableName: process.env.USERTABLE
          };
        console.log('entered info:', params);

        // Call DynamoDB
        try {
            await ddb.putItem(params).promise();
            console.log("Success");
            context.done(null, event);
        } catch (err) {
            console.log("Error", err);
            context.done(null, event);
        }
        console.log("Success: Everything executed correctly");
        console.log('entered info:', params);
        context.done(null, event);
    } else {
        // Nothing to do, the user's email ID is unknown
        console.log("Error: Nothing was written to DynamoDB");
        context.done(null, event);
    }
};