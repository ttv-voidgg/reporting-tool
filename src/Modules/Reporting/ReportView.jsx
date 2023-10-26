import React, { useEffect, useState } from 'react';
import { onValue , set} from 'firebase/database';
import { ref } from 'firebase/storage';
import { reportsRef, companiesRef } from '../../firebase'; // Import your Firebase setup
import '../../css/ReportView.css'; // Import CSS file for styling
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'

const STATUS_ORDER = ['Done', 'In Progress', 'To Do', 'Client Notes'];

const STATUS_EQUIVALENTS = {
  Done: 'This week, we worked on the following:',
  'In Progress': 'We are currently working on the following:',
  'To Do': 'We will be working on the following:',
  'Client Notes': 'Additional Notes:',
};

function getWeekDateRange(date) {
  const today = new Date(date);
  const startOfWeek = new Date(date);
  const endOfWeek = new Date(date);

  const currentDay = today.getDay();
  const diffToMonday = today.getDate() - currentDay + (currentDay === 1 ? 1 : (currentDay === 1 ? -6 : 1));

  startOfWeek.setDate(diffToMonday);
  endOfWeek.setDate(diffToMonday + 4); // 4 because it's a 5-day work week (Monday to Friday)

  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedStartDate = startOfWeek.toLocaleDateString('en-US', options);
  const formattedEndDate = endOfWeek.toLocaleDateString('en-US', options);

  return `${formattedStartDate} - ${formattedEndDate}`;
}

