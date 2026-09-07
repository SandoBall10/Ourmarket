import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from './layout/AppNavbar';
import './Principal.css';

type SearchMode = 'comprar' | 'vender';

const quickLinks = [
  { icon: 'fa-coins', title: 'Obtén tu crédito hipotecario', copy: 'Simula tu cuota fácil, rápido y 100% online.', path: '/compradores' },
  { icon: 'fa-file-lines', title: 'Guía para comprar', copy: 'Todo lo que necesitas saber en un solo lugar.', path: '/compradores' },
  { icon: 'fa-bullhorn', title: 'Conoce InmoMarket', copy: 'Información, consejos y mucho más.', path: '/conocenos' },
];

const properties = [
  {
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tag: 'DESTACADO', title: 'Moderno departamento en San Isidro', location: 'San Isidro, Lima',
    beds: 3, baths: 2, area: '120 m²', price: 'US$ 245,000',
  },
  {
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    tag: 'CON PISCINA', title: 'Casa familiar con jardín en La Molina', location: 'La Molina, Lima',
    beds: 4, baths: 4, area: '250 m²', price: 'US$ 520,000',
  },
  {
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85',
    tag: 'TERRENO', title: 'Terreno en condominio exclusivo', location: 'Cieneguilla, Lima',
    area: '500 m²', price: 'US$ 180,000',
  },
];

const benefits = [
  { icon: 'fa-magnifying-glass', title: 'Búsqueda clara y rápida', copy: 'Encuentra el inmueble ideal con filtros avanzados y mapas interactivos.' },
  { icon: 'fa-user', title: 'Tienes tu propia sección', copy: 'Accede a favoritos, alertas, seguimiento y gestiona tus anuncios.' },
  { icon: 'fa-building', title: 'Variedad de anunciantes', copy: 'Inmobiliarias y dueños directos en un solo lugar, con más opciones para ti.' },
  { icon: 'fa-shield-halved', title: '¡Somos InmoMarket!', copy: 'Una plataforma confiable para tu próxima casa o terreno.' },
];

