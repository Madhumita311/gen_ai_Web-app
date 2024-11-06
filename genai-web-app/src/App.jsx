import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
   <div className='main-container'>

<h1>Gen AI Web App by Visuara AI</h1>
<div className='form-container'>
  <div>
    <label>Enter Query:</label>
    <input type='text'
    className='query-input' placeholder="enter placeholder"/>
  </div>
</div>
   </div>
  );
}

export default App
