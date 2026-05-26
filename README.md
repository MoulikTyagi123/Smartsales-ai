# SmartSales AI 🚀

### AI-Powered Sales Analytics + Forecasting Dashboard

---

## 📁 Folder Structure

```
smartsales-ai/
├── frontend/               ← React.js + Tailwind + Recharts
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   ├── Upload/
│   │   │   ├── Charts/
│   │   │   ├── Chat/
│   │   │   └── Insights/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
│   ├── package.json
│   └── .env
│
├── backend/                ← Node.js + Express + MongoDB
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   ├── uploads/            ← temp CSV storage
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── ml-service/             ← Python + Pandas + Scikit-learn
    ├── main.py
    ├── forecasting.py
    ├── analytics.py
    ├── segmentation.py
    └── requirements.txt
```

---

## 🛠 Tech Stack

| Layer    | Tech                             |
| -------- | -------------------------------- |
| Frontend | React.js, Tailwind CSS, Recharts |
| Backend  | Node.js, Express.js              |
| ML Layer | Python, Pandas, Scikit-learn     |
| Database | MongoDB (Mongoose)               |
| AI       | Gemini API                       |
| Deploy   | Vercel (FE) + Render (BE)        |

---

## 🚀 Setup Instructions

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install

# ML Service
cd ml-service
pip install -r requirements.txt
```

### 2. Environment Variables

**backend/.env**

```
PORT=5000
MONGO_URI=mongodb+srv://yourcluster
GEMINI_API_KEY=your_gemini_key
PYTHON_PATH=python3
```

**frontend/.env**

```
VITE_API_URL=http://localhost:5000
```

### 3. Run

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## 💬 Interview Talking Points

- **Data Pipeline**: "I built a CSV ingestion pipeline with validation, cleaning via Pandas, and structured storage in MongoDB"
- **Forecasting**: "Used scikit-learn linear regression on historical sales data to predict future revenue trends"
- **LLM Workflow**: "Gemini API receives aggregated analytics context + user query and generates grounded business insights"
- **Architecture**: "Microservice-style separation — Node.js handles API routing, Python handles all ML computation via child process spawning"
