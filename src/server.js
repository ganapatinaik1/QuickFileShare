const multer = require("multer");

const express = require('express');

const { PrismaClient } = require("@prisma/client");

const path = require("path");

const prisma = new PrismaClient();

const app = express()

app.use(express.static("public"));




app.listen(3000, () => {
    console.log("Server running on port 3000");
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

 await prisma.file.create({
    data: {
        code: code,
        originalName: req.file.originalname,
        storedName: req.file.filename,
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

console.log(filePath);

res.download(filePath, file.originalName);


});



