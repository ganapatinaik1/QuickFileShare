# QuickFileShare

QuickFileShare is a temporary file sharing application built using Node.js, Express, Prisma, and PostgreSQL.

Users can upload a file and receive a unique 6-character code. Anyone with the code can download the file. Files automatically expire after 30 minutes.

## Features

- Upload files
- Generate a unique 6-character sharing code
- Download files using the generated code
- Automatic file expiration after 30 minutes
- PostgreSQL database with Prisma
- Deployed on Railway

## Technologies Used

- Node.js
- Express.js
- Multer
- Prisma ORM
- PostgreSQL
- Railway

## Installation

Clone the repository:

```bash
git clone https://github.com/ganapatinaik1/QuickFileShare.git
```

Go to the project directory:

```bash
cd QuickFileShare
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and add:

```env
DATABASE_URL=your_database_url
```

Run the database migration:

```bash
npx prisma migrate dev
```

Start the server:

```bash
npm start
```

The application will run at:

```
http://localhost:3000
```

## Project Structure

```
QuickFileShare/
├── prisma/
├── public/
├── src/
├── uploads/
├── package.json
└── README.md
```


## Author

Ganapati Naik
GitHub: https://github.com/ganapatinaik1

Ganapati Naik

GitHub: https://github.com/ganapatinaik1.
