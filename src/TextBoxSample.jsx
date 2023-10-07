import React, { useState } from 'react';

const TextBoxSample = () => {
  const [inputs, setInputs] = useState([{ taskName: '', prLink: '', details: '', subDetails: [''], notes: '' }]);

  const handleInputChange = (inputIndex, field, event) => {
    const values = [...inputs];
    values[inputIndex][field] = event.target.value;
    setInputs(values);
  };

  const handleAddSubDetail = (inputIndex) => {
    const values = [...inputs];
    values[inputIndex].subDetails.push('');
    setInputs(values);
  };

  const handleRemoveSubDetail = (inputIndex, subIndex) => {
    const values = [...inputs];
    values[inputIndex].subDetails.splice(subIndex, 1);
    setInputs(values);
  };

  const handleAddInput = () => {
    setInputs([...inputs, { taskName: '', prLink: '', details: '', subDetails: [''], notes: '' }]);
  };

  const handleRemoveInput = (index) => {
    if (inputs.length > 1) {
      const values = [...inputs];
      values.splice(index, 1);
      setInputs(values);
    }
  };

  const handleSave = () => {
    const formattedData = inputs.map((input) => ({
      'Task Name': input.taskName.trim(), // Remove leading/trailing spaces
      'PR Link': input.prLink.trim(),
      'Details': input.details.trim(),
      'Sub details': input.subDetails.map((subDetail) => subDetail.trim()), // Trim each sub detail
      'Notes': input.notes.trim(),
    }));
    console.log(JSON.stringify(formattedData, null, 2)); // Log the formatted data as JSON
  };

  return (
    <div className="">
      {inputs.map((input, inputIndex) => (
        <div key={inputIndex}>
          <textarea
            placeholder='Task Name'
            className="border rounded px-2 py-1 mr-2 mb-5 w-full"
            rows='2'
            value={input.taskName}
            onChange={(event) => handleInputChange(inputIndex, 'taskName', event)}
          />
          <input
            type='text'
            placeholder='PR Link (if applicable)'
            className="border rounded px-2 py-1 mr-2 mb-5 w-full"
            value={input.prLink}
            onChange={(event) => handleInputChange(inputIndex, 'prLink', event)}
          />
          <div className="mb-4 flex items-center">
            <textarea
              placeholder='Details'
              className="border rounded px-2 py-1 mr-2 w-full flex-grow"
              value={input.details}
              onChange={(event) => handleInputChange(inputIndex, 'details', event)}
            />
            <button
              className={`rounded h-8 w-8 ${
                inputs.length === 1 ? 'disabled' : 'enabled'
              }`}
              onClick={() => handleRemoveInput(inputIndex)}
              disabled={inputs.length === 1}
            >
              -
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded ml-2 h-8 w-8"
              onClick={() => handleAddSubDetail(inputIndex)}
            >
              +
            </button>
          </div>
          {input.subDetails.map((subDetail, subIndex) => (
            <div key={subIndex} className="mb-4 ml-6 flex items-center">
              <textarea
                placeholder='Sub Details'
                className="border rounded px-2 py-1 mr-2 w-full flex-grow"
                value={subDetail}
                onChange={(event) => {
                  const values = [...inputs];
                  values[inputIndex].subDetails[subIndex] = event.target.value;
                  setInputs(values);
                }}
              />
              <button
                className={`rounded h-8 w-8 ${
                  input.subDetails.length === 1 ? 'disabled' : 'enabled'
                }`}
                onClick={() => handleRemoveSubDetail(inputIndex, subIndex)}
                disabled={input.subDetails.length === 1}
              >
                -
              </button>
            </div>
          ))}
          <textarea
            placeholder='Notes for this Task'
            className="border rounded px-2 py-1 mr-2 mb-5 w-full"
            rows='5'
            value={input.notes}
            onChange={(event) => handleInputChange(inputIndex, 'notes', event)}
          />
        </div>
      ))}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleAddInput}
      >
        Add Report
      </button>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
        onClick={handleSave}
      >
        Save
      </button>
      <style>
        {`
          .disabled {
            opacity: 0.5;
            background-color: #ccc;
            cursor: not-allowed;
          }

          .enabled {
            background-color: red;
            color: white;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

export default TextBoxSample;
