const multer = require("multer");

const express = require('express');

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

app.post("/upload", upload.single("file"), (req, res) => {

 const code = generateCode();

    console.log(req.file);

    console.log(code);
    
    res.json({
        code: code
    });


});