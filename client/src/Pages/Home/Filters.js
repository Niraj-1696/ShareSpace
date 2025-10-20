import React from "react";

function Filters({ showFilters, setShowFilters, filters, setFilters }) {
  return (
    <div className="w-72">
      <div className="flex justify-between">
        <h1 className="text-orange-900">Filters</h1>
        <i
          className="ri-close-line text-xl cursor-pointer"
          onClick={() => setShowFilters(false)}
          title="Hide filters"
        />
      </div>
    </div>
  );
}

export default Filters;
