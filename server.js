const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'HEALTHY', timestamp: new Date() });
});

const questionsDB = [
    { id: "1", question: "What does CI/CD stand for?", choices: ["Continuous Integration/Continuous Deployment", "Cloud Integration/Cloud Data"], correct: "Continuous Integration/Continuous Deployment" }
];

app.get('/api/exam', (req, res) => {
    const safeQuestions = questionsDB.map(({ correct, ...rest }) => rest);
    res.status(200).json(safeQuestions);
});

app.post('/api/exam/submit', (req, res) => {
    const { id, user_answer } = req.body;
    const question = questionsDB.find(q => q.id === id);
    if (!question) return res.status(404).json({ error: "Exam item not found" });
    
    const isCorrect = question.correct === user_answer;
    res.status(200).json({ passed: isCorrect, msg: isCorrect ? "Correct!" : "Incorrect Answer" });
});

app.listen(PORT, () => console.log(`Exam API running on port ${PORT}`));
