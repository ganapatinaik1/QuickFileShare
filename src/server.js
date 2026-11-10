require("dotenv").config();

const multer = require("multer");

const express = require('express');

const { PrismaClient } = require("@prisma/client");

const path = require("path");

const fs = require("fs");

let WORDS = [];

try {
    const raw = fs.readFileSync(path.join(__dirname, "data", "words.txt"), "utf8");
    WORDS = raw.split("\n").map(w => w.trim()).filter(w => w.length > 0);
} catch (e) {
    WORDS = ["kiwi", "moss", "cake", "fish", "bird", "tree", "wind", "rain", "sun", "moon"];
}

const prisma = new PrismaClient();

const app = express();

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

const upload = multer({
    dest: "uploads/"
});

async function generateCode() {

    if (WORDS.length === 0) {

        return "kiwi moss";

    }

    for (let attempt = 0; attempt < 50; attempt++) {

        const w1 = WORDS[Math.floor(Math.random() * WORDS.length)];

        const w2 = WORDS[Math.floor(Math.random() * WORDS.length)];

        const code = w1 + " " + w2;

        const existing = await prisma.file.findFirst({

            where: { code: code }

        });

        if (!existing) {

            return code;

        }

    }

    return WORDS[Math.floor(Math.random() * WORDS.length)] + " " + WORDS[Math.floor(Math.random() * WORDS.length)];

}

app.post("/upload", upload.any(), async (req, res) => {

    const files = req.files || [];

    if (files.length === 0) {

        return res.status(400).json({ error: "No files uploaded" });

    }

    const code = await generateCode();

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const created = await Promise.all(files.map(f =>

        prisma.file.create({

            data: {

                code: code,

                originalName: f.originalname,

                storedName: f.filename,

                expiresAt: expiresAt

            }

        })

    ));

    res.json({

        code: code,

        count: files.length

    });

});

app.get("/download/:code", async (req, res) => {

    const files = await prisma.file.findMany({

        where: { code: req.params.code },

        orderBy: { uploadedAt: "asc" }

    });

    if (files.length === 0) {

        return res.status(404).send("Files not found");

    }

    if (new Date() > files[0].expiresAt) {

        for (const f of files) {

            const fp = path.join(__dirname, "..", "uploads", f.storedName);

            if (fs.existsSync(fp)) {

                fs.unlinkSync(fp);

            }

        }

        await prisma.file.deleteMany({

            where: { code: req.params.code }

        });

        return res.status(410).send("Files have expired.");

    }

    res.send(renderDownloadPage(req.params.code, files));

});

app.get("/download/:code/:id", async (req, res) => {

    const file = await prisma.file.findUnique({

        where: { id: parseInt(req.params.id) }

    });

    if (!file || file.code !== req.params.code) {

        return res.status(404).send("File not found");

    }

    if (new Date() > file.expiresAt) {

        const fp = path.join(__dirname, "..", "uploads", file.storedName);

        if (fs.existsSync(fp)) {

            fs.unlinkSync(fp);

        }

        await prisma.file.delete({

            where: { id: file.id }

        });

        return res.status(410).send("File has expired");

    }

    const filePath = path.join(__dirname, "..", "uploads", file.storedName);

    res.download(filePath, file.originalName);

});

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});

