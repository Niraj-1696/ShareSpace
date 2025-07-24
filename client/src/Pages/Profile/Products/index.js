import React from "react";
import { Button } from "antd";
import ProductsForm from "./ProductsForm";

function Products() {
  const [showProductForm, setShowProductForm] = React.useState(false);
  return (
    <div>
      <div className="flex justify-end">
        <Button type="default" onClick={() => setShowProductForm(true)}>
          Add Products
        </Button>
      </div>
      {showProductForm && (
        <ProductsForm
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
        />
      )}
    </div>
  );
}

export default Products;
