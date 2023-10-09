import React, { useEffect, useState } from 'react';
import { onValue } from 'firebase/database';
import { reportsRef, companiesRef } from './firebase'; // Import reportsRef and companiesRef from firebase.jsx

const ReportsList = () => {
  const [reports, setReports] = useState({});
  const [companies, setCompanies] = useState({});

  useEffect(() => {
    const fetchReports = () => {
      onValue(reportsRef, (snapshot) => {
        if (snapshot.exists()) {
          setReports(snapshot.val());
        } else {
          console.log('No reports available');
        }
      });
    };

    const fetchCompanies = () => {
      onValue(companiesRef, (snapshot) => {
        if (snapshot.exists()) {
          setCompanies(snapshot.val());
        } else {
          console.log('No companies available');
        }
      });
    };

    fetchReports();
    fetchCompanies();

    return () => {
      // Clean up event listeners if necessary
    };
  }, []);

  const getCompanyName = (companyId) => {
    const company = companies[companyId];
    return company ? company.Company_Name : 'Unknown Company';
  };

  return (
    <div className="reports-list font-sans">
      <h2>Reports List</h2>
      {Object.keys(reports).length > 0 ? (
        Object.keys(reports).map((date) => (
          <div key={date}>
            <h3>{date}</h3>
            {reports[date] &&
              Object.keys(reports[date]).map((company) => (
                <div key={company}>
                  <h4>{getCompanyName(company)}</h4>
                  {reports[date][company] &&
                    Object.keys(reports[date][company]).map((reportId) => {
                      const report = reports[date][company][reportId];
                      return (
                        <div key={reportId}>
                          <ul className="list-disc ml-10 mb-5">
                            <li><h5>{report['Task Name']}</h5></li>
                            <li><p>PR Link: {report['PR Link']}</p></li>
                            
                            <ul className="list-disc ml-10">
                                {report.Details &&
                                report.Details.map((detail, index) => (
                                    <li key={index}>
                                    Parent Detail: {detail['Parent Detail']}
                                    {detail['Child Details'] && detail['Child Details'].length > 0 && (
                                        <ul className="list-disc ml-10">
                                        {detail['Child Details'].map((childDetail, childIndex) => (
                                            <li key={childIndex}>Child Detail: {childDetail}</li>
                                        ))}
                                        </ul>
                                    )}
                                    </li>
                                ))}
                            </ul>

                            <li><p>Notes: {report['Notes']}</p></li>
                          </ul>
                        </div>
                      );
                    })}
                </div>
              ))}
          </div>
        ))
      ) : (
        <p>No reports available</p>
      )}
    </div>
  );
};

export default ReportsList;
