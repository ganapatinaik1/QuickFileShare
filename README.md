<div align="center">

<img src="preview.png" width="800" alt="QuickFileShare website preview">

# QuickFileShare

### Temporary File Sharing, Made Simple

Upload a file, get a unique 6-character code, share it with anyone.<br>
No logins · No clutter · Files auto-delete after 30 minutes.

**[Overview](#overview)** &nbsp;·&nbsp;
**[Website](https://quickfileshare.up.railway.app/)** &nbsp;·&nbsp;
**[Features](#features)** &nbsp;·&nbsp;
**[Technologies](#technologies-used)** &nbsp;·&nbsp;
**[Installation](#installation)** &nbsp;·&nbsp;
**[Structure](#project-structure)** &nbsp;·&nbsp;
**[Author](#author)**

<p>
  <a href="#technologies-used"><img alt="Node.js" src="https://img.shields.io/badge/RUNTIME-NODE.JS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=0C1213"></a>
  <a href="#technologies-used"><img alt="Express" src="https://img.shields.io/badge/SERVER-EXPRESS.JS-80D4DC?style=for-the-badge&logo=express&logoColor=black&labelColor=0C1213"></a>
  <a href="#technologies-used"><img alt="Multer" src="https://img.shields.io/badge/UPLOADS-MULTER-FF9800?style=for-the-badge&labelColor=0C1213"></a>
  <a href="#technologies-used"><img alt="Prisma" src="https://img.shields.io/badge/ORM-PRISMA-B7C7EA?style=for-the-badge&logo=prisma&logoColor=black&labelColor=0C1213"></a>
  <a href="#technologies-used"><img alt="PostgreSQL" src="https://img.shields.io/badge/DATABASE-POSTGRESQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white&labelColor=0C1213"></a>
  <a href="https://quickfileshare.mooo.com/"><img alt="Oracle" src="https://img.shields.io/badge/HOSTED%20ON-Oracle-00F0FF?style=for-the-badge&logo=racle&logoColor=black&labelColor=0C1213"></a>
</p>
<p>
  <img alt="Code" src="https://img.shields.io/badge/SHARE%20CODE-6%20CHARACTERS-80CBC4?style=for-the-badge&labelColor=0C1213">
  <img alt="Expiry" src="https://img.shields.io/badge/AUTO%20EXPIRY-30%20MINUTES-FF6F00?style=for-the-badge&labelColor=0C1213">
  <img alt="Login" src="https://img.shields.io/badge/LOGIN-NOT%20REQUIRED-4CAF50?style=for-the-badge&labelColor=0C1213">
  <img alt="Last Commit" src="https://img.shields.io/github/last-commit/ganapatinaik1/QuickFileShare?style=for-the-badge&labelColor=0C1213&color=80D4DC">
  <img alt="Stars" src="https://img.shields.io/github/stars/ganapatinaik1/QuickFileShare?style=for-the-badge&labelColor=0C1213&color=B7C7EA">
</p>

</div>

## Overview

QuickFileShare is a temporary file sharing application built using Node.js, Express, Prisma, and PostgreSQL.

Users can upload a file and receive a unique 6-character code. Anyone with the code can download the file. Files automatically expire after 30 minutes.

**Live website:** https://quickfileshare.up.railway.app/

## Features

- Upload files
- Generate a unique 6-character sharing code
- Download files using the generated code
- No logins required
- Automatic file expiration after 30 minutes
- PostgreSQL database with Prisma

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

**Ganapati Naik**<br>
GitHub: [@ganapatinaik1](https://github.com/ganapatinaik1)
