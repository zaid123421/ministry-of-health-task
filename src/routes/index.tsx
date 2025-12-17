import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login/login';
import Products from '../pages/products/Products';
import ProductDetails from '../pages/products/ProductDetails';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../components/layout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/login" />} />
      
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
        </Route>
      </Route>

    </Routes>
  );
}