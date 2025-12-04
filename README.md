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
- **Core Challenge**: Generating consistent, structured data (JSON) from an LLM(used gemini flash 2.0) for both questions and feedback.
- **User Experience**: The app needs to handle asynchronous AI operations (loading states) gracefully and provide immediate, meaningful feedback to the user.
- **Assumptions**:
    - The user has a valid internet connection for API calls.
    - The AI model (`gemini-2.0-flash`) is available and responsive.
    - 5 questions is an optimal length for a quick engagement loop.

---

## 3. AI Prompts & Iterations

## Prompts & Refinements

The core of this application relies on carefully crafted prompts to the Gemini API. Here are the prompts used and the refinements applied to ensure reliable JSON output.

### 1. Question Generation Prompt
**Goal:** Generate 5 multiple-choice questions for a specific topic.

**Prompt:**
```text
Generate 5 multiple-choice questions about "${topic}".
Return the response in the following JSON format ONLY:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0 // 0-3 index of correct answer
    }
  ]
}
Ensure the JSON is valid and strictly follows this schema. Do not include markdown code blocks.
```

**Refinements:**
- **JSON Schema Enforcement:** Explicitly requested a strict JSON structure to ensure the backend can parse the response reliably.
- **Markdown Cleanup:** Added post-processing logic in the backend to remove any markdown code blocks (```json ... ```) that the model might include despite instructions.

### 2. Feedback Generation Prompt
**Goal:** Provide detailed feedback on the user's quiz performance, including explanations for each question.

**Prompt:**
```text
The user took a quiz on "${topic}" and scored ${score} out of ${total}.

Here are the questions and the user's answers (index):
${JSON.stringify(questionsAndAnswers)}

Generate a JSON response with:
1. "overallFeedback": A brief encouraging message.
2. "questionFeedback": An array of objects for each question with:
    - "questionId": The id of the question.
    - "status": "correct" or "incorrect".
    - "explanation": A brief explanation of the correct answer and why the user was right or wrong.

Return the response in the following JSON format ONLY:
{
  "overallFeedback": "string",
  "questionFeedback": [
    {
      "questionId": 1,
      "status": "correct",
      "explanation": "string"
    }
  ]
}
Ensure the JSON is valid and strictly follows this schema. Do not include markdown code blocks.
```

**Refinements:**
- **Contextual Input:** Passed the full list of questions, correct answers, and user's selected answers to allow the AI to generate specific explanations.
- **Structured Output:** Defined a clear schema for `overallFeedback` and `questionFeedback` to easily display them on the frontend.


## 4. Architecture & State Management

### Frontend (React + Vite)
- **State Management:** Uses the **Context API** (`QuizContext`) to manage global application state. This avoids prop drilling and keeps the state accessible across different screens (Topic Selection, Quiz, Results).
    - **Key State Variables:** `topic`, `questions`, `currentQuestionIndex`, `answers`, `score`, `feedback`, `loading`, `error`.
    - **Reducer Pattern:** A `quizReducer` handles complex state transitions (e.g., `SET_QUESTIONS`, `ANSWER_QUESTION`, `FINISH_QUIZ`).
- **Styling:** Vanilla CSS (`index.css`) with a focus on a clean, modern, and responsive design.
- **Routing:** Conditional rendering based on `quizStatus` ('idle', 'loading', 'active', 'completed') within `App.jsx`.

### Backend (Node.js + Express)
- **API Design:** RESTful endpoints.
    - `POST /api/generate-questions`: Accepts a topic and returns generated questions.
    - `POST /api/generate-feedback`: Accepts quiz results and returns AI feedback.
- **Service Layer:** `aiService.js` encapsulates all interactions with the Google Gemini API, keeping controllers clean.
- **Validation:** Basic validation to ensure required data is present before calling the AI service.

### AI Integration
- **SDK:** Uses `@google/generative-ai` to interact with the Gemini 2.0 Flash model.
- **Model:** `gemini-2.0-flash` chosen for its speed and efficiency in generating structured text.

## demo screen shots 
<img width="940" height="462" alt="image" src="https://github.com/user-attachments/assets/1f69b964-9c28-4dbc-a546-a652d8b8d9d2" />

<img width="940" height="463" alt="image" src="https://github.com/user-attachments/assets/647dcf7f-f644-48cf-9027-6e1d98fe66de" />

<img width="940" height="470" alt="image" src="https://github.com/user-attachments/assets/19d3d88b-80e4-45cd-87f7-629c777e3e17" />

<img width="2524" height="1266" alt="image" src="https://github.com/user-attachments/assets/28fd3c09-62e9-4f7a-9b6d-019b7b862850" />

## Known Issues & Improvements

-   **API Rate Limits:** The application depends on the Gemini API free tier, which has rate limits. Heavy usage might result in errors.
-   **Markdown Parsing:** While we strip markdown blocks, occasionally the model might return malformed JSON in edge cases.
-   **Future Improvements:**
    -   Add user authentication to save quiz history.
    -   Implement a "Retry" mechanism for failed API calls.
    -   Add more question types (True/False, Fill in the blank).


