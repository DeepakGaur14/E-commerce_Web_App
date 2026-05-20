import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
  category: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://api.escuelajs.co/api/v1/categories')
      .then(res => res.json())
      .then(data => {
        console.log('categories fetched', data);
        setCategories(data);
      })
      .catch(err => console.log('category fetch error', err));
  }, []);

  useEffect(() => {
    setLoading(true);

    let url = 'https://api.escuelajs.co/api/v1/products?limit=40&offset=0';

    if (selectedCategories.length > 0) {
      const fetchPromises = selectedCategories.map(catId =>
        fetch(`https://api.escuelajs.co/api/v1/categories/${catId}/products?limit=20&offset=0`)
          .then(r => r.json())
      );

      Promise.all(fetchPromises).then(results => {
        let merged: Product[] = [];
        results.forEach(r => {
          merged = [...merged, ...r];
        });

        const unique = merged.filter((p, idx, arr) => arr.findIndex(x => x.id === p.id) === idx);
        const sorted = sortProducts(unique, sortOrder);
        console.log('products fetched by category', sorted);
        setProducts(sorted);
        setLoading(false);
      }).catch(err => {
        console.log('fetch error', err);
        setLoading(false);
      });
    } else {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          const sorted = sortProducts(data, sortOrder);
          console.log('all products fetched', sorted);
          setProducts(sorted);
          setLoading(false);
        })
        .catch(err => {
          console.log('fetch error', err);
          setLoading(false);
        });
    }
  }, [selectedCategories, sortOrder]);

  function sortProducts(list: Product[], order: string) {
    if (!order) return list;
    const copy = [...list];
    if (order === 'asc') return copy.sort((a, b) => a.price - b.price);
    if (order === 'desc') return copy.sort((a, b) => b.price - a.price);
    if (order === 'name') return copy.sort((a, b) => a.title.localeCompare(b.title));
    return copy;
  }

  function toggleCategory(id: number) {
    setSelectedCategories(prev => {
      if (prev.includes(id)) return prev.filter(c => c !== id);
      return [...prev, id];
    });
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
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, letterSpacing: '1px' }}>ShopZone</h1>
        <span style={{ fontSize: '14px', color: '#ccc' }}>Browse Products</span>
      </header>

      <div style={{ display: 'flex', gap: '24px', padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <aside style={{
          width: '220px',
          flexShrink: 0,
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          alignSelf: 'flex-start',
          position: 'sticky',
          top: '72px'
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#1a1a2e' }}>Filter by Category</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {categories.slice(0, 10).map(cat => (
              <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                />
                <span style={{ color: selectedCategories.includes(cat.id) ? '#e94560' : '#333' }}>{cat.name}</span>
              </label>
            ))}
          </div>

          <h2 style={{ margin: '20px 0 12px 0', fontSize: '16px', fontWeight: 700, color: '#1a1a2e' }}>Sort by Price</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Default', value: '' },
              { label: 'Price: Low to High', value: 'asc' },
              { label: 'Price: High to Low', value: 'desc' },
              { label: 'Name A-Z', value: 'name' }
            ].map(opt => (
              <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                <input
                  type="radio"
                  name="sort"
                  value={opt.value}
                  checked={sortOrder === opt.value}
                  onChange={() => setSortOrder(opt.value)}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ color: sortOrder === opt.value ? '#e94560' : '#333' }}>{opt.label}</span>
              </label>
            ))}
          </div>
        </aside>

        <main style={{ flex: 1 }}>
          {selectedCategories.length > 0 && (
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#666' }}>Active filters:</span>
              {selectedCategories.map(id => {
                const cat = categories.find(c => c.id === id);
                return (
                  <span key={id} style={{
                    backgroundColor: '#e94560',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {cat?.name}
                    <span onClick={() => toggleCategory(id)} style={{ cursor: 'pointer', fontWeight: 700 }}>x</span>
                  </span>
                );
              })}
            </div>
          )}

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {[1,2,3,4,5,6,7,8].map(n => (
                <div key={n} style={{ backgroundColor: 'white', borderRadius: '10px', padding: '16px', height: '280px', animation: 'pulse 1.5s ease-in-out infinite' }}>
                  <div style={{ backgroundColor: '#eee', height: '160px', borderRadius: '8px', marginBottom: '12px' }}></div>
                  <div style={{ backgroundColor: '#eee', height: '16px', borderRadius: '4px', marginBottom: '8px' }}></div>
                  <div style={{ backgroundColor: '#eee', height: '14px', borderRadius: '4px', width: '60%' }}></div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {products.map(product => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}/details`)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
                  }}
                >
                  <div style={{ height: '180px', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x180?text=No+Image';
                      }}
                    />
                  </div>
                  <div style={{ padding: '12px' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {product.category.name}
                    </p>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 600, color: '#1a1a2e', lineHeight: '1.3',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#e94560' }}>
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
              <p style={{ fontSize: '18px' }}>No products found</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
