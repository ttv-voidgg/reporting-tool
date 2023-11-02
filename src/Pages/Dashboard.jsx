import React from "react";
import { useParams } from "react-router-dom";
import ReportSubmission from "../Modules/Reporting/ReportSubmission";
import ReportView from "../Modules/Reporting/ReportView";

export default function Dashboard() {
  const { action } = useParams();

  return (
    <div className="flex flex-col space-y-6">
      {/* Render both components */}
      Just a Dashboard...
      <br/>
      Needs more work... My brain's not braining right now...
      <br/>
      - Eejay
    </div>
  );
}
