import React from "react";

const categories = [
  { label: "Electronics", value: "electronics" },
  { label: "Fashion", value: "fashion" },
  { label: "Books", value: "books" },
  { label: "Sports", value: "sports" },
];

const ages = [
  { label: "0-1 years", value: "0-1" },
  { label: "2-3 years", value: "2-3" },
  { label: "4-5 years", value: "4-5" },
];

function Filters({ showFilters, setShowFilters, filters, setFilters }) {
  return (
    <div className="w-72 flex flex-col">
      <div className="flex justify-between">
        <h1 className="text-orange-900">Filters</h1>
        <i
          className="ri-close-line text-xl cursor-pointer"
          onClick={() => setShowFilters(false)}
          title="Hide filters"
        />
      </div>

      <div className="flex flex-col gap-1 mt-5">
        <h1 className="text-gray-600">Category</h1>
        <div className="flex flex-col gap-1">
          {categories.map((category) => (
            <label
              className="flex items-center gap-2 cursor-pointer"
              key={category.value}
            >
              <input
                type="checkbox"
                name="category"
                className="max-width"
                checked={filters.category?.includes(category.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFilters({
                      ...filters,
                      category: [...(filters.category || []), category.value],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      category: filters.category.filter(
                        (item) => item !== category.value
                      ),
                    });
                  }
                }}
              />
              <span>{category.label}</span>
            </label>
          ))}
        </div>

        <h1 className="text-gray-600">Age</h1>

        <div className="flex flex-col gap-1">
          {ages.map((a) => (
            <label
              className="flex items-center gap-2 cursor-pointer"
              key={a.value}
            >
              <input
                type="checkbox"
                name="age"
                className="max-width"
                checked={filters.age?.includes(a.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFilters({
                      ...filters,
                      age: [...(filters.age || []), a.value],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      age: filters.age.filter((item) => item !== a.value),
                    });
                  }
                }}
              />
              <span>{a.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Filters;
