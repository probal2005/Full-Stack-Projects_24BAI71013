# 🚀 Backend Optimization API

A Spring Boot REST API project demonstrating backend optimization techniques using **Spring Boot, Spring Data JPA, Hibernate, H2 File Database, DTOs, JOIN FETCH, Native SQL Queries, and a responsive frontend**.

This project is developed as part of **Experiment 2.2.2** for Full Stack Development.

---

## 📌 Project Overview

The Backend Optimization API manages students and departments while demonstrating important backend optimization techniques.

The project includes:

* Student and Department relationship
* RESTful API
* Spring Data JPA
* DTO-based API responses
* Lazy loading
* JOIN FETCH optimization
* Native SQL queries
* Duplicate UID validation
* H2 persistent file database
* SQL-based preloaded dataset
* Interactive frontend
* Persistent data storage

---

# 🏗️ Project Architecture

```text
Frontend
   │
   ▼
REST Controllers
   │
   ▼
Service Layer
   │
   ▼
Repository Layer
   │
   ▼
Spring Data JPA / Hibernate
   │
   ▼
H2 File Database
```

The application follows a layered backend architecture.

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

---

# 🧩 Database Relationship

The project contains two main entities:

* Department
* Student

Relationship:

```text
Department
    │
    │ One Department
    │
    └──────────────< Many Students
```

Database relationship:

```text
departments
    │
    │ id
    │
    ▼
students.department_id
```

A single department can contain multiple students.

---

# ✨ Features

## 👨‍🎓 Student Management

* Add new students
* View all students
* Fetch students with department information
* Validate duplicate UID
* Sort students using a native SQL query
* Store student information permanently

---

## 🏢 Department Management

* Add departments
* View departments
* Connect multiple students with one department
* Manage one-to-many relationships

---

## ⚡ Backend Optimization

The project demonstrates multiple backend optimization techniques.

### 1. Lazy Loading

The `Student` entity uses lazy loading:

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "department_id")
private Department department;
```

This prevents unnecessary department data from loading until required.

---

### 2. JOIN FETCH Optimization

The repository contains an optimized query:

```java
@Query(
    "SELECT s FROM Student s " +
    "JOIN FETCH s.department"
)
List<Student> findAllWithDepartment();
```

This loads students and their departments in a single optimized query.

Benefits:

* Reduces unnecessary database queries
* Helps prevent the N+1 query problem
* Improves API performance

---

### 3. DTO Response

The project uses a DTO:

```text
StudentResponse
```

DTOs help control the data returned by the API.

Benefits:

* Avoid exposing unnecessary entity data
* Cleaner API responses
* Better separation between database and API layers

---

### 4. Native SQL Query

The project also demonstrates a native SQL query:

```java
@Query(
    value =
        "SELECT * FROM students " +
        "ORDER BY age DESC",
    nativeQuery = true
)
List<Student> findStudentsByNativeQuery();
```

This retrieves students ordered by age in descending order.

---

### 5. Duplicate UID Validation

The repository checks whether a student UID already exists:

```java
boolean existsByUid(String uid);
```

This prevents duplicate student records.

---

# 🗄️ Database System

This project uses an **H2 File Database**.

Unlike an in-memory database, the H2 file database stores data permanently inside the project.

Database location:

```text
data/
└── optimizationdb.mv.db
```

The database is automatically created when the application runs.

---

# 📂 SQL Database Files

The project uses two SQL files.

```text
src/main/resources/
├── schema.sql
└── data.sql
```

---

## `schema.sql`

This file creates the database tables.

Tables:

```text
departments
students
```

Example structure:

```text
departments
├── id
└── name


students
├── id
├── name
├── uid
├── age
└── department_id
```

The `department_id` column acts as a foreign key.

---

## `data.sql`

This file contains the initial preloaded dataset.

Example:

```text
Departments
├── Computer Science Engineering
├── Artificial Intelligence and Machine Learning
├── Information Technology
├── Data Science
└── Computer Science
```

Students are automatically inserted into their respective departments.

---

# 💾 Data Persistence

The project contains two types of data storage.

## Preloaded Data

Initial data is stored in:

```text
src/main/resources/data.sql
```

This is used to populate the database with initial records.

---

## Live Application Data

When a user adds a student using the web interface:

```text
Web Interface
      ↓
REST API
      ↓
Service Layer
      ↓
Repository
      ↓
