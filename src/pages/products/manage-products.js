// pages/products/manage-products.js

import AddProduct from '../../app/components/shopping/AddProduct';
import SmartBlankLayout from '../../app/components/SmartBlankLayout';

const ManageProducts = () => {
  return (
    <SmartBlankLayout>
      <h1 className="text-2xl font-bold text-center">Manage Products</h1>
      <AddProduct />
    </SmartBlankLayout>
  );
};

export default ManageProducts;
