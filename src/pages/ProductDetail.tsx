import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: {
    id: number;
    name: string;
  };
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    console.log('fetching product with id:', id);
    setLoading(true);
    fetch(`https://api.escuelajs.co/api/v1/products/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log('product detail:', data);
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.log('error fetching product', err);
        setLoading(false);
      });
  }, [id]);

  const alreadyInCart = cartItems.some(item => item.id === Number(id));

  function handleAddToCart() {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0]
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #e94560', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>Product not found</p>
          <button onClick={() => navigate('/')} style={{ marginTop: '12px', padding: '10px 24px', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', paddingBottom: '80px' }}>
      <header style={{
        backgroundColor: '#1a1a2e',
        color: 'white',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          &larr; Back to Home
        </button>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>ShopZone</h1>
        <div style={{ width: '120px' }}></div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '32px auto', padding: '0 24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', display: 'flex', gap: '0', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 45%', minWidth: '300px', padding: '24px', borderRight: '1px solid #f0f0f0' }}>
            <div style={{ height: '340px', overflow: 'hidden', borderRadius: '10px', backgroundColor: '#f9f9f9', marginBottom: '12px' }}>
              <img
                src={product.images[activeImage]}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease' }}
                onError={e => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x340?text=No+Image';
                }}
              />
            </div>
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    style={{
                      width: '60px',
                      height: '60px',
                      overflow: 'hidden',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: idx === activeImage ? '2px solid #e94560' : '2px solid transparent',
                      transition: 'border 0.2s ease'
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: '300px', padding: '32px 28px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              {product.category.name}
            </span>
            <h1 style={{ margin: '0 0 16px 0', fontSize: '26px', fontWeight: 700, color: '#1a1a2e', lineHeight: '1.3' }}>
              {product.title}
            </h1>
            <p style={{ margin: '0 0 24px 0', fontSize: '15px', color: '#555', lineHeight: '1.7', flex: 1 }}>
              {product.description}
            </p>

            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
              <p style={{ margin: '0 0 20px 0', fontSize: '32px', fontWeight: 800, color: '#e94560' }}>
                ${product.price.toFixed(2)}
              </p>

              <button
                onClick={handleAddToCart}
                disabled={alreadyInCart}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: alreadyInCart ? '#ccc' : added ? '#27ae60' : '#e94560',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: alreadyInCart ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s ease, transform 0.15s ease',
                  transform: added ? 'scale(0.98)' : 'scale(1)'
                }}
              >
                {alreadyInCart ? 'Already in Cart' : added ? 'Added!' : 'Add to My Cart'}
              </button>

              {alreadyInCart && (
                <p style={{ margin: '10px 0 0 0', textAlign: 'center', fontSize: '13px', color: '#888' }}>
                  This item is already in your cart
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
