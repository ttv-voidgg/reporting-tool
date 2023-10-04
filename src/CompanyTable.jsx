import React, { useEffect, useState } from "react";
import companiesRef from "./firebase";
import { onValue } from "firebase/database";
import './clientTable.css'

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
  }, []); // Empty dependency array ensures the effect runs once after the initial render

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
              <td>{company.Name}</td>
              <td>{company["Client Contacts"]}</td>
              <td>{company["Client Email"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyTable;
