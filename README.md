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



<!-- results -->
<!-- signup -->
{
    "message": "User created successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc1MzY4MzQ4LCJleHAiOjE3NzU0NTQ3NDh9.NsRm9jge2xu4etwMBC-B6zLZ4Jjx-7N1vFTPVFbpC1U",
    "user": {
        "id": 3,
        "name": "evaan",
        "password": "$2b$10$cEkKmirKp9HAuHL57.SNJuZpy45G71I1SPWFypwuQUXPyG1RxwPXG",
        "email": "evaan@example.com",
        "userdata": {
            "id": 3,
            "userid": 3,
            "status": "active",
            "roleid": 2,
            "role": {
                "id": 2,
                "name": "viewer"
            }
        }
    }
}
<!-- admin login -->
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc1MzY2ODY4LCJleHAiOjE3NzU0NTMyNjh9.foMsokEG1bmZWryuEKZmp5mZs-qo7UA7TDTE7EtdyTo",
    "user": {
        "id": 1,
        "name": "Super Admin",
        "password": "$2b$10$HxYbFvyCWP.oi6YHCL4JHuSYz6o6pLsi8GoboSSKZwI75wcv7/J56",
        "email": "admin@example.com"
    }
}