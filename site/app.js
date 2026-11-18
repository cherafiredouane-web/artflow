(() => {
  'use strict';

  const state = {
    lang: safeStoredLanguage(),
    catalog: [],
    categories: [],
    config: null,
    route: { page: 'home' },
    searchQuery: '',
    categoryFilter: '',
    colorFilter: '',
    sortKey: 'relevance',
    visibleCount: 24,
    selectedSizeId: '',
    currentProductId: '',
    carouselIndex: 0,
    carouselStartX: null,
    listing: null,
  };

  const T = {
    fr: {
      home: 'Accueil', all: 'Toutes les œuvres', categories: 'Collections', about: 'À propos',
      language: 'Langue', explore: 'Découvrir les œuvres', heroKicker: 'L’art trouve sa place',
      heroTitle: 'L’art qui change <em>l’atmosphère.</em>',
      heroText: 'Des tableaux décoratifs pour donner du caractère à vos espaces et faire place à l’émotion.',
      heroNote: 'TABLEAUX UNIQUES, ÉMOTIONS INFINIES', best: 'Meilleures ventes',
      bestIntro: 'Les œuvres choisies dans la collection Artflow.', seeAll: 'Voir la collection',
      ourCollections: 'Explorer les univers', categoriesIntro: 'Six univers pour trouver l’œuvre qui vous ressemble.',
      discover: 'Découvrir', artCount: 'œuvres', from: 'À partir de 230 DH', sizes: '3 formats disponibles',
      viewArtwork: 'Voir l’œuvre', ourStory: 'Un regard sur l’art et les espaces',
      storyTitle: 'Des œuvres qui donnent une autre dimension à vos murs.',
      storyText: 'Artflow rassemble une sélection de tableaux décoratifs pensée pour accompagner les intérieurs et les sensibilités de chacun. Des compositions abstraites aux inspirations marocaines, chaque univers invite à regarder les espaces autrement.',
      aboutLink: 'En savoir plus', search: 'Rechercher', searchPlaceholder: 'Un titre, une couleur, une inspiration…',
      category: 'Catégorie', allCategories: 'Toutes les catégories', color: 'Couleur dominante', allColors: 'Toutes les couleurs',
      sort: 'Trier par', relevance: 'Pertinence', az: 'Nom A–Z', za: 'Nom Z–A', filters: 'Filtres', clear: 'Effacer les filtres', apply: 'Appliquer',
      results: 'résultats', result: 'résultat', noResults: 'Aucune œuvre trouvée', noResultsText: 'Essayez un autre terme ou retirez certains filtres.',
      reset: 'Tout effacer', more: 'Afficher plus', breadcrumbHome: 'Accueil',
      chooseSize: 'Choisir un format', sizeHelp: 'Sélectionnez un format pour afficher son prix exact.',
      selectedSize: 'Format sélectionné', order: 'Commander via WhatsApp', orderDisabled: 'Choisissez un format pour commander',
      collection: 'Collection', dominant: 'Couleur dominante', related: 'Vous aimerez aussi',
      aboutKicker: 'L’univers Artflow', aboutTitle: 'Tableaux uniques, émotions infinies.',
      aboutText1: 'Artflow explore la rencontre entre l’art décoratif, les couleurs et les espaces de vie. La collection réunit plusieurs univers visuels — abstrait, islamique, marocain, minimaliste, nature — pour laisser à chacun la liberté de composer un intérieur qui lui ressemble.',
      aboutText2: 'Nous croyons qu’une œuvre peut transformer la perception d’une pièce, attirer le regard ou simplement créer une atmosphère. Parcourez les collections, choisissez le format qui convient à votre espace, puis contactez-nous directement sur WhatsApp pour votre demande.',
      contact: 'Contact', contactTitle: 'Une œuvre vous plaît ?', contactText: 'Écrivez-nous sur WhatsApp pour choisir votre format et préparer votre demande.',
      whatsapp: 'WhatsApp', allWorks: 'Toutes les œuvres', catalogCount: 'œuvres dans la collection',
      collectionUnavailable: 'Cette collection est momentanément vide.',
      notFound: 'Cette page est introuvable.', backHome: 'Retour à l’accueil',
      footerIntro: 'Tableaux uniques, émotions infinies. Explorez les collections Artflow et trouvez une œuvre qui vous ressemble.',
      footerExplore: 'Explorer', footerInfo: 'Informations', footerCopyright: 'Tous droits réservés.',
      threeSizes: 'Trois formats au choix', orderMessage: 'Bonjour, je souhaite commander le tableau',
      reference: 'référence', thankYou: 'Merci de me confirmer sa disponibilité et les modalités de livraison.',
      searchBy: 'Rechercher une œuvre', categoryHint: 'Filtrer la collection', categoryIntro: 'Parcourez les œuvres de cet univers.',
      allCollection: 'La collection complète', noCover: 'Image non disponible', productIntro: 'Une œuvre décorative de la collection Artflow.',
      unavailable: 'Visuel de couverture en attente', noSize: 'Sélectionnez un format avant de commander.',
    },
    ar: {
      home: 'الرئيسية', all: 'جميع اللوحات', categories: 'المجموعات', about: 'من نحن',
      language: 'اللغة', explore: 'اكتشف اللوحات', heroKicker: 'الفن يجد مكانه',
      heroTitle: 'فنّ يغيّر <em>أجواء المكان.</em>',
      heroText: 'لوحات فنية تضيف طابعًا خاصًا إلى مساحاتكم وتمنح المكان إحساسًا مختلفًا.',
      heroNote: 'لوحات فريدة، ومشاعر لا تنتهي', best: 'الأكثر مبيعًا',
      bestIntro: 'أعمال اختارتها Artflow ضمن مجموعتها.', seeAll: 'عرض المجموعة',
      ourCollections: 'اكتشف عوالمنا', categoriesIntro: 'ستة عوالم فنية لتجدوا اللوحة التي تشبه ذوقكم.',
      discover: 'اكتشف', artCount: 'لوحة', from: 'ابتداءً من 230 درهم', sizes: '3 مقاسات متاحة',
      viewArtwork: 'عرض اللوحة', ourStory: 'نظرة إلى الفن والمساحات',
      storyTitle: 'أعمال تمنح جدرانكم بُعدًا مختلفًا.',
      storyText: 'تجمع Artflow مجموعة من اللوحات الفنية المختارة لتنسجم مع المساحات والذوق المختلف. من التكوينات التجريدية إلى الإلهامات المغربية، تدعوكم كل مجموعة إلى رؤية المكان بطريقة جديدة.',
      aboutLink: 'اكتشف المزيد', search: 'بحث', searchPlaceholder: 'عنوان أو لون أو فكرة…',
      category: 'الفئة', allCategories: 'جميع الفئات', color: 'اللون الغالب', allColors: 'جميع الألوان',
      sort: 'ترتيب حسب', relevance: 'الأكثر صلة', az: 'الاسم: أ إلى ي', za: 'الاسم: ي إلى أ', filters: 'التصفية', clear: 'مسح عوامل التصفية', apply: 'تطبيق',
      results: 'نتائج', result: 'نتيجة', noResults: 'لم يتم العثور على لوحات', noResultsText: 'جرّبوا كلمة أخرى أو أزيلوا بعض عوامل التصفية.',
      reset: 'مسح الكل', more: 'عرض المزيد', breadcrumbHome: 'الرئيسية',
      chooseSize: 'اختيار المقاس', sizeHelp: 'اختاروا المقاس لعرض السعر المحدد.',
      selectedSize: 'المقاس المختار', order: 'اطلب عبر واتساب', orderDisabled: 'اختاروا المقاس لإتمام الطلب',
      collection: 'المجموعة', dominant: 'اللون الغالب', related: 'قد تعجبكم أيضًا',
      aboutKicker: 'عالم Artflow', aboutTitle: 'لوحات فريدة، ومشاعر لا تنتهي.',
      aboutText1: 'تستكشف Artflow العلاقة بين الفن الديكوري والألوان ومساحات العيش. تضم المجموعة عوالم بصرية متنوعة — تجريدية وإسلامية ومغربية وبسيطة ومستوحاة من الطبيعة — لتمنح كل شخص حرية اختيار ما ينسجم مع مساحته وذوقه.',
      aboutText2: 'نؤمن أن اللوحة يمكن أن تغيّر إحساسنا بالمكان، أو تجذب النظر، أو تضيف أجواءً هادئة. تصفحوا المجموعات، واختاروا المقاس المناسب لمساحتكم، ثم تواصلوا معنا مباشرة عبر واتساب لإرسال طلبكم.',
      contact: 'اتصلوا بنا', contactTitle: 'هل أعجبتكم إحدى اللوحات؟', contactText: 'راسلونا عبر واتساب لاختيار المقاس وإرسال طلبكم.',
      whatsapp: 'واتساب', allWorks: 'جميع اللوحات', catalogCount: 'لوحة في المجموعة',
      collectionUnavailable: 'هذه المجموعة فارغة حاليًا.',
      notFound: 'الصفحة غير موجودة.', backHome: 'العودة إلى الرئيسية',
      footerIntro: 'لوحات فريدة، ومشاعر لا تنتهي. اكتشفوا مجموعات Artflow واختاروا ما يشبه ذوقكم.',
      footerExplore: 'اكتشف', footerInfo: 'معلومات', footerCopyright: 'جميع الحقوق محفوظة.',
      threeSizes: 'ثلاثة مقاسات للاختيار', orderMessage: 'السلام عليكم، أرغب في طلب اللوحة',
      reference: 'المرجع', thankYou: 'المرجو تأكيد التوفر وتفاصيل التوصيل.',
      searchBy: 'ابحثوا عن لوحة', categoryHint: 'تصفية المجموعة', categoryIntro: 'اكتشفوا الأعمال ضمن هذا العالم الفني.',
      allCollection: 'المجموعة الكاملة', noCover: 'الصورة غير متاحة', productIntro: 'لوحة فنية من مجموعة Artflow.',
      unavailable: 'صورة الغلاف بانتظار الإضافة', noSize: 'يرجى اختيار المقاس قبل الطلب.',
    }
  };

  const COLOR_HEX = {'Beige':'#d8c6a7','Blanc':'#f3f1ed','Noir':'#24212a','Gris':'#97939a','Marron':'#86624a','Bleu':'#3977bd','Vert':'#648968','Rouge':'#bf4a4a','Orange':'#d77a3c','Jaune / doré':'#c5a15b','Rose':'#d889a6','Violet':'#7950ae','Multicolore':'conic-gradient(#ec6c58,#e6c455,#68a47f,#4b82c6,#8b5ab5,#ec6c58)'};
  const COLOR_AR = {
    'Beige':'بيج','Blanc':'أبيض','Noir':'أسود','Gris':'رمادي','Marron':'بني','Bleu':'أزرق',
    'Vert':'أخضر','Rouge':'أحمر','Orange':'برتقالي','Jaune / doré':'أصفر وذهبي','Rose':'وردي',
    'Violet':'بنفسجي','Multicolore':'متعدد الألوان'
  };

  function safeStoredLanguage() {
    try { return localStorage.getItem('artflow-language') === 'ar' ? 'ar' : 'fr'; }
    catch { return 'fr'; }
  }
  const t = (key) => T[state.lang][key] || T.fr[key] || key;
  const isAr = () => state.lang === 'ar';
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const number = (value) => new Intl.NumberFormat(isAr() ? 'ar' : 'fr-FR').format(value);
  const money = (value) => isAr() ? `<bdi>${number(value)} درهم</bdi>` : `<bdi>${number(value)} DH</bdi>`;
  const langLabel = (category) => isAr() ? category.nameAr : category.nameFr;
  const titleOf = (product) => isAr() ? product.titleAr : product.titleFr;
  const altOf = (product) => isAr() ? product.altAr : product.altFr;
  const colorName = (c) => isAr() ? (COLOR_AR[c] || c) : c;
  const categoryById = (id) => state.categories.find(c => c.id === id);
  const productById = (id) => state.catalog.find(p => p.id === id);
  const productBySlug = (slug) => state.catalog.find(p => p.slug === slug);
  const categoryProducts = (id) => state.catalog.filter(p => p.categories.includes(id));
  const allColors = [...new Set(state.catalog.map(p => p.dominantColor))].sort((a,b) => a.localeCompare(b, 'fr'));
  const sizeOptions = () => state.config?.productSizeOptions || [];

  function norm(s) {
    return String(s ?? '').toLocaleLowerCase()
      .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
      .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
      .replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
  }

  function parseRoute() {
    const raw = (location.hash || '#/').replace(/^#\/?/, '');
    const parts = raw.split('/').filter(Boolean);
    if (!parts.length) return {page:'home'};
    if (parts[0] === 'catalog') return {page:'catalog'};
    if (parts[0] === 'about') return {page:'about'};
    if (parts[0] === 'contact') return {page:'contact'};
    if (parts[0] === 'category' && parts[1]) return {page:'category', categoryId:parts[1]};
    if (parts[0] === 'artwork' && parts[1]) return {page:'detail', slug:parts[1]};
    return {page:'notFound'};
  }

  function setDocumentLanguage() {
    document.documentElement.lang = isAr() ? 'ar' : 'fr';
    document.documentElement.dir = isAr() ? 'rtl' : 'ltr';
    document.body.classList.toggle('is-ar', isAr());
    try { localStorage.setItem('artflow-language', state.lang); } catch { /* storage may be disabled */ }
  }

  function header(home=false) {
    const links = [
      [`#/`,t('home')], [`#/catalog`,t('all')], [`#/`,t('categories')], [`#/about`,t('about')]
    ];
    return `<header class="site-header ${home?'header-home':''}">
      <div class="container header-inner">
        <a href="#/" aria-label="Artflow — accueil"><img class="brand-logo" src="./assets/brand/artflow-logo.svg" alt="Artflow"></a>
        <nav class="main-nav" aria-label="${isAr()?'التنقل الرئيسي':'Navigation principale'}">
          ${links.map((l,i)=>`<a href="${l[0]}" ${i===2?'data-scroll-categories="true"':''}>${l[1]}</a>`).join('')}
        </nav>
        <div class="header-actions">
          <div class="lang-switch" role="group" aria-label="${t('language')}">
            <button type="button" data-action="language" data-lang="fr" aria-pressed="${!isAr()}">FR</button>
            <button type="button" data-action="language" data-lang="ar" aria-pressed="${isAr()}">ع</button>
          </div>
          <button type="button" class="menu-toggle" aria-expanded="false" aria-label="${isAr()?'فتح القائمة':'Ouvrir le menu'}" data-action="menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
        </div>
      </div>
      <nav class="mobile-menu" aria-label="${isAr()?'قائمة الهاتف':'Menu mobile'}">
        ${links.map((l,i)=>`<a href="${l[0]}" ${i===2?'data-scroll-categories="true"':''}>${l[1]}</a>`).join('')}
      </nav>
    </header>`;
  }

  function footer() {
    const numberText = '+212 627 025 271';
    return `<footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="#/"><img class="footer-logo" src="./assets/brand/artflow-logo.svg" alt="Artflow"></a>
            <p>${t('footerIntro')}</p>
          </div>
          <div class="footer-col"><h3>${t('footerExplore')}</h3><div class="footer-links">
            <a href="#/catalog">${t('all')}</a>
            ${state.categories.filter(c=>c.id!=='meilleures-ventes').map(c=>`<a href="#/category/${c.id}">${esc(langLabel(c))}</a>`).join('')}
          </div></div>
          <div class="footer-col"><h3>${t('footerInfo')}</h3><div class="footer-links">
            <a href="#/about">${t('about')}</a>
            <a href="#/contact">${t('contact')}</a>
            <a href="https://wa.me/${state.config.whatsappNumber}" target="_blank" rel="noopener noreferrer">${t('whatsapp')} · <bdi>${numberText}</bdi></a>
          </div></div>
        </div>
        <div class="footer-bottom"><span>© ${new Date().getFullYear()} ARTFLOW. ${t('footerCopyright')}</span><span>${isAr()?'Tableaux uniques, émotions infinies':'Tableaux uniques, émotions infinies'}</span></div>
      </div>
    </footer>
    <a class="whatsapp-float" href="https://wa.me/${state.config.whatsappNumber}" target="_blank" rel="noopener noreferrer" aria-label="${t('whatsapp')}" title="${t('whatsapp')}">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.9 11.9 0 0 0 12.05 0C5.5 0 .17 5.32.17 11.87c0 2.1.55 4.15 1.6 5.96L.07 24l6.33-1.66a11.9 11.9 0 0 0 5.65 1.44h.01c6.54 0 11.87-5.32 11.87-11.87 0-3.17-1.24-6.15-3.43-8.41ZM12.06 21.7h-.01a9.88 9.88 0 0 1-5.03-1.37l-.36-.21-3.76.99 1-3.66-.23-.38a9.86 9.86 0 0 1-1.51-5.2c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.99c0 5.45-4.44 9.88-9.89 9.88Zm5.42-7.4c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.69.15-.2.3-.79.97-.96 1.17-.18.2-.36.23-.66.08-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.36.45-.53.15-.18.2-.31.3-.51.1-.2.05-.38-.02-.53-.08-.15-.69-1.66-.94-2.27-.25-.59-.5-.51-.69-.52h-.58c-.2 0-.53.08-.81.38-.28.3-1.06 1.03-1.06 2.52s1.09 2.93 1.24 3.13c.15.2 2.14 3.27 5.19 4.59.72.31 1.29.5 1.73.64.73.23 1.39.2 1.91.12.59-.09 1.77-.72 2.02-1.41.25-.69.25-1.28.18-1.41-.08-.12-.28-.2-.58-.35Z"/></svg>
    </a>`;
  }

  function categoryCards() {
    return `<div class="category-grid">${state.categories.map(cat=>{
      const cover=productById(cat.coverArtworkId);
      const coverImage=cover?`<img src="${cover.image}" alt="${esc(isAr()?cover.altAr:cover.altFr)}" loading="lazy" decoding="async">`:`<span>${t('noCover')}</span>`;
      const countLabel=isAr()?`${number(cat.count)} ${t('artCount')}`:`${number(cat.count)} ${t('artCount')}`;
      return `<a class="category-card" href="#/category/${cat.id}">
        <div class="category-card-media">${coverImage}</div>
        <div class="category-card-copy"><h3>${esc(langLabel(cat))}</h3><p>${esc(countLabel)}</p>
          <span class="category-card-arrow">${t('discover')} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span>
        </div></a>`;
    }).join('')}</div>`;
  }

  function productCard(p) {
    return `<article class="product-card">
      <a class="product-card-link" href="#/artwork/${encodeURIComponent(p.slug)}" aria-label="${esc(t('viewArtwork'))} : ${esc(titleOf(p))}">
        <div class="product-image"><img src="${p.image}" alt="${esc(altOf(p))}" loading="lazy" decoding="async"></div>
        <h3 class="product-title">${esc(titleOf(p))}</h3>
        <p class="product-price">${t('from')}</p>
        <p class="product-meta">${t('sizes')}</p>
        <span class="product-view">${t('viewArtwork')} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span>
      </a>
    </article>`;
  }

  function homeCarousel() {
    const ids=state.config.bestSellerArtworkIds || [];
    const products=ids.map(productById).filter(Boolean);
    if (!products.length) return `<div class="empty-state"><h3>${t('collectionUnavailable')}</h3><p>${t('bestIntro')}</p></div>`;
    state.carouselIndex=Math.min(state.carouselIndex,products.length-1);
    const cards=products.map((p,i)=>`<a class="showcase-card" data-carousel-card="${i}" href="#/artwork/${encodeURIComponent(p.slug)}" tabindex="-1" aria-label="${esc(titleOf(p))}">
      <img src="${p.image}" alt="${esc(altOf(p))}" loading="lazy" decoding="async">
    </a>`).join('');
    return `<div class="best-showcase" data-carousel>
      <div class="carousel-stage" aria-label="${t('best')}" role="group">${cards}</div>
      <div class="carousel-info" aria-live="polite"><h3 id="carousel-title"></h3><p id="carousel-price">${t('from')}</p><a id="carousel-link" class="btn btn-primary" href="#/catalog">${t('viewArtwork')}</a></div>
      <div class="carousel-controls">
        <button class="circle-control" type="button" data-action="carousel-prev" aria-label="${isAr()?'السابق':'Précédent'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 18l-6-6 6-6"/></svg></button>
        <div class="carousel-dots">${products.map((p,i)=>`<button type="button" class="carousel-dot" data-action="carousel-go" data-index="${i}" aria-label="${isAr()?'اللوحة':'Œuvre'} ${i+1}" aria-current="${i===state.carouselIndex}"></button>`).join('')}</div>
        <button class="circle-control" type="button" data-action="carousel-next" aria-label="${isAr()?'التالي':'Suivant'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18l6-6-6-6"/></svg></button>
      </div>
    </div>`;
  }

  function loadApprovedHeroCover() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const image = new Image();
    image.onload = () => {
      hero.style.setProperty('--approved-hero-image', `url("${image.src}")`);
      hero.classList.add('has-approved-cover');
    };
    // This path is intentionally reserved for the approved asset from the source hero/ folder.
    image.src = './assets/hero/cover.webp';
  }

  function renderHome() {
    return `${header(true)}<main>
      <section class="hero" aria-labelledby="hero-title"><div class="container hero-inner">
        <div class="hero-copy"><span class="eyebrow">${t('heroKicker')}</span>
          <h1 id="hero-title">${t('heroTitle')}</h1>
          <p class="hero-description">${t('heroText')}</p>
          <div class="hero-actions"><a class="btn btn-light" href="#/catalog">${t('explore')} <span aria-hidden="true">↗</span></a><a class="btn btn-outline-light" href="#/about">${t('about')}</a></div>
          <p class="hero-note">${t('heroNote')}</p>
        </div>
      </div></section>
      <section class="section best-section" aria-labelledby="best-heading"><div class="container">
        <div class="section-heading"><div class="section-heading-copy"><p class="kicker">ARTFLOW · CURATION</p><h2 id="best-heading">${t('best')}</h2><p>${t('bestIntro')}</p></div><a class="text-link" href="#/category/meilleures-ventes">${t('seeAll')} ↗</a></div>
        ${homeCarousel()}
      </div></section>
      <section class="section" id="collections"><div class="container">
        <div class="section-heading"><div class="section-heading-copy"><p class="kicker">COLLECTIONS ARTFLOW</p><h2>${t('ourCollections')}</h2><p>${t('categoriesIntro')}</p></div><a class="text-link" href="#/catalog">${t('all')} ↗</a></div>
        ${categoryCards()}
      </div></section>
      <section class="section brand-story"><div class="container story-inner"><div class="story-mark" aria-hidden="true">A.</div><div class="story-copy"><p class="kicker">${t('ourStory')}</p><h2>${t('storyTitle')}</h2><p>${t('storyText')}</p><a class="text-link" href="#/about">${t('aboutLink')} ↗</a></div></div></section>
    </main>${footer()}`;
  }

  function pageTop(title, description, breadcrumb=true) {
    return `<section class="page-top"><div class="container">
      ${breadcrumb?`<nav class="breadcrumbs" aria-label="${isAr()?'مسار التنقل':'Fil d’Ariane'}"><a href="#/">${t('breadcrumbHome')}</a><span> / </span><a href="#/catalog">${t('all')}</a>${state.route.page==='category'?`<span> / </span><span>${esc(title)}</span>`:''}</nav>`:''}
      <div class="page-heading"><p class="kicker">ARTFLOW · ${t('allWorks')}</p><h1>${esc(title)}</h1><p>${esc(description)}</p></div>
    </div></section>`;
  }

  function renderListingPage({title, description, categoryId=''}) {
    const isCategory=Boolean(categoryId);
    const cat=categoryId?categoryById(categoryId):null;
    state.listing={categoryId, isCategory};
    const baseItems=isCategory?categoryProducts(categoryId):state.catalog;
    const uniqueColors=[...new Set(baseItems.map(p=>p.dominantColor))].sort((a,b)=>a.localeCompare(b,'fr'));
    const categoryOptions=state.categories.map(c=>`<option value="${c.id}" ${state.categoryFilter===c.id?'selected':''}>${esc(langLabel(c))}</option>`).join('');
    const colorOptions=uniqueColors.map(c=>`<button class="color-swatch ${state.colorFilter===c?'is-selected':''}" type="button" data-action="select-color" data-color="${esc(c)}" aria-pressed="${state.colorFilter===c}"><span class="swatch-dot" style="--swatch:${COLOR_HEX[c]}" aria-hidden="true"></span><span>${esc(colorName(c))}</span></button>`).join('');
    return `${header()}<main class="page-shell">
      ${pageTop(title,description)}
      <section class="section-tight"><div class="container">
        <div class="result-toolbar"><div><strong id="result-count">${number(baseItems.length)}</strong> <span id="result-label">${baseItems.length===1?t('result'):t('results')}</span></div>
          <button class="filter-toggle" type="button" data-action="toggle-filters" aria-expanded="false"><span>☷</span> ${t('filters')}</button>
        </div>
        <div class="filter-panel" id="filter-panel">
          <div class="field"><label for="search-field">${t('search')}</label><div class="search-wrap"><svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10.8" cy="10.8" r="6.6"/><path d="m16 16 5 5"/></svg><input id="search-field" type="search" data-action="search" value="${esc(state.searchQuery)}" placeholder="${t('searchPlaceholder')}" autocomplete="off"></div></div>
          ${!isCategory?`<div class="field"><label for="category-field">${t('category')}</label><select id="category-field" data-action="category-filter"><option value="">${t('allCategories')}</option>${categoryOptions}</select></div>`:''}
          <div class="field color-field"><label>${t('color')}</label><div class="color-swatches">${colorOptions}</div></div>
          <div class="field"><label for="sort-field">${t('sort')}</label><select id="sort-field" data-action="sort"><option value="relevance" ${state.sortKey==='relevance'?'selected':''}>${t('relevance')}</option><option value="az" ${state.sortKey==='az'?'selected':''}>${t('az')}</option><option value="za" ${state.sortKey==='za'?'selected':''}>${t('za')}</option></select></div>
          <div class="filter-actions"><button class="clear-filters" type="button" data-action="clear-filters">${t('clear')}</button><button class="filter-apply" type="button" data-action="close-filters">${t('apply')}</button></div>
        </div>
        <div class="active-filters" id="active-filters"></div>
        <div id="listing-results"><div class="product-grid" id="product-grid"></div></div>
        <div class="load-more-wrap" id="load-more-wrap"></div>
      </div></section>
    </main>${footer()}`;
  }

  function makeSearchText(p) {
    const cats=p.categories.map(id=>categoryById(id)).filter(Boolean).flatMap(c=>[c.nameFr,c.nameAr]);
    return norm([p.titleFr,p.titleAr,...(p.aliases||[]),...(p.keywordsFr||[]),...(p.keywordsAr||[]),...cats,p.dominantColor].join(' '));
  }

  function filterProducts() {
    const listing=state.listing || {categoryId:'',isCategory:false};
    let items=listing.isCategory?categoryProducts(listing.categoryId):state.catalog.slice();
    const query=norm(state.searchQuery);
    if (query) items=items.filter(p=>makeSearchText(p).includes(query));
    if (!listing.isCategory && state.categoryFilter) items=items.filter(p=>p.categories.includes(state.categoryFilter));
    if (state.colorFilter) items=items.filter(p=>p.dominantColor===state.colorFilter);
    if (state.sortKey==='az') items.sort((a,b)=>titleOf(a).localeCompare(titleOf(b),isAr()?'ar':'fr'));
    if (state.sortKey==='za') items.sort((a,b)=>titleOf(b).localeCompare(titleOf(a),isAr()?'ar':'fr'));
    return items;
  }

  function activeFilterMarkup() {
    const items=[];
    if (state.searchQuery) items.push({type:'search',label:state.searchQuery});
    if (state.listing && !state.listing.isCategory && state.categoryFilter) {
      const c=categoryById(state.categoryFilter); if (c) items.push({type:'category',label:langLabel(c)});
    }
    if (state.colorFilter) items.push({type:'color',label:colorName(state.colorFilter)});
    return items.map(x=>`<span class="filter-chip">${esc(x.label)} <button type="button" data-action="remove-filter" data-filter="${x.type}" aria-label="${isAr()?'إزالة':'Retirer'}">×</button></span>`).join('');
  }

  function refreshListing() {
    if (!state.listing) return;
    const items=filterProducts();
    const visible=items.slice(0,state.visibleCount);
    const grid=document.getElementById('product-grid');
    const active=document.getElementById('active-filters');
    const count=document.getElementById('result-count');
    const label=document.getElementById('result-label');
    const more=document.getElementById('load-more-wrap');
    if (!grid || !active || !count || !label || !more) return;
    count.textContent=number(items.length);
    label.textContent=items.length===1?t('result'):t('results');
    active.innerHTML=activeFilterMarkup();
    if (!items.length) {
      grid.innerHTML=`<div class="empty-state" style="grid-column:1/-1"><h3>${t('noResults')}</h3><p>${t('noResultsText')}</p><button class="btn btn-primary" data-action="clear-filters" type="button">${t('reset')}</button></div>`;
      more.innerHTML='';
      return;
    }
    grid.innerHTML=visible.map(productCard).join('');
    more.innerHTML=items.length>state.visibleCount?`<button class="btn btn-outline" type="button" data-action="more">${t('more')} (${number(items.length-state.visibleCount)})</button>`:'';
  }

  function renderDetail(p) {
    if (state.currentProductId!==p.id) {
      state.selectedSizeId='';
      state.currentProductId=p.id;
    }
    const relevantCategories=p.categories.map(categoryById).filter(Boolean);
    const firstCategory=relevantCategories.find(c=>c.id!=='meilleures-ventes')||relevantCategories[0];
    const relatedIds=p.categories.filter(id=>id!=='meilleures-ventes');
    let related=[];
    for (const catId of relatedIds) {
      related=related.concat(categoryProducts(catId).filter(x=>x.id!==p.id&&!related.some(r=>r.id===x.id)));
    }
    related=related.slice(0,4);
    const sizeHtml=sizeOptions().map(o=>`<button class="size-option" type="button" data-action="select-size" data-size="${o.id}" aria-pressed="${state.selectedSizeId===o.id}"><span>${esc(o.label)}</span><span>${money(o.priceMAD)}</span></button>`).join('');
    return `${header()}<main class="page-shell">
      <div class="container product-detail">
        <nav class="breadcrumbs" aria-label="${isAr()?'مسار التنقل':'Fil d’Ariane'}"><a href="#/">${t('breadcrumbHome')}</a><span> / </span><a href="#/catalog">${t('all')}</a><span> / </span><span>${esc(titleOf(p))}</span></nav>
        <div class="detail-grid">
          <div class="detail-image"><img src="${p.image}" alt="${esc(altOf(p))}" fetchpriority="high"></div>
          <section class="detail-info" aria-labelledby="detail-title">
            <p class="kicker">${esc(firstCategory?langLabel(firstCategory):'ARTFLOW')}</p>
            <h1 id="detail-title">${esc(titleOf(p))}</h1>
            <p class="detail-description">${t('productIntro')}</p>
            <p id="detail-price" class="detail-price">${t('from')}</p>
            <div class="field"><label>${t('chooseSize')}</label><div class="size-options">${sizeHtml}</div></div>
            <p id="selected-size-note" class="selected-size-note">${state.selectedSizeId?t('selectedSize'):t('sizeHelp')}</p>
            <button id="order-button" class="btn btn-primary order-button" type="button" data-action="order" ${state.selectedSizeId?'':'disabled'}>${t('order')}</button>
            <div class="detail-tags">
              ${relevantCategories.map(c=>`<a class="detail-tag" href="#/category/${c.id}">${esc(langLabel(c))}</a>`).join('')}
              <span class="detail-tag">${t('dominant')} · ${esc(colorName(p.dominantColor))}</span>
            </div>
            <hr class="detail-divider">
            <p class="detail-small">${t('threeSizes')} · ${sizeOptions().map(o=>`${esc(o.label)} — ${money(o.priceMAD)}`).join(' · ')}</p>
          </section>
        </div>
      </div>
      ${related.length?`<section class="section-tight related-section"><div class="container"><div class="section-heading"><div class="section-heading-copy"><p class="kicker">ARTFLOW</p><h2>${t('related')}</h2></div></div><div class="product-grid">${related.map(productCard).join('')}</div></div></section>`:''}
    </main>${footer()}`;
  }

  function renderAbout() {
    return `${header()}<main class="page-shell"><section class="about-hero"><div class="container"><p class="kicker">${t('aboutKicker')}</p><h1>${t('aboutTitle')}</h1><p>${t('aboutText1')}</p></div></section>
      <section class="about-body"><div class="container about-columns"><div><h2>${t('ourStory')}</h2><p>${t('aboutText2')}</p></div><div class="contact-panel"><div><h2>${t('contactTitle')}</h2><p>${t('contactText')}</p></div><a class="btn btn-light" href="https://wa.me/${state.config.whatsappNumber}" target="_blank" rel="noopener noreferrer">${t('whatsapp')} ↗</a></div></div></section></main>${footer()}`;
  }

  function renderContact() {
    return `${header()}<main class="page-shell"><section class="about-hero"><div class="container"><p class="kicker">ARTFLOW · ${t('contact')}</p><h1>${t('contactTitle')}</h1><p>${t('contactText')}</p><div class="hero-actions"><a class="btn btn-primary" href="https://wa.me/${state.config.whatsappNumber}" target="_blank" rel="noopener noreferrer">${t('whatsapp')} · <bdi>+212 627 025 271</bdi> ↗</a></div></div></section></main>${footer()}`;
  }

  function renderNotFound() {
    return `${header()}<main class="page-shell"><section class="section"><div class="container empty-state"><h3>${t('notFound')}</h3><p>${t('noResultsText')}</p><a class="btn btn-primary" href="#/">${t('backHome')}</a></div></section></main>${footer()}`;
  }

  function applyCarousel() {
    const root=document.querySelector('[data-carousel]');
    if (!root) return;
    const cards=[...root.querySelectorAll('[data-carousel-card]')];
    const ids=state.config.bestSellerArtworkIds || [];
    const products=ids.map(productById).filter(Boolean);
    const n=cards.length;
    cards.forEach((card,i)=>{
      let delta=i-state.carouselIndex;
      if (n>2) {
        if (delta>n/2) delta-=n;
        if (delta< -n/2) delta+=n;
      }
      const abs=Math.abs(delta);
      const step=window.innerWidth<760?112:160;
      const scale=abs===0?1:abs===1?.84:abs===2?.68:.54;
      const rot=delta===0?0:delta*(window.innerWidth<760?4:5);
      const opacity=abs<=2?1-(abs*.17):0;
      card.style.transform=`translate(-50%, 0) translateX(${delta*step}px) scale(${scale}) rotate(${rot}deg)`;
      card.style.zIndex=String(10-abs);
      card.style.opacity=String(opacity);
      card.style.pointerEvents=abs<=2?'auto':'none';
      card.tabIndex=abs<=1?0:-1;
      card.classList.toggle('is-active',delta===0);
      card.setAttribute('aria-current',String(delta===0));
      card.setAttribute('aria-hidden',String(abs>2));
    });
    const active=products[state.carouselIndex];
    const title=root.querySelector('#carousel-title');
    const price=root.querySelector('#carousel-price');
    const link=root.querySelector('#carousel-link');
    if (active && title && price && link) {
      title.textContent=titleOf(active);
      price.textContent=t('from');
      link.href=`#/artwork/${encodeURIComponent(active.slug)}`;
    }
    root.querySelectorAll('[data-action="carousel-go"]').forEach(dot=>dot.setAttribute('aria-current',String(Number(dot.dataset.index)===state.carouselIndex)));
  }

  function setCarousel(next) {
    const count=(state.config.bestSellerArtworkIds||[]).filter(productById).length;
    if (!count) return;
    state.carouselIndex=(next+count)%count;
    applyCarousel();
  }

  function whatsappMessage(product, option) {
    if (isAr()) {
      return `${t('orderMessage')} « ${product.titleAr} » (${t('reference')} ${product.id})، بمقاس ${option.label}، بسعر ${option.priceMAD} درهم. ${t('thankYou')}`;
    }
    return `${t('orderMessage')} « ${product.titleFr} » (${t('reference')} ${product.id}), au format ${option.label}, au prix de ${option.priceMAD} DH. ${t('thankYou')}`;
  }

  function updateDetailSize() {
    const p=productById(state.currentProductId);
    if (!p) return;
    const option=sizeOptions().find(o=>o.id===state.selectedSizeId);
    document.querySelectorAll('[data-action="select-size"]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.size===state.selectedSizeId)));
    const price=document.getElementById('detail-price');
    const note=document.getElementById('selected-size-note');
    const btn=document.getElementById('order-button');
    if (!option) {
      if (price) price.textContent=t('from');
      if (note) note.textContent=t('sizeHelp');
      if (btn) { btn.disabled=true; btn.textContent=t('orderDisabled'); }
      return;
    }
    if (price) price.innerHTML=money(option.priceMAD);
    if (note) note.textContent=`${t('selectedSize')} : ${option.label}`;
    if (btn) { btn.disabled=false; btn.textContent=t('order'); }
  }

  function updateListingControls() {
    const search=document.getElementById('search-field');
    const cat=document.getElementById('category-field');
    const sort=document.getElementById('sort-field');
    if (search) search.value=state.searchQuery;
    if (cat) cat.value=state.categoryFilter;
    document.querySelectorAll('[data-action="select-color"]').forEach(btn=>{ const selected=btn.dataset.color===state.colorFilter; btn.setAttribute('aria-pressed',String(selected)); btn.classList.toggle('is-selected',selected); });
    if (sort) sort.value=state.sortKey;
  }

  function render() {
    state.route=parseRoute();
    setDocumentLanguage();
    state.listing=null;
    let html='';
    if (state.route.page==='home') html=renderHome();
    else if (state.route.page==='catalog') html=renderListingPage({title:t('all'),description:`${number(state.catalog.length)} ${t('catalogCount')}.`});
    else if (state.route.page==='category') {
      const cat=categoryById(state.route.categoryId);
      if (!cat) html=renderNotFound();
      else html=renderListingPage({title:langLabel(cat),description:cat.introFr && !isAr()?cat.introFr:cat.introAr,categoryId:cat.id});
    }
    else if (state.route.page==='detail') {
      const p=productBySlug(state.route.slug);
      if (!p) html=renderNotFound();
      else html=renderDetail(p);
    }
    else if (state.route.page==='about') html=renderAbout();
    else if (state.route.page==='contact') html=renderContact();
    else html=renderNotFound();
    document.getElementById('app').innerHTML=html;
    document.title=state.route.page==='home'?'Artflow — Tableaux uniques, émotions infinies':`${state.route.page==='detail'&&productBySlug(state.route.slug)?titleOf(productBySlug(state.route.slug))+' — ':''}Artflow`;
    if (state.route.page==='home') { applyCarousel(); loadApprovedHeroCover(); }
    if (state.route.page==='catalog' || state.route.page==='category') refreshListing();
    if (state.route.page==='detail') updateDetailSize();
    window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'instant'});
  }

  document.addEventListener('click', (event) => {
    const target=event.target.closest('[data-action]');
    if (!target) {
      const scroll=event.target.closest('[data-scroll-categories]');
      if (scroll) {
        event.preventDefault();
        if (state.route.page==='home') document.getElementById('collections')?.scrollIntoView({behavior:'smooth'});
        else location.hash='#/';
      }
      return;
    }
    const action=target.dataset.action;
    if (action==='language') {
      const lang=target.dataset.lang;
      if (lang==='fr'||lang==='ar') { state.lang=lang; render(); }
    }
    if (action==='menu') {
      const menu=document.querySelector('.mobile-menu');
      const open=!menu?.classList.contains('is-open');
      menu?.classList.toggle('is-open',open);
      target.setAttribute('aria-expanded',String(open));
    }
    if (action==='toggle-filters' || action==='close-filters') {
      const panel=document.getElementById('filter-panel');
      const open=action==='close-filters'?false:!panel?.classList.contains('is-open');
      panel?.classList.toggle('is-open',open);
      document.querySelector('[data-action="toggle-filters"]')?.setAttribute('aria-expanded',String(open));
    }
    if (action==='clear-filters') {
      state.searchQuery=''; state.categoryFilter=''; state.colorFilter=''; state.sortKey='relevance'; state.visibleCount=24;
      updateListingControls(); refreshListing();
    }
    if (action==='remove-filter') {
      const type=target.dataset.filter;
      if (type==='search') state.searchQuery='';
      if (type==='category') state.categoryFilter='';
      if (type==='color') state.colorFilter='';
      state.visibleCount=24; updateListingControls(); refreshListing();
    }
    if (action==='more') { state.visibleCount+=24; refreshListing(); }
    if (action==='select-color') { state.colorFilter=state.colorFilter===target.dataset.color?'':target.dataset.color; state.visibleCount=24; updateListingControls(); refreshListing(); }
    if (action==='carousel-prev') setCarousel(state.carouselIndex-1);
    if (action==='carousel-next') setCarousel(state.carouselIndex+1);
    if (action==='carousel-go') setCarousel(Number(target.dataset.index));
    if (action==='select-size') { state.selectedSizeId=target.dataset.size; updateDetailSize(); }
    if (action==='order') {
      const p=productById(state.currentProductId);
      const option=sizeOptions().find(o=>o.id===state.selectedSizeId);
      if (p && option && !target.disabled) {
        const url=`https://wa.me/${state.config.whatsappNumber}?text=${encodeURIComponent(whatsappMessage(p,option))}`;
        window.open(url,'_blank','noopener,noreferrer');
      }
    }
  });

  document.addEventListener('input', (event) => {
    const el=event.target;
    if (el.matches('[data-action="search"]')) {
      state.searchQuery=el.value; state.visibleCount=24; refreshListing();
    }
  });
  document.addEventListener('change', (event) => {
    const el=event.target;
    if (el.matches('[data-action="category-filter"]')) { state.categoryFilter=el.value; state.visibleCount=24; refreshListing(); }
    if (el.matches('[data-action="sort"]')) { state.sortKey=el.value; state.visibleCount=24; refreshListing(); }
  });
  window.addEventListener('hashchange', () => {
    const next=parseRoute();
    const old=state.route;
    if (next.page==='detail' && old.page==='detail' && next.slug!==old.slug) state.selectedSizeId='';
    state.route=next;
    render();
  });
  window.addEventListener('resize', () => { if (state.route.page==='home') applyCarousel(); });
  const carouselStage = () => document.querySelector('.carousel-stage');
  document.addEventListener('pointerdown',(e)=>{
    const stage=carouselStage(); if (stage && stage.contains(e.target)) state.carouselStartX=e.clientX;
  });
  document.addEventListener('pointerup',(e)=>{
    if (state.carouselStartX===null) return;
    const delta=e.clientX-state.carouselStartX; state.carouselStartX=null;
    if (Math.abs(delta)>38) setCarousel(state.carouselIndex+(delta<0?1:-1));
  });
  document.addEventListener('keydown',(e)=>{
    if (state.route.page==='home' && (e.key==='ArrowLeft'||e.key==='ArrowRight') && document.activeElement?.closest('[data-carousel]')) {
      e.preventDefault(); setCarousel(state.carouselIndex+(e.key==='ArrowRight'?1:-1));
    }
  });

  async function start() {
    try {
      const [catalog,categories,config]=await Promise.all([
        fetch('./data/catalog.json').then(r=>{if(!r.ok)throw new Error('catalog');return r.json();}),
        fetch('./data/categories.json').then(r=>{if(!r.ok)throw new Error('categories');return r.json();}),
        fetch('./data/store-config.json').then(r=>{if(!r.ok)throw new Error('config');return r.json();})
      ]);
      state.catalog=catalog; state.categories=categories; state.config=config;
      // Fail closed on malformed IDs or missing shared options.
      const validIds=new Set(state.catalog.map(p=>p.id));
      state.config.bestSellerArtworkIds=[...new Set(state.config.bestSellerArtworkIds||[])].filter(id=>validIds.has(id));
      if (!Array.isArray(state.config.productSizeOptions) || state.config.productSizeOptions.length!==3) throw new Error('Invalid product size configuration');
      render();
    } catch (error) {
      document.getElementById('app').innerHTML=`<main class="section"><div class="container empty-state"><h1>Artflow</h1><p>Le catalogue n’a pas pu être chargé. Vérifiez les fichiers du dossier <code>data</code>.</p></div></main>`;
      console.error('Artflow initialization failed:',error);
    }
  }
  start();
})();
