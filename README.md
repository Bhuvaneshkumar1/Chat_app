# 💬 Chatbot Application

A simple chatbot application built with **Node.js (Express)** on the backend and **HTML/JS/CSS** on the frontend, using **Grok 4** as the brain.  
This project demonstrates handling environment variables securely with `.env` and structuring a clean Node.js app.

---

## 🚀 Features

- ⚡ Real-time chatbot responses  
- 🔒 Environment variables with `.env` (API keys, configs)  
- 📦 Node.js + Express backend  
- 🌐 Static frontend with HTML/CSS/JS  
- 🛡️ `.gitignore` to keep secrets safe (`.env`, `node_modules`)  

---


## 📂 Project Structure
```

chat_system/
│
├── .env                # Environment variables (ignored by git)
├── .gitignore          # Git ignore rules (.env, node_modules, etc.)
├── node_modules/       # Dependencies (auto-generated, ignored by git)
├── package-lock.json   # Exact versions of dependencies
├── package.json        # Project metadata + dependencies + scripts
├── public/             # Static frontend files
│   └── chat.html       # Example: chat.html, styles.css, script.js
├── README.md           # Project documentation
└── server.js           # Main Node.js backend server
```

## ⚙️ Installation & Setup

### 1️⃣ Clone the repo
```bash
git clone https://github.com/Bhuvaneshkumar1/Chat_app.git
cd chat_system
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables

Create a `.env` file in the root of your project:

```bash
PORT=3000
API_KEY=your_api_key_here
```

> **Note:** `.env` is already in `.gitignore` to keep your secrets safe.

### 4️⃣ Start the server

```bash
npm start
```
# or run directly
```bash
node server.js
```

### 5️⃣ Open the frontend

Go to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Development Mode (Hot Reload)

You can add a dev script in `package.json` for automatic reloads:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Run:

```bash
npm run dev
```

> This will automatically reload the server whenever you save a file. 🚀

---

## 🧰 Tech Stack

* **Backend:** Node.js, Express
* **Frontend:** HTML, CSS, JavaScript
* **Env Management:** dotenv
* **Version Control:** Git + GitHub
* **Brain:** Grok 4

---

## 🔒 Security Notes

* Never commit `.env` or API keys.
* Always add `.env` and `node_modules/` to `.gitignore`.
* Use environment-specific `.env` files if deploying (`.env.production`, `.env.development`).

---

## 🤝 Contributing

Pull requests are welcome!
If you have suggestions, feel free to fork this repo, open an issue, or submit a PR.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## ⭐ Acknowledgements

* Express.js
* dotenv
* Inspiration from real-time chat apps 💬

```

