// import { useState } from 'react';
import './App.css';
import OpenAI from "openai";

function App() {
  const [query, setQuery] = useState("");
  const [noOfQuestions, setNoOfQuestions] = useState(4);
  const [difficulty, setDifficulty] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleQueryInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleNoOfQuestionsInputChange = (e) => {
    setNoOfQuestions(e.target.value);
  };

  const handleDifficultyInputChange = (e) => {
    setDifficulty(e.target.value);
  };

  const createQuestionsWithOpenAIApi = async () => {
    setIsLoading(true);

    const promptMessage = `Generate ${noOfQuestions} ${difficulty} questions with 4 options in an array format on the topic: ${query}.
    Each question should be structured in JSON format with the following keys:
      - "question": The text of the question.
      - "options": An array of 4 options, each option as a string.
      - "correct_option": The correct option (must match one of the options).
      - "difficulty": The difficulty level of the question ("easy", "medium", or "hard").
    Output the result as an array of JSON objects with the structure described. Don't put anything else. Only valid Array.`;

    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: promptMessage },
        ],
        model: "gpt-4", // Corrected model name
      });

      setIsLoading(false);

      const response = chatCompletion?.choices[0].message?.content;
      const jsonOutput = JSON.parse(response);
      setGeneratedQuestions(jsonOutput);

    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setGeneratedQuestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createQuestionsWithOpenAIApi();
  };

  return (
    <div className="main-container">
      <h1>AI Questions Generator</h1>
      <div className="form-container">
        <div>
          <label>Enter Query:</label>
          <input
            type="text"
            value={query}
            className="query-input"
            placeholder="Enter Query/subject or topic..."
            onChange={handleQueryInputChange}
          />
        </div>
        <div>
          <label>Number of Questions: {noOfQuestions}</label>
          <input
            type="range"
            value={noOfQuestions}
            onChange={handleNoOfQuestionsInputChange}
            min={1}
            max={10}
            required
            className="questions-input"
          />
        </div>
        <div>
          <label>Select Difficulty:</label>
          <select
            value={difficulty}
            onChange={handleDifficultyInputChange}
            className="difficulty-input"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            className="submit-button"
            onClick={handleSubmit}
          >
            {isLoading ? "Generating..." : "Generate Questions"}
          </button>
        </div>

        <div>
          {generatedQuestions?.map((questionobj, i) => (
            <div key={i} className="question-list">
              <h4>{questionobj.question}</h4>
              <ul>
                {questionobj.options.map((option, idx) => (
                  <li key={idx}>
                    {idx + 1}. {option}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
