const multer = require("multer");

const express = require('express');

const { PrismaClient } = require("@prisma/client");

const path = require("path");

const fs = require("fs");

const prisma = new PrismaClient();

const app = express();

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const upload = multer({
    dest: "uploads/"
});

function generateCode() {

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code = "";

    for (let i = 0; i < 6; i++) {

        const randomIndex = Math.floor(Math.random() * chars.length);

        code += chars[randomIndex];

    }

    return code;
}

app.post("/upload", upload.single("file"), async (req, res) => {

    const code = generateCode();

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.file.create({
        data: {
            code: code,
            originalName: req.file.originalname,
            storedName: req.file.filename,
            expiresAt: expiresAt
        }
    });

    console.log(req.file);

    console.log(code);

    res.json({
        code: code
    });

});


//download

app.get("/download/:code", async (req, res) => {

    const file = await prisma.file.findUnique({
        where: {
            code: req.params.code
        }
    });

    if (!file) {
        return res.status(404).send("File not found");
    }

    console.log(file);

    const filePath = path.join(__dirname, "..", "uploads", file.storedName);

    if (new Date() > file.expiresAt) {

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await prisma.file.delete({
            where: {
                code: file.code
            }
        });

        return res.status(410).send("File has expired.");
    }

    console.log(filePath);

    res.download(filePath, file.originalName);

});