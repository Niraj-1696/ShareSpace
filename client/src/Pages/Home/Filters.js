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
    <div className="w-72 flex flex-col bg-white p-5 rounded-lg shadow-md h-fit">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-primary text-xl font-bold">Filters</h1>
        <i
          className="ri-close-line text-2xl cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
          onClick={() => setShowFilters(false)}
          title="Hide filters"
        />
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-gray-700 font-semibold mb-3 text-base">
            Category
          </h2>
          <div className="flex flex-col gap-2">
            {categories.map((category) => (
              <label
                className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-2 rounded-md transition-colors"
                key={category.value}
              >
                <input
                  type="checkbox"
                  name="category"
                  className="max-width w-4 h-4 text-primary rounded focus:ring-primary"
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
                <span className="text-gray-700">{category.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-gray-700 font-semibold mb-3 text-base">Age</h2>
          <div className="flex flex-col gap-2">
            {ages.map((a) => (
              <label
                className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-2 rounded-md transition-colors"
                key={a.value}
              >
                <input
                  type="checkbox"
                  name="age"
                  className="max-width w-4 h-4 text-primary rounded focus:ring-primary"
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
                <span className="text-gray-700">{a.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filters;
