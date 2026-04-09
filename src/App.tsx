import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
