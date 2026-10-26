'use strict';

const app = document.getElementById('app');
const LANGUAGE_KEY = 'artflow-language';
const COLORS = [
  { id: 'Beige', fr: 'Beige', ar: 'بيج', hex: '#DCC9A7' },
  { id: 'Blanc', fr: 'Blanc', ar: 'أبيض', hex: '#FFFFFF' },
  { id: 'Noir', fr: 'Noir', ar: 'أسود', hex: '#25212B' },
  { id: 'Gris', fr: 'Gris', ar: 'رمادي', hex: '#929198' },
  { id: 'Marron', fr: 'Marron', ar: 'بني', hex: '#855D43' },
  { id: 'Bleu', fr: 'Bleu', ar: 'أزرق', hex: '#4477C8' },
  { id: 'Vert', fr: 'Vert', ar: 'أخضر', hex: '#4F8C68' },
  { id: 'Rouge', fr: 'Rouge', ar: 'أحمر', hex: '#C8534B' },
  { id: 'Orange', fr: 'Orange', ar: 'برتقالي', hex: '#DE8A3D' },
  { id: 'Jaune / doré', fr: 'Jaune / doré', ar: 'أصفر / ذهبي', hex: '#D5AD4C' },
  { id: 'Rose', fr: 'Rose', ar: 'وردي', hex: '#D98FA8' },
  { id: 'Violet', fr: 'Violet', ar: 'بنفسجي', hex: '#8B6CC2' },
  { id: 'Multicolore', fr: 'Multicolore', ar: 'متعدد الألوان', hex: null }
];
const state = {
  lang: getSavedLanguage(), route: { type: 'home' }, search: '',
  categoryFilters: [], colorFilter: null, sort: 'relevance', visibleLimit: 24,
  showFilters: false, showMobileMenu: false, pendingFocus: null
};
let artworks = [];
let categories = [];
let store = {};
let booted = false;

