const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuestions = async (topic) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
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
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up potential markdown code blocks if Gemini adds them
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions');
  }
};

const generateFeedback = async (topic, score, total, questions, userAnswers) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      The user took a quiz on "${topic}" and scored ${score} out of ${total}.
      
      Here are the questions and the user's answers (index):
      ${JSON.stringify(questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      userAnswerIndex: userAnswers[q.id]
    })))}

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
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up potential markdown code blocks
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error generating feedback:', error);
    throw new Error('Failed to generate feedback');
  }
};

module.exports = {
  generateQuestions,
  generateFeedback,
};
