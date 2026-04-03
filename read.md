1. Roles
{
  "name": "Admin"
}

{
  "name": "Admin"
  "rolepermission": {
    "connect" : [
        { "id": 1 }
    ]
  }
}

2. Permission
{
  "attribute": "finance",
  "action": "read"
}

3. Assign Permissions to Role (Many-to-Many)
{
  "attribute": "finance",
  "action": "read",
  "role": {
    "connect": [
      { "id": 1 },
      { "id": 2 }
    ]
  }
}

4. UserAuth (Signup)
{
  id
  "name": "Gourav",
  "email": "gourav@example.com",
  "password": "123456"
}

5. UserData (Link user + role)
{
  "userid": 1,
  "status": "Active",
  "roleid": 1
}

6. FinanceData
{
  "amount": 5000,
  "category": "Salary",
  "type": "income",
  "date": "2026-04-02T10:00:00.000Z",
  "notes": "Monthly salary"
}