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

#### 5. navigate back to the root of the project and run the server

```bash
cd ..
npm run dev
```

#### 6. open the link `http://localhost:3000` to use the application




















This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