function getSavedLanguage() {
  try { return localStorage.getItem(LANGUAGE_KEY) === 'ar' ? 'ar' : 'fr'; }
  catch (_) { return 'fr'; }
}
function isAr() { return state.lang === 'ar'; }
function t(fr, ar) { return isAr() ? ar : fr; }
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function icon(name, extra = '') {
  const paths = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    filter: '<path d="M4 7h16M7 12h10m-7 5h4"/><circle cx="8" cy="7" r="1"/><circle cx="15" cy="12" r="1"/>',
    x: '<path d="m18 6-12 12M6 6l12 12"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    whatsapp: '<path d="M20.5 11.7a8.3 8.3 0 0 1-12.3 7.2L3 20l1.2-5A8.3 8.3 0 1 1 20.5 11.7Z"/><path d="M8 8.1c.2-.5.5-.5.8-.5h.4c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.5.6c-.2.2-.2.4 0 .7.4.7 1.1 1.4 1.8 1.8.3.2.5.2.7 0l.7-.8c.2-.2.4-.2.7-.1l1.5.7c.3.1.4.3.4.5 0 .5-.2 1.2-.7 1.5-.5.4-1.2.7-2 .5-1.1-.2-2.5-.9-3.7-2.1S7.1 10.8 7 9.7c-.1-.7.3-1.2 1-1.6Z"/>',
    heart: '<path d="M20.8 8.8c0 5.1-8.8 10-8.8 10s-8.8-4.9-8.8-10a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z"/>',
    shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    sparkle: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z"/>',
    eye: '<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.5"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 1.4-3.4 1.8 1.8 0 0 1 1.3-3.1h1.6A3.5 3.5 0 0 0 21 11C21 6.6 17 3 12 3Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="14.5" cy="7.5" r="1"/>',
    house: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1Z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="m18 6-12 12M6 6l12 12"/>',
    leaf: '<path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 8-8 8-16Z"/><path d="M4 21c3-6 7-9 12-12"/>',
    book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 1 4 17.5Z"/><path d="M4 16a2.5 2.5 0 0 1 2.5-2.5H20"/>',
    location: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
    sort: '<path d="M4 7h12M4 12h8M4 17h4M19 5v14m-3-3 3 3 3-3"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 10v6m4-6v6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    truck: '<path d="M3 6h11v11H3zM14 10h4l3 3v4h-7"/><circle cx="7.5" cy="18" r="1.5"/><circle cx="17.5" cy="18" r="1.5"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9a7 7 0 0 1 11.7-2L20 12M4 12l2.8 5a7 7 0 0 0 11.7-2"/>',
  };
  return `<svg ${extra} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.sparkle}</svg>`;
}
function normalize(value) {
  return String(value ?? '')
    .toLocaleLowerCase('fr')
    .normalize('NFD').replace(/[\u0300-\u036f\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه').replace(/ك/g, 'ک')
    .replace(/[\u200e\u200f\u202a-\u202e]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}
function titleFor(art) { return isAr() ? art.titleAr : art.titleFr; }
function categoryName(cat) { return cat ? (isAr() ? cat.ar : cat.fr) : ''; }
function getCategory(id) { return categories.find((c) => c.id === id); }
function colorInfo(id) { return COLORS.find((c) => c.id === id) || COLORS[COLORS.length - 1]; }
function colorName(id) { const info = colorInfo(id); return isAr() ? info.ar : info.fr; }
function colorStyle(id) {
  const c = colorInfo(id);
  return c.hex ? `style="background:${c.hex}"` : 'data-multi="true"';
}
function hasConfiguredPrice() {
  return store.productPriceMAD !== null && store.productPriceMAD !== '' && Number.isFinite(Number(store.productPriceMAD)) && Number(store.productPriceMAD) > 0;
}
function formatPrice() {
  return hasConfiguredPrice()
    ? `${new Intl.NumberFormat(isAr() ? 'ar-MA' : 'fr-MA', { maximumFractionDigits: 0 }).format(Number(store.productPriceMAD))} ${t('DH', 'درهم')}`
    : t(store.priceDisplayFallbackFr || 'Prix communiqué sur WhatsApp', store.priceDisplayFallbackAr || 'السعر عبر واتساب');
}
function formatDimensions() {
  return String(store.productDimensions || '').trim() || t(store.dimensionsFallbackFr || 'Format à confirmer avec nous', store.dimensionsFallbackAr || 'يرجى تأكيد المقاس معنا');
}
function whatsappUrl(art, general = false) {
  const number = String(store.whatsappNumber || '212627025271').replace(/\D/g, '');
  let message;
  if (general || !art) {
    message = t('Bonjour Artflow, je souhaite en savoir plus sur vos tableaux et les modalités de commande.', 'السلام عليكم آرت فلو، أود معرفة المزيد عن اللوحات وكيفية الطلب.');
  } else if (isAr()) {
    const details = [];
    if (hasConfiguredPrice()) details.push(`السعر: ${formatPrice()}`);
    if (String(store.productDimensions || '').trim()) details.push(`المقاس: ${formatDimensions()}`);
    message = `السلام عليكم، أرغب في طلب اللوحة «${art.titleAr}» (المرجع ${art.id}). ${details.length ? details.join('، ') + '. ' : ''}المرجو تأكيد ${details.length === 2 ? 'التوفر وتفاصيل التوصيل' : 'السعر والمقاس والتوفر وتفاصيل التوصيل'}.`;
  } else {
    const details = [];
    if (hasConfiguredPrice()) details.push(`prix : ${formatPrice()}`);
    if (String(store.productDimensions || '').trim()) details.push(`dimensions : ${formatDimensions()}`);
    message = `Bonjour, je souhaite commander le tableau « ${art.titleFr} » (référence ${art.id}). ${details.length ? details.join(' ; ') + '. ' : ''}Merci de me confirmer ${details.length === 2 ? 'sa disponibilité et les modalités de livraison' : 'le prix, le format, la disponibilité et les modalités de livraison'}.`;
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
function routeHref(type, value = '') {
  const map = { home: '#/', all: '#/oeuvres', about: '#/a-propos', contact: '#/contact' };
  if (type === 'category') return `#/categorie/${encodeURIComponent(value)}`;
  if (type === 'art') return `#/oeuvre/${encodeURIComponent(value)}`;
  return map[type] || '#/';
}
function getArtBySlug(slug) { return artworks.find((a) => a.slug === slug || a.id === slug); }
function parseRoute() {
  const hash = (location.hash || '#/').replace(/^#\/?/, '').split('?')[0];
  const parts = hash.split('/').filter(Boolean).map((p) => decodeURIComponent(p));
  if (!parts.length) return { type: 'home' };
  if (parts[0] === 'oeuvres') return { type: 'all' };
  if (parts[0] === 'categorie' && parts[1]) return getCategory(parts[1]) ? { type: 'category', categoryId: parts[1] } : { type: 'not-found' };
  if (parts[0] === 'oeuvre' && parts[1]) return getArtBySlug(parts[1]) ? { type: 'art', slug: parts[1] } : { type: 'not-found' };
  if (parts[0] === 'a-propos') return { type: 'about' };
  if (parts[0] === 'contact') return { type: 'contact' };
  return { type: 'not-found' };
}
function syncDirection() {
  const skip = document.getElementById('skip-link');
  if (skip) skip.textContent = t('Passer au contenu', 'انتقل إلى المحتوى');
  document.documentElement.lang = isAr() ? 'ar' : 'fr';
  document.documentElement.dir = isAr() ? 'rtl' : 'ltr';
  document.body.setAttribute('dir', isAr() ? 'rtl' : 'ltr');
  document.body.classList.toggle('dialog-open', state.showFilters);
}
function setLanguage(lang) {
  state.lang = lang === 'ar' ? 'ar' : 'fr';
  try { localStorage.setItem(LANGUAGE_KEY, state.lang); } catch (_) { /* local storage may be disabled */ }
  render();
}
function allActiveColors() {
  const used = new Set(artworks.map((a) => a.dominantColor));
  return COLORS.filter((c) => used.has(c.id));
}
function searchableText(art) {
  const relatedCategories = art.categories.map((id) => {
    const c = getCategory(id); return c ? `${c.fr} ${c.ar} ${c.source}` : id;
  });
  return normalize([
    art.titleFr, art.titleAr, art.slug, art.id,
    ...(art.keywordsFr || []), ...(art.keywordsAr || []),
    ...(art.originalFilenames || []), ...(art.originalPaths || []), ...relatedCategories
  ].join(' '));
}
function filterArtwork(list, opts = {}) {
  const query = normalize(state.search);
  let filtered = list.filter((art) => {
    if (opts.categoryId && !art.categories.includes(opts.categoryId)) return false;
    if (state.categoryFilters.length && !opts.categoryId && !state.categoryFilters.some((id) => art.categories.includes(id))) return false;
    if (state.colorFilter && art.dominantColor !== state.colorFilter) return false;
    if (query && !searchableText(art).includes(query)) return false;
    return true;
  });
  if (state.sort === 'az') filtered.sort((a, b) => a.titleFr.localeCompare(b.titleFr, 'fr'));
  else if (state.sort === 'za') filtered.sort((a, b) => b.titleFr.localeCompare(a.titleFr, 'fr'));
  else if (state.sort === 'relevance' && query) {
    filtered.sort((a, b) => {
      const q = query;
      const score = (art) => {
        const title = normalize(`${art.titleFr} ${art.titleAr}`);
        return title === q ? 0 : title.startsWith(q) ? 1 : title.includes(q) ? 2 : 3;
      };
      return score(a) - score(b) || a.titleFr.localeCompare(b.titleFr, 'fr');
    });
  }
  return filtered;
}
function productCard(art) {
  const cats = art.categories.map(getCategory).filter(Boolean);
  const firstCat = cats[0];
  const displayName = titleFor(art);
  return `<article class="art-card" data-art-id="${esc(art.id)}">
    <a class="art-card-media" href="${routeHref('art', art.slug)}" aria-label="${esc(t('Voir l’œuvre : ', 'عرض اللوحة: '))}${esc(displayName)}">
      <img src="${esc(art.image)}" alt="${esc(isAr() ? art.altAr : art.altFr)}" loading="lazy" decoding="async" width="${Number(art.width) || 800}" height="${Number(art.height) || 800}" onerror="this.onerror=null;this.style.opacity='.15';this.alt='${esc(t('Image indisponible', 'الصورة غير متاحة'))}'">
      <span class="art-card-label"><span class="color-dot" ${colorStyle(art.dominantColor)} aria-hidden="true"></span>${esc(colorName(art.dominantColor))}</span>
    </a>
    <div class="art-card-body">
      ${firstCat ? `<span class="art-card-category">${esc(categoryName(firstCat))}</span>` : ''}
      <h3 class="art-card-title"><a href="${routeHref('art', art.slug)}">${esc(displayName)}</a></h3>
      <div class="art-card-footer"><span class="art-card-price">${esc(formatPrice())}</span><div class="art-card-actions">
        <a class="art-card-action" href="${routeHref('art', art.slug)}" aria-label="${esc(t('Voir les détails', 'عرض التفاصيل'))}" title="${esc(t('Voir les détails', 'عرض التفاصيل'))}">${icon('eye')}</a>
        <a class="art-card-action" href="${whatsappUrl(art)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t('Commander via WhatsApp', 'اطلب عبر واتساب'))}" title="${esc(t('Commander via WhatsApp', 'اطلب عبر واتساب'))}">${icon('whatsapp')}</a>
      </div></div>
    </div>
  </article>`;
}
const COVER_HINTS = {
  abstrait: ['Artboard 1.jpg', 'Abstract-side-a.jpg', 'Artboard'],
  animaux: ["Tiger's-Face.jpg", 'Tiger', 'Lion'],
  islamique: ['Artboard 1 copy 3.jpg', 'Artboard', 'Zellij'],
  'culture-marocaine': ['Chafchaouen.jpg', 'Chefchaouen', 'Morocco'],
  minimalisme: ['Minimalist-Mountains.jpg', 'Minimalist', 'minimal'],
  nature: ['Sakura-tree-painting.jpg', 'Sakura', 'Flower']
};
function categoryCoverArt(cat) {
  const hints = COVER_HINTS[cat.id] || [];
  for (const hint of hints) {
    const found = artworks.find((a) => a.categories.includes(cat.id) && (a.originalFilenames || []).some((file) => file.toLowerCase().includes(hint.toLowerCase())));
    if (found) return found;
  }
  return artworks.find((a) => a.categories.includes(cat.id));
}
function categoryCard(cat, index) {
  const art = categoryCoverArt(cat);
  const count = artworks.filter((a) => a.categories.includes(cat.id)).length;
  return `<a class="category-card" href="${routeHref('category', cat.id)}" aria-label="${esc(t('Explorer la catégorie ', 'تصفح فئة '))}${esc(categoryName(cat))}">
    <div class="category-card-media">${art ? `<img src="${esc(art.image)}" alt="${esc(isAr() ? art.altAr : art.altFr)}" loading="lazy" decoding="async">` : ''}</div>
    <div class="category-card-content"><span class="category-count">${String(index + 1).padStart(2, '0')} / ${String(categories.length).padStart(2, '0')}</span>
      <h3>${esc(categoryName(cat))}</h3><p>${esc(isAr() ? cat.intro_ar : cat.intro_fr)}</p>
      <span class="category-go">${esc(t('Explorer la collection', 'اكتشف المجموعة'))} ${icon('arrow')}</span>
      <span class="category-count">${count} ${esc(t('œuvres', 'لوحات'))}</span>
    </div></a>`;
}
function sectionHeading(kicker, heading, copy, link = '') {
  return `<div class="section-heading"><div class="heading-copy"><div class="section-kicker">${esc(kicker)}</div><h2>${heading}</h2><p>${esc(copy)}</p></div>${link}</div>`;
}
function siteHeader() {
  const active = state.route.type === 'all' ? 'all' : state.route.type === 'about' ? 'about' : state.route.type === 'contact' ? 'contact' : 'home';
  const nav = [
    ['home', t('Accueil', 'الرئيسية'), routeHref('home')],
    ['all', t('Toutes les œuvres', 'جميع اللوحات'), routeHref('all')],
    ['categories', t('Catégories', 'الفئات'), '#categories'],
    ['about', t('À propos', 'من نحن'), routeHref('about')]
  ];
  return `<div class="announcement">${esc(t('L’art qui donne une âme à vos murs', 'فن يمنح جدرانك روحًا'))} <span aria-hidden="true">✦</span> ${esc(t('Collection Artflow', 'مجموعة آرت فلو'))}</div>
  <header class="site-header"><div class="container header-inner">
    <a class="brand-lockup" href="${routeHref('home')}" aria-label="Artflow — ${esc(t('Accueil', 'الرئيسية'))}"><img class="brand-logo" src="assets/brand/artflow-logo.svg" alt="Artflow" width="148" height="54"></a>
    <nav class="main-nav ${state.showMobileMenu ? 'is-open' : ''}" aria-label="${esc(t('Navigation principale', 'التنقل الرئيسي'))}">
      ${nav.map(([id, label, href]) => `<a href="${href}" ${id === active ? 'aria-current="page"' : ''} ${id === 'categories' ? 'data-scroll-categories="true"' : ''}>${esc(label)}</a>`).join('')}
      <a href="${routeHref('contact')}" ${active === 'contact' ? 'aria-current="page"' : ''}>${esc(t('Contact', 'اتصل بنا'))}</a>
    </nav>
    <div class="header-actions">
      <div class="language-switch" role="group" aria-label="${esc(t('Choisir la langue', 'اختيار اللغة'))}"><button type="button" data-lang="fr" class="${!isAr() ? 'is-active' : ''}" aria-pressed="${!isAr()}">FR</button><button type="button" data-lang="ar" class="${isAr() ? 'is-active' : ''}" aria-pressed="${isAr()}">العربية</button></div>
      <a class="button button-primary" href="${routeHref('all')}">${esc(t('Découvrir', 'اكتشف'))} ${icon('arrow')}</a>
      <button class="icon-button menu-toggle" type="button" data-action="toggle-menu" aria-label="${esc(state.showMobileMenu ? t('Fermer le menu', 'إغلاق القائمة') : t('Ouvrir le menu', 'فتح القائمة'))}" aria-expanded="${state.showMobileMenu}">${icon(state.showMobileMenu ? 'x' : 'menu')}</button>
    </div></div></header>`;
}
function siteFooter() {
  const now = new Date().getFullYear();
  return `<footer class="site-footer"><div class="container"><div class="footer-main">
    <div class="footer-brand"><a href="${routeHref('home')}" aria-label="Artflow accueil"><img class="footer-brand-logo" src="assets/brand/artflow-logo.svg" alt="Artflow" width="155" height="50"></a><p>${esc(t('Des tableaux choisis pour accompagner vos espaces, révéler votre style et donner du caractère à vos murs.', 'لوحات فنية تضيف لمسة خاصة إلى مساحاتك، وتعكس ذوقك وتمنح جدرانك طابعًا مميزًا.'))}</p><span class="footer-social-note">${icon('sparkle')} ${esc(store.tagline || 'Tableaux uniques, émotions infinies')}</span></div>
    <div class="footer-col"><h3>${esc(t('Explorer', 'تصفح'))}</h3><div class="footer-links"><a href="${routeHref('home')}">${esc(t('Accueil', 'الرئيسية'))}</a><a href="${routeHref('all')}">${esc(t('Toutes les œuvres', 'جميع اللوحات'))}</a>${categories.map((c) => `<a href="${routeHref('category', c.id)}">${esc(categoryName(c))}</a>`).join('')}</div></div>
    <div class="footer-col"><h3>${esc(t('Artflow', 'آرت فلو'))}</h3><div class="footer-links"><a href="${routeHref('about')}">${esc(t('À propos', 'من نحن'))}</a><a href="${routeHref('contact')}">${esc(t('Contact', 'اتصل بنا'))}</a><a href="${routeHref('all')}">${esc(t('La collection', 'المجموعة'))}</a></div></div>
    <div class="footer-col footer-contact-col"><h3>${esc(t('Une question ?', 'لديك سؤال؟'))}</h3><div class="footer-contact-card"><p>${esc(t('Écrivez-nous pour connaître les prix, les formats et les modalités de commande.', 'تواصل معنا لمعرفة الأسعار والمقاسات وطريقة الطلب.'))}</p><a class="button button-whatsapp" href="${whatsappUrl(null, true)}" target="_blank" rel="noopener noreferrer">${icon('whatsapp')} ${esc(t('Parler sur WhatsApp', 'تواصل عبر واتساب'))}</a></div></div>
  </div><div class="footer-bottom"><span>© ${Number(store.copyrightStartYear) > 0 ? store.copyrightStartYear + (now > store.copyrightStartYear ? `–${now}` : '') : now} Artflow. ${esc(t('Tous droits réservés.', 'جميع الحقوق محفوظة.'))}</span><span>${esc(t('Conçu autour de l’art.', 'تصميم يحتفي بالفن.'))}</span></div></div></footer>
  <a class="whatsapp-float" href="${whatsappUrl(null, true)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t('Contacter Artflow sur WhatsApp', 'تواصل مع آرت فلو عبر واتساب'))}" title="WhatsApp">${icon('whatsapp')}</a>`;
}
function shell(content) {
  return `${siteHeader()}<main id="main-content">${content}</main>${siteFooter()}${state.showFilters ? filterDialog(state.route.type === 'category' ? state.route.categoryId : null) : ''}`;
}
function homePage() {
  const heroArt = artworks.find((a) => (a.originalFilenames || []).some((f) => /Autumn-Painting/i.test(f))) || artworks[0];
  const curatedHints = ['African-Woman', "Tiger's-Face", 'Artboard 1 copy 3', 'Chafchaouen', 'Minimalist-Mountains', 'Sakura-tree-painting', 'Blue-Wave', 'Zellij'];
  const curated = curatedHints.map((hint) => artworks.find((a) => (a.originalFilenames || []).some((f) => f.toLowerCase().includes(hint.toLowerCase())))).filter(Boolean);
  const featured = [...new Map([...curated, ...artworks].map((a) => [a.id, a])).values()].slice(0, 8);
  return `<section class="hero"><div class="container hero-grid"><div class="hero-copy-block"><div class="eyebrow">${esc(t('L’art à votre image', 'فن يعكس ذوقك'))}</div>
    <h1>${esc(t('L’art qui donne une âme à vos', 'فن يمنح جدرانك'))} <em>${esc(t('murs.', 'روحًا.'))}</em></h1>
    <p class="hero-copy">${esc(t('Explorez une collection de tableaux décoratifs pensée pour transformer vos murs en espaces qui vous ressemblent. Trouvez l’œuvre qui vous parle.', 'اكتشف مجموعة من اللوحات الفنية التي تضفي على جدرانك طابعًا خاصًا وتعكس شخصيتك. اعثر على اللوحة التي تشبهك.'))}</p>
    <div class="hero-actions"><a class="button button-primary" href="${routeHref('all')}">${esc(t('Découvrir les œuvres', 'اكتشف اللوحات'))} ${icon('arrow')}</a><a class="button button-secondary" href="#categories" data-scroll-categories="true">${esc(t('Parcourir les catégories', 'تصفح الفئات'))}</a></div>
    <div class="hero-note"><span class="note-mark">${icon('sparkle')}</span><span><strong>${esc(t('Votre espace, votre histoire', 'مساحتك، قصتك'))}</strong>${esc(t('Des œuvres pour exprimer votre style.', 'لوحات تعبّر عن ذوقك.'))}</span></div>
    </div><div class="hero-visual"><div class="hero-image-frame">${heroArt ? `<img src="${esc(heroArt.image)}" alt="${esc(isAr() ? heroArt.altAr : heroArt.altFr)}" fetchpriority="high" decoding="async">` : ''}</div><div class="hero-stamp"><span class="stamp-icon">${icon('palette')}</span><span><strong>${esc(t('Une collection à explorer', 'مجموعة تستحق الاكتشاف'))}</strong><span>${esc(t('Trouvez votre œuvre coup de cœur', 'اعثر على لوحتك المفضلة'))}</span></span></div><div class="hero-counter"><strong>${artworks.length}</strong><span>${esc(t('œuvres', 'لوحة'))}</span></div></div></div></section>
  <section id="categories" class="section"><div class="container">${sectionHeading(t('La collection', 'المجموعة'), t('Choisissez votre univers', 'اختر عالمك الفني'), t('Six univers artistiques pour découvrir des œuvres qui s’accordent à votre intérieur.', 'ستة عوالم فنية لاكتشاف لوحات تنسجم مع مساحتك.'), `<a class="text-link" href="${routeHref('all')}">${esc(t('Voir toutes les œuvres', 'عرض جميع اللوحات'))} ${icon('arrow')}</a>`)}<div class="category-grid">${categories.map(categoryCard).join('')}</div></div></section>
  <section class="section section-muted"><div class="container">${sectionHeading(t('Sélection Artflow', 'اختيارات آرت فلو'), t('Des œuvres qui attirent le regard', 'لوحات تخطف الأنظار'), t('Une sélection variée pour commencer votre découverte. Chaque œuvre a sa propre personnalité.', 'مجموعة متنوعة لتبدأ رحلتك في الاكتشاف. لكل لوحة طابعها الخاص.'), `<a class="text-link" href="${routeHref('all')}">${esc(t('Toute la collection', 'المجموعة كاملة'))} ${icon('arrow')}</a>`)}<div class="art-grid">${featured.map(productCard).join('')}</div></div></section>
  <section class="section"><div class="container editorial-grid"><div class="editorial-copy"><div class="eyebrow">${esc(t('L’art chez vous', 'الفن في منزلك'))}</div><h2>${esc(t('Un mur peut changer toute une pièce.', 'لوحة واحدة قد تغيّر إحساس المكان.'))}</h2><p>${esc(t('Une œuvre donne du relief à un coin discret, apporte une note de couleur et raconte quelque chose de vous. Explorez différents styles, puis choisissez librement la pièce qui vous correspond.', 'تمنح اللوحة زاوية بسيطة حضورًا جديدًا، وتضيف لونًا وتحكي شيئًا عنك. اكتشف أنماطًا مختلفة ثم اختر العمل الذي يناسبك.'))}</p><a class="button button-secondary" href="${routeHref('all')}">${esc(t('Trouver une œuvre', 'ابحث عن لوحة'))} ${icon('arrow')}</a></div><div class="editorial-art"><figure>${featured[1] ? `<img src="${esc(featured[1].image)}" alt="${esc(isAr() ? featured[1].altAr : featured[1].altFr)}" loading="lazy">` : ''}</figure><figure>${featured[4] ? `<img src="${esc(featured[4].image)}" alt="${esc(isAr() ? featured[4].altAr : featured[4].altFr)}" loading="lazy">` : ''}</figure><span class="quote-mark" aria-hidden="true">“</span></div></div></section>
  <section class="section"><div class="container"><div class="cta-strip"><div><h2>${esc(t('Vous avez trouvé votre coup de cœur ?', 'هل وجدت اللوحة التي أعجبتك؟'))}</h2><p>${esc(t('Contactez Artflow sur WhatsApp pour connaître le prix, le format et les modalités de commande.', 'تواصل مع آرت فلو عبر واتساب لمعرفة السعر والمقاس وطريقة الطلب.'))}</p></div><a class="button" href="${whatsappUrl(null, true)}" target="_blank" rel="noopener noreferrer">${icon('whatsapp')} ${esc(t('Discuter avec Artflow', 'تحدث مع آرت فلو'))}</a></div></div></section>`;
}
function breadcrumb(items) {
  return `<div class="breadcrumbs"><a href="${routeHref('home')}">${esc(t('Accueil', 'الرئيسية'))}</a>${items.map((item) => `<span aria-hidden="true">${icon('chevron')}</span>${item.href ? `<a href="${item.href}">${esc(item.label)}</a>` : `<span aria-current="page">${esc(item.label)}</span>`}`).join('')}</div>`;
}
function catalogHeader(title, desc, count, crumb = []) {
  return `<section class="page-top"><div class="container">${breadcrumb(crumb)}<div class="page-title-row"><div><h1>${esc(title)}</h1><p>${esc(desc)}</p></div><div class="results-count">${count} ${esc(t('œuvres uniques', 'لوحات فريدة'))}</div></div></div></section>`;
}
function filterDialog(categoryId = null) {
  const allCounts = (id) => artworks.filter((a) => a.categories.includes(id)).length;
  const colorCounts = (id) => artworks.filter((a) => (!categoryId || a.categories.includes(categoryId)) && (categoryId || !state.categoryFilters.length || state.categoryFilters.some((c) => a.categories.includes(c))) && a.dominantColor === id).length;
  const nSelected = (categoryId ? 0 : state.categoryFilters.length) + (state.colorFilter ? 1 : 0);
  return `<div class="dialog-backdrop" data-action="backdrop-close"><section class="filter-dialog" role="dialog" aria-modal="true" aria-labelledby="filter-heading" aria-describedby="filter-description"><div class="filter-dialog-header"><div><h2 id="filter-heading">${esc(t('Filtrer les œuvres', 'تصفية اللوحات'))}</h2><p id="filter-description">${esc(categoryId ? t('Affinez cette catégorie par couleur dominante.', 'صفِّ هذه الفئة حسب اللون الغالب.') : t('Combinez les catégories et les couleurs.', 'اجمع بين الفئات والألوان.'))}</p></div><button class="icon-button" type="button" data-action="close-filters" aria-label="${esc(t('Fermer', 'إغلاق'))}">${icon('x')}</button></div>
  <div class="filter-dialog-body">${!categoryId ? `<div class="filter-group"><h3>${esc(t('Catégories', 'الفئات'))}</h3><div class="filter-options">${categories.map((cat) => `<label class="filter-option"><input type="checkbox" data-filter-category="${esc(cat.id)}" ${state.categoryFilters.includes(cat.id) ? 'checked' : ''}><span>${esc(categoryName(cat))}</span><span class="count">${allCounts(cat.id)}</span></label>`).join('')}</div></div>` : ''}
  <div class="filter-group"><h3>${esc(t('Couleur dominante', 'اللون الغالب'))}</h3><div class="color-options">${allActiveColors().map((c) => `<button type="button" class="color-option ${state.colorFilter === c.id ? 'is-selected' : ''}" data-filter-color="${esc(c.id)}" aria-pressed="${state.colorFilter === c.id}"><span class="color-dot" ${colorStyle(c.id)} aria-hidden="true"></span><span>${esc(isAr() ? c.ar : c.fr)}</span><span class="count">${colorCounts(c.id)}</span></button>`).join('')}</div></div></div>
  <div class="filter-dialog-footer"><span class="result-text">${nSelected} ${esc(t('filtre(s) actif(s)', 'عامل تصفية نشط'))}</span><div class="filter-dialog-footer-actions"><button type="button" class="button button-secondary" data-action="clear-filters">${esc(t('Effacer', 'مسح'))}</button><button type="button" class="button button-primary" data-action="close-filters">${esc(t('Afficher les résultats', 'عرض النتائج'))} ${icon('arrow')}</button></div></div></section></div>`;
}
function activeFilterMarkup(categoryId = null) {
  const chips = [];
  if (!categoryId) state.categoryFilters.forEach((id) => { const c = getCategory(id); if (c) chips.push(`<span class="filter-chip">${esc(categoryName(c))}<button type="button" data-remove-category="${esc(id)}" aria-label="${esc(t('Retirer le filtre ', 'إزالة عامل التصفية '))}${esc(categoryName(c))}">${icon('x')}</button></span>`); });
  if (state.colorFilter) chips.push(`<span class="filter-chip"><span class="color-dot" ${colorStyle(state.colorFilter)} aria-hidden="true"></span>${esc(colorName(state.colorFilter))}<button type="button" data-action="clear-color" aria-label="${esc(t('Retirer le filtre couleur', 'إزالة فلتر اللون'))}">${icon('x')}</button></span>`);
  if (state.search.trim()) chips.push(`<span class="filter-chip">${icon('search')}${esc(state.search.trim())}<button type="button" data-action="clear-search" aria-label="${esc(t('Effacer la recherche', 'مسح البحث'))}">${icon('x')}</button></span>`);
  return chips.length ? `<div class="active-filters">${chips.join('')}<button type="button" class="clear-filters" data-action="clear-filters">${esc(t('Effacer les filtres', 'مسح عوامل التصفية'))}</button></div>` : '';
}
function catalogPage(categoryId = null) {
  const category = categoryId ? getCategory(categoryId) : null;
  const pool = category ? artworks.filter((a) => a.categories.includes(category.id)) : artworks;
  const results = filterArtwork(pool, { categoryId });
  const visible = results.slice(0, state.visibleLimit);
  const title = category ? categoryName(category) : t('Toutes les œuvres', 'جميع اللوحات');
  const description = category ? (isAr() ? category.intro_ar : category.intro_fr) : t('Explorez les œuvres Artflow, recherchez un titre et combinez les filtres pour trouver celle qui vous ressemble.', 'اكتشف لوحات آرت فلو، وابحث بالعنوان واجمع بين عوامل التصفية لتجد ما يناسب ذوقك.');
  const crumb = category ? [{ label: t('Toutes les œuvres', 'جميع اللوحات'), href: routeHref('all') }, { label: title }] : [{ label: title }];
  const categoryFixed = category ? `<span class="filter-chip is-fixed">${esc(title)}</span>` : '';
  return `${catalogHeader(title, description, pool.length, crumb)}<section class="catalog-area"><div class="container"><div class="catalog-toolbar">
    <label class="search-control">${icon('search')}<input type="search" id="catalog-search" value="${esc(state.search)}" placeholder="${esc(t('Rechercher une œuvre, une couleur…', 'ابحث عن لوحة أو لون…'))}" aria-label="${esc(t('Rechercher dans la collection', 'البحث في المجموعة'))}">${state.search ? `<button type="button" class="clear-search" data-action="clear-search" aria-label="${esc(t('Effacer la recherche', 'مسح البحث'))}">${icon('x')}</button>` : ''}</label>
    <label class="toolbar-select"><span>${esc(t('Trier', 'ترتيب'))}</span><select id="catalog-sort" aria-label="${esc(t('Trier les œuvres', 'ترتيب اللوحات'))}"><option value="relevance" ${state.sort === 'relevance' ? 'selected' : ''}>${esc(t('Pertinence', 'الأكثر صلة'))}</option><option value="az" ${state.sort === 'az' ? 'selected' : ''}>${esc(t('Nom A–Z', 'الاسم أ–ي'))}</option><option value="za" ${state.sort === 'za' ? 'selected' : ''}>${esc(t('Nom Z–A', 'الاسم ي–أ'))}</option></select></label>
    <button type="button" class="button button-secondary filter-trigger" data-action="open-filters">${icon('filter')} ${esc(t('Filtres', 'تصفية'))} ${((categoryId ? 0 : state.categoryFilters.length) + (state.colorFilter ? 1 : 0)) ? `<span class="filter-count">${(categoryId ? 0 : state.categoryFilters.length) + (state.colorFilter ? 1 : 0)}</span>` : ''}</button>
  </div>${activeFilterMarkup(categoryId)}${categoryFixed ? `<div class="active-filters">${categoryFixed}</div>` : ''}
  <div class="catalog-results-line"><strong>${results.length} ${esc(t('résultat(s)', 'نتيجة'))}</strong><span>${esc(t('Les filtres portent sur toute la collection, pas seulement sur les œuvres affichées.', 'تُطبّق عوامل التصفية على المجموعة كاملة، وليس على اللوحات الظاهرة فقط.'))}</span></div>
  ${results.length ? `<div class="catalog-grid">${visible.map(productCard).join('')}</div>${results.length > visible.length ? `<div class="load-more-row"><button type="button" class="button button-secondary" data-action="load-more">${esc(t('Afficher plus', 'عرض المزيد'))} ${icon('arrow')} <span>(${visible.length}/${results.length})</span></button></div>` : ''}` : `<div class="empty-state"><span class="empty-icon">${icon('search')}</span><h2>${esc(t('Aucune œuvre trouvée', 'لم يتم العثور على لوحات'))}</h2><p>${esc(t('Essayez un autre mot-clé ou retirez un ou plusieurs filtres.', 'جرّب كلمة أخرى أو أزل بعض عوامل التصفية.'))}</p><button class="button button-primary" type="button" data-action="clear-filters">${esc(t('Effacer les filtres', 'مسح عوامل التصفية'))}</button></div>`}
  </div></section>`;
}
function artDetailPage(slug) {
  const art = getArtBySlug(slug);
  if (!art) return notFoundPage();
  const cats = art.categories.map(getCategory).filter(Boolean);
  const related = artworks.filter((a) => a.id !== art.id && a.categories.some((c) => art.categories.includes(c))).slice(0, 4);
  const title = titleFor(art);
  return `<section class="page-top"><div class="container">${breadcrumb([{ label: t('Toutes les œuvres', 'جميع اللوحات'), href: routeHref('all') }, { label: title }])}</div></section>
  <section class="container detail-layout"><div class="detail-artwork"><img src="${esc(art.image)}" alt="${esc(isAr() ? art.altAr : art.altFr)}" fetchpriority="high" decoding="async"><span class="detail-image-caption">Artflow · ${esc(t('Art mural', 'فن جداري'))}</span></div><div class="detail-info"><div class="eyebrow">${esc(t('Une œuvre à découvrir', 'لوحة تستحق الاكتشاف'))}</div><h1>${esc(title)}</h1><p class="detail-lede">${esc(t('Une œuvre de la collection Artflow. Contactez-nous pour confirmer le prix, le format disponible et les modalités de livraison.', 'لوحة من مجموعة آرت فلو. تواصل معنا لتأكيد السعر والمقاس المتاح وتفاصيل التوصيل.'))}</p>
  <div class="detail-price-block"><div><div class="detail-price-label">${esc(t('Prix', 'السعر'))}</div><div class="detail-price">${esc(formatPrice())}</div></div><div class="detail-price-note">${esc(t('Même tarif pour toute la collection, une fois confirmé.', 'سعر موحّد للمجموعة بعد تأكيده.'))}</div></div>
  <div class="detail-meta"><div class="detail-meta-item"><div class="detail-meta-label">${esc(t('Dimensions', 'المقاس'))}</div><div class="detail-meta-value">${icon('grid')} ${esc(formatDimensions())}</div></div><div class="detail-meta-item"><div class="detail-meta-label">${esc(t('Couleur dominante', 'اللون الغالب'))}</div><div class="detail-meta-value"><span class="color-dot" ${colorStyle(art.dominantColor)} aria-hidden="true"></span>${esc(colorName(art.dominantColor))}</div></div></div>
  <div class="detail-meta"><div class="detail-meta-item"><div class="detail-meta-label">${esc(t('Référence', 'المرجع'))}</div><div class="detail-meta-value ltr">${esc(art.id)}</div></div><div class="detail-meta-item"><div class="detail-meta-label">${esc(t('Collection', 'المجموعة'))}</div><div class="detail-meta-value">${esc(t(`${art.categories.length} catégorie(s)`, `${art.categories.length} فئة`))}</div></div></div>
  <div class="detail-categories">${cats.map((cat) => `<a class="category-pill" href="${routeHref('category', cat.id)}">${esc(categoryName(cat))}</a>`).join('')}</div>
  <div class="detail-actions"><a class="button button-whatsapp" href="${whatsappUrl(art)}" target="_blank" rel="noopener noreferrer">${icon('whatsapp')} ${esc(t('Commander via WhatsApp', 'اطلب عبر واتساب'))}</a><button class="button button-secondary" type="button" data-action="share-art" data-art-slug="${esc(art.slug)}" aria-label="${esc(t('Partager cette œuvre', 'مشاركة هذه اللوحة'))}">${icon('arrow')} ${esc(t('Partager', 'مشاركة'))}</button></div>
  <div class="detail-trust">${icon('shield')}<span>${esc(t('Votre commande se confirme directement avec Artflow. Le prix, le format et la livraison sont à valider avant toute commande.', 'يتم تأكيد الطلب مباشرة مع آرت فلو. يجب التحقق من السعر والمقاس والتوصيل قبل تأكيد الطلب.'))}</span></div></div></section>
  ${related.length ? `<section class="section section-muted related-section"><div class="container">${sectionHeading(t('Dans le même esprit', 'من نفس الطابع'), t('À découvrir également', 'اكتشف أيضًا'), t('D’autres œuvres liées à cette sélection.', 'لوحات أخرى من هذه المجموعة.'))}<div class="art-grid">${related.map(productCard).join('')}</div></div></section>` : ''}`;
}
function aboutPage() {
  const sample = artworks.find((a) => /Chafchaouen|Sakura|Minimalist/i.test((a.originalFilenames || []).join(' '))) || artworks[0];
  return `<section class="about-hero"><div class="container about-grid"><div><div class="eyebrow">${esc(t('À propos d’Artflow', 'من نحن'))}</div><h1>${esc(t('L’art, pour faire place à l’émotion.', 'الفن مساحة للمشاعر.'))}</h1><p>${esc(t('Artflow réunit une collection de tableaux décoratifs autour de plusieurs univers visuels : compositions abstraites, nature, animaux, culture marocaine, minimalisme et art islamique.', 'تجمع آرت فلو مجموعة من اللوحات الزخرفية ضمن عوالم بصرية مختلفة: الفن التجريدي والطبيعة والحيوانات والثقافة المغربية والبساطة والفن الإسلامي.'))}</p><p>${esc(t('Notre envie est simple : vous aider à trouver une œuvre qui vous parle et qui s’intègre naturellement à votre espace. Explorez la collection, puis contactez-nous directement pour les informations pratiques et la commande.', 'هدفنا بسيط: مساعدتك في العثور على لوحة تعبّر عنك وتنسجم مع مساحتك. استكشف المجموعة ثم تواصل معنا مباشرة لمعرفة التفاصيل والطلب.'))}</p><a class="button button-primary" href="${routeHref('all')}">${esc(t('Explorer la collection', 'اكتشف المجموعة'))} ${icon('arrow')}</a></div><div class="about-image">${sample ? `<img src="${esc(sample.image)}" alt="${esc(isAr() ? sample.altAr : sample.altFr)}" loading="lazy">` : ''}</div></div></section>
  <section class="section section-muted"><div class="container">${sectionHeading(t('Notre approche', 'نهجنا'), t('Six univers, mille façons de se sentir chez soi.', 'ستة عوالم، ومساحات تعبّر عنك.'), t('Choisissez selon votre sensibilité, vos couleurs et l’ambiance que vous souhaitez créer.', 'اختر حسب ذوقك وألوانك والأجواء التي ترغب في خلقها.'))}<div class="about-values"><article class="value-card"><span class="value-card-icon">${icon('palette')}</span><h3>${esc(t('Une collection variée', 'مجموعة متنوعة'))}</h3><p>${esc(t('Des thèmes différents pour explorer des styles graphiques et des ambiances multiples.', 'موضوعات مختلفة لاكتشاف أساليب وأجواء فنية متنوعة.'))}</p></article><article class="value-card"><span class="value-card-icon">${icon('heart')}</span><h3>${esc(t('Le choix vous appartient', 'الاختيار لك'))}</h3><p>${esc(t('Prenez le temps de comparer et de choisir une œuvre qui vous ressemble.', 'خذ وقتك للمقارنة واختيار لوحة تشبه ذوقك.'))}</p></article><article class="value-card"><span class="value-card-icon">${icon('whatsapp')}</span><h3>${esc(t('Un contact direct', 'تواصل مباشر'))}</h3><p>${esc(t('Posez vos questions et confirmez les détails de votre commande via WhatsApp.', 'اطرح أسئلتك وأكد تفاصيل طلبك عبر واتساب.'))}</p></article></div></div></section>`;
}
function contactPage() {
  return `<section class="about-hero"><div class="container about-grid"><div><div class="eyebrow">${esc(t('Contact', 'اتصل بنا'))}</div><h1>${esc(t('Parlons de l’œuvre qui vous plaît.', 'لنتحدث عن اللوحة التي أعجبتك.'))}</h1><p>${esc(t('Vous souhaitez connaître le prix, le format ou les modalités de livraison ? Écrivez directement à Artflow sur WhatsApp. Vous pourrez partager le nom ou la référence de l’œuvre qui vous intéresse.', 'هل ترغب في معرفة السعر أو المقاس أو تفاصيل التوصيل؟ تواصل مباشرة مع آرت فلو عبر واتساب، ويمكنك مشاركة اسم اللوحة أو مرجعها.'))}</p><a class="button button-whatsapp" href="${whatsappUrl(null, true)}" target="_blank" rel="noopener noreferrer">${icon('whatsapp')} ${esc(t('Contacter Artflow sur WhatsApp', 'تواصل مع آرت فلو عبر واتساب'))}</a><p class="phone"><strong>WhatsApp</strong><br><span dir="ltr" class="ltr">+212 627 025 271</span></p></div><div class="about-image">${artworks[5] ? `<img src="${esc(artworks[5].image)}" alt="${esc(isAr() ? artworks[5].altAr : artworks[5].altFr)}" loading="lazy">` : ''}</div></div></section>`;
}
function notFoundPage() {
  return `<section class="not-found"><div><div class="eyebrow" style="justify-content:center">404</div><h1>${esc(t('Cette page est introuvable.', 'هذه الصفحة غير موجودة.'))}</h1><p>${esc(t('L’œuvre ou la page recherchée n’a peut-être pas cette adresse.', 'ربما تغيّر عنوان اللوحة أو الصفحة التي تبحث عنها.'))}</p><a class="button button-primary" href="${routeHref('home')}">${icon('house')} ${esc(t('Retour à l’accueil', 'العودة إلى الرئيسية'))}</a></div></section>`;
}
function updateMeta() {
  let title = 'Artflow — Tableaux uniques, émotions infinies';
  let description = t('Découvrez les tableaux décoratifs Artflow et commandez directement via WhatsApp.', 'اكتشف لوحات آرت فلو الفنية واطلب مباشرة عبر واتساب.');
  if (state.route.type === 'all') title = `${t('Toutes les œuvres', 'جميع اللوحات')} | Artflow`;
  if (state.route.type === 'category') {
    const cat = getCategory(state.route.categoryId);
    if (cat) title = `${categoryName(cat)} | Artflow`;
  }
  if (state.route.type === 'art') {
    const art = getArtBySlug(state.route.slug);
    if (art) { title = `${titleFor(art)} | Artflow`; description = isAr() ? art.altAr : art.altFr; }
  }
  if (state.route.type === 'about') title = `${t('À propos', 'من نحن')} | Artflow`;
  if (state.route.type === 'contact') title = `${t('Contact', 'اتصل بنا')} | Artflow`;
  document.title = title;
  let desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', description.slice(0, 160));
}
function restoreSearchFocus() {
  if (state.pendingFocus === 'filter-trigger') {
    const button = app.querySelector('[data-action="open-filters"]');
    if (button) button.focus({ preventScroll: true });
  } else if (state.pendingFocus === 'search') {
    const input = document.getElementById('catalog-search');
    if (input) { input.focus({ preventScroll: true }); const n = input.value.length; input.setSelectionRange(n, n); }
  }
  state.pendingFocus = null;
}
function render() {
  if (!booted) return;
  state.route = parseRoute();
  syncDirection();
  let body = '';
  if (state.route.type === 'home') body = homePage();
  else if (state.route.type === 'all') body = catalogPage();
  else if (state.route.type === 'category') {
    // The category is route-derived, never a mutable duplicate of the product record.
    body = catalogPage(state.route.categoryId);
  } else if (state.route.type === 'art') body = artDetailPage(state.route.slug);
  else if (state.route.type === 'about') body = aboutPage();
  else if (state.route.type === 'contact') body = contactPage();
  else body = notFoundPage();
  app.innerHTML = shell(body);
  syncDirection();
  updateMeta();
  restoreSearchFocus();
}
function clearFilters() {
  state.categoryFilters = [];
  state.colorFilter = null;
  state.search = '';
  state.sort = 'relevance';
  state.visibleLimit = 24;
  state.pendingFocus = 'search';
  render();
}
function navigate(hash) {
  state.showMobileMenu = false;
  state.showFilters = false;
  if (location.hash === hash) render(); else location.hash = hash;
}
function handleClick(event) {
  const langButton = event.target.closest('[data-lang]');
  if (langButton) { setLanguage(langButton.dataset.lang); return; }
  const categoryCheckbox = event.target.closest('[data-filter-category]');
  if (categoryCheckbox && categoryCheckbox.type === 'checkbox') {
    const id = categoryCheckbox.dataset.filterCategory;
    if (categoryCheckbox.checked && !state.categoryFilters.includes(id)) state.categoryFilters.push(id);
    if (!categoryCheckbox.checked) state.categoryFilters = state.categoryFilters.filter((v) => v !== id);
    state.visibleLimit = 24; render(); return;
  }
  const colorButton = event.target.closest('[data-filter-color]');
  if (colorButton) {
    state.colorFilter = state.colorFilter === colorButton.dataset.filterColor ? null : colorButton.dataset.filterColor;
    state.visibleLimit = 24; render(); return;
  }
  const removeCategory = event.target.closest('[data-remove-category]');
  if (removeCategory) { state.categoryFilters = state.categoryFilters.filter((v) => v !== removeCategory.dataset.removeCategory); state.visibleLimit = 24; render(); return; }
  const actionEl = event.target.closest('[data-action]');
  if (actionEl) {
    const action = actionEl.dataset.action;
    if (action === 'toggle-menu') { state.showMobileMenu = !state.showMobileMenu; render(); }
    else if (action === 'open-filters') { state.showFilters = true; render(); const close = app.querySelector('[data-action="close-filters"]'); if (close) close.focus(); }
    else if (action === 'close-filters') { state.showFilters = false; state.pendingFocus = 'filter-trigger'; render(); }
    else if (action === 'backdrop-close' && event.target === actionEl) { state.showFilters = false; state.pendingFocus = 'filter-trigger'; render(); }
    else if (action === 'clear-filters') { state.showFilters = false; clearFilters(); }
    else if (action === 'clear-color') { state.colorFilter = null; state.visibleLimit = 24; render(); }
    else if (action === 'clear-search') { state.search = ''; state.visibleLimit = 24; state.pendingFocus = 'search'; render(); }
    else if (action === 'load-more') { state.visibleLimit += 24; render(); }
    else if (action === 'share-art') {
      const art = getArtBySlug(actionEl.dataset.artSlug);
      const url = `${location.origin}${location.pathname}${routeHref('art', art ? art.slug : '')}`;
      if (navigator.share && art) navigator.share({ title: titleFor(art), text: t('Découvrez cette œuvre Artflow', 'اكتشف هذه اللوحة من آرت فلو'), url }).catch(() => {});
      else if (navigator.clipboard && art) navigator.clipboard.writeText(url).then(() => announce(t('Lien copié.', 'تم نسخ الرابط.'))).catch(() => announce(url));
      else if (art) announce(url);
    }
    return;
  }
  const categoryLink = event.target.closest('[data-scroll-categories]');
  if (categoryLink) {
    event.preventDefault();
    state.showMobileMenu = false;
    if (state.route.type === 'home') { render(); const target = document.getElementById('categories'); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    else navigate(routeHref('all'));
  }
}
function announce(message) {
  let status = document.getElementById('artflow-live-status');
  if (!status) { status = document.createElement('div'); status.id = 'artflow-live-status'; status.setAttribute('role', 'status'); status.className = 'sr-only'; document.body.appendChild(status); }
  status.textContent = message;
}
function handleInput(event) {
  if (event.target.id === 'catalog-search') {
    const start = event.target.selectionStart;
    state.search = event.target.value;
    state.visibleLimit = 24;
    state.pendingFocus = 'search';
    render();
    const input = document.getElementById('catalog-search');
    if (input && typeof start === 'number') input.setSelectionRange(start, start);
  }
}
function handleChange(event) {
  if (event.target.id === 'catalog-sort') {
    state.sort = event.target.value;
    state.visibleLimit = 24;
    render();
  }
}
async function boot() {
  try {
    const [artRes, catRes, storeRes] = await Promise.all([
      fetch('data/artworks.json'), fetch('data/categories.json'), fetch('data/store-config.json')
    ]);
    if (![artRes, catRes, storeRes].every((r) => r.ok)) throw new Error('Impossible de charger les données du catalogue.');
    [artworks, categories, store] = await Promise.all([artRes.json(), catRes.json(), storeRes.json()]);
    // Defend against accidental duplicate records and malformed data when the catalog is edited later.
    const byId = new Map();
    for (const art of artworks) {
      if (!art || !art.id || !art.slug || !art.image) { console.warn('Œuvre ignorée : fiche incomplète.', art); continue; }
      if (byId.has(art.id)) { console.warn(`ID en double ignoré : ${art.id}`); continue; }
      if (!Array.isArray(art.categories)) art.categories = [];
      if (!COLORS.some((c) => c.id === art.dominantColor)) art.dominantColor = 'Multicolore';
      byId.set(art.id, art);
    }
    artworks = [...byId.values()];
    booted = true;
    state.route = parseRoute();
    app.addEventListener('click', handleClick);
    app.addEventListener('input', handleInput);
    app.addEventListener('change', handleChange);
    window.addEventListener('hashchange', () => { state.showMobileMenu = false; state.showFilters = false; state.visibleLimit = 24; render(); window.scrollTo(0, 0); });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (state.showFilters) { state.showFilters = false; state.pendingFocus = 'filter-trigger'; render(); }
        else if (state.showMobileMenu) { state.showMobileMenu = false; render(); }
      }
      if (state.showFilters && event.key === 'Tab') {
        const dialog = app.querySelector('.filter-dialog');
        if (!dialog) return;
        const focusables = [...dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),a[href]')];
        if (!focusables.length) return;
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    render();
  } catch (error) {
    console.error('Artflow : initialisation impossible.', error);
    app.innerHTML = `<section class="not-found"><div><h1>${esc('Artflow')}</h1><p>${esc(t('Le catalogue ne peut pas être chargé. Vérifiez que les dossiers data/ et assets/ sont présents à la racine du site, puis rechargez la page.', 'تعذر تحميل المجموعة. تحقق من وجود مجلدي data/ وassets/ في جذر الموقع ثم أعد تحميل الصفحة.'))}</p><button class="button button-primary" onclick="location.reload()">${esc(t('Réessayer', 'إعادة المحاولة'))}</button></div></section>`;
  }
}
boot();
