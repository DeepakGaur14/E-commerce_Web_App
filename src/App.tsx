import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id/details" element={<ProductDetail />} />
        </Routes>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
