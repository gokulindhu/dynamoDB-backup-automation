import {
  DynamoDBClient,
  ListTablesCommand,
  ScanCommand,
  BatchWriteItemCommand,
  DescribeTableCommand,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

async function getKeySchema(tableName) {
  const tableInfo = await client.send(new DescribeTableCommand({ TableName: tableName }));
  const keySchema = tableInfo.Table.KeySchema; // [{AttributeName: 'PK', KeyType: 'HASH'}, ...]
  return keySchema.map((k) => k.AttributeName);
}

async function deleteAllItemsFromTable(tableName) {
  const keyAttrs = await getKeySchema(tableName);
  let lastEvaluatedKey = null;

  console.log(`\nClearing table: ${tableName} (keys: ${keyAttrs.join(", ")})`);

  do {
    const scanResult = await client.send(
      new ScanCommand({
        TableName: tableName,
        ExclusiveStartKey: lastEvaluatedKey || undefined,
        ProjectionExpression: keyAttrs.join(", "), // only fetch keys
        Limit: 25, // batch write max
      })
    );

    if (scanResult.Items.length > 0) {
      const deleteRequests = scanResult.Items.map((item) => {
        const key = {};
        for (const k of keyAttrs) key[k] = item[k];
        return { DeleteRequest: { Key: key } };
      });

      for (let i = 0; i < deleteRequests.length; i += 25) {
        const batch = deleteRequests.slice(i, i + 25);
        await client.send(
          new BatchWriteItemCommand({ RequestItems: { [tableName]: batch } })
        );
      }

      console.log(`Deleted ${scanResult.Items.length} items from ${tableName}`);
    }

    lastEvaluatedKey = scanResult.LastEvaluatedKey;
  } while (lastEvaluatedKey);
}

async function wipeAllTables() {
  const tables = await client.send(new ListTablesCommand({}));
  for (const table of tables.TableNames) {
    await deleteAllItemsFromTable(table);
  }
  console.log("✅ All DynamoDB tables wiped clean");
}

wipeAllTables().catch((err) => console.error("Error wiping tables:", err));
