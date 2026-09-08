# 🎓 Student Pagination API

A full-stack **Student Management and Pagination API** built using **Spring Boot, Spring Data JPA, H2 Database, HTML, CSS, and JavaScript**.

The application demonstrates how backend APIs can efficiently return large datasets using **pagination**. Student data is automatically loaded from SQL files when the application starts.

---

## 🚀 Features

* 📚 Student Management API
* 📄 Server-side Pagination
* 🗄️ H2 File Database
* 📝 Preloaded Student Dataset
* ⚡ Automatic Database Initialization
* 🔍 Retrieve Students Page by Page
* 🌐 REST API Integration
* 💻 Responsive Frontend UI
* 🎨 HTML, CSS and JavaScript Frontend
* 🔄 Dynamic Pagination Controls
* 🧩 Spring Data JPA Repository

---

## 🛠️ Technologies Used

### Backend

* Java 17
* Spring Boot
* Spring Web
* Spring Data JPA
* Hibernate
* Maven

### Database

* H2 Database
* SQL

### Frontend

* HTML5
* CSS3
* JavaScript

---

# 📁 Project Structure

```text
pagination-api/
│
├── HELP.md
├── mvnw
├── mvnw.cmd
├── pom.xml
│
├── src/
│   ├── main/
│   │   │
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── probal/
│   │   │           └── pagination_api/
│   │   │
│   │   │               ├── controller/
│   │   │               │   └── StudentController.java
│   │   │
│   │   │               ├── entity/
│   │   │               │   └── Student.java
│   │   │
│   │   │               ├── repository/
│   │   │               │   └── StudentRepository.java
│   │   │
│   │   │               ├── service/
│   │   │               │   └── StudentService.java
│   │   │
│   │   │               └── PaginationApiApplication.java
│   │   │
│   │   └── resources/
│   │       │
│   │       ├── application.properties
│   │       ├── schema.sql
│   │       ├── data.sql
│   │       │
│   │       ├── static/
│   │       │   ├── index.html
│   │       │   ├── style.css
│   │       │   └── script.js
│   │       │
│   │       └── templates/
│   │
│   └── test/
│       └── java/
│           └── com/
│               └── probal/
│                   └── pagination_api/
│                       └── PaginationApiApplicationTests.java
│
└── target/
```

---

# ⚙️ How the Application Works

When the Spring Boot application starts, the following process happens automatically:

```text
Spring Boot Application
        │
        ▼
schema.sql
        │
        ▼
Creates students table
        │
        ▼
data.sql
        │
        ▼
Inserts student dataset
        │
        ▼
Spring Data JPA
        │
        ▼
Student Repository
        │
        ▼
Student Service
        │
        ▼
REST Controller
        │
        ▼
Pagination API
        │
        ▼
Frontend UI
```

---

# 🗄️ Database Configuration

The project uses an **H2 File Database**.

The database configuration is located in:

```text
src/main/resources/application.properties
```

Example configuration:

```properties
spring.application.name=pagination-api

# H2 File Database
spring.datasource.url=jdbc:h2:file:./data/studentdb
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

The database files are automatically generated inside:

```text
data/
```

Example:

```text
data/
└── studentdb.mv.db
```

---

# 🧱 Database Schema

The database schema is defined inside:

```text
src/main/resources/schema.sql
```

The `students` table contains the following fields:

| Column          | Description        |
| --------------- | ------------------ |
| id              | Unique Student ID  |
| name            | Student Name       |
| uid             | University UID     |
| department      | Student Department |
| student_year    | Academic Year      |
| age             | Student Age        |
| university_name | University Name    |

---

# 📊 Preloaded Dataset

Student data is stored inside:

```text
src/main/resources/data.sql
```

The dataset is automatically inserted when the application starts.

The project includes **20 preloaded student records** for demonstrating pagination.

Example dataset record:

```sql
INSERT INTO students
(name, uid, department, student_year, age, university_name)
VALUES
(
    'Probal Dhali',
    '23BCS10001',
    'Computer Science Engineering',
    3,
    21,
    'Chandigarh University'
);
```

---

# 🔗 API Pagination

The API returns student data in pages.

Example request:

```text
GET /api/students?page=0&size=5
```

Example URL:

```text
http://localhost:8080/api/students?page=0&size=5
```

This returns:

* Page Number: `0`
* Students Per Page: `5`

Pagination example:

| Page   | Students                |
| ------ | ----------------------- |
| Page 0 | Student 1 – Student 5   |
| Page 1 | Student 6 – Student 10  |
| Page 2 | Student 11 – Student 15 |
| Page 3 | Student 16 – Student 20 |

---

# 📦 Example API Response

```json
{
  "content": [
    {
      "id": 1,
      "name": "Probal Dhali",
      "uid": "23BCS10001",
      "department": "Computer Science Engineering",
      "year": 3,
      "age": 21,
      "universityName": "Chandigarh University"
    }
  ],
  "totalElements": 20,
  "totalPages": 4,
  "size": 5,
  "number": 0
}
```

---

# 💻 Frontend

The frontend files are located inside:

```text
src/main/resources/static/
```

```text
static/
├── index.html
├── style.css
└── script.js
```

The frontend communicates with the Spring Boot REST API and dynamically displays student data.

Features include:

* Student Table
* Dynamic Data Loading
* Previous Page Button
* Next Page Button
* Page Number Display
* Pagination Controls

---

# ▶️ How to Run the Project

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/pagination-api.git
```