H2 File Database
```

The new data is stored inside:

```text
data/optimizationdb.mv.db
```

This means new data can remain available after restarting the application when the schema is not dropped.

---

# 📁 Project Structure

```text
backend-optimization-api
│
├── HELP.md
├── README.md
├── mvnw
├── mvnw.cmd
├── pom.xml
│
├── data
│   └── optimizationdb.mv.db
│
├── src
│   │
│   ├── main
│   │   │
│   │   ├── java
│   │   │   └── com
│   │   │       └── probal
│   │   │           └── backend_optimization_api
│   │   │
│   │   │               ├── BackendOptimizationApiApplication.java
│   │   │
│   │   │               ├── controller
│   │   │               │   ├── DepartmentController.java
│   │   │               │   └── StudentController.java
│   │   │
│   │   │               ├── dto
│   │   │               │   └── StudentResponse.java
│   │   │
│   │   │               ├── entity
│   │   │               │   ├── Department.java
│   │   │               │   └── Student.java
│   │   │
│   │   │               ├── repository
│   │   │               │   ├── DepartmentRepository.java
│   │   │               │   └── StudentRepository.java
│   │   │
│   │   │               └── service
│   │   │                   ├── DepartmentService.java
│   │   │                   └── StudentService.java
│   │   │
│   │   └── resources
│   │       ├── application.properties
│   │       ├── schema.sql
│   │       ├── data.sql
│   │       │
│   │       ├── static
│   │       │   ├── index.html
│   │       │   ├── script.js
│   │       │   └── style.css
│   │       │
│   │       └── templates
│   │
│   └── test
│       └── java
│           └── com
│               └── probal
│                   └── backend_optimization_api
│                       └── BackendOptimizationApiApplicationTests.java
│
└── target
```

---

# 🛠️ Technologies Used

| Technology      | Purpose                  |
| --------------- | ------------------------ |
| Java 17         | Programming Language     |
| Spring Boot     | Backend Framework        |
| Spring Web      | REST API Development     |
| Spring Data JPA | Database Access          |
| Hibernate       | ORM Framework            |
| H2 Database     | Persistent File Database |
| Maven           | Dependency Management    |
| HTML            | Frontend Structure       |
| CSS             | Frontend Styling         |
| JavaScript      | Frontend Functionality   |

---

# ⚙️ Database Configuration

Example `application.properties`:

```properties
spring.application.name=backend-optimization-api

# H2 File Database
spring.datasource.url=jdbc:h2:file:./data/optimizationdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# SQL Initialization
spring.sql.init.mode=always

# Server
server.port=8080
```

---

# 🚀 How to Run the Project

## Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/backend-optimization-api.git
```

Move into the project folder:

```bash
cd backend-optimization-api
```

---

## Step 2: Run the Application

Linux:

```bash
./mvnw spring-boot:run
```

Windows:

```bash
mvnw.cmd spring-boot:run
```

---

## Step 3: Open the Application

Open your browser and visit:

```text
http://localhost:8080
```

---

# 🔌 API Architecture

Example request flow:

```text
Frontend Request
       ↓
Controller
       ↓
Service
       ↓
Repository
       ↓
Hibernate / JPA
       ↓
H2 Database
       ↓
Response DTO
       ↓
Frontend
```

---

# 📡 API Functionality

Depending on the controller mappings implemented in the project, the API supports operations related to:

```text
Students
│
├── Get Students
├── Add Student
├── Get Students with Departments
├── Native Query Results
└── Duplicate UID Validation


Departments
│
├── Get Departments
└── Add Department
```

---

# 🧪 Testing

Run all tests using:

```bash
./mvnw test
```

For a clean build:

```bash
./mvnw clean
```

Build the project:

```bash
./mvnw package
```

---

# 📦 Build JAR

Create the executable JAR:

```bash
./mvnw clean package
```

The generated JAR will be available inside:

```text
target/
```

Run the JAR:

```bash
java -jar target/backend-optimization-api-0.0.1-SNAPSHOT.jar
```

---

# 🔄 Development Workflow

```text
1. Start Application
        ↓
2. SQL Schema Initialized
        ↓
3. Preloaded Dataset Available
        ↓
4. Open Web Interface
        ↓
5. Add Student / Department
        ↓
6. API Processes Request
        ↓
7. Data Stored in H2 File Database
        ↓
8. Optimized Queries Retrieve Data
```

---

# 🎯 Learning Outcomes

After completing this experiment, the following concepts are demonstrated:

* REST API development
* Spring Boot application structure
* Layered architecture
* JPA entity relationships
* One-to-many relationships
* Many-to-one relationships
* Lazy loading
* JOIN FETCH optimization
* N+1 query problem awareness
* DTO pattern
* Native SQL queries
* Repository pattern
* Service layer architecture
* SQL schema initialization
* SQL preloaded datasets
* Persistent file databases
* Duplicate validation
* Frontend and backend integration

---

# 🔮 Future Improvements

Possible improvements include:

* Pagination
* Sorting
* Search functionality
* Global exception handling
* Request validation
* Swagger / OpenAPI documentation
* MySQL or PostgreSQL migration
* Authentication with Spring Security
* JWT authentication
* Docker containerization
* Unit and integration tests
* Caching for improved performance

---

# 👨‍💻 Author

**Probal Dhali**

B.Tech Computer Science Engineering (AI/ML)
Chandigarh University

---

# 📜 License

This project is created for educational and experimental purposes.

---

⭐ If you found this project useful, consider giving the repository a star!
