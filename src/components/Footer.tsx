import { useCart } from '../context/CartContext';

export default function Footer() {
  const { cartItems, totalItems, totalValue } = useCart();

  return (
    <footer style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#1a1a2e',
      color: 'white',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 200,
      boxShadow: '0 -2px 12px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          backgroundColor: '#e94560',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          position: 'relative'
        }}>
          <span>🛒</span>
          {totalItems > 0 && (
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              backgroundColor: '#f5a623',
              color: '#1a1a2e',
              fontSize: '10px',
              fontWeight: 700,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {totalItems}
            </span>
          )}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '13px', color: '#ccc' }}>
            {totalItems === 0 ? 'Your cart is empty' : `${totalItems} item${totalItems > 1 ? 's' : ''} in cart`}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {cartItems.length > 0 && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {cartItems.slice(0, 3).map(item => (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '11px', color: '#aaa' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px', marginBottom: '2px' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                x{item.quantity}
              </div>
            ))}
            {cartItems.length > 3 && (
              <span style={{ fontSize: '12px', color: '#aaa' }}>+{cartItems.length - 3} more</span>
            )}
          </div>
        )}

        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>Total</p>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#e94560' }}>
            ${totalValue.toFixed(2)}
          </p>
        </div>
      </div>
    </footer>
  );
}
