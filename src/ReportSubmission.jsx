import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { onValue, set, push } from 'firebase/database';
import { ref as sRef } from 'firebase/storage';
import { companiesRef, reportsRef } from './firebase'; // Import your Firebase setup
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'

export default function ReportSubmission() {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const editorRef = useRef(null);
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);


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

    function getWeekDateRange(date) {
      const today = new Date(date);
      const startOfWeek = new Date(date);
      const endOfWeek = new Date(date);
    
      const currentDay = today.getDay();
      const diffToMonday = today.getDate() - currentDay + (currentDay === 1 ? 0 : (currentDay === 1 ? -6 : 1));
    
      startOfWeek.setDate(diffToMonday);
      endOfWeek.setDate(diffToMonday + 4); // 4 because it's a 5-day work week (Monday to Friday)
    
      const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
      const formattedStartDate = startOfWeek.toLocaleDateString('en-US', options);
      const formattedEndDate = endOfWeek.toLocaleDateString('en-US', options);
    
      return `${formattedStartDate} - ${formattedEndDate}`;
    }
  
    

    const handleSave = () => {

        if (!selectedCompany || !selectedStatus) {
          console.error('Please select a company and status');
          return;
        }

            
        // Set the state to show the "Report Submitted" prompt
        setIsReportSubmitted(true);

        // Automatically hide the prompt after 3 seconds
        setTimeout(() => {
          setIsReportSubmitted(false);
        }, 3000);          
    
        const formattedDate = new Date().toLocaleDateString('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\//g, '-');

        const updatedData = { ...existingData };   
             
    
        const statusKey = selectedStatus;
        const uniqueReportKey = push(reportsRef).key; // Generate a unique key for the report

        if (!updatedData[formattedDate]) {
            updatedData[formattedDate] = {};
        }
      
        if (!updatedData[formattedDate][selectedCompany]) {
            updatedData[formattedDate][selectedCompany]= {};
        }        

        if (!updatedData[formattedDate][selectedCompany][statusKey]) {
            updatedData[formattedDate][selectedCompany][statusKey] = {};
        }        

        const content = editorRef.current.getContent();

        // Check if taskKey is a non-empty string and does not contain invalid characters
        if (uniqueReportKey && typeof uniqueReportKey === 'string' && !/[.#$[\]\/]/.test(uniqueReportKey)) {
            updatedData[formattedDate][selectedCompany][statusKey][uniqueReportKey] = content;
        } else {
            console.error('Invalid taskKey:', uniqueReportKey);
            return; // Skip saving this task if the key is invalid
        }        
    
        const databaseRef = sRef(reportsRef);
        set(databaseRef, updatedData)
          .then(() => {
            console.log('Data saved successfully!');
            // Optionally, you can reset the TinyMCE editor here
            // Clear the TinyMCE editor content
            editorRef.current.setContent('');        
          
          })
          .catch((error) => {
            console.error('Error saving data: ', error);
          });        
      };



  const [companiesData, setCompaniesData] = useState([]);

  useEffect(() => {
    const unsubscribe = onValue(companiesRef, (snapshot) => {
      if (snapshot.exists()) {
        const jsonData = snapshot.val();
        setCompaniesData(Object.entries(jsonData));
      } else {
        console.log('No company data available');
        setCompaniesData([]);
      }
    });

    return () => {
      // Unsubscribe the listener when the component unmounts
      unsubscribe();
    };
  }, []);
  return (
    
    <div className="">
      {
        isReportSubmitted && 
        <div className="confirmation-message rounded-md bg-green-50 p-4 fixed left-0 top-0 z-50 m-5">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">Report Submitted</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button close-button"
                className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                onClick={() => setDeleteConfirmation(false)}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        </div>

      }      
      <select
        className="border rounded px-2 py-1 mr-2 mb-5"
        value={selectedCompany}
        onChange={(event) => setSelectedCompany(event.target.value)}
      >
        <option value="">Select a Company</option>
        {companiesData.map(([key, company]) => (
          <option key={key} value={key}>
            {company['Company_Name']}
          </option>
        ))}
      </select>

      <div className="status-radio">
        <label>
          <input type="radio" name="status" value="Done" onChange={() => setSelectedStatus('Done')} />
          Done
        </label>
        <label>
          <input type="radio" name="status" value="In Progress" onChange={() => setSelectedStatus('In Progress')} />
          In Progress
        </label>
        <label>
          <input type="radio" name="status" value="To Do" onChange={() => setSelectedStatus('To Do')} />
          To Do
        </label>
        <label>
          <input type="radio" name="status" value="Client Notes" onChange={() => setSelectedStatus('Client Notes')} />
          Additional Client Notes
        </label>        
      </div>

      <Editor
        apiKey="9kmml34hfnmo4nntltoekgxa8n24hd5ilv6wunbb5d0vr1cm"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
          ],
          toolbar: 'undo redo ' +
            'bold italic forecolor | bullist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}