export default function ReportView() {
  const [reportsData, setReportsData] = useState(null);
  const [companiesData, setCompaniesData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState(null); // Initialize with null
  const [availableDateRanges, setAvailableDateRanges] = useState([]);
  const [filterDateRange, setFilterDateRange] = useState(''); // Initialize with an empty string
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');


  useEffect(() => {
    // Fetch companies data from Firebase
    const companiesUnsubscribe = onValue(companiesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setCompaniesData(data);
      } else {
        console.log('No companies data available');
        setCompaniesData({});
      }
    });

    // Fetch reports data from Firebase
    const reportsUnsubscribe = onValue(reportsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setReportsData(data);

        // Extract and set available date ranges
        const ranges = Object.keys(data).map((date) => getWeekDateRange(date));
        const uniqueRanges = [...new Set(ranges)]; // Remove duplicates
        setAvailableDateRanges(uniqueRanges);
      } else {
        console.log('No reports data available');
        setReportsData(null);
      }
    });

    return () => {
      // Unsubscribe the listeners when the component unmounts
      companiesUnsubscribe();
      reportsUnsubscribe();
    };
  }, []);

  const convertParagraphsToList = (htmlContent) => {
    const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
    const paragraphs = doc.querySelectorAll('p');
    if (paragraphs.length > 0) {
      const listItems = Array.from(paragraphs).map((paragraph) => <li key={Math.random()}>{paragraph.textContent}</li>);
      return <ul>{listItems}</ul>;
    } else {
      return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    }
  };


  const compileReportsByDateAndCompany = () => {
    if (!reportsData) {
      return {};
    }
  
    const groupedReports = {};
  
    Object.keys(reportsData).forEach((date) => {
      const dateRange = getWeekDateRange(date);
  
      if (!groupedReports[dateRange]) {
        groupedReports[dateRange] = {};
      }
  
      Object.keys(reportsData[date]).forEach((companyKey) => {
        if (!groupedReports[dateRange][companyKey]) {
          groupedReports[dateRange][companyKey] = {
            Done: [],
            'In Progress': [],
            'To Do': [],
            'Client Notes': [],
          };
        }
  
        STATUS_ORDER.forEach((status) => {
          if (reportsData[date][companyKey][status]) {
            // Inside the compileReportsByDateAndCompany function
            Object.keys(reportsData[date][companyKey][status]).forEach((reportKey) => {
              const reportItem = {
                status,
                reportKey,
                content: reportsData[date][companyKey][status][reportKey],
                date: date,
                companyKey: companyKey, // Include the company key here
              };
              groupedReports[dateRange][companyKey][status].push(reportItem);
            });
          }
        });
      });
    });
  
    return groupedReports;
  };  

  const handleDeleteReport = (date, companyKey, status, reportKey) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this report?');
  
    if (isConfirmed) {
      const updatedData = { ...reportsData };
      // Show confirmation message
      setDeleteConfirmation(true);

      // Hide confirmation message after 3 seconds
       setTimeout(() => {
         setDeleteConfirmation(false);
       }, 3000);      
  
      // Check if the necessary properties exist before attempting to delete the report
      if (updatedData[date] && updatedData[date][companyKey] && updatedData[date][companyKey][status]) {
        // Remove the specific report from the data structure
        delete updatedData[date][companyKey][status][reportKey];
  
        // Update the Firebase database
        const databaseRef = ref(reportsRef);
        set(databaseRef, updatedData)
          .then(() => {
            console.log('Report deleted successfully!');
          })
          .catch((error) => {
            console.error('Error deleting report: ', error);
          });
      } else {
        console.error('Report not found. Unable to delete.');
      }
    }
  };

  const renderReports = () => {
    const groupedReports = compileReportsByDateAndCompany();

    if (!companiesData) {
      return <div>Loading...</div>; // Or a loading indicator
    }    
    
    return (
      <div className="">
          {deleteConfirmation && (

          <div className="confirmation-message rounded-md bg-green-50 p-4 fixed left-0 top-0 z-50 m-5">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Report Deleted</p>
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

        )}

        <h2 className="text-3xl mb-5">Weekly Reports</h2>
        <select
          value={filterDateRange}
          onChange={(e) => setFilterDateRange(e.target.value)}
          className="mb-10"
        >
          <option value="">All Date Ranges</option>
          {availableDateRanges.map((dateRange) => (
            <option key={dateRange} value={dateRange}>
              {dateRange}
            </option>
          ))}
        </select>

        <select
            id="companyDropdown"
            name="company"
            className="mt-1 pr-10 border"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">All Companies</option>
            {Object.keys(companiesData).map((companyKey) => {
  const hasReportsForDateRange = Object.keys(groupedReports).some(dateRange =>
    Object.keys(groupedReports[dateRange]).some(innerCompanyKey =>
      innerCompanyKey === companyKey && (!filterDateRange || dateRange === filterDateRange)
    )
  );

  if (hasReportsForDateRange) {
    const company = companiesData[companyKey];
    return (
      <option key={companyKey} value={companyKey}>
        {company['Company_Name']} {/* Safely access 'Company_Name' using optional chaining */}
      </option>
    );
  }

  return null; // Do not render if the company does not have associated reports for the selected date range
})}

          </select>
        

        {Object.keys(groupedReports).map((dateRange) => {
          if (!filterDateRange || dateRange === filterDateRange) {
            return (
              <div className="ReportView" key={dateRange}>
                {Object.keys(groupedReports[dateRange]).map((companyKey) => {

                  // Skip rendering if selected company is not empty and doesn't match the filtered company
                  if (selectedCompany && selectedCompany !== companyKey) {
                    return null;
                  }                  

                  const companyReports = groupedReports[dateRange][companyKey];
                  return (
                    <div className="mb-10" key={companyKey}>
                      <h4 className="text-xl mb-5 font-semibold">
                        {companiesData[companyKey]?.['Company_Name'] || 'Unknown Company'} Weekly Reports | {dateRange}
                      </h4>
                      {STATUS_ORDER.map((status) => {
                        const reports = companyReports[status];
                        if (reports && reports.length > 0) {
                          return (
                            <div className="mb-5" key={status}>
                              <h5 className="font-bold">{STATUS_EQUIVALENTS[status]}</h5>
                              <ul className="ReportList">
                                {reports.map((reportItem) => (
                                  <li className="border-b border-solid" name={reportItem.reportKey} key={reportItem.reportKey}>
                                      <button
                                        className="text-red-500 float-right"
                                        onClick={() =>
                                          handleDeleteReport(
                                            reportItem.date, // Pass the actual date key
                                            companyKey,
                                            status,
                                            reportItem.reportKey
                                          )
                                        }
                                      >
                                        Delete
                                      </button>                                    
                                    <div className="ml-5">
                                      {convertParagraphsToList(reportItem.content)}
                                      
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  );
                })}
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="">
      {renderReports()}
    </div>
  );
}
