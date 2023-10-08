import React, { useEffect, useState } from "react";
import { onValue, push, set } from "firebase/database";
import { ref as sRef } from 'firebase/storage';
import { companiesRef, reportsRef } from "./firebase"; // Import companiesRef from firebase.jsx

const TextBoxSample = () => {
  const [inputs, setInputs] = useState([
    {
      taskName: '',
      prLink: '',
      details: [{ parentDetail: '', childDetails: [] }],
      notes: ''
    }
  ]);
  const [companiesData, setCompaniesData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');

  useEffect(() => {
    const unsubscribe = onValue(companiesRef, (snapshot) => {
      if (snapshot.exists()) {
        const jsonData = snapshot.val();
        setCompaniesData(Object.entries(jsonData));
      } else {
        console.log("No company data available");
        setCompaniesData([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleInputChange = (inputIndex, field, event) => {
    const values = [...inputs];
    values[inputIndex][field] = event.target.value;
    setInputs(values);
  };

  const handleRemoveInput = (index) => {
    if (inputs.length > 1) {
      const values = [...inputs];
      values.splice(index, 1);
      setInputs(values);
    }
  };  

  const handleAddParentDetail = (inputIndex) => {
    const values = [...inputs];
    values[inputIndex].details.push({ parentDetail: '', childDetails: [] });
    setInputs(values);
  };

  const handleRemoveParentDetail = (inputIndex, parentIndex) => {
    if (inputs[inputIndex].details.length > 1) {
      const values = [...inputs];
      values[inputIndex].details.splice(parentIndex, 1);
      setInputs(values);
    }
  };

  const handleAddChildDetail = (inputIndex, parentIndex) => {
    const values = [...inputs];
    values[inputIndex].details[parentIndex].childDetails.push('');
    setInputs(values);
  };

  const handleRemoveChildDetail = (inputIndex, parentIndex, childIndex) => {
    const values = [...inputs];
    values[inputIndex].details[parentIndex].childDetails.splice(childIndex, 1);
    setInputs(values);
  };

  const handleAddInput = () => {
    setInputs([...inputs, { taskName: '', prLink: '', details: [{ parentDetail: '', childDetails: [] }], notes: '' }]);
  };

  const [existingData, setExistingData] = useState(null);

  useEffect(() => {
      const reportsReference = sRef(reportsRef);

      const unsubscribe = onValue(reportsReference, (snapshot) => {
          if (snapshot.exists()) {
              const data = snapshot.val();
              setExistingData(data);
          } else {
              console.log("No existing data available");
              setExistingData({}); // Set an empty object if no data exists
          }
      });

      return () => {
          unsubscribe();
      };
  }, []);

  const handleSave = () => {
    if (!existingData) {
      console.error("Existing data not available");
      return;
    }
  
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    ).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
  
    const updatedData = { ...existingData };
  
    inputs.forEach((input, index) => {
      const newTask = {
        'Task Name': input.taskName.trim(),
        'PR Link': input.prLink.trim(),
        'Details': input.details.map((detail) => ({
          'Parent Detail': detail.parentDetail.trim(),
          'Child Details': detail.childDetails.map((childDetail) =>
            childDetail.trim()
          ),
        })),
        'Notes': input.notes.trim(),
      };
  
      if (!updatedData[formattedDate]) {
        updatedData[formattedDate] = {};
      }
  
      if (!updatedData[formattedDate][selectedCompany]) {
        updatedData[formattedDate][selectedCompany] = {};
      }
  
      const taskKey = push(reportsRef).key; // Generate a unique key for the task
  
      // Check if taskKey is a non-empty string and does not contain invalid characters
      if (taskKey && typeof taskKey === 'string' && !/[.#$[\]\/]/.test(taskKey)) {
        updatedData[formattedDate][selectedCompany][taskKey] = newTask;
      } else {
        console.error('Invalid taskKey:', taskKey);
        return; // Skip saving this task if the key is invalid
      }
    });
  
    console.log("Data to be saved:", updatedData);
  
    set(reportsRef, updatedData)
      .then(() => {
        console.log("Data saved successfully!");
        // Clear the input fields after saving data
        setInputs([
          {
            taskName: '',
            prLink: '',
            details: [{ parentDetail: '', childDetails: [''] }],
            notes: '',
          },
        ]);
      })
      .catch((error) => {
        console.error("Error saving data: ", error);
      });
  };
  

  return (
    <div className="">
      <h3 className="text-2xl font-bold mb-5">Company</h3>
      <select
        className="border rounded px-2 py-1 mr-2 mb-5 w-full"
        value={selectedCompany}
        onChange={(event) => setSelectedCompany(event.target.value)}
      >
        <option value="">Select a Company</option>
        {companiesData.map(([key, company]) => (
          <option key={key} value={key}>
            {company["Company_Name"]}
          </option>
        ))}
      </select>

      {inputs.map((input, inputIndex) => (
        <div key={inputIndex} className="border-b border-solid border-gray-700 pb-5 mb-10">
          <div className="border-b border-solid border-gray-300 pb-5 mb-5">
          <h3 className="text-2xl font-bold mb-5">Task Heading</h3>
            <textarea
              placeholder='Task Name'
              className="border rounded px-2 py-1 mb-2 w-full"
              rows='2'
              value={input.taskName}
              onChange={(event) => handleInputChange(inputIndex, 'taskName', event)}
            />
            <input
              type='text'
              placeholder='PR Link (if applicable)'
              className="border rounded px-2 py-1 mb-2 w-full"
              value={input.prLink}
              onChange={(event) => handleInputChange(inputIndex, 'prLink', event)}
            />
          </div>
          <h3 className="text-xl font-bold">Details</h3>
          {input.details.map((parentDetail, parentIndex) => (
            <div key={parentIndex} className="border-b border-solid border-gray-300 py-5">
              <div className="mb-2 flex items-center">
                <input
                  type='text'
                  placeholder='Parent Detail'
                  className="border rounded px-2 py-1 mr-2 flex-grow"
                  value={parentDetail.parentDetail}
                  onChange={(event) => {
                    const values = [...inputs];
                    values[inputIndex].details[parentIndex].parentDetail = event.target.value;
                    setInputs(values);
                  }}
                />
                <button
                  className={`${
                    input.details.length === 1 ? "disabled" : "enabled"
                  } rounded h-8 w-8 bg-red-500 text-white font-bold`}
                  onClick={() => handleRemoveParentDetail(inputIndex, parentIndex)}
                  disabled={input.details.length === 1}
                >
                  -
                </button>
              </div>
              {parentDetail.childDetails.map((childDetail, childIndex) => (
                <div key={childIndex} className="mb-2 ml-8 flex items-center">
                  <input
                    type='text'
                    placeholder='Child Detail'
                    className="border rounded px-2 py-1 mr-2 flex-grow"
                    value={childDetail}
                    onChange={(event) => {
                      const values = [...inputs];
                      values[inputIndex].details[parentIndex].childDetails[childIndex] = event.target.value;
                      setInputs(values);
                    }}
                  />
                  <button
                    className="rounded h-8 w-8 bg-red-500 text-white font-bold"
                    onClick={() => handleRemoveChildDetail(inputIndex, parentIndex, childIndex)}
                  >
                    -
                  </button>
                </div>
              ))}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-8"
                onClick={() => handleAddChildDetail(inputIndex, parentIndex)}
              >
                Add Child Detail
              </button>
            </div>
          ))}

          <textarea
            placeholder='Notes for this Task'
            className="border rounded px-2 py-1 mb-2 w-full"
            rows='5'
            value={input.notes}
            onChange={(event) => handleInputChange(inputIndex, 'notes', event)}
          />
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAddParentDetail(inputIndex)}
          >
            Add Parent Detail
          </button>

          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={() => handleRemoveInput(inputIndex)}
          >
            Remove Task
          </button>
          
                          
        </div>

      ))}

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleAddInput}
      >
        Add Tasks
      </button>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
        onClick={handleSave}
      >
        Submit
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
