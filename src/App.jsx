import React, { useEffect, useMemo, useRef, useState } from 'react';
import { products } from './data/products';
import Product360 from './components/Product360/Product360';

const WHATSAPP = '5583991124238';
const INSTAGRAM = 'https://www.instagram.com/myphone.cg/';
const MAPS = 'https://www.google.com/maps/search/?api=1&query=Rua+Tavares+Cavalcante+160+Centro+Campina+Grande+PB';

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 }
    );
    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function Logo() {
  return (
    <a className="brand" href="#top" aria-label="My Phone - início">
      <img className="brand-symbol" src="/assets/brand/myphone-symbol.png" alt="" aria-hidden="true" />
      <span className="brand-word">my phone</span>
    </a>
  );
}

function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={`navbar navbar-expand-lg fixed-top my-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container nav-shell">
        <Logo />
        <button className="navbar-toggler border-0 shadow-none" type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open}>
          <span className="menu-lines"><i></i><i></i></span>
        </button>
        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <div className="navbar-nav mx-auto gap-lg-4">
            <a className="nav-link" href="#top" onClick={() => setOpen(false)}>Início</a>
            <a className="nav-link" href="#modelos" onClick={() => setOpen(false)}>iPhones</a>
            <a className="nav-link" href="#experiencia" onClick={() => setOpen(false)}>Experiência</a>
            <a className="nav-link" href="#loja" onClick={() => setOpen(false)}>Loja</a>
          </div>
          <a className="btn btn-brand rounded-pill px-4 btn-nav" target="_blank" rel="noreferrer"
             href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá! Vim pelo site da My Phone e quero saber quais aparelhos estão disponíveis.')}`}>
            <i className="bi bi-whatsapp me-2"></i> Falar no WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const visualRef = useRef(null);
  const motionRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, frame: 0 });
  useEffect(() => () => cancelAnimationFrame(motionRef.current.frame), []);
  const animate = () => {
    const motion = motionRef.current;
    motion.x += (motion.targetX - motion.x) * .08;
    motion.y += (motion.targetY - motion.y) * .08;
    const visual = visualRef.current;
    if (!visual) return;
    visual.style.setProperty('--mx', `${motion.x * 15}px`);
    visual.style.setProperty('--my', `${motion.y * 15}px`);
    visual.style.setProperty('--rx', `${-motion.y * 2}deg`);
    visual.style.setProperty('--ry', `${motion.x * 2}deg`);
    visual.style.setProperty('--back-x', `${motion.x * 8}px`);
    visual.style.setProperty('--back-y', `${motion.y * 8}px`);
    visual.style.setProperty('--glow-x', `${motion.x * 5}px`);
    visual.style.setProperty('--glow-y', `${motion.y * 5}px`);
    if (Math.abs(motion.targetX - motion.x) + Math.abs(motion.targetY - motion.y) > .001) {
      motion.frame = requestAnimationFrame(animate);
    } else motion.frame = 0;
  };
  const onMove = (event) => {
    const box = visualRef.current?.getBoundingClientRect();
    if (!box || window.innerWidth < 992 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    motionRef.current.targetX = x * 2;
    motionRef.current.targetY = y * 2;
    if (!motionRef.current.frame) motionRef.current.frame = requestAnimationFrame(animate);
  };
  const reset = () => {
    motionRef.current.targetX = 0;
    motionRef.current.targetY = 0;
    if (!motionRef.current.frame) motionRef.current.frame = requestAnimationFrame(animate);
  };

  return (
    <header className="hero-section" id="top">
      <div className="hero-grid"></div>
      <div className="hero-glow glow-a"></div><div className="hero-glow glow-b"></div>
      <div className="container hero-container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 hero-copy" data-reveal>
            <div className="hero-kicker">TECNOLOGIA QUE TE APROXIMA DO EXTRAORDINÁRIO</div>
            <h1>Os últimos <span>lançamentos</span> da Apple.</h1>
            <p className="hero-lead">Na My Phone você encontra uma experiência moderna para descobrir seu próximo iPhone e falar direto com quem entende.</p>
            <div className="d-flex flex-wrap gap-3 hero-actions">
              <a className="btn btn-brand btn-lg rounded-pill px-4" href="#modelos">Ver aparelhos <i className="bi bi-arrow-right ms-2"></i></a>
              <a className="btn btn-outline-brand btn-lg rounded-pill px-4" target="_blank" rel="noreferrer"
                 href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá! Vim pelo site da My Phone e quero consultar os iPhones disponíveis.')}`}>
                <i className="bi bi-whatsapp me-2"></i>Falar no WhatsApp
              </a>
            </div>
            <div className="hero-meta">
              <div><i className="bi bi-geo-alt"></i><span>Centro de Campina Grande</span></div>
              <div><i className="bi bi-stars"></i><span>Experiência premium</span></div>
              <div><i className="bi bi-chat-dots"></i><span>Atendimento direto</span></div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hero-visual" ref={visualRef} onMouseMove={onMove} onMouseLeave={reset} data-reveal>
              <div className="visual-halo halo-one"></div><div className="visual-halo halo-two"></div>
              <div className="brand-float">
                <img src="/assets/brand/myphone-symbol.png" alt="" aria-hidden="true" />
                <span><strong>My Phone</strong><small>Tecnologia. Confiança.<br/>Sempre com você.</small></span>
              </div>
              <div className="hero-slogan">Muito mais<br/>que um iPhone.<br/><strong>É a sua próxima história.</strong></div>
              <img src={products[0].image} alt="Linha iPhone em destaque" className="hero-phone" />
              <div className="phone-aura"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="marquee-wrap" aria-hidden="true">
        <div className="marquee-line">
          <span>MY PHONE</span><b>✦</b><span>IPHONE</span><b>✦</b><span>DESIGN</span><b>✦</b><span>TECNOLOGIA</span><b>✦</b><span>EXPERIÊNCIA</span><b>✦</b>
          <span>MY PHONE</span><b>✦</b><span>IPHONE</span><b>✦</b><span>DESIGN</span><b>✦</b><span>TECNOLOGIA</span><b>✦</b><span>EXPERIÊNCIA</span><b>✦</b>
        </div>
      </div>
    </header>
  );
}

