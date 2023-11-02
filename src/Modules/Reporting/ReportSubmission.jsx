import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { onValue, set, push } from 'firebase/database';
import { ref as sRef } from 'firebase/storage';
import { companiesRef, reportsRef } from '../../firebase'; // Import your Firebase setup
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import '../../css/ReportsSubmission.css';

export default function ReportSubmission() {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const editorRef = useRef(null);
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


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

        if (!selectedCompany || !selectedStatus) {
          setErrorMessage('Please select a company and status.');
          setErrorModalVisible(true);
          setTimeout(() => {
            setErrorModalVisible(false);
          }, 3000);           
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
      {errorModalVisible && (
        <div className="error-modal rounded-md bg-red-50 p-4 fixed left-0 top-0 z-50 m-5">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800">Please select a Company and Status</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button close-button"
                className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-green-50"
                onClick={() => setErrorModalVisible(false)}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        </div>
      )}

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

      <div className="status-radio">
      <select
        className="border inline rounded px-2 py-1 mr-5"
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

        <p className="inline mr-3 font-bold">Task Status:</p>
        
        <input type="radio" name="status" value="Done" onChange={() => setSelectedStatus('Done')} />
        <label>
          Done
        </label>

        <input type="radio" name="status" value="In Progress" onChange={() => setSelectedStatus('In Progress')} />
        <label>
          In Progress
        </label>

        <input type="radio" name="status" value="To Do" onChange={() => setSelectedStatus('To Do')} />
        <label>
          To Do
        </label>

        <input type="radio" name="status" value="Client Notes" onChange={() => setSelectedStatus('Client Notes')} />
        <label>
          Additional Client Notes
        </label>  

      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded float-right" onClick={handleSave}>
        Save
      </button>              
      </div>

      <Editor
        apiKey="9kmml34hfnmo4nntltoekgxa8n24hd5ilv6wunbb5d0vr1cm"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue='
        <ul>
        <li>Style Guide <strong>(ATTENTION!)</strong>
        <ul>
        <li>First of, sorry for that all caps, I need you to read this</li>
        <li>Make sure you put everything in a bullet list</li>
        <li>Use proper styling
        <ul>
        <li>If you need to emphasize something use <strong>bold</strong></li>
        <li>if you need you need to add a note to a specific task, use <em>italic</em></li>
        </ul>
        </li>
        <li>Make sure to properly add hierarchy to your list
        <ul>
        <li>If tasks have subitems make sure you indent those subitems
        <ul>
        <li>If subitems have subitems make sure you indent them as well</li>
        </ul>
        </li>
        </ul>
        </li>
        <li>If a task contains a link make sure you use the link tool:
        <ul>
        <li><a href="https://chykalophia.com/">link to the item</a><br><br></li>
        </ul>
        </li>
        </ul>
        </li>
        <li>Adding Reports<br>
        <ul>
        <li>Make sure to <strong>Select a Company</strong> and the respective <strong>Task Status</strong></li>
        <li>When done, click the save button</li>
        <li>You&lsquo;ll be able to view your report in the Weekly Reports View<br><br></li>
        </ul>
        </li>
        <li>Deleting Stuff
        <ul>
        <li>If you have to delete something, make sure to only delete your reports
        <ul>
        <li>I havent added the feature to prevent other users from deleting reports that aren&lsquo;t theirs.<br><br></li>
        </ul>
        </li>
        </ul>
        </li>
        <li>App is still on Beta
        <ul>
        <li>If you have any suggestions, please do list them down in the&nbsp;<strong>To Do&nbsp;</strong>section of&nbsp;<strong>Internal Reports</strong></li>
        <li>Validations are still limited, so please don&lsquo;t play around just yet as it might break</li>
        <li>I haven&lsquo;t added delete and edit functions to the Companies page yet, so no touchy!</li>
        </ul>
        </li>
        </ul>
        '
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'save',
          ],
          toolbar: 'undo redo ' +
            'bold italic forecolor | link | bullist outdent indent | ' +
            'removeformat code | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
    </div>
  );
}
