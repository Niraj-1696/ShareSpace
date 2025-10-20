import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Divider, message } from "antd";
import { GetProducts } from "../../apicalls/products";
import { Setloader } from "../../Redux/loadersSlice";
import { useNavigate } from "react-router-dom";

function Home() {
  const [products, setProducts] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(Setloader(true));
      const response = await GetProducts({ status: "approved" });
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
  }, []);
  const { user } = useSelector((state) => state.users);
  return (
    <div>
      <div className="grid grid-cols-5 gap-5">
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
  );
}

export default Home;
