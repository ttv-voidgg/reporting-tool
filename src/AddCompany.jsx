import React, { useState } from 'react';
import { push } from 'firebase/database';
import { ref as sRef } from 'firebase/storage';
import { companiesRef } from './firebase'; // Import companiesRef from firebase.jsx

export default function AddCompany() {
  const [Company_Name, setCompanyName] = useState('');
  const [Contacts, setContacts] = useState('');
  const [Email, setEmail] = useState('');

  const addCompany = (e) => {
    e.preventDefault();
    const newCompanyRef = sRef(companiesRef); // Create a reference to the "Companies" node
    const newCompany = {
      Company_Name,
      Contacts: Contacts,
      Email: Email,
    };

    // Use the push method to add data
    push(newCompanyRef, newCompany)
      .then(() => {
        // Data has been added successfully
        setCompanyName(''); // Clear the input field after submitting
        setContacts('');
        setEmail('');
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error adding company:', error);
      });
  };

  const handleCompanyName = (e) => {
    setCompanyName(e.target.value);
  };
  const handleContacts = (e) => {
    setContacts(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };



  return (
    <form onSubmit={addCompany} className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
        <div className='col-span-3'>
            <input
            type="text"
            placeholder="Company Name"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={Company_Name}
            required
            onChange={handleCompanyName}
            />
        </div>
        <div className='col-span-3'>
            <input
            type="text"
            placeholder="Contact/s"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={Contacts}
            required
            onChange={handleContacts}
            />
        </div>
        <div className='col-span-3'>
            <input
            type="text"
            placeholder="Email/s"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={Email}
            required
            onChange={handleEmail}
            />
        </div>                
        <button className="col-span-9 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" type="submit">
          Submit
        </button>
    </form>


  );
}
