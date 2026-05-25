import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const linkBase: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 500,
  padding: '8px 14px',
  borderRadius: '6px',
  transition: 'background-color 0.2s ease',
};

export default function Navbar({ subtitle }: { subtitle?: string }) {
  const { totalItems, totalValue } = useCart();
  const location = useLocation();

  function isActive(path: string) {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }

  return (
    <header
      style={{
        backgroundColor: '#1a1a2e',
        color: 'white',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, letterSpacing: '1px' }}>
            ShopZone
          </h1>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Link
            to="/"
            style={{
              ...linkBase,
              backgroundColor: isActive('/') && location.pathname === '/' ? 'rgba(233, 69, 96, 0.35)' : 'transparent',
            }}
          >
            Home
          </Link>
          <Link
            to="/cart"
            style={{
              ...linkBase,
              backgroundColor: isActive('/cart') ? 'rgba(233, 69, 96, 0.35)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            Cart
            {totalItems > 0 && (
              <span
                style={{
                  backgroundColor: '#f5a623',
                  color: '#1a1a2e',
                  fontSize: '11px',
                  fontWeight: 700,
                  minWidth: '20px',
                  height: '20px',
                  padding: '0 6px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {subtitle && <span style={{ fontSize: '14px', color: '#ccc' }}>{subtitle}</span>}
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Cart total
          </p>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#e94560' }}>
            ${totalValue.toFixed(2)}
            {totalItems > 0 && (
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#ccc', marginLeft: '8px' }}>
                ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </span>
            )}
          </p>
        </div>
      </div>
    </header>
  );
}
