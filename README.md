# BP Wallet

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white&style=for-the-badge" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white&style=for-the-badge" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge" />
  <img alt="Vitest" src="https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white&style=for-the-badge" />
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white&style=for-the-badge" />
</p>

BP Wallet is a full-stack application designed for managing user transactions. It leverages Next.js, Prisma ORM, PostgreSQL, and Tailwind CSS to provide a seamless user experience. The project includes a REST API, database migrations, seed scripts, and testing with Vitest and MSW.

## ✨ Features

-   **REST API**: Manage transactions and user data.
-   **Database**: PostgreSQL with Prisma ORM for data management.
-   **UI**: Responsive frontend built with Next.js and styled using Tailwind CSS.
-   **Testing**: API testing with Vitest and MSW.
-   **Seeding**: Seed scripts to populate the database with initial data.

## 🚀 Tech Stack

-   **Frontend**: Next.js, React, Tailwind CSS, Storybook
-   **Backend**: Node.js, Prisma ORM
-   **Database**: PostgreSQL
-   **Testing**: Vitest, MSW (Mock Service Worker)
-   **Deployment**: Vercel

## 🏁 Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

-   Node.js (v18 or higher)
-   A running PostgreSQL database

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/blakeparkinson/bp-wallet.git](https://github.com/blakeparkinson/bp-wallet.git)
    cd bp-wallet
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add your database connection string.
    ```.env
    DATABASE_URL="postgresql://username:password@host:port/database"
    ```

4.  **Set up the database:**

    First, generate the Prisma client:
    ```bash
    npx prisma generate
    ```

    Next, apply the database migrations:
    ```bash
    npx prisma migrate dev
    ```

    Finally, seed the database with initial data:
    ```bash
    node prisma/seed.js
    ```

## 🏃 Running the Application

### Running Locally

To start the development server:
```bash
npm run dev
````

### Running Tests

To run the test suite:

```bash
npm run test
```

## ☁️ Deployment

This project is configured for easy deployment with Vercel.

### Deploying with Vercel CLI

1.  **Install Vercel CLI:**

    ```bash
    npm install -g vercel
    ```

2.  **Log in to your Vercel account:**

    ```bash
    vercel login
    ```

3.  **Deploy the application:**

    ```bash
    vercel
    ```

    Follow the prompts to set up and deploy your application.

### Environment Variables

After deployment, you **must** add your `DATABASE_URL` as an environment variable in the Vercel project dashboard.

1.  Go to your project on Vercel.
2.  Navigate to `Settings` \> `Environment Variables`.
3.  Add `DATABASE_URL` and paste your PostgreSQL connection string as the value.

### Deployment Configuration

The `vercel.json` file can be used for custom deployment configurations.

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "env": {
    "DATABASE_URL": "@bp-wallet-database-url"
  }
}
```

*Note: Using `@bp-wallet-database-url` allows you to set the variable securely in the Vercel dashboard instead of hard-coding it here.*

## 📁 Project Structure

```bash
bp-wallet/
├── api/                # API routes
│   └── transactions.js
├── prisma/             # Prisma schema and seed scripts
│   ├── schema.prisma
│   └── seed.js
├── public/             # Static assets
├── styles/             # Tailwind CSS configurations
├── tests/              # Test files
├── pages/              # Next.js pages
├── components/         # React components
├── package.json        # Project metadata and dependencies
├── tsconfig.json       # TypeScript configuration
└── .env                # Environment variables
```
