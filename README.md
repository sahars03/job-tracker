# JobTracker

This is a web application for logging job applications. By making an account, users can create a list of the jobs they have applied to, storing information such as their location and date of application.

It has been built using Next.js, with a React/Tailwind frontend and
a PostgreSQL database.

## Features

- Registration/login system to use the application.
- List of applications saved.
- Options to edit and delete applications.

## Requirements

- Node.js >= 22.11
- npm >= 11
- Next.js >= 15.5.9
- React >= 19.1
- Tailwind CSS >= 4.1.13
- PostgreSQL >= 17.6

## Installation

#### 1. clone the repository

```bash
git clone https://github.com/sahars03/job-tracker.git
cd job-tracker
```
#### 2. install dependencies

```bash
npm install
```

#### 3. create environment variables and fill in the Postgres details in the newly-created .env file

```bash
cp .env.example .env
```

#### 4. navigate to the database folder and use schema.sql to set up the database

```bash
cd database
```

#### 5. navigate to the backend folder and install dependencies

```bash
cd ..
cd backend
npm install
```

#### 6. navigate back to the root of the project and run the server

```bash
cd ..
npm run dev
```

#### 7. open the link `http://localhost:3000` to use the application