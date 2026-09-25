/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'musicopoli', // usato per localStorage lang
    whatsapp: {
      number: '393338366044',
      message: 'Buongiorno, vi scrivo dal sito di Musicopoli: vorrei prenotare la lezione di prova gratuita. ',
      ids: ['heroWhatsapp'],
    },
    /* orari: per giorno (0=domenica) un array di finestre [inizio, fine]
       in minuti-stringa 'HH:MM'. Fine oltre '24:00' = scavalca mezzanotte
       (es. ['18:00','24:30'] = apre alle 18, chiude alle 00:30 del giorno
       dopo). Giorno chiuso = []. */
    hours: {
      0: [['10:00', '21:00']],
      1: [['09:00', '23:00']],
      2: [['09:00', '23:00']],
      3: [['09:00', '23:00']],
      4: [['09:00', '23:00']],
      5: [['09:00', '23:00']],
      6: [['10:00', '21:00']]
    },
    hoursStatusId: 'orarioStato',     // elemento testo stato
    hoursTableSelector: '[data-day]', // righe/li con data-day da evidenziare
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1500,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 960,
    /* dizionario EN: SOLO overlay — l'HTML è la versione italiana.
       Forma storica a due lingue, resta valida e invariata. */
    EN: {
      "m.top": "Musicopoli, back to the top",
      "m.nav": "Sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "i.cosa": "from 4 to 94 years old",
      "i.skip": "Skip",
      "n.sotto": "City of the Arts",
      "n.seq": "By age",
      "n.corsi": "Courses",
      "n.estate": "Summer",
      "n.storia": "Our story",
      "n.sedi": "Locations",
      "n.dove": "Hours and contacts",
      "n.wa": "WhatsApp",
      "h.eti": "Music and dance school · Milan",
      "h.t": "From <span class=\"num\">4</span> to <span class=\"num\">94</span>.",
      "h.s": "At Musicopoli, talent has no age.",
      "h.p": "Singing, instruments, dance, English and summer holidays, for children, teenagers and adults: for more than thirty years in Via Boifava, near Gratosoglio, and at Piazza Buonarroti. <strong>The first trial lesson is free.</strong>",
      "h.wa": "Book the free trial",
      "h.seq": "What you can do at your age",
      "h.voto": "4.9 from 150 Google reviews",
      "s.t": "What can you do at your age?",
      "s.s": "Thirteen courses, from 4 to 94. Tap an age and the ones for you light up.",
      "s.play": "Run through the ages from 4 to 94",
      "s.cap": "Musicopoli courses by age: one row per course, one column per age",
      "s.eta": "age",
      "q.canto": "Singing",
      "q.strumenti": "Instruments",
      "q.classica": "Ballet",
      "q.moderna": "Modern dance",
      "q.hiphop": "Hip hop and urban",
      "q.ballainforma": "Dance to stay fit",
      "q.yoga": "Yoga",
      "q.zumba": "Zumba",
      "q.pilates": "Pilates",
      "q.inglese": "English",
      "q.campus": "City campus",
      "q.pinarella": "Holidays in Pinarella",
      "q.chester": "Camp in Chester",
      "c.eti": "Courses",
      "c.t": "We sing, we play, we dance.",
      "c.s": "Lessons with teachers who are musicians and dancers, for people starting from zero and for those who want to make it their job. The first one is always a trial, and free.",
      "g.voce": "Voice and instruments",
      "g.danza": "Dance",
      "g.adulti": "For adults",
      "g.inglese": "English",
      "g.esami": "Students of an instrument or singing can take the London College of Music exams (University of West London), which Musicopoli is accredited with.",
      "g.adultinota": "And of course singing, instruments, English and hip hop: there is everything for adults, including a free hip hop course.",
      "q.canto2": "Singing",
      "q.strumenti2": "Instruments",
      "q.classica2": "Ballet",
      "q.moderna2": "Modern dance",
      "q.hiphop2": "Hip hop and urban dance",
      "q.ballainforma2": "Dance to stay fit",
      "q.inglese2": "English for everyone",
      "q.campus2": "City campus",
      "q.pinarella2": "Art holidays in Pinarella",
      "q.chester2": "Summer camp in Chester",
      "e.canto": "from 4 to 94",
      "e.strumenti": "from 4 to 94",
      "e.classica": "from 4 to 15",
      "e.moderna": "from 4 to 14",
      "e.hiphop": "from 6 to 94",
      "e.ballainforma": "from 18 to 94",
      "e.yoga": "from 18 to 94",
      "e.zumba": "from 18 to 94",
      "e.pilates": "from 18 to 94",
      "e.inglese": "from 4 to 94",
      "e.campus": "from 6 to 11",
      "e.pinarella": "from 6 to 15",
      "e.chester": "from 12 to 17",
      "d.canto": "Modern singing for children, teenagers and adults, with vocal technique and choir. At the end of the year you sing on the stage of the recital, backed by a real band of students.",
      "d.strumenti": "One-to-one lessons in classical, rock, blues and jazz guitar, electric bass, keyboard, classical and modern piano, saxophone, flute, drums, percussion, harmonica, violin. And from this year the accordion, even starting from zero.",
      "d.classica": "Posture, balance, musicality, expressiveness: a path of discipline and emotion. No experience needed, just the wish to start.",
      "d.moderna": "Movement, choreography and lots of music, for the little ones and for teenagers.",
      "d.hiphop": "Hip hop, commercial and today's street styles, on the hits of the moment. For adults the course is free.",
      "d.ballainforma": "Dancing to feel good, at any age.",
      "d.yoga": "Breath, balance and calm.",
      "d.zumba": "An hour of music and movement, for anyone who wants to have fun.",
      "d.pilates": "Posture, strength and flexibility, calmly.",
      "d.inglese": "One-to-one, group and conversation courses for children from 4, teenagers and adults, and preparation for the Cambridge exams: Starters, Movers, Flyers, KET, PET and First. Lots of speaking, to get the right pronunciation.",
      "d.campus": "In Milan, from June to September, at our locations: painting, sculpture, drama, singing, dance, music and cooking workshops, the swimming pool once a week, the city's museums and parks.",
      "d.pinarella": "By the sea in Pinarella di Cervia: music, drama, dance, painting, sculpture, cooking, beach sports, instrument lessons for those who want them, and every year a whole day at Mirabilandia. Also as a first holiday without parents.",
      "d.chester": "In England, on the University of Chester campus: English lessons with native-speaker teachers in small classes, activities every afternoon and every evening, trips, and our staff always with the kids.",
      "f.band": "The rehearsal room: drums, keyboard, amplifiers and an electric guitar",
      "f.bandc": "The rehearsal room, in Via Boifava 29/A.",
      "f.piano": "The piano room, with the score open and the red chairs",
      "f.pianoc": "The piano room.",
      "f.chitarre": "The guitar room: a classical guitar, the music stand and two amplifiers",
      "f.chitarrec": "The guitar room.",
      "f.batteria": "The gold drum kit, the cymbals and the congas",
      "f.batteriac": "Drums and percussion.",
      "f.danza": "The dance room with its wooden floor, mirrors and the circus mural",
      "f.danzac": "The room with the circus mural.",
      "f.grande": "The big hall with the mirror and the magenta roll-ups",
      "f.grandec": "The big hall, for rehearsals and recitals.",
      "f.salotto": "The little lounge with two red sofas on the wooden floor",
      "f.salottoc": "The lounge, between one lesson and the next.",
      "f.vetrina": "The shop window with a guitarist's silhouette and «It's time to learn English!» on the Union Jack",
      "f.vetrinac": "The window in Via Boifava.",
      "f.nuova": "The new dance room in Via Boifava 4C: wooden floor, mirrors and curtains with magenta pelmets",
      "f.facciata": "The Via Boifava building with the big mural and the magenta Musicopoli sign",
      "f.facciatac": "Via Boifava: the mural and the sign.",
      "f.murales": "The black, green and red mural under the portico",
      "f.muralesc": "The murals under the portico.",
      "f.ingresso": "The entrance of Via Boifava 29/A with the magenta Musicopoli sign",
      "v.eti": "Summer",
      "v.t": "In summer we set off.",
      "v.s": "Since 1997 Musicopoli has organised holidays for children and teenagers: educators always there from departure to return, and families updated every day.",
      "v.q": "«I'm waiting eleven months to be able to go back!!!»",
      "v.qf": "Serena Giulia Esposito, back from Chester (Google review)",
      "t.eti": "Our story",
      "t.t": "The city of the arts.",
      "t.p1": "Musicopoli was born in 1991 in a primary school in Gratosoglio, from a group of professional musicians: free music courses for children and music therapy sessions for children with disabilities.",
      "t.p2": "Since then we have been a non-profit social promotion association and a landmark of the neighbourhood: affordable courses, free workshops such as Piccoli Chef and TrovoLavoro, and since 2009 the Via Boifava premises granted by Municipio 5.",
      "t.p3": "Here, at 14, Alessandro Mahmoud, known as Mahmood, started studying singing: he won Sanremo in 2019 and 2022. Like him, thousands of kids from every background have grown up with us.",
      "t.firma": "Our president is Andrea Cerati.",
      "l.eti": "Locations",
      "l.t": "Three locations in Milan.",
      "l.b29": "At the corner of Via dei Missaglia. MM2 Abbiategrasso, trams 3 and 15, bus 79.",
      "l.b4": "The new location, since 14 September 2026: a new, bright dance room. Bus 79.",
      "l.dd": "At Piazza Buonarroti. MM1 Buonarroti.",
      "r.eti": "4.9 from 150 Google reviews",
      "r.t": "What people say",
      "rc.1": "Qualified staff attentive to every need of little ones and grown-ups. Loads of activities. Children and teenagers are given responsibility through play, and learn to be punctual and tidy. Families are updated in real time with short videos. I give a 10 with honours because the leaders manage to include everyone, little and big, through play too! Fun guaranteed! Congratulations to all the Musicopoli staff!",
      "rc.f1": "Lina Pagliarulo · a year ago · 5 stars",
      "rc.2": "A really useful place for the neighbourhood. Children can dance and adults can exercise. You sing, you play, you study English with young but competent teachers. […]",
      "rc.f2": "Loredana Corona · a year ago · 5 stars",
      "rc.3": "A wonderful experience, well-prepared and empathetic staff, well organised. Our children were very happy in many ways, including: engaging English teachers, an empathetic and cheerful atmosphere, varied trips with cultural content, clean rooms and spaces, good food, fun afternoon and evening activities, excellent organisation and communication with parents, professional, cheerful and empathetic chaperones. Heartfelt thanks!",
      "rc.f3": "Elisabetta Bello · 11 months ago · 5 stars",
      "rc.4": "A stimulating place where my children are discovering a passion for music!",
      "rc.f4": "Eleonora Festa · a year ago · 5 stars",
      "rc.5": "Art Holidays, and above all great fun!!! Fantastic organisation, from travel to activities to personal needs, always with lots of kindness, humanity and empathy. The leaders are all really helpful. I'm so happy my children share a week of holiday every year with Musicopoli.",
      "rc.f5": "Silvia Fortunato · a year ago · 5 stars",
      "r.piede": "Public reviews on Google, copied word for word (translated in this English version).",
      "o.eti": "Hours and contacts",
      "o.t": "Write to us, on Sundays too.",
      "o.wa": "WhatsApp, 7 days a week",
      "o.seg": "Office",
      "o.segv": "Monday to Friday, 16:30–19:30",
      "o.tel": "Phone",
      "o.telv": "(Via Boifava)",
      "o.sede": "The Via Boifava 29/A location",
      "o.cap": "Opening hours of the Via Boifava 29/A location",
      "o.lun": "Monday",
      "o.mar": "Tuesday",
      "o.mer": "Wednesday",
      "o.gio": "Thursday",
      "o.ven": "Friday",
      "o.sab": "Saturday",
      "o.dom": "Sunday",
      "o.acc": "Wheelchair-accessible entrance and parking.",
      "o.mappa": "Map: Musicopoli, Via Pietro Boifava 29/A, Milan",
      "o.btn": "Directions",
      "z.aps": "social promotion association",
      "z.cred": "Demo site by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · texts from their website and their Instagram (September 2026), the Google listing and the press (Fanpage 2022, Il Sud Milano 2025); public reviews on Google (September 2026); photographs from the Google listing and their Instagram.",
      "x.nav": "Quick actions",
      "x.eta": "By age",
      "x.mappa": "Map",
      "x.orari": "Hours"
    },
    /* MULTILINGUA (V4) — per i siti con più di due lingue, al posto di EN:
         LANGS: { en: {chiave:'...'}, ar: {chiave:'...'} }
       L'italiano resta SEMPRE la lingua del DOM e non ha dizionario.
       Se si valorizza EN e non LANGS, il comportamento è identico a prima. */
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],   // lingue che ribaltano dir=rtl
    /* etichette dello stato orari per lingua non-IT; l'IT è nel codice.
       Chiave mancante = fallback all'inglese, poi all'italiano. */
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */
  // ── FIRMA «il talento non ha età» (#209 Musicopoli) ──
  // Il sequencer delle età. Stato finale in HTML/CSS (vale senza JS e con reduced-motion): la testina sulla colonna dei 94
  // anni, le sue celle accese in evidenza, il display «94 anni · 8 corsi» e l'elenco. Con GSAP e senza reduced-motion il JS
  // toglie la testina e, a fine intro o quando la griglia entra in vista, fa partire la riproduzione: la testina scorre i 16
  // passi, a ogni passo le celle accese di quella colonna «suonano» (si gonfiano e diventano gialle) e il display scrive l'età
  // e quanti corsi; si ferma sui 94 anni. Poi il visitatore tocca un'età (la testina ci salta) o il tasto ▶ (la corsa riparte).
  // Il display e l'elenco si scrivono dai nomi delle righe, quindi seguono la lingua.
  var pannello = document.getElementById('sequencer');
  var anima = hasGsap && !reducedMotion;
  var introFinita = false;
  var parti = function () {};
  var inVista = function () { return false; };
  if (pannello) {
    var tab = document.getElementById('seqTab');
    var bottoni = [].slice.call(tab.querySelectorAll('.seq__eta'));
    var colTh = [].slice.call(tab.querySelectorAll('thead th.seq__col'));
    var righe = [].slice.call(tab.tBodies[0].rows);
    var elEta = document.getElementById('seqEta'), elN = document.getElementById('seqN'), elElenco = document.getElementById('seqElenco');
    var play = document.getElementById('seqPlay');
    var N = bottoni.length, corrente = N - 1, timer = null;
    var inglese = function () { return (document.documentElement.lang || 'it').indexOf('en') === 0; };
    var scrivi = function (c) {
      var eta = bottoni[c].getAttribute('data-eta');
      var nomi = righe.filter(function (r) { return r.cells[c + 1].classList.contains('on'); }).map(function (r) { return r.cells[0].textContent.trim(); });
      var en = inglese();
      elEta.textContent = en ? 'Age ' + eta : eta + ' anni';
      elN.textContent = nomi.length + (en ? (nomi.length === 1 ? ' course' : ' courses') : (nomi.length === 1 ? ' corso' : ' corsi'));
      var lista = nomi.map(function (n) { return en ? n : n.toLowerCase(); }).join(', ');
      elElenco.textContent = en ? 'At ' + eta + ': ' + lista + '.' : 'A ' + eta + ' anni: ' + lista + '.';
      righe.forEach(function (r) { r.classList.toggle('is-attiva', r.cells[c + 1].classList.contains('on')); });
    };
    var testina = function (c) {
      colTh.forEach(function (th, i) { th.classList.toggle('is-testina', i === c); });
      bottoni.forEach(function (b, i) { b.setAttribute('aria-pressed', String(i === c)); });
      righe.forEach(function (r) { for (var i = 1; i < r.cells.length; i++) r.cells[i].classList.toggle('is-testina', i - 1 === c); });
      corrente = c;
      if (c >= 0) scrivi(c);
    };
    var suona = function (c) {
      if (!anima) return;
      righe.forEach(function (r) {
        var td = r.cells[c + 1];
        if (!td.classList.contains('on')) return;
        var cella = td.firstElementChild;
        td.classList.add('suona');
        gsap.fromTo(cella, { scale: 1 }, { scale: 1.2, duration: 0.09, yoyo: true, repeat: 1, ease: 'power1.out', overwrite: true,
          onComplete: function () { td.classList.remove('suona'); gsap.set(cella, { clearProps: 'transform' }); } });
      });
    };
    var ferma = function () { if (timer) { timer.kill(); timer = null; } play.classList.remove('is-in-corsa'); };
    var corsa = function () {
      ferma();
      play.classList.add('is-in-corsa');
      var passo = 0;
      var tick = function () {
        testina(passo);
        suona(passo);
        passo++;
        if (passo < N) timer = gsap.delayedCall(0.2, tick);
        else { timer = null; play.classList.remove('is-in-corsa'); }
      };
      tick();
    };
    bottoni.forEach(function (b, i) { b.addEventListener('click', function () { ferma(); testina(i); suona(i); }); });
    play.addEventListener('click', function () { if (anima) corsa(); else testina(N - 1); });
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { if (corrente >= 0) scrivi(corrente); }); });
    // dalla riga del corso alla sua scheda, che si accende un momento
    righe.forEach(function (r) {
      var a = r.cells[0].querySelector('a');
      if (!a) return;
      a.addEventListener('click', function () {
        var dest = document.querySelector(a.getAttribute('href'));
        if (!dest) return;
        document.querySelectorAll('.corso.is-scelto').forEach(function (x) { x.classList.remove('is-scelto'); });
        dest.classList.add('is-scelto');
        setTimeout(function () { dest.classList.remove('is-scelto'); }, 2600);
      });
    });
    if (anima) {
      // sotto l'intro: nessuna colonna, il display aspetta la corsa
      testina(-1);
      righe.forEach(function (r) { r.classList.remove('is-attiva'); });
      elEta.textContent = '4 → 94';
      elN.textContent = '';
      elElenco.textContent = '';
      var partita = false;
      parti = function () { if (partita) return; partita = true; gsap.delayedCall(0.3, corsa); };
      inVista = function () { var r = tab.getBoundingClientRect(); return r.top < window.innerHeight * 0.82 && r.bottom > 0; };
      if (hasST) ScrollTrigger.create({ trigger: tab, start: 'top 82%', once: true, onEnter: function () { if (introFinita) parti(); } });
    }
  }
  window.bespokeHeroEntrance = function () {
    introFinita = true;
    if (pannello && anima && inVista()) parti();
  };

  // lo stato degli orari anche in «Orari e contatti»
  var st1 = document.getElementById('orarioStato'), st2 = document.getElementById('orarioStato2');
  if (st1 && st2) {
    var copiaStato = function () { st2.textContent = st1.textContent; };
    copiaStato();
    new MutationObserver(copiaStato).observe(st1, { childList: true, characterData: true, subtree: true });
  }
})();
