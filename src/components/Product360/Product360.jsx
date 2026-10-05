import { useEffect, useRef, useState } from 'react';
import { products } from '../../data/products';
import './Product360.css';

const finishes = [
  { id: 'natural', label: 'Titânio natural', color: '#b6aba2' },
  { id: 'blue', label: 'Titânio azul', color: '#596b80' },
  { id: 'black', label: 'Titânio preto', color: '#444344' },
  { id: 'white', label: 'Titânio branco', color: '#dbdbd8' },
];

export default function Product360() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const pointerRef = useRef(null);
  const visibleRef = useRef(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [status, setStatus] = useState('loading');
  const [finish, setFinish] = useState('natural');
  const [interacted, setInteracted] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const preload = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setShouldLoad(true);
        preload.disconnect();
      }
    }, { rootMargin: '800px 0px' });
    const visibility = new IntersectionObserver(entries => {
      visibleRef.current = entries[0].isIntersecting;
      sceneRef.current?.setVisible(visibleRef.current);
    }, { threshold: .05 });
    preload.observe(section);
    visibility.observe(section);
    return () => { preload.disconnect(); visibility.disconnect(); };
  }, []);

  useEffect(() => {
    if (!shouldLoad) return undefined;
    let cancelled = false;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => sceneRef.current?.setReduced(media.matches);
    media.addEventListener('change', onMotionChange);
    import('./realPhoneScene.js').then(async ({ createPhoneScene }) => {
      if (cancelled) return;
      try {
        const scene = await createPhoneScene(canvasRef.current);
        if (cancelled) { scene.dispose(); return; }
        sceneRef.current = scene;
        scene.setReduced(media.matches);
        scene.setVisible(visibleRef.current);
        setStatus('ready');
      } catch (error) {
        console.warn('A visualização 3D não pôde ser iniciada.', error);
        setStatus('fallback');
      }
    }).catch(() => { if (!cancelled) setStatus('fallback'); });
    return () => {
      cancelled = true;
      media.removeEventListener('change', onMotionChange);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [shouldLoad]);

  function beginDrag(event) {
    if (!sceneRef.current || pointerRef.current || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const now = performance.now();
    pointerRef.current = { id: event.pointerId, x: event.clientX, time: now };
    stageRef.current.setPointerCapture(event.pointerId);
    sceneRef.current.startDrag(now);
    setInteracted(true);
    setDragging(true);
  }
  function moveDrag(event) {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    const now = performance.now();
    sceneRef.current?.drag(event.clientX - pointer.x, now - pointer.time, now);
    pointer.x = event.clientX;
    pointer.time = now;
  }
  function endDrag(event) {
    if (pointerRef.current?.id !== event.pointerId) return;
    pointerRef.current = null;
    sceneRef.current?.endDrag(performance.now());
    if (stageRef.current?.hasPointerCapture(event.pointerId)) stageRef.current.releasePointerCapture(event.pointerId);
    setDragging(false);
  }
  function onKeyDown(event) {
    if (status !== 'ready' || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    sceneRef.current?.step(event.key === 'ArrowRight' ? 1 : -1, performance.now());
    setInteracted(true);
  }
  function selectFinish(id) {
    setFinish(id);
    sceneRef.current?.setColor(id);
  }

  return (
    <section className="product-360-section" id="iphone-360" ref={sectionRef} aria-labelledby="product-360-title">
      <div className="container product-360-shell">
        <div className="product-360-copy" data-reveal>
          <span className="section-kicker">EXPLORE CADA DETALHE</span>
          <h2 id="product-360-title">Cada detalhe.<br />De todos os <span>ângulos.</span></h2>
          <p>Arraste o aparelho e explore cada detalhe do design.</p>
          <div className="product-360-meta"><span className="meta-line" />Uma experiência para olhar mais de perto</div>
          <a className="btn btn-brand rounded-pill px-4 product-360-cta" href="#modelos">Ver aparelhos <i className="bi bi-arrow-right ms-2" aria-hidden="true" /></a>
        </div>
        <div className="product-360-display" data-reveal>
          <div className="product-360-orbit" aria-hidden="true" />
          <div className="product-360-shadow" aria-hidden="true" />
          <div
            className={`product-360-stage ${dragging ? 'is-dragging' : ''} ${status === 'fallback' ? 'has-fallback' : ''}`}
            ref={stageRef}
            tabIndex={status === 'ready' ? 0 : -1}
            role="img"
            aria-label={status === 'ready' ? 'Visualização interativa do iPhone. Arraste ou use as setas para girar o aparelho.' : 'Imagem de iPhone em destaque'}
            onPointerDown={beginDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onLostPointerCapture={endDrag}
            onKeyDown={onKeyDown}
          >
            <canvas ref={canvasRef} className="product-360-canvas" aria-hidden="true" style={{ opacity: status === 'ready' ? 1 : 0 }} />
            {status !== 'ready' && <div className="product-360-placeholder">
              <img src={products[2].image} alt="" width="560" height="560" />
              {status === 'loading' && <div className="product-360-loading" role="status"><span>Preparando experiência</span><i /></div>}
              {status === 'fallback' && <span className="product-360-fallback-note">Explore os modelos na vitrine abaixo</span>}
            </div>}
          </div>
          <div className={`product-360-hint ${interacted || status !== 'ready' ? 'is-hidden' : ''}`} aria-hidden="true"><i className="bi bi-arrow-left-right" /> Arraste para explorar</div>
          {status === 'ready' && <div className="product-360-finishes" role="group" aria-label="Acabamento da visualização">
            <span>ACABAMENTO</span>
            <div>{finishes.map(item => <button
              key={item.id}
              type="button"
              className={finish === item.id ? 'is-selected' : ''}
              onClick={() => selectFinish(item.id)}
              aria-label={item.label}
              aria-pressed={finish === item.id}
              title={item.label}
              style={{ '--finish': item.color }}
            ><i /></button>)}</div>
            <small>{finishes.find(item => item.id === finish)?.label}</small>
          </div>}
          {status === 'ready' && <small className="product-360-disclaimer">iPhone 15 Pro Max · <a href="https://sketchfab.com/3d-models/iphone-15-pro-max-5b7b35513a154ac69619dc2b2fe15686" target="_blank" rel="noreferrer">Modelo 3D: MajdyModels (CC BY 4.0)</a></small>}
        </div>
      </div>
    </section>
  );
}
