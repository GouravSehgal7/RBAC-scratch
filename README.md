# NOTE:- STEPS TO RUN PROJECT AND WATCH DOCUMENTATION AND DATABASE DISCRIPTION
### RUN: npm start
### DOCS VISIT :: http://localhost:8000/api-docs
### DATABASE VISIT :: http://localhost:51212

#### make a .env file and add this
 - DATABASE_URL="file:./src/prisma/dev.db"
 - JWT_SECRET = "abce"

# Financial Dashboard Backend API

A scalable and role-based backend system for managing financial records, users, and analytics.  
This project is designed with **production-ready architecture**, focusing on **extensibility, maintainability, and fine-grained access control**.

---

## Overview

This backend provides a complete system for:

- **User and role management (RBAC)**
- **Financial records handling** (income/expense tracking)
- **Dashboard analytics and aggregation**
- **Secure access control**
- **Validation and error handling**
- **Scalable architecture for future growth**

---

## Tech Stack

- **Node.js + Express**
- **Prisma ORM**
- **SQLite** (development, easily extensible)
- **JWT Authentication**
- **Zod** (Validation)
- **Swagger** (API Documentation)

---

## 1. User & Role Management

The system implements a **Role-Based Access Control (RBAC)** model with extensibility toward fine-grained permissions.

### Features Implemented

- User creation and management  
- Role assignment and updates  
- User status management (active/inactive)  
- Middleware-based access restriction  

### Roles

| Role     | Capabilities                              |
|----------|------------------------------------------|
| Viewer   | Read-only access to dashboard data       |
| Analyst  | Access to records + analytics            |
| Admin    | Full system access                       |

---

## Advanced Permission System (Extended Capability)

Although not required, the system includes **permission-level APIs** to support **future fine-grained access control**.

### Additional Work Done

- Create permissions  
- Assign permissions to roles  
- Remove permissions from roles  
- Create roles with predefined permissions  

### Why This Matters

This enables:

- Transition from **coarse RBAC → fine-grained RBAC**  
- Feature-level access control (e.g., `read_dashboard`, `edit_user`)  
- Easier scaling for enterprise-level authorization  

---

## Future Authorization Scalability

The system design allows integration with advanced authorization models such as:

### OpenFGA (Fine-Grained Authorization)

- Supports **Relationship-Based Access Control (ReBAC)**  
- Enables **Attribute-Based Access Control (ABAC)**  
- Allows complex policies like:
  - “User can edit only their own records”  
  - “Managers can access team data”  
  - “Conditional access based on attributes”  

> Current architecture (**middleware + modular RBAC**) makes it straightforward to integrate such systems without major refactoring.

---

## 2. Financial Records Management

Full lifecycle management of financial records.

### Record Fields

- **Amount**  
- **Type** (income / expense)  
- **Category**  
- **Date**  
- **Notes / description**  

### Supported Operations

- Create records  
- View records  
- Update records  
- Delete records  

### Filtering

- By **date**  
- By **category**  
- By **type**  

### Pagination

- Implemented for efficient large dataset handling  

---

## 3. Dashboard Summary APIs

Provides aggregated insights for dashboard visualization.

### Implemented APIs

- Total income  
- Total expenses  
- Net balance  
- Category-wise totals  
- Monthly trends  
- Recent activity  
- Monthly category trends  

### Implementation Highlights

- Optimized aggregation queries  
- Clean separation of aggregation logic  
- Designed for **frontend-ready consumption**  

---

## 4. Access Control Logic

Strict backend-level enforcement using layered middleware.

### Middleware Strategy

- `isauth` → Authentication  
- `isStatusAllowed` → User state validation  
- `isroleallowed` → Role-based authorization  

### Behavior Enforcement

- **Viewer** → read-only access  
- **Analyst** → read + analytics access  
- **Admin** → full system control  

---

## 5. Validation & Error Handling

Ensures reliability and predictable API behavior.

### Features

- Schema validation using **Zod**  
- Structured error responses  
- Proper HTTP status codes  
- Protection against invalid operations  

---

## 6. Data Persistence

- **Prisma ORM** for database abstraction  
- **SQLite** for development simplicity  
- Schema-driven design  
- Easily portable to production-grade databases  

---

## Additional Enhancements Implemented

Beyond the base requirements, the following improvements were added:

### Authentication

- JWT-based secure authentication  
- Token-based request validation  

### API Documentation

- Swagger UI integration  
- Structured endpoint grouping  
- Read-only documentation support for production  

### Pagination & Filtering

- Efficient pagination for records  
- Flexible filtering system  

### RBAC + Permission Hybrid Model

- Role-based + permission-based system  
- Future-ready authorization design  

### Ownership Transfer Logic

- Supports transferring ownership of data between users  
- Useful for administrative workflows  

---
