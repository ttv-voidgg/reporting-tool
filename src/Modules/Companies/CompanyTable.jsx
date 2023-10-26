import React, { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { companiesRef } from "../../firebase"; // Import companiesRef from firebase.jsx
import '../../css/clientTable.css';

const CompanyTable = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const unsubscribe = onValue(companiesRef, (snapshot) => {
      if (snapshot.exists()) {
        const jsonData = snapshot.val();
        setCompanies(Object.entries(jsonData));
      } else {
        console.log("No data available");
        setCompanies([]);
      }
    });

    return () => {
      // Unsubscribe the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h2>Company Data</h2>
      <table className="client-table table-auto w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Client Contacts</th>
            <th>Client Email</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(([key, company]) => (
            <tr key={key}>
              <td>{company["Company_Name"]}</td>
              <td>{company["Contacts"]}</td>
              <td>{company["Email"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyTable;
