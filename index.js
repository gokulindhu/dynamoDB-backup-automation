// export-dynamodb.js
const fs = require("fs");
const { DynamoDBClient, ListTablesCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({
  region: "us-east-1", // change your region
});

async function scanAllItems(tableName) {
  let items = [];
  let lastEvaluatedKey = undefined;

  do {
    const scanCommand = new ScanCommand({
      TableName: tableName,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const response = await client.send(scanCommand);
    if (response.Items) {
      items = items.concat(response.Items);
    }
    lastEvaluatedKey = response.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return items;
}

async function exportAllTables() {
  try {
    const tables = await client.send(new ListTablesCommand({}));

    console.log(`Found ${tables.TableNames.length} tables.`);

    for (const table of tables.TableNames) {
      console.log(`Exporting table: ${table}`);
      const items = await scanAllItems(table);

      fs.writeFileSync(`${table}.json`, JSON.stringify(items, null, 2));
      console.log(`✅ Exported ${items.length} items from ${table} to ${table}.json`);
    }
  } catch (err) {
    console.error("Error exporting tables:", err);
  }
}

exportAllTables();
