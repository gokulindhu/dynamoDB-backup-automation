import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import fs from "fs";

const client = new CognitoIdentityProviderClient({ region: "us-east-1" }); // change region
const userPoolId = "us-east-1_Ayviomu6n"
async function listAllUsers() {
  let users = [];
  let paginationToken;

  do {
    const response = await client.send(
      new ListUsersCommand({
        UserPoolId: userPoolId,
        Limit: 60,
        PaginationToken: paginationToken,
      })
    );

    users = users.concat(response.Users);
    paginationToken = response.PaginationToken;
  } while (paginationToken);

  fs.writeFileSync("cognito-users.json", JSON.stringify(users, null, 2));
  console.log(`✅ Exported ${users.length} users to cognito-users.json`);
}

listAllUsers().catch(console.error);
