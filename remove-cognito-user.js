import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminDeleteUserCommand
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "us-east-1" }); // change your region
const userPoolId = process.argv[2];

async function getAllUsers() {
  let users = [];
  let paginationToken;

  do {
    const response = await client.send(
      new ListUsersCommand({
        UserPoolId: userPoolId,
        Limit: 60, // max per request
        PaginationToken: paginationToken,
      })
    );

    users = users.concat(response.Users.map(u => u.Username));
    paginationToken = response.PaginationToken;
  } while (paginationToken);

  return users;
}

async function deleteAllUsers() {
  const users = await getAllUsers();
  console.log(`Found ${users.length} users. Deleting...`);

  for (const username of users) {
    try {
      await client.send(
        new AdminDeleteUserCommand({
          UserPoolId: userPoolId,
          Username: username,
        })
      );
      console.log(`✅ Deleted user: ${username}`);
    } catch (err) {
      console.error(`❌ Failed to delete user ${username}:`, err.message);
    }
  }

  console.log("✅ All users deleted");
}

deleteAllUsers().catch(console.error);