function ProductCard({ product, onOpen }) {
  const cardRef = useRef(null);
  const frameRef = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);
  const tilt = (event) => {
    if (window.innerWidth < 992 || window.matchMedia('(prefers-reduced-motion: reduce)').matches || event.pointerType !== 'mouse') return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width - .5;
    const y = (event.clientY - r.top) / r.height - .5;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      cardRef.current?.style.setProperty('--card-rx', `${-y * 6}deg`);
      cardRef.current?.style.setProperty('--card-ry', `${x * 6}deg`);
      cardRef.current?.style.setProperty('--mouse-x', `${(x + .5) * 100}%`);
      cardRef.current?.style.setProperty('--mouse-y', `${(y + .5) * 100}%`);
      frameRef.current = 0;
    });
  };
  const reset = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    cardRef.current.style.setProperty('--card-rx', '0deg');
    cardRef.current.style.setProperty('--card-ry', '0deg');
  };
  return (
    <article className="product-card" ref={cardRef} onPointerMove={tilt} onPointerLeave={reset}>
      <div className="product-topline"><span>{product.badge}</span><i className="bi bi-arrow-up-right"></i></div>
      <div className="product-image-stage" style={{'--accent': product.accent}}><img src={product.image} alt={product.name}/></div>
      <div className="product-copy">
        <small>{product.eyebrow}</small>
        <h3>{product.name}</h3>
        <p>{product.display}</p>
      </div>
      <span className="product-link">Ver detalhes <i className="bi bi-arrow-right"></i></span>
      <button className="product-hit-area" type="button" onClick={() => onOpen(product)} aria-label={`Ver detalhes do ${product.name}`} />
    </article>
  );
}

