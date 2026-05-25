import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, totalItems, totalValue } = useCart();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', paddingBottom: '80px' }}>
      <Navbar subtitle="Your Cart" />

      <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 24px' }}>
        {cartItems.length === 0 ? (
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '60px 24px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>🛒</p>
            <h2 style={{ margin: '0 0 8px 0', color: '#1a1a2e' }}>Your cart is empty</h2>
            <p style={{ margin: '0 0 24px 0', color: '#666' }}>Add some products to get started.</p>
            <Link
              to="/"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                backgroundColor: '#e94560',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h2 style={{ margin: 0, fontSize: '20px', color: '#1a1a2e' }}>
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </h2>
              <p style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#e94560' }}>
                Total: ${totalValue.toFixed(2)}
              </p>
            </div>

            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {cartItems.map(item => (
                <li
                  key={item.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                  }}
                >
                  <Link to={`/product/${item.id}/details`} style={{ flexShrink: 0 }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        display: 'block',
                      }}
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/80?text=No+Image';
                      }}
                    />
                  </Link>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      to={`/product/${item.id}/details`}
                      style={{
                        color: '#1a1a2e',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '16px',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      {item.title}
                    </Link>
                    <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#e94560', flexShrink: 0 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.title} from cart`}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: 'transparent',
                      color: '#e94560',
                      border: '1px solid #e94560',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div
              style={{
                marginTop: '24px',
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Order summary</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 800, color: '#1a1a2e' }}>
                  ${totalValue.toFixed(2)}
                </p>
              </div>
              <Link
                to="/"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#1a1a2e',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
