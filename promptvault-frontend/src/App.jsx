import { useState } from 'react';

function App() {
  // 1. Define state (memory). 'count' holds the value, 'setCount' updates it.
  const [count, setCount] = useState(0);

  // 2. Define a function to handle the button click
  const incrementScore = () => {
    setCount(count + 1);
  };
 
  // 3. Return the JSX (the visual layout)
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>PromptVault</h1>
      
      {/* Displaying our state variable using curly braces */}
      <p>The button has been clicked {count} times.</p>
      
      {/* Triggering our function on click */}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={incrementScore}>
        Click Me!
      </button>
    </div>
  );
}

export default App;