function renderDownloadPage(code, files) {

    const fileRows = files.map(f => `
        <div class="file-item">
            <div class="file-info">
                <span class="file-name">${f.originalName}</span>
            </div>
            <a href="/download/${code}/${f.id}" class="tbtn tbtn-primary">
                <span class="bracket">[</span> Download <span class="bracket">]</span>
            </a>
        </div>
    `).join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>QuickFileShare — download ${code}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>

    /* =========================
       ANSI-inspired palette
    ========================= */
    :root {
        --term-bg: #0a0e12;
        --term-bg-raised: #0d1218;
        --border: #1f2b26;
        --border-bright: #2f4a3d;

        --fg: #c9d1c5;
        --fg-dim: #5f7266;
        --green: #39ff8c;
        --green-dim: #1fae62;
        --cyan: #58e6ff;
        --yellow: #ffd866;
        --magenta: #ff6ac1;
        --red: #ff5f5f;
        --blue: #6ea8ff;

        --font-mono: 'JetBrains Mono', ui-monospace, 'Courier New', monospace;
    }

    * {
        box-sizing: border-box;
    }

    html, body {
        margin: 0;
        padding: 0;
        min-height: 100%;
        background: var(--term-bg);
    }

    body {
        font-family: var(--font-mono);
        color: var(--fg);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        min-height: 100vh;
        /* faint scanlines — kept subtle, not a decorative gradient wash */
        background-image: repeating-linear-gradient(
            to bottom,
            rgba(57, 255, 140, 0.025) 0px,
            rgba(57, 255, 140, 0.025) 1px,
            transparent 1px,
            transparent 3px
        );
    }

    ::selection {
        background: var(--green);
        color: #04140b;
    }

    /* =========================
       Terminal window chrome
    ========================= */
    .terminal {
        width: 100%;
        max-width: 620px;
        background: var(--term-bg-raised);
        border: 1px solid var(--border-bright);
        display: flex;
        flex-direction: column;
    }

    .titlebar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 14px;
        border-bottom: 1px solid var(--border);
        font-size: 12px;
        color: var(--fg-dim);
        letter-spacing: 0.5px;
    }

    .titlebar .dots {
        letter-spacing: 4px;
        font-size: 10px;
    }
    .titlebar .dots span:nth-child(1) { color: var(--red); }
    .titlebar .dots span:nth-child(2) { color: var(--yellow); }
    .titlebar .dots span:nth-child(3) { color: var(--green); }

    .titlebar .path {
        color: var(--fg-dim);
    }

    .crt {
        padding: 20px 22px 24px;
        min-height: 380px;
        display: flex;
        flex-direction: column;
    }

    /* =========================
       Prompt lines
    ========================= */
    .prompt-line {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        font-size: 14px;
        line-height: 1.7;
        white-space: pre-wrap;
        word-break: break-word;
    }

    .prompt-user { color: var(--green); }
    .prompt-at { color: var(--fg-dim); }
    .prompt-path { color: var(--cyan); }
    .prompt-sym { color: var(--fg-dim); }
    .prompt-cmd { color: var(--fg); }

    .out {
        font-size: 14px;
        line-height: 1.7;
        color: var(--fg-dim);
    }
    .out .arrow { color: var(--fg-dim); }
    .out.ok { color: var(--green); }
    .out.warn { color: var(--yellow); }
    .out.err { color: var(--red); }

    .rule {
        color: var(--border-bright);
        font-size: 13px;
        overflow: hidden;
        white-space: nowrap;
        letter-spacing: -1px;
        margin: 10px 0;
        user-select: none;
    }

    .cursor {
        display: inline-block;
        width: 8px;
        height: 15px;
        background: var(--green);
        animation: blink 1s steps(1) infinite;
        vertical-align: text-bottom;
    }

    @keyframes blink {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0; }
    }

    /* =========================
       Text-buttons / bracket links
    ========================= */
    .tbtn {
        background: none;
        border: none;
        font-family: var(--font-mono);
        font-size: 14px;
        font-weight: 700;
        color: var(--yellow);
        cursor: pointer;
        padding: 0;
        text-align: left;
    }

    .tbtn:hover {
        color: var(--term-bg);
        background: var(--yellow);
    }

    .tbtn:focus-visible {
        outline: 1px dashed var(--yellow);
        outline-offset: 3px;
    }

    .tbtn .bracket {
        color: inherit;
        opacity: 0.7;
    }

    .tbtn-primary {
        color: var(--green);
    }
    .tbtn-primary:hover {
        color: var(--term-bg);
        background: var(--green);
    }

    .tbtn-cyan {
        color: var(--cyan);
    }
    .tbtn-cyan:hover {
        color: var(--term-bg);
        background: var(--cyan);
    }

    .menu {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 18px 0;
    }

    .menu-row {
        font-size: 14px;
    }

    .menu-row .idx {
        color: var(--fg-dim);
    }

    /* =========================
       Section spacing
    ========================= */
    .section {
        display: none;
        flex-direction: column;
        flex: 1;
    }
    .section.active {
        display: flex;
    }

    /* =========================
       File list (download page)
    ========================= */
    .file-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex: 1;
    }
    .file-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid var(--border);
        padding: 10px 14px;
        border-radius: 4px;
        background: transparent;
    }
    .file-info {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        min-width: 0;
    }
    .file-name {
        color: var(--cyan);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 500;
    }

    /* =========================
       Section spacing
    ========================= */
    .footer-hint {
        margin-top: auto;
        padding-top: 16px;
        font-size: 12px;
        color: var(--fg-dim);
    }

    .code-readout {
        margin: 10px 0;
        font-size: 13px;
    }

    .code-value {
        color: var(--magenta);
        font-weight: 700;
        font-size: 22px;
        letter-spacing: 4px;
    }

    /* =========================
       Responsive
    ========================= */
    @media (max-width: 480px) {
        .crt {
            padding: 16px;
            min-height: 320px;
        }
        .code-value {
            font-size: 16px;
            letter-spacing: 3px;
        }
        .prompt-line, .out, .tbtn {
            font-size: 13px;
        }
        .file-item {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
        }
    }

</style>
</head>
<body>

<main class="terminal">

    <div class="titlebar">
        <span class="dots"><span>●</span> <span>●</span> <span>●</span></span>
        <span class="path">guest@quickfileshare: ~/downloads</span>
        <span></span>
    </div>

    <div class="crt">

        <p class="prompt-line">
            <span class="prompt-user">guest</span><span class="prompt-at">@</span><span class="prompt-path">qfs</span><span class="prompt-sym">:~$</span>
            <span class="prompt-cmd">receive --code ${code}</span>
        </p>
        <p class="out"><span class="arrow">&gt;</span> ${files.length} file${files.length > 1 ? 's' : ''} ready — click download for each</p>

        <div class="rule">──────────────────────────────────────────────</div>

        <div class="code-readout">
            <p style="margin: 4px 0 4px;">SHARE_CODE:</p>
            <div class="code-value">${code}</div>
        </div>

        <div class="file-list">${fileRows}</div>

        <p class="footer-hint">[ back ] <button class="tbtn" onclick="window.location.href='/'">click here</button> to return to menu</p>

    </div>
</main>
</body>
</html>`;
}
