# AI-Assisted Knowledge Quiz

## 1. Project Setup & Demo

### Prerequisites
- Node.js installed
- Google Gemini API Key

### Installation & Running

**1. Backend Setup**
```bash
cd backend
npm install
# Create a .env file and add your API key: GEMINI_API_KEY=your_key_here
npm run dev
```
*Runs on http://localhost:5000*

**2. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```
*Runs on http://localhost:5173*

### Demo
- **Topic Selection**: Enter any topic (e.g., "Quantum Physics") or choose a suggestion.
- **Quiz**: Answer 5 AI-generated questions.
- **Results**: Get a score and detailed, question-by-question AI feedback.

---

## 2. Problem Understanding
The goal was to build a full-stack application that leverages Generative AI to create a dynamic quiz experience.
- **Core Challenge**: Generating consistent, structured data (JSON) from an LLM for both questions and feedback.
- **User Experience**: The app needs to handle asynchronous AI operations (loading states) gracefully and provide immediate, meaningful feedback to the user.
- **Assumptions**:
    - The user has a valid internet connection for API calls.
    - The AI model (`gemini-2.0-flash`) is available and responsive.
    - 5 questions is an optimal length for a quick engagement loop.

---

## 3. AI Prompts & Iterations

### Refined Prompts & Solutions
I switched to `gemini-2.0-flash` for better speed and reliability. I also implemented regex cleaning to handle Markdown formatting.

**Question Generation Prompt:**
> "Generate 5 multiple-choice questions about "{topic}". Return the response in the following JSON format ONLY: { "questions": [...] } Ensure the JSON is valid and strictly follows this schema."

**Feedback Generation Prompt:**
> "The user took a quiz on "{topic}"... Here are the questions and the user's answers... Generate a JSON response with: 1. "overallFeedback"... 2. "questionFeedback": An array of objects... Return the response in the following JSON format ONLY..."

**Iteration on Feedback**:
- *v1*: Only generated a generic summary based on the score.
- *v2 (Current)*: Passes the full list of questions and user answers to the AI to generate specific explanations for *why* an answer was correct or incorrect.

---

## 4. Architecture & Code Structure

### Frontend (React + Vite)
- **`App.jsx`**: Manages the main view switching based on `quizStatus`.
- **`context/QuizContext.jsx`**: Uses React Context + useReducer to manage global state (questions, answers, score, loading status). This avoids prop drilling.
- **Screens**:
    - `TopicSelectionScreen.jsx`: Custom input field and suggestion chips.
    - `QuizScreen.jsx`: Displays questions one by one with a progress bar.
    - `ResultScreen.jsx`: Displays score and renders the detailed AI feedback.
- **`api/api.js`**: Centralized service for backend API calls.

### Backend (Node.js + Express)
- **`server.js`**: Entry point.
- **`app.js`**: Express app setup and middleware.
- **`routes/quizRoutes.js`**: API endpoints (`/generate-questions`, `/generate-feedback`).
- **`services/aiService.js`**: Handles all interactions with the Google Gemini API. It encapsulates the prompt logic and error handling, keeping the routes clean.
