# Local Pages

Local Pages is a Next.js application that allows businesses to create profiles showcasing their services and service areas. It integrates with a mobile app, enabling potential clients to find local services in specific regions.

## Prerequisites

-   Node.js version 20 or higher

## Getting Started

### Installation

1. Extract the provided zip file containing the project files.

2. Navigate to the project directory:

    ```
    cd local-pages
    ```

3. Install dependencies:
    ```
    npm install
    ```

### Environment Setup

Create a `.env.local` file in the root directory and add the necessary Supabase API keys. You can find an example of the required keys in the `.env.example` file.

### Development Server

To start the development server, run:

```
npm run dev
```

The application will be available at `http://localhost:3000`.

## Building for Production

To create a production build, run:

```
npm run build
```

## Starting Production Server

After building the application, you can start the production server with:

```
npm start
```

## Backend

The backend of this application is developed using Supabase. The necessary API keys can be found in the `.env.local` file.

## Test Account

A test account has been set up with the following credentials:

-   Username: zacwalls20@gmail.com
-   Password: #Testing123

You can use this account to explore the application's features.

## Account Creation

You are able to create your own accounts, which will direct you to the create-company page. However, please note that this process relies on the Supabase SMTP server for email validation. Due to the lack of a dedicated SMTP server, this feature may not always work properly.

## References

During the development of this project, Claude 3.5, an AI assistant, was used for general brainstorming and docstring generation. This tool helped in conceptualizing various aspects of the application and organizing its structure effectively.
