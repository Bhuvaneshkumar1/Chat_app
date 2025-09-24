💬 Chatbot Application

A simple chatbot application built with Node.js (Express) on the backend and HTML/JS/CSS on the frontend with Grok 4 as brain.This project demonstrates how to handle environment variables securely using .env, and how to structure a clean Node.js app.

🚀 Features

⚡ Real-time chatbot responses

🔒 Environment variables with .env (API keys, configs)

📦 Node.js + Express backend

🌐 Static frontend with HTML/CSS/JS

🛡️ .gitignore to keep secrets safe (.env, node_modules)

📂 Project Structure
chat_system/
│
├── .env                # Environment variables (ignored by git)
├── .gitignore          # Git ignore rules (.env, node_modules, etc.)
├── node_modules/       # Dependencies (auto-generated, ignored by git)
├── package-lock.json   # Exact versions of dependencies
├── package.json        # Project metadata + dependencies + scripts
├── public/             # Static frontend files (HTML, CSS, JS)
│   └──chat.html        # e.g., chat.html, styles.css, script.js
├── README.md           # Project documentation
└── server.js           # Main Node.js backend server
               

⚙️ Installation & Setup

Clone the repo

git clone https://github.com/your-username/chatbot-app.git
cd chat_system


Install dependencies

npm install


Set up .env
Create a .env file in the Back_end folder:

PORT=3000
API_KEY=your_api_key_here


Start the server

npm start

or

node server.js


Open the frontend
Go to http://localhost:3000
 in your browser.

🛠️ Scripts

Inside package.json, you can add handy scripts:

"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}


Then run:

npm run dev


(for hot reload during development).

🧰 Tech Stack

Backend: Node.js, Express

Frontend: HTML, CSS, JavaScript

Env Management: dotenv

Version Control: Git + GitHub

Brain: Grok 4 fast

🔒 Security Notes

Never commit .env or API keys.

Always add .env and node_modules/ to .gitignore.

Use environment-specific .env files if deploying (.env.production, .env.development).

🤝 Contributing

Pull requests are welcome!
If you have suggestions, feel free to fork this repo, open an issue, or submit a PR.

📜 License

This project is licensed under the MIT License. 

⭐ Acknowledgements

Express.js

dotenv

Inspiration from real-time chat apps 💬
