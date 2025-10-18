// ... imports
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    // 1. Get the schoolId from the path parameter
    const schoolId = event.pathParameters.schoolId;

    if (!schoolId) {
        return { statusCode: 400, body: 'Error: Missing schoolId' };
    }

    // 2. Use a Query operation instead of Scan
    const params = {
        TableName: 'StudySpots',
        KeyConditionExpression: 'schoolId = :s',
        ExpressionAttributeValues: {
            ':s': schoolId
        }
    };

    try {
        const command = new QueryCommand(params); // Use QueryCommand
        const data = await docClient.send(command);
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(data.Items),
        };
    } catch (error) {
        // ... error handling
    }
};
