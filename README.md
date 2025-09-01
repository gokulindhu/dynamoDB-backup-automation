# dynamoDB-backup-automation

This project provides utilities to **export, backup, and wipe data** from **AWS DynamoDB** and **Cognito User Pools**.  
It includes scripts for exporting all data to JSON files and for clearing all users and tables when needed.

---

## 📦 Features

- **Export DynamoDB Data** (`index.js`)  
  Exports all tables from DynamoDB into local `.json` files.

- **Export Cognito Users** (`export-cognito.js`)  
  Exports all Cognito User Pool users into a JSON file.

- **Remove All Cognito Users** (`remove-cognito-user.js`)  
  Deletes all users from a given Cognito User Pool.

- **Remove All DynamoDB Data** (`remove-data.js`)  
  Wipes all items from every table in DynamoDB.

---

## ⚙️ Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/dynamoDB-backup-automation.git
   cd dynamoDB-backup-automation
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure your AWS credentials:  
   Make sure you have AWS CLI configured or environment variables set:

   ```bash
   aws configure
   ```

4. Update **region** inside scripts where required.  
   (User Pool IDs will now be passed via CLI arguments.)

---

## 🚀 Usage

### 1. Export DynamoDB Tables

```bash
node index.js
```

- Exports all DynamoDB tables in your region.
- Each table is saved as `<table-name>.json`.

---

### 2. Export Cognito Users

```bash
node export-cognito.js <USER_POOL_ID>
```

- Exports all Cognito users from the specified **User Pool ID**.
- Example:

  ```bash
  node export-cognito.js us-east-1_xxxxx
  ```

- Output file: `cognito-users.json`.

---

### 3. Delete All Cognito Users

```bash
node remove-cognito-user.js <USER_POOL_ID>
```

- Deletes every user in the specified **Cognito User Pool**.
- Example:

  ```bash
  node remove-cognito-user.js us-east-1_xxxxx
  ```

- Use with caution ⚠️ — this is irreversible.

---

### 4. Wipe All DynamoDB Tables

```bash
node remove-data.js
```

- Deletes **all items** from every DynamoDB table in the configured region.
- Table structures remain intact (tables are not dropped).
- Use with caution ⚠️ — this is irreversible.

---

## 🛠️ Requirements

- Node.js v16+
- AWS SDK v3
- AWS Account with DynamoDB & Cognito access
- Proper IAM permissions:
  - `dynamodb:ListTables`
  - `dynamodb:Scan`
  - `dynamodb:BatchWriteItem`
  - `cognito-idp:ListUsers`
  - `cognito-idp:AdminDeleteUser`

---

## ⚠️ Disclaimer

These scripts perform **destructive actions** (user deletion, table wipe).  
Make sure to **backup data** before running deletion scripts. Use in development or controlled environments unless you are certain.

---

## 📜 License

MIT License
