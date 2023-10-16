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
  const diffToMonday = today.getDate() - currentDay + (currentDay === 1 ? 0 : (currentDay === 1 ? -6 : 1));

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
  }, []); // Empty dependency array ensures the effect runs once after the initial render

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

  const renderReports = () => {
    if (!reportsData) {
      return <p>No reports data available</p>;
    }

    return Object.keys(reportsData).map((date) => (
      <div className="ReportView" key={date}>
        {Object.keys(reportsData[date]).map((companyKey) => (
          <div className="mb-20" key={companyKey}>
            <h3 className="mb-10 text-xl">{companiesData[companyKey]?.Company_Name || companyKey} Weekly Reports | {getWeekDateRange(date)}</h3> {/* Display company name */}
            {STATUS_ORDER.map((status) => {
              if (reportsData[date][companyKey][status]) {
                return (
                  <div className="mb-10" key={status}>
                    <h5 className="font-bold">{STATUS_EQUIVALENTS[status]}</h5>
                    <ul className="ReportList">
                      {Object.keys(reportsData[date][companyKey][status]).map((reportKey) => (
                        <li name={reportKey} key={reportKey}>
                          <div className="ml-5">{convertParagraphsToList(reportsData[date][companyKey][status][reportKey])}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="">
      <h2 className="text-3xl mb-5">Weekly Reports</h2>
      {renderReports()}
    </div>
  );
}
