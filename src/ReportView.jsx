import React, { useEffect, useState } from 'react';
import { onValue } from 'firebase/database';
import { reportsRef, companiesRef } from './firebase'; // Import your Firebase setup
import './ReportView.css'; // Import CSS file for styling

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

  const compileReportsByDateRange = () => {
    if (!reportsData) {
      return {};
    }

    const groupedReports = {};

    Object.keys(reportsData).forEach((date) => {
      const dateRange = getWeekDateRange(date);

      if (!groupedReports[dateRange]) {
        groupedReports[dateRange] = {
          Done: [],
          'To Do': [],
          'In Progress': [],
          'Client Notes': [],
        };
      }

      Object.keys(reportsData[date]).forEach((companyKey) => {
        STATUS_ORDER.forEach((status) => {
          if (reportsData[date][companyKey][status]) {
            Object.keys(reportsData[date][companyKey][status]).forEach((reportKey) => {
              const reportItem = {
                companyKey,
                status,
                reportKey,
                content: reportsData[date][companyKey][status][reportKey],
              };
              groupedReports[dateRange][status].push(reportItem);
            });
          }
        });
      });
    });

    return groupedReports;
  };

  const renderReports = () => {
    const groupedReports = compileReportsByDateRange();

    return Object.keys(groupedReports).map((dateRange) => (
      <div className="ReportView" key={dateRange}>
        {!filterDateRange && <h3 className="mb-10 text-xl">Weekly Reports | {dateRange}</h3>}
        {STATUS_ORDER.map((status) => {
          if (
            (!filterDateRange || dateRange === filterDateRange) &&
            groupedReports[dateRange][status].length > 0
          ) {
            return (
              <div className="mb-10" key={status}>
                <h5 className="font-bold">{STATUS_EQUIVALENTS[status]}</h5>
                <ul className="ReportList">
                  {groupedReports[dateRange][status].map((reportItem) => (
                    <li name={reportItem.reportKey} key={reportItem.reportKey}>
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
    ));
  };

  return (
    <div className="">
      <h2 className="text-3xl mb-5">Weekly Reports</h2>
      <select
        value={filterDateRange}
        onChange={(e) => setFilterDateRange(e.target.value)}
      >
        <option value="">All Date Ranges</option>
        {availableDateRanges.map((dateRange) => (
          <option key={dateRange} value={dateRange}>
            {dateRange}
          </option>
        ))}
      </select>
      {renderReports()}
    </div>
  );
}
