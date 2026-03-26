const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.json());

// База данных в файле, чтобы ничего не слетало при перезагрузке
const DB_FILE = './database.json';
let data = {
    userData: {
        id: 2046759833,
        username: "Кровавый флакон",
        balance: 5000.0,
        isAdmin: true,
        inventory: []
    },
    cases: [
        { id: "c1", name: "FARM Case", price: 0, image: "images/refcase15.webp", category: "all" },
        { id: "c2", name: "STARS Case", price: 500, image: "images/StarsBanner.webp", category: "all" }
    ],
    promos: []
};

// Загрузка данных из файла при старте
if (fs.existsSync(DB_FILE)) {
    data = JSON.parse(fs.readFileSync(DB_FILE));
}

const saveDB = () => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// API для фронтенда
app.get('/api/user-data', (req, res) => res.json(data.userData));
app.get('/api/get-cases', (req, res) => res.json({ "all": data.cases, "farm": [], "stars": [] }));

// API для админки
app.post('/api/admin/add-case', (req, res) => {
    data.cases.push({ id: "c" + Date.now(), ...req.body });
    saveDB();
    res.json({ success: true });
});

app.post('/api/admin/set-balance', (req, res) => {
    data.userData.balance = Number(req.body.amount);
    saveDB();
    res.json({ success: true });
});

app.post('/api/admin/reset', (req, res) => {
    data.cases = [];
    saveDB();
    res.json({ success: true });
});

// Заглушки для Telegram WebApp
app.get('/api/referrals', (req, res) => res.json({ count: 0, spent: 0, available: 0 }));
app.get('/api/recent-drops', (req, res) => res.json([]));

app.listen(PORT, () => {
    console.log(`\n🚀 FORCE GIFT ОЖИЛ!`);
    console.log(`🔗 Ссылка: http://localhost:${PORT}?web=1`);
    console.log(`🛠 Админка: http://localhost:${PORT}/admin.html\n`);
});

