# CRUD Code Test 

Please read each note very carefully!
Feel free to add/change the project structure to a clean architecture to your view.
and if you are not able to work on the FrontEnd project, you can add a Swagger UI
in a new Front project.

Create a simple CRUD application with [NestJS](https://nestjs.com/) that implements the below model:
```
Customer {
	FirstName
	LastName
	DateOfBirth
	PhoneNumber
	Email
	BankAccountNumber
}
```

Create a NestJS template project

## Practices and patterns:

- [TDD](https://en.wikipedia.org/wiki/Test-driven_development)
- [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development)
- [DDD](https://en.wikipedia.org/wiki/Domain-driven_design)
- [Clean architecture](https://dev.to/dipakahirav/modern-api-development-with-nodejs-express-and-typescript-using-clean-architecture-1m77)
- [CQRS](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation#Command_query_responsibility_separation) pattern ([Event sourcing](https://en.wikipedia.org/wiki/Domain-driven_design#Event_sourcing)).
- Clean git commits that show your work progress, each commit must provide your decision-making process for each change or selection.

### Validations

- During Create; validate the phone number to be a valid *mobile* number only (Please use [Google LibPhoneNumber](https://github.com/google/libphonenumber) to validate number at the backend).

- A Valid email and a valid bank account number must be checked before submitting the form.

- Customers must be unique in the database: By `Firstname`, `Lastname`, and `DateOfBirth`.

- Email must be unique in the database.

### Storage

- Store the phone number in a database with minimized space storage (choose `varchar`/`string`, or `ulong` whichever store less space).

### Delivery
- Please clone this repository in a new GitHub repository in private mode and share with ID: `mason-chase` in private mode on github.com, make sure you do not erase my commits and then create a [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) (code review).

## Nice to do:
- Front-end Web (React)
- Docker-compose project that loads the database service automatically, which `docker-compose up`

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) v20+ and [npm](https://www.npmjs.com/) (for local development)

### Running the Database with Docker Compose

1. Start the PostgreSQL database:
   ```sh
   docker compose up -d db
   ```
   This will start the database service defined in `docker-compose.yml`.

2. (Optional) To run the backend in Docker as well, ensure you have a `Dockerfile` and uncomment the `app` service in `docker-compose.yml`, then run:
   ```sh
   docker compose up --build
   ```

### Running the Backend Locally

1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `.env.example` to `.env` and adjust if needed (see below for DB connection):
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=customer_crud
   ```
3. Start the backend:
   ```sh
   npm run start:dev
   ```
4. Access Swagger UI at [http://localhost:3000/api](http://localhost:3000/api)

### Running Tests

- **Unit tests:**
  ```sh
  npm run test
  ```
- **End-to-end (e2e) tests:**
  ```sh
  npm run test:e2e
  ```

---

**For any issues, ensure your database is running and your environment variables are set correctly.**
