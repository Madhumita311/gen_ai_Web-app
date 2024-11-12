import { useState } from 'react';
import './App.css'
import OpenAI from "openai"
function App() {
  const[query,setQuery] = useState("")
  const[noOfQuestion,setNoOfQuestions] = useState(4)
  const[difficulty,setDifficulty] = useState("")
  // const [questions,setQuestions]=useState([])
  const [generatedQuestions,setGeneratedQuestions]=useState([]);
  const handleQueryInputChange=(e)=>{
    setQuery(e.target.value)
  };
  const handleNoOfQuestionsInputChange=(e)=>{
    setNoOfQuestions(e.target.value)
  };
  const handleDifficultyInputChange=(e)=>{
    setDifficulty(e.target.value)
  };
  const[isLoading,setISLoading] = useState(false);

  const createQuestionsWithOpenAIApi = async () => {
    setIsLoading(true);
    
    const promptMessage = `Generate ${noOfQuestion} ${difficulty} questions with 4 options in an array format on the topic: ${query}.
    
    Each question should be structured in JSON format with the following keys:
      - "question": The text of the question.
      - "options": An array of 4 options, each option as a string.
      - "correct_option": The correct option (must match one of the options).
      - "difficulty": The difficulty level of the question ("easy", "medium", or "hard").

    Output the result as an array of JSON objects with the structure described. Don't put anything else. Only valid Array.

    Example format:
    [
      {
        "question": "What is the capital of France?",
        "options": ["Paris", "London", "Berlin", "Rome"],
        "correct_option": "Paris",
        "difficulty": "easy"
      }
    ]`;

    const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
    });

    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant.", },
                { role: "user", content: promptMessage, },
            ],
            model: "gpt-4o-mini",
        });
        
        setIsLoading(false);
        
        const response = chatCompletion?.choices[0].message?.content;
        // const jsonOutput = JSON.parse(response);
        // console.log(questions);
        setNoOfQuestions(generatedQuestions);
        
    } catch (error) {
        console.error(error);
        setIsLoading(false);
        setNoOfQuestions([]);
    }
};

const handleSubmit = (e) => {
    e.preventDefault();
    createQuestionsWithOpenAIApi();
};

  // const handleSubmit=(e)=>{
  //   e.preventDefault()
  //   console.log(query)
  //   console.log(noOfQuestion)
  //   console.log(difficulty)
  // }
  return (
   <div className='main-container'>

<h1>Generate Questions using GEN AI</h1>
<div className='form-container'>
  <div>
    <label>Enter Query:</label>
    <input type='text'
    className='query-input' placeholder="enter Query"
    onChange={handleQueryInputChange}/>
  </div>
  <div>
    <label>No of Questions:{noOfQuestion}</label>
    <input type='range'
    min={1} max={10}

    className='questions-input' onChange={handleNoOfQuestionsInputChange}
    placeholder='Enter Query'/>

  </div><div>
  <label>Difficulty:</label>
  <select className='difficulty-input' onChange={handleDifficultyInputChange}>
    <option value="easy">Easy</option>
    <option value="medium">Medium</option>
    <option value='hard'>Hard</option>
  </select>
  </div>
  <button className='submit-button'onClick={handleSubmit}>Generate Questions</button>
</div>
</div>
  );
}

export default App;
