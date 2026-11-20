&#x20;\<div align="center">

# QuickFileShare

**Share files. Skip the hassle.**

A lightweight temporary file-sharing platform built with Node.js, Express, Prisma and PostgreSQL.

Upload a file, get a unique 6-character code, and share it with anyone.
No accounts. No unnecessary steps. Files automatically expire after 30 minutes.

\<br/>

[**Website**](https://quickfileshare.up.railway.app/) · [**GitHub**](https://github.com/ganapatinaik1/QuickFileShare) · [**Installation**](#installation) · [**Features**](#features)

\<br/>




\


\<br/>



\</div>

---

## Overview

QuickFileShare makes temporary file sharing ridiculously simple.

1. Upload a file.
2. Receive a unique 6-character sharing code.
3. Share the code with anyone.
4. They enter the code and download your file.

Files are automatically deleted after **30 minutes**, keeping storage temporary and the workflow simple.

## Features

| Feature           | Description                                      |
| :---------------- | :----------------------------------------------- |
| File Uploads      | Upload files through a simple interface          |
| Unique Codes      | Automatically generate 6-character sharing codes |
| File Downloads    | Retrieve files using their sharing codes         |
| No Authentication | No accounts or login required                    |
| Auto Expiration   | Files expire after 30 minutes                    |
| Database          | PostgreSQL powered by Prisma ORM                 |

## Tech Stack

| Technology | Purpose                 |
| :--------- | :---------------------- |
| Node.js    | Runtime environment     |
| Express.js | Backend framework       |
| Multer     | File upload handling    |
| Prisma ORM | Database management     |
| PostgreSQL | Persistent data storage |
|            |                         |

## Installation

**1. Clone the repository**

```bash
git clone https://github.com/ganapatinaik1/QuickFileShare.git
```

**2. Navigate to the project**

```bash
cd QuickFileShare
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env` file in the project root:

```env
DATABASE_URL=your_database_url
```

**5. Run database migrations**

```bash
npx prisma migrate dev
```

**6. Start the application**

```bash
npm start
```

The application will be available at:

```text
http://localhost:3000
```

## Project Structure

```text
QuickFileShare/
├── prisma/
├── public/
├── src/
├── uploads/
├── package.json
└── README.md
```

---

\<div align="center">

**Built by [Ganapati Naik](https://github.com/ganapatinaik1)**

\<sub>Simple file sharing. Nothing more, nothing less.\</sub>

\</div>
