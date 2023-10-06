import React, { useState } from 'react';

const TextBoxSample = () => {
  const [inputs, setInputs] = useState(['']); // State to store input values

  const handleInputChange = (index, event) => {
    const values = [...inputs];
    values[index] = event.target.value;
    setInputs(values);
  };

  const handleAddInput = () => {
    setInputs([...inputs, '']);
  };

  const handleRemoveInput = (index) => {
    const values = [...inputs];
    values.splice(index, 1);
    setInputs(values);
  };

  return (
    <div className="">
        <textarea
            placeholder='Task Name'
            className="border rounded px-2 py-1 mr-2 mb-5 w-full"
            rows='2'
        />    
        <input
            type="text"
            placeholder='PR Link (if applicable)'
            className="border rounded px-2 py-1 mr-2 mb-5 w-full"
        />            
      {inputs.map((input, index) => (
        <div key={index} className="mb-4 flex">
          <textarea
            placeholder='Particulars'
            className="border rounded px-2 py-1 mr-2 w-full"
            value={input}
            onChange={(event) => handleInputChange(index, event)}
          />
          <button
            className="bg-red-500 text-white rounded px-2 py-1"
            onClick={() => handleRemoveInput(index)}
          >
            Remove
          </button>
        </div>
      ))}
        <textarea
            placeholder='Notes for this Task'
            className="border rounded px-2 py-1 mr-2 mb-5 w-full"
            rows='5'
        />       
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleAddInput}
      >
        Add Report
      </button>
    </div>
  );
};

export default TextBoxSample;
