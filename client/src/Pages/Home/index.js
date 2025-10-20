import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Divider, message } from "antd";
import { GetProducts } from "../../apicalls/products";
import { Setloader } from "../../Redux/loadersSlice";
import { useNavigate } from "react-router-dom";
import Filters from "./Filters";

function Home() {
  const [showFilters, setShowFilters] = React.useState(true);
  const [filters, setFilters] = React.useState({
    status: "approved",
  });
  const { user } = useSelector((state) => state.users);
  const [products, setProducts] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(Setloader(true));
      const payload = {
        status: filters.status || "approved",
        categories: filters.category || [],
        age: filters.age || [],
      };
      const response = await GetProducts(payload);
      dispatch(Setloader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(error.message);
    }
  };
  React.useEffect(() => {
    getData();
  }, [JSON.stringify(filters)]);

  return (
    <div>
      <div className="flex gap-5">
        {showFilters && (
          <Filters
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            setFilters={setFilters}
          />
        )}
        <div className="flex flex-col gap-5 flex-1">
          <div className="flex gap-5 items-center justify-between">
            {!showFilters && (
              <i
                className="ri-equalizer-line text-xl cursor-pointer"
                onClick={() => setShowFilters(true)}
                title="Show filters"
              />
            )}
            <input
              type="text"
              placeholder="Search products..."
              className="border border-gray-300 rounded border-solid px-2 py-1 h-14"
            />
          </div>
          <div className="grid gap-5 grid-cols-4">
            {products?.map((product) => (
              <div
                className="border border-gray-300 rounded border-solid flex flex-col gap-5 pb-2 cursor-pointer"
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.images[0]}
                  className="w-full h-52 p-2 rounded-md object-cover"
                  alt=""
                />
                <div className="px-2 flex flex-col">
                  <h1 className="text-lg font-semibold">{product.name}</h1>
                  <p className="text-sm">{product.description}</p>
                  <Divider />
                  <span className="text-xl font-semibold text-green-700">
                    ₹ {product.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