function Catalog({ onOpen }) {
  return (
    <section className="section-pad catalog-section" id="modelos">
      <div className="container">
        <div className="section-heading" data-reveal>
          <div><span className="section-kicker">Destaques My Phone</span><h2>Destaques da <span>Apple.</span></h2></div>
          <p>Os iPhones que merecem sua atenção, apresentados com o mesmo cuidado visual que define a identidade da My Phone.</p>
        </div>
        <div className="product-grid" data-reveal>
          {products.map(product => <ProductCard key={product.id} product={product} onOpen={onOpen} />)}
        </div>
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section className="story-section" id="experiencia">
      <div className="container story-shell">
        <div className="row g-0 align-items-stretch">
          <div className="col-lg-6 story-dark d-flex align-items-center">
            <div className="story-content" data-reveal>
              <span className="section-kicker">MAIS QUE TECNOLOGIA</span>
              <h2>Uma conexão com o <span>seu mundo.</span></h2>
              <p>Explore modelos, compare capacidades e chegue ao atendimento já sabendo qual experiência faz sentido para você.</p>
              <div className="story-points">
                <div><span>01</span><p><strong>Descubra</strong> os modelos que mais combinam com você.</p></div>
                <div><span>02</span><p><strong>Compare</strong> tamanho, capacidade e acabamento.</p></div>
                <div><span>03</span><p><strong>Converse</strong> com a My Phone e consulte disponibilidade real.</p></div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 story-visual-wrap">
            <div className="story-visual" data-reveal>
              <div className="story-word">AIR</div>
              <img src={products[4].image} alt="iPhone Air em diferentes acabamentos"/>
              <div className="floating-label f-one"><span>5,64 mm*</span><small>design ultrafino</small></div>
              <div className="floating-label f-two"><span>4 acabamentos</span><small>uma estética só sua</small></div>
              <p className="micro-note">*Especificação do modelo apresentada pela Apple.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureBand() {
  const items = [
    ['bi-phone', 'Curadoria visual', 'Veja os aparelhos antes de iniciar o atendimento.'],
    ['bi-chat-dots', 'Atendimento direto', 'Um clique e você já está falando com a loja.'],
    ['bi-geo-alt', 'Loja física', 'No Centro de Campina Grande, perto de você.'],
    ['bi-sparkles', 'Experiência premium', 'Uma jornada digital à altura dos produtos.']
  ];
  return (
    <section className="feature-section section-pad-sm">
      <div className="container">
        <div className="row g-4">
          {items.map(([icon, title, text]) => <div className="col-sm-6 col-lg-3" key={title} data-reveal>
            <div className="feature-card"><i className={`bi ${icon}`}></i><h4>{title}</h4><p>{text}</p></div>
          </div>)}
        </div>
      </div>
    </section>
  );
}

function StoreSection() {
  return (
    <section className="store-section section-pad" id="loja">
      <div className="container">
        <div className="store-shell" data-reveal>
          <div className="store-copy">
            <span className="section-kicker">MY PHONE · CAMPINA GRANDE</span>
            <h2>Online para descobrir.<br/>Na loja para <span>decidir.</span></h2>
            <p>Visite a My Phone no Centro ou chame no WhatsApp para consultar aparelhos e condições.</p>
            <div className="store-info">
              <a href={MAPS} target="_blank" rel="noreferrer"><i className="bi bi-geo-alt"></i><span><small>Endereço</small>R. Tavares Cavalcante, 160 · Centro</span><b>↗</b></a>
              <a href={`tel:+${WHATSAPP}`}><i className="bi bi-telephone"></i><span><small>Telefone / WhatsApp</small>(83) 99112-4238</span><b>↗</b></a>
              <div><i className="bi bi-clock"></i><span><small>Horário</small>Seg–Sex 09h–20h · Sáb 09h–12h</span></div>
            </div>
          </div>
          <div className="store-card">
            <div className="store-grid-bg"></div>
            <div className="store-brand-card"><img src="/assets/brand/myphone-symbol.png" alt=""/><span><strong>my phone</strong><small>Campina Grande · PB</small></span></div>
            <div className="store-pin"><span className="pin-pulse"></span><i className="bi bi-geo-alt-fill"></i></div>
            <div className="store-card-footer"><span>Centro</span><strong>Campina Grande · PB</strong></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="container text-center" data-reveal>
        <img className="cta-mark" src="/assets/brand/myphone-symbol.png" alt="" aria-hidden="true" />
        <span className="section-kicker">SEU PRÓXIMO UPGRADE</span>
        <h2>Seu próximo iPhone.<br/><span>Sua próxima história.</span></h2>
        <p>Fale com a My Phone e consulte os modelos disponíveis agora.</p>
        <a className="btn btn-brand btn-lg rounded-pill px-5" target="_blank" rel="noreferrer" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá! Vim pelo site e quero consultar os iPhones disponíveis na My Phone.')}`}>
          Chamar no WhatsApp <i className="bi bi-whatsapp ms-2"></i>
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-top"><Logo/><div className="footer-links"><a href="#modelos">iPhones</a><a target="_blank" rel="noreferrer" href={INSTAGRAM}>Instagram</a><a target="_blank" rel="noreferrer" href={MAPS}>Como chegar</a></div></div><div className="footer-bottom"><span>My Phone · Campina Grande, PB</span><span>Vitrine digital · disponibilidade sob consulta.</span></div></div></footer>;
}

function ProductModal({ product, onClose }) {
  const [storage, setStorage] = useState(product?.storage?.[0] || '');
  const closeRef = useRef(null);
  useEffect(() => { if (product) setStorage(product.storage[0]); }, [product]);
  useEffect(() => {
    if (!product) return undefined;
    const previousFocus = document.activeElement;
    closeRef.current?.focus();
    const onKeyDown = event => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); previousFocus?.focus?.(); };
  }, [product, onClose]);
  useEffect(() => {
    document.body.style.overflow = product ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [product]);
  if (!product) return null;
  const message = `Olá! Vim pelo site da My Phone e tenho interesse no ${product.name} ${storage}. Pode me informar disponibilidade e condições?`;
  return (
    <div className="modal-backdrop-custom" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="product-modal" role="dialog" aria-modal="true" aria-label={`Detalhes do ${product.name}`}>
        <button className="modal-close" ref={closeRef} onClick={onClose} aria-label="Fechar"><i className="bi bi-x-lg"></i></button>
        <div className="modal-image" style={{'--accent': product.accent}}><img src={product.image} alt={product.name}/><span>{product.badge}</span></div>
        <div className="modal-copy">
          <span className="section-kicker">{product.eyebrow}</span>
          <h2>{product.name}</h2><p>{product.description}</p>
          <div className="modal-spec"><span>Tela</span><strong>{product.display}</strong></div>
          <label className="option-label">Escolha uma capacidade</label>
          <div className="storage-options">{product.storage.map(s => <button key={s} className={storage === s ? 'active' : ''} onClick={() => setStorage(s)}>{s}</button>)}</div>
          <div className="color-list"><span>Cores:</span> {product.colors.join(' · ')}</div>
          <a className="btn btn-brand btn-lg rounded-pill w-100" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">Consultar no WhatsApp <i className="bi bi-whatsapp ms-2"></i></a>
          <small className="availability-note">Disponibilidade, valores e condições são confirmados diretamente com a loja.</small>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  useReveal();
  const app = useMemo(() => <>
    <NavBar/><Hero/><Product360/><Catalog onOpen={setSelected}/><StorySection/><FeatureBand/><StoreSection/><FinalCTA/><Footer/>
  </>, []);
  return <>{app}<ProductModal product={selected} onClose={() => setSelected(null)}/></>;
}
