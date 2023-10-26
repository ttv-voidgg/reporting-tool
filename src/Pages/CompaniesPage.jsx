import React from "react";
import { useParams } from "react-router-dom";
import AddCompany from "../Modules/Companies/AddCompany";
import CompanyTable from "../Modules/Companies/CompanyTable";

export default function CompanyPage() {
  const { action } = useParams();

  return (
    <div className="flex flex-col space-y-6">
      {/* Render both components */}
      <AddCompany />
      <CompanyTable />
    </div>
  );
}
