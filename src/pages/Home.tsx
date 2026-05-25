import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HomeLoader from '../components/HomeLoader';

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

const VALID_SORT = ['', 'asc', 'desc', 'name'] as const;

function parseCategoriesParam(value: string | null): number[] {
  if (!value) return [];
  return value
    .split(',')
    .map(s => parseInt(s.trim(), 10))
    .filter(n => !Number.isNaN(n) && n > 0);
}

function parseSortParam(value: string | null): string {
  if (!value || !VALID_SORT.includes(value as (typeof VALID_SORT)[number])) return '';
  return value;
}

function sortProducts<T extends { price: number; title: string }>(list: T[], order: string): T[] {
  if (!order) return list;
  const copy = [...list];
  if (order === 'asc') return copy.sort((a, b) => a.price - b.price);
  if (order === 'desc') return copy.sort((a, b) => b.price - a.price);
  if (order === 'name') return copy.sort((a, b) => a.title.localeCompare(b.title));
  return copy;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoriesParam = searchParams.get('categories') ?? '';
  const sortOrder = parseSortParam(searchParams.get('sort'));
  const selectedCategories = useMemo(
    () => parseCategoriesParam(categoriesParam || null),
    [categoriesParam]
  );

  const updateFilters = useCallback(
    (categories: number[], sort: string) => {
      const next = new URLSearchParams();
      if (categories.length > 0) next.set('categories', categories.join(','));
      if (sort) next.set('sort', sort);
      const nextStr = next.toString();
      const currentStr = searchParams.toString();
      if (nextStr === currentStr) return;
      setSearchParams(next, { replace: false });
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    fetch('https://api.escuelajs.co/api/v1/categories')
      .then(res => res.json())
      .then(data => {
        console.log('categories fetched', data);
        setCategories(data);
      })
      .catch(err => console.log('category fetch error', err));
  }, []);

  const fetchIdRef = useRef(0);

  useEffect(() => {
    const fetchId = ++fetchIdRef.current;
    const controller = new AbortController();
    setLoading(true);

    const url = 'https://api.escuelajs.co/api/v1/products?limit=40&offset=0';

    const finish = (list: Product[]) => {
      if (fetchId !== fetchIdRef.current) return;
      setProducts(list);
      setLoading(false);
    };

    const fail = () => {
      if (fetchId !== fetchIdRef.current) return;
      setLoading(false);
    };

    if (selectedCategories.length > 0) {
      const fetchPromises = selectedCategories.map(catId =>
        fetch(`https://api.escuelajs.co/api/v1/categories/${catId}/products?limit=20&offset=0`, {
          signal: controller.signal,
        }).then(r => r.json())
      );

      Promise.all(fetchPromises)
        .then(results => {
          let merged: Product[] = [];
          results.forEach(r => {
            merged = [...merged, ...r];
          });
          const unique = merged.filter(
            (p, idx, arr) => arr.findIndex(x => x.id === p.id) === idx
          );
          finish(unique);
        })
        .catch(err => {
          if (err instanceof Error && err.name === 'AbortError') return;
          console.log('fetch error', err);
          fail();
        });
    } else {
      fetch(url, { signal: controller.signal })
        .then(res => res.json())
        .then(data => finish(data))
        .catch(err => {
          if (err instanceof Error && err.name === 'AbortError') return;
          console.log('fetch error', err);
          fail();
        });
    }

    return () => controller.abort();
  }, [categoriesParam]);

  const displayProducts = useMemo(
    () => sortProducts(products, sortOrder),
    [products, sortOrder]
  );

  function toggleCategory(id: number) {
    const next = selectedCategories.includes(id)
      ? selectedCategories.filter(c => c !== id)
      : [...selectedCategories, id];
    updateFilters(next, sortOrder);
  }

  function setSortOrder(order: string) {
    updateFilters(selectedCategories, order);
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', paddingBottom: '80px' }}>
      <Navbar subtitle="Browse Products" />

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
            <HomeLoader />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {displayProducts.map(product => (
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

          {!loading && displayProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
              <p style={{ fontSize: '18px' }}>No products found</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