const Principal: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<SearchMode>('comprar');
  const [propertyType, setPropertyType] = useState('Departamento');
  const [query, setQuery] = useState('');
  const [favoriteIndexes, setFavoriteIndexes] = useState<number[]>([]);
  const [subscribed, setSubscribed] = useState(false);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === 'vender') {
      navigate('/vender');
      return;
    }
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    params.set('tipo', propertyType.toLowerCase());
    navigate(`/buscar?${params.toString()}`);
  };

  const toggleFavorite = (index: number) => {
    setFavoriteIndexes((current) => current.includes(index)
      ? current.filter((favorite) => favorite !== index)
      : [...current, index]);
  };

  return (
    <div className="inmo-home">
      <AppNavbar />

      <main>
        <section className="home-hero" aria-labelledby="hero-title">
          <div className="home-shell hero-content">
            <p className="hero-kicker">MÁS QUE PROPIEDADES, MEJORES HISTORIAS</p>
            <h1 id="hero-title">Encuentra tu hogar<span>con confianza</span></h1>
            <p className="hero-copy">Miles de propiedades en un solo lugar. Compra, vende o alquila de forma simple, segura y rápida.</p>

            <form className="property-search" onSubmit={handleSearch}>
              <div className="search-modes" aria-label="Tipo de operación">
                <button type="button" className={mode === 'comprar' ? 'active' : ''} onClick={() => setMode('comprar')} aria-pressed={mode === 'comprar'}>Comprar</button>
                <button type="button" className={mode === 'vender' ? 'active' : ''} onClick={() => setMode('vender')} aria-pressed={mode === 'vender'}>Vender</button>
              </div>

              <div className="search-fields">
                <label className="search-control search-select">
                  <i className="fa-solid fa-house-chimney" aria-hidden="true" />
                  <span className="visually-hidden">Tipo de propiedad</span>
                  <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
                    <option>Departamento</option><option>Casa</option><option>Terreno</option>
                  </select>
                </label>
                <label className="search-control search-location">
                  <i className="fa-solid fa-location-dot" aria-hidden="true" />
                  <span className="visually-hidden">Ubicación o características</span>
                  <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={mode === 'comprar' ? 'Ubicación o características (ej: piscina, 3 dorm)' : 'Ubicación de tu propiedad'} />
                </label>
                <button type="submit" className="search-submit"><i className="fa-solid fa-magnifying-glass" aria-hidden="true" />{mode === 'comprar' ? 'Buscar' : 'Publicar'}</button>
              </div>
            </form>
          </div>
        </section>

        <section className="brand-strip" aria-label="Marcas que confían en nosotros">
          <div className="home-shell">
            <p className="strip-label">MARCAS QUE CONFÍAN EN NOSOTROS</p>
            <div className="brand-list" aria-hidden="true">
              <span className="brand-bcp">BCP</span><span>Interbank</span><span>Scotiabank</span><span className="brand-bbva">BBVA</span><span className="brand-asei">asei</span><span>Urbania</span>
            </div>
          </div>
        </section>

        <section className="quick-section" aria-label="Accesos rápidos">
          <div className="home-shell quick-grid">
            {quickLinks.map((item) => (
              <button className="quick-card" key={item.title} onClick={() => navigate(item.path)}>
                <span className="quick-icon"><i className={`fa-solid ${item.icon}`} aria-hidden="true" /></span>
                <span className="quick-text"><strong>{item.title}</strong><small>{item.copy}</small></span>
                <span className="round-arrow" aria-hidden="true"><i className="fa-solid fa-arrow-right" /></span>
              </button>
            ))}
          </div>
        </section>

        <section className="featured-section" aria-labelledby="featured-title">
          <div className="home-shell">
            <div className="section-heading-row">
              <div><p className="section-kicker">PROPIEDADES DESTACADAS</p><h2 id="featured-title">Inmuebles que te pueden interesar</h2></div>
              <button className="text-link" onClick={() => navigate('/buscar')}>Ver más propiedades <i className="fa-solid fa-arrow-right" aria-hidden="true" /></button>
            </div>

            <div className="property-grid">
              {properties.map((property, index) => {
                const isFavorite = favoriteIndexes.includes(index);
                return (
                  <article className="property-card" key={property.title}>
                    <div className="property-image-wrap">
                      <img src={property.image} alt={property.title} className="property-image" />
                      <span className="property-tag">{property.tag}</span>
                      <button className={`favorite-button ${isFavorite ? 'saved' : ''}`} onClick={() => toggleFavorite(index)} aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'} aria-pressed={isFavorite}>
                        <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart`} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="property-body">
                      <h3>{property.title}</h3>
                      <p className="property-location"><i className="fa-solid fa-location-dot" aria-hidden="true" /> {property.location}</p>
                      <div className="property-meta">
                        {property.beds && <span><i className="fa-solid fa-bed" aria-hidden="true" /> {property.beds}</span>}
                        {property.baths && <span><i className="fa-solid fa-bath" aria-hidden="true" /> {property.baths}</span>}
                        <span><i className="fa-regular fa-square" aria-hidden="true" /> {property.area}</span>
                      </div>
                      <div className="property-footer"><strong>{property.price}</strong><button onClick={() => navigate('/buscar')} aria-label={`Ver ${property.title}`}><i className="fa-solid fa-arrow-right" aria-hidden="true" /></button></div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="benefits-section" aria-labelledby="benefits-title">
          <div className="home-shell benefits-layout">
            <div className="benefits-intro">
              <p className="section-kicker">TU ALIADO EN TODO EL PROCESO</p>
              <h2 id="benefits-title">Te acompañamos <span>en cada paso</span></h2>
              <p>Te brindamos herramientas, recursos y asesoría para que tomes la mejor decisión.</p>
              <button className="primary-link" onClick={() => navigate('/conocenos')}>Conoce más <i className="fa-solid fa-arrow-right" aria-hidden="true" /></button>
            </div>
            <div className="benefit-grid">
              {benefits.map((benefit) => (
                <article className="benefit-card" key={benefit.title}>
                  <span className="benefit-icon"><i className={`fa-solid ${benefit.icon}`} aria-hidden="true" /></span>
                  <h3>{benefit.title}</h3><p>{benefit.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="inmo-footer">
        <div className="home-shell footer-grid">
          <div className="footer-brand-column">
            <div className="footer-logo"><img src="/inmoicon.png" alt="" /><span>InmoMarket</span></div>
            <p>La plataforma inmobiliaria que conecta a compradores y vendedores para hacer realidad sus sueños inmobiliarios.</p>
            <div className="social-links" aria-label="Redes sociales">
              <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f" /></a><a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a><a href="#" aria-label="X"><i className="fa-brands fa-x-twitter" /></a><a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in" /></a><a href="#" aria-label="YouTube"><i className="fa-brands fa-youtube" /></a>
            </div>
          </div>
          <div className="footer-column"><h3>Comprar</h3><button onClick={() => navigate('/buscar?tipo=departamento')}>Departamentos</button><button onClick={() => navigate('/buscar?tipo=casa')}>Casas</button><button onClick={() => navigate('/buscar?tipo=terreno')}>Terrenos</button></div>
          <div className="footer-column"><h3>Vender</h3><button onClick={() => navigate('/vender')}>Publicar Propiedad</button><button onClick={() => navigate('/vendedores')}>Consejos de Venta</button><button onClick={() => navigate('/vendedores')}>Valoración de Inmuebles</button></div>
          <div className="footer-newsletter-column">
            <h3>Suscríbete</h3><p>Recibe las mejores ofertas inmobiliarias en tu correo.</p>
            <form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); setSubscribed(true); }}>
              <label className="visually-hidden" htmlFor="newsletter-email">Tu correo electrónico</label>
              <input id="newsletter-email" required type="email" placeholder="Tu correo electrónico" /><button type="submit">Suscribirte</button>
            </form>
            {subscribed && <p className="newsletter-success" role="status">¡Gracias! Pronto recibirás novedades.</p>}
          </div>
        </div>
        <div className="home-shell footer-bottom"><p>© {new Date().getFullYear()} InmoMarket. Todos los derechos reservados.</p><div><a href="#">Términos y condiciones</a><a href="#">Política de privacidad</a></div></div>
      </footer>
    </div>
  );
};

export default Principal;