Move into the project:

```bash
cd pagination-api
```

---

## 2. Check Java Version

This project requires **Java 17 or later**.

Check your Java version:

```bash
java -version
```

---

## 3. Give Maven Wrapper Permission

For Linux:

```bash
chmod +x mvnw
```

---

## 4. Clean the Project

```bash
./mvnw clean
```

---

## 5. Run the Application

```bash
./mvnw spring-boot:run
```

If everything is configured correctly, Spring Boot will start on:

```text
http://localhost:8080
```

---

# 🌐 Open the Application

Open your browser and visit:

```text
http://localhost:8080
```

The frontend application will load automatically.

---

# 🔌 API Testing

You can test the API directly in your browser or using Postman.

Example:

```text
http://localhost:8080/api/students?page=0&size=5
```

Change the page:

```text
http://localhost:8080/api/students?page=1&size=5
```

Change the page size:

```text
http://localhost:8080/api/students?page=0&size=10
```

---

# 🧪 Build the Project

To build the project:

```bash
./mvnw clean package
```

If you want to skip tests:

```bash
./mvnw clean package -DskipTests
```

The generated JAR file will be available inside:

```text
target/
```

Example:

```text
target/pagination-api-0.0.1-SNAPSHOT.jar
```

Run the JAR:

```bash
java -jar target/pagination-api-0.0.1-SNAPSHOT.jar
```

---

# 🔄 Database Reset

Because the project uses a file-based H2 database, database files are created inside:

```text
data/
```

To completely reset the database:

```bash
rm -rf data
```

Then restart the application:

```bash
./mvnw spring-boot:run
```

The application will automatically:

1. Create the database
2. Create the `students` table
3. Insert data from `data.sql`

---

# 🧠 Pagination Concept

Pagination divides a large dataset into smaller pages.

Instead of returning all records at once:

```text
1000 Students
```

The API can return:

```text
Page 1 → 10 Students
Page 2 → 10 Students
Page 3 → 10 Students
...
```

This improves:

* Performance
* Response Time
* Database Efficiency
* Memory Usage
* User Experience

---

# 🏗️ Application Architecture

```text
Frontend
   │
   ▼
StudentController
   │
   ▼
StudentService
   │
   ▼
StudentRepository
   │
   ▼
Spring Data JPA
   │
   ▼
H2 Database
```

---

# 📚 Learning Objectives

This project demonstrates:

* Spring Boot Application Development
* REST API Development
* Spring Data JPA
* Entity Mapping
* Repository Pattern
* Service Layer Architecture
* Database Initialization
* SQL Schema Creation
* SQL Dataset Loading
* Server-side Pagination
* Frontend and Backend Integration

---

# 👨‍💻 Author

**Probal Dhali**

B.Tech Computer Science Engineering
Specialization: Artificial Intelligence & Machine Learning

Chandigarh University

---

# 📄 License

This project is created for educational and academic purposes.

---

⭐ If you found this project useful, consider giving the repository a star!
