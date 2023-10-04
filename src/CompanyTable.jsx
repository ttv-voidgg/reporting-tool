import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import companiesRef from "./firebase";

const CompanyTable = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // Fetch data from Firebase
    const fetchData = async () => {
      try {
        const database = getDatabase();
        const companyRef = ref(database, "Companies");

        const snapshot = await get(companyRef);
        if (snapshot.exists()) {
          setCompanies(Object.entries(snapshot.val()));
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <table>
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
  );
};

export default CompanyTable;
