/* Virio — site de lancement.
   The phone is built in CSS 3D (faces + a polygonal edge strip), the scroll story is one
   pinned GSAP timeline, and the demo is a tiny state machine that renders phone screens. */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);

  // Without GSAP the beats fall back to normal flow (the .js layout stacks them).
  if (!hasGsap) document.documentElement.classList.remove("js");
  else {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  const nf = (d) => new Intl.NumberFormat("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
  const use = (id, cls = "", vb = "") =>
    `<svg${cls ? ` class="${cls}"` : ""}${vb ? ` viewBox="${vb}"` : ""} aria-hidden="true"><use href="#${id}"/></svg>`;
  const MARK_VB = "-10 -10 220 260";

  /* ------------------------------------------------------------------ clock + countdown */

  function clock() {
    const d = new Date();
    const t = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const ds = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
    $$("[data-clock]").forEach((e) => (e.textContent = t));
    $$("[data-date]").forEach((e) => (e.textContent = ds));
  }
  clock();
  setInterval(clock, 20000);

  let countdown = 14 * 60 + 58;
  setInterval(() => {
    countdown = countdown > 0 ? countdown - 1 : 14 * 60 + 58;
    const s = `00:${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(countdown % 60).padStart(2, "0")}`;
    $$("[data-countdown]").forEach((e) => (e.textContent = s));
  }, 1000);

  /* ------------------------------------------------------------------ the 3D phone */

  /** Builds the rounded edge as a strip of thin planes around the outline, lit from the top-left. */
  function buildPhone(phone) {
    const w = phone.offsetWidth;
    const h = phone.offsetHeight;
    if (!w) return;
    const R = w * 0.16;
    const d = w * 0.095;
    const N = 7;
    const pts = [];
    [
      [w / 2 - R, -h / 2 + R, -90],
      [w / 2 - R, h / 2 - R, 0],
      [-w / 2 + R, h / 2 - R, 90],
      [-w / 2 + R, -h / 2 + R, 180],
    ].forEach(([cx, cy, a0]) => {
      for (let i = 0; i <= N; i++) {
        const a = ((a0 + (90 * i) / N) * Math.PI) / 180;
        pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
      }
    });

    const LIGHT = -2.2;
    const mix = (t) => [20 + 105 * t, 24 + 112 * t, 31 + 123 * t].map(Math.round).join(",");
    let html = "";
    for (let i = 0; i < pts.length; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[(i + 1) % pts.length];
      const len = Math.hypot(x2 - x1, y2 - y1);
      if (len < 0.3) continue;
      const th = Math.atan2(y2 - y1, x2 - x1);
      const lit = Math.pow((1 + Math.cos(th - Math.PI / 2 - LIGHT)) / 2, 1.4);
      const mid = mix(lit);
      const rim = mix(lit * 0.45);
      const ww = len + 1.6;
      html +=
        `<i style="width:${ww.toFixed(2)}px;height:${d.toFixed(2)}px;margin:${(-d / 2).toFixed(2)}px 0 0 ${(-ww / 2).toFixed(2)}px;` +
        `background:linear-gradient(180deg,rgb(${rim}),rgb(${mid}) 38%,rgb(${mid}) 62%,rgb(${rim}));` +
        `transform:translate3d(${((x1 + x2) / 2).toFixed(2)}px,${((y1 + y2) / 2).toFixed(2)}px,0) rotateZ(${th.toFixed(4)}rad) rotateX(90deg)"></i>`;
    }
    // side buttons: action + volume on the left, power on the right
    [
      [-1, 0.165, 0.045],
      [-1, 0.245, 0.075],
      [-1, 0.335, 0.075],
      [1, 0.27, 0.115],
    ].forEach(([side, y, l]) => {
      const bl = h * l;
      const by = -h / 2 + h * y + bl / 2;
      const bw = d * 0.42;
      html +=
        `<i style="width:${bw.toFixed(2)}px;height:${bl.toFixed(2)}px;margin:${(-bl / 2).toFixed(2)}px 0 0 ${(-bw / 2).toFixed(2)}px;border-radius:${(bw / 2).toFixed(2)}px;` +
        `background:linear-gradient(90deg,#1a1f28,#5e687d 50%,#1a1f28);transform:translate3d(${(side * (w / 2 + 1.4)).toFixed(2)}px,${by.toFixed(2)}px,0) rotateY(90deg)"></i>`;
    });
    $(".edge", phone).innerHTML = html;
    phone.style.setProperty("--k", ($(".screen", phone).clientWidth / 390).toFixed(4));
  }

  function sizePhone(phone, pw, floor) {
    phone.style.setProperty("--pw", `${Math.round(pw)}px`);
    buildPhone(phone);
    if (floor) {
      floor.style.width = `${pw * 0.9}px`;
      floor.style.height = `${pw * 0.16}px`;
      floor.style.marginLeft = `${-pw * 0.45}px`;
      floor.style.marginTop = `${pw * 1.04}px`;
    }
  }

  /** Tilts a rig toward the cursor ("it moves when you pass in front of it"). */
  function tilt(rig, phone, area, amp) {
    if (!hasGsap || reduce) return;
    if (coarse) {
      gsap.fromTo(rig, { rotationY: -amp * 0.45 }, { rotationY: amp * 0.45, duration: 4.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      return;
    }
    const rx = gsap.quickTo(rig, "rotationX", { duration: 0.9, ease: "power3.out" });
    const ry = gsap.quickTo(rig, "rotationY", { duration: 0.9, ease: "power3.out" });
    area.addEventListener("pointermove", (e) => {
      const r = rig.getBoundingClientRect();
      const nx = gsap.utils.clamp(-1, 1, (e.clientX - r.left) / (innerWidth * 0.5));
      const ny = gsap.utils.clamp(-1, 1, (e.clientY - r.top) / (innerHeight * 0.5));
      ry(nx * amp);
      rx(-ny * amp * 0.6);
      phone.style.setProperty("--gx", `${30 - nx * 35}%`);
      phone.style.setProperty("--gy", `${-5 - ny * 20}%`);
    });
    area.addEventListener("pointerleave", () => {
      rx(0);
      ry(0);
    });
  }

  /* ------------------------------------------------------------------ spam data */

  // [from, body, url, reason chip]
  const SPAM = [
    ["AMENDES-INFO", "Amende impayée : 35 €. Payez ici :", "antai-paiement-gouv.com", "Faux domaine"],
    ["COLIS", "Votre colis est bloqué. Frais : 1,99 €", "suivi-colis-livraison.net", "Créé il y a 3 jours"],
    ["BANQUE", "Compte suspendu. Vérifiez vos accès :", "secure-banque-verif.com", "Demande vos codes"],
    ["IMPOTS", "Remboursement de 214 € en attente :", "impots-remboursement.org", "Imite l'État"],
    ["ASSURANCE MALADIE", "Carte Vitale expirée. Renouvelez :", "ameli-carte-vitale.info", "Faux domaine"],
    ["MON CPF", "Vos droits CPF expirent ce soir :", "moncompte-cpf-droits.fr", "Imite l'État"],
    ["TÉLÉPÉAGE", "Facture impayée : 6,80 €. Régularisez :", "telepeage-facture.info", "Créé hier"],
    ["PERMIS", "Retrait de points sur votre permis :", "permis-points-ants.com", "Demande votre carte"],
  ];
  // base placement around a 340px phone: x, y, z, rotateY, rotateZ
  const POS = [
    [-300, -270, 120, 18, -4],
    [290, -310, -40, -16, 3],
    [-340, 30, -140, 22, 2],
    [330, -30, 150, -20, -3],
    [-290, 300, 60, 16, 3],
    [310, 280, -90, -18, -2],
    [40, -420, -260, 4, -1],
    [120, 440, -170, -8, 2],
  ];
  const PERSPECTIVE = 1500;

  /** Right edge (viewport px) of the hero copy as actually set, line by line. */
  function heroTextRight() {
    let right = 0;
    $$(".beat:first-child > *", scene).forEach((c) => {
      const range = document.createRange();
      range.selectNodeContents(c);
      [...range.getClientRects()].forEach((r) => (right = Math.max(right, r.right)));
    });
    return right;
  }

  const notifHTML = (m, time = "maintenant") =>
    `<div class="notif-head">${use("i-msg")}Messages<time>${time}</time></div><div class="notif-from">${m[0]}</div>` +
    `<div class="notif-body">${m[1]}</div><span class="notif-link">${m[2]}</span>`;

  /* ------------------------------------------------------------------ scene */

  const scene = $("[data-scene]");
  const stage = $("[data-stage]");
  const scenePhone = $("[data-phone]", scene);
  const swarm = $("[data-swarm]");
  const lockStack = $("[data-lock-stack]");

  swarm.innerHTML = SPAM.map(
    (m) =>
      `<div class="n"><div class="n-act"><div class="n-float"><div class="notif">${notifHTML(m)}` +
      `<span class="strike">${use("i-x", "", "0 0 16 16")}${m[3]}</span></div></div></div></div>`
  ).join("");

  // lock screen: start with three messages, then keep them coming while the hero is on screen
  [SPAM[1], SPAM[2]].forEach((m, i) => {
    const el = document.createElement("div");
    el.className = "notif";
    el.innerHTML = notifHTML(m, i ? "il y a 4 min" : "il y a 1 min");
    lockStack.append(el);
  });
  let lockIdx = 3;
  let lockActive = true;
  function lockPush() {
    if (!hasGsap || reduce || !lockActive || document.hidden) return;
    const m = SPAM[lockIdx++ % SPAM.length];
    const el = document.createElement("div");
    el.className = "notif";
    el.innerHTML = notifHTML(m);
    lockStack.prepend(el);
    gsap.from(el, { y: -40, opacity: 0, scale: 0.96, duration: 0.7, ease: "expo.out" });
    const items = $$(".notif", lockStack);
    items.slice(1).forEach((n, i) => {
      const t = $("time", n);
      if (t) t.textContent = `il y a ${i * 3 + 1} min`;
    });
    if (items.length > 3) {
      const last = items[items.length - 1];
      gsap.to(last, { opacity: 0, duration: 0.3, onComplete: () => last.remove() });
    }
  }
  setInterval(lockPush, 2800);

  const DIGITS = "4970123456781234";
  let lastDigits = -1;
  function renderDigits(el, n) {
    if (n === lastDigits && el.dataset.scene) return;
    lastDigits = n;
    if (n <= 0) {
      el.classList.remove("is-focus");
      el.innerHTML = '<span class="ph">0000 0000 0000 0000</span>';
      return;
    }
    el.classList.add("is-focus");
    el.innerHTML = DIGITS.slice(0, n).replace(/(\d{4})(?=\d)/g, "$1 ") + '<span class="fk-caret"></span>';
  }

  function layoutScene() {
    const mobile = innerWidth <= 860;
    const H = stage.clientHeight;
    const W = stage.clientWidth;
    const pw = mobile ? Math.min((H * 0.84) / 2.055, W * 0.56) : Math.min(340, (H * 0.8) / 2.055, W * 0.5);
    sizePhone(scenePhone, Math.max(150, pw), $("[data-floor]"));
    if (!hasGsap) return;
    const s = pw / 340;
    const sc = mobile ? 0.62 : Math.min(1, 0.55 + 0.45 * s);
    // keep the left-hand cards clear of the hero copy (projected through the stage perspective)
    const sb = stage.getBoundingClientRect();
    const leftLimit = mobile ? -Infinity : heroTextRight() + 56 - (sb.left + sb.width / 2);
    $$(".n", swarm).forEach((n, i) => {
      const [x, y, z, ry, rz] = POS[i];
      const hide = mobile && i >= 6;
      const f = PERSPECTIVE / (PERSPECTIVE - z * s);
      const xMin = leftLimit / f + 125 * sc;
      gsap.set(n, {
        x: mobile ? x * s * 1.05 : Math.max(x * s, xMin),
        y: mobile ? gsap.utils.clamp(-(H / 2 - 40), H / 2 - 80, y * s) : y * s,
        z: z * s,
        rotationY: ry,
        rotationZ: rz,
        scale: sc,
        autoAlpha: hide ? 0 : 1,
      });
    });
  }

  function buildScene({ mobile }) {
    layoutScene();
    const q = (s) => $(s, scene);
    const S = (n) => q(`[data-s="${n}"]`);
    const beats = $$(".beat", scene);
    const move = q("[data-move]");
    const acts = $$(".n-act", swarm).filter((_, i) => !(mobile && i >= 6));
    const flash = q(".scene-flash");
    const digits = q("[data-digits]");
    digits.dataset.scene = "1";
    const progress = q("[data-progress]");
    const sheet = q("[data-sheet]");
    const riskNum = q("[data-risk]");
    const riskBar = q("[data-risk-bar]");

    riskBar.style.transform = "scaleX(0)";
    riskNum.textContent = "0 %";
    const pose = (ry, rx, rz, sc) => (reduce ? { rotationY: ry * 0.35, rotationX: rx * 0.35, rotationZ: 0, scale: 1 } : { rotationY: ry, rotationX: rx, rotationZ: rz, scale: sc });
    gsap.set(move, pose(mobile ? -16 : -24, 8, 3, 1));
    gsap.set(beats.slice(1), { opacity: 0 });
    gsap.set(beats, { yPercent: mobile ? 0 : -50, y: 0 });

    const beatOut = (b, at) => tl.to(b, { opacity: 0, y: reduce ? 0 : -40, duration: 0.45, ease: "power2.in" }, at);
    const beatIn = (b, at) => tl.fromTo(b, { opacity: 0, y: reduce ? 0 : 50 }, { opacity: 1, y: 0, duration: 0.55, ease: "expo.out" }, at);

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: scene,
        start: "top top",
        end: () => `+=${Math.round(innerHeight * 4.6)}`,
        pin: true,
        scrub: reduce ? true : 0.7,
        anticipatePin: 1,
        onUpdate: (self) => {
          progress.style.transform = `scaleX(${self.progress})`;
          lockActive = self.progress < 0.04;
        },
      },
    });

    // 0 → 1 : the hero holds
    tl.to({}, { duration: 1 }, 0);

    // beat 1 — "Ça a l'air vrai." : the SMS opens
    beatOut(beats[0], 1);
    tl.set(beats[0], { pointerEvents: "none" }, 1.2);
    beatIn(beats[1], 1.35);
    tl.to(move, { ...pose(-10, 4, 0, 1.04), duration: 1.2, ease: "power3.inOut" }, 1);
    tl.to(S("lock"), { opacity: 0, scale: 1.06, duration: 0.5, ease: "power3.in" }, 1.1);
    tl.fromTo(S("sms"), { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" }, 1.35);
    // The swarm steps back without ever sitting over the phone screen or the copy:
    // right-hand cards move right, front left-hand cards move up/down out of the text band,
    // cards behind the phone stay put (the phone hides them), top/bottom cards move outward.
    const s = scenePhone.offsetWidth / 340;
    acts.forEach((a, i) => {
      const [x, y, z] = POS[i];
      let dx = 0;
      let dy = 0;
      if (x > 150) dx = 120 * s;
      else if (x < -150 && z > 0) {
        dx = -60 * s;
        dy = mobile ? 0 : Math.sign(y) * 70 * s;
      } else if (Math.abs(x) <= 150) dy = Math.sign(y) * 110 * s;
      tl.to(a, { x: dx, y: dy, scale: 0.84, opacity: 0.55, duration: 1.2, ease: "power3.inOut" }, 1);
    });
    tl.fromTo(q(".sms-ring"), { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 0.4, ease: "expo.out" }, 1.95);

    // beat 2 — "Un clic. Faux site, vraie carte."
    beatOut(beats[1], 2.5);
    beatIn(beats[2], 2.85);
    tl.fromTo(q(".sms-tap"), { opacity: 0.9, scale: 0.2 }, { opacity: 0, scale: 2.4, duration: 0.4, ease: "expo.out" }, 2.5);
    tl.to(S("sms"), { xPercent: -28, duration: 0.5, ease: "power3.inOut" }, 2.7);
    tl.fromTo(S("fake"), { xPercent: 100, x: 0 }, { xPercent: 0, duration: 0.5, ease: "power3.inOut" }, 2.7);
    tl.fromTo($$(".fk", S("fake")), { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.35, ease: "expo.out" }, 3.0);
    tl.to(move, { ...pose(0, 2, 0, 1.1), duration: 1, ease: "power3.inOut" }, 2.6);
    // the film's red stage while the victim types the card number
    tl.to(q(".scene-threat"), { opacity: 1, duration: 0.8, ease: "power2.inOut" }, 3.5);
    tl.to(q(".scene-threat"), { opacity: 0, duration: 0.25, ease: "power2.in" }, 5.0);
    const typer = { n: 0 };
    tl.to(typer, { n: 16, duration: 1.4, onUpdate: () => renderDigits(digits, Math.round(typer.n)) }, 3.5);

    // beat 3 — STOP. Virio blocks, the swarm is struck out
    beatOut(beats[2], 5.0);
    if (!reduce) {
      tl.to(flash, { autoAlpha: 1, duration: 0.16 }, 5.05);
      tl.fromTo($("span", flash), { scale: 1.3 }, { scale: 1, duration: 0.4, ease: "expo.out" }, 5.05);
      tl.to(flash, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 5.42);
    }
    tl.fromTo(S("stop"), { opacity: 0 }, { opacity: 1, duration: 0.15 }, 5.1);
    tl.fromTo(q(".stop-draw"), { strokeDashoffset: 700 }, { strokeDashoffset: 0, duration: 0.4, ease: "power3.inOut" }, 5.1);
    tl.fromTo(q(".stop-pupil"), { scaleY: 0, transformOrigin: "50% 50%" }, { scaleY: 1, duration: 0.3, ease: "expo.out" }, 5.35);
    tl.to(q(".dim"), { opacity: 0.6, duration: 0.3 }, 5.6);
    tl.to(S("stop"), { opacity: 0, duration: 0.3, ease: "power2.in" }, 5.75);
    tl.fromTo(sheet, { yPercent: 105, y: 0 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 5.75);
    tl.fromTo($$(".sh-a", sheet), { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.35, ease: "expo.out" }, 6.0);
    const risk = { v: 0 };
    tl.to(
      risk,
      {
        v: 97,
        duration: 0.6,
        ease: "power3.inOut",
        onUpdate: () => {
          riskBar.style.transform = `scaleX(${risk.v / 100})`;
          riskNum.textContent = `${Math.round(risk.v)} %`;
        },
      },
      6.25
    );
    beatIn(beats[3], 5.55);
    tl.to(move, { ...pose(8, 0, 0, 1.06), duration: 1, ease: "power3.inOut" }, 5.5);
    acts.forEach((a, i) => {
      const at = 5.6 + i * 0.07;
      // full strength and back in frame for the strike, so every chip reads
      tl.to(a, { "--hit": 1, opacity: 1, x: 0, duration: 0.2, ease: "power2.out" }, at);
      tl.fromTo($(".strike", a), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2)" }, at);
      tl.to(
        a,
        reduce ? { opacity: 0, duration: 0.6 } : { y: 320, rotationZ: (i % 2 ? 1 : -1) * (14 + i * 3), opacity: 0, duration: 0.8, ease: "power3.in" },
        6.35 + i * 0.05
      );
    });

    // beat 4 — back to the real site
    beatOut(beats[3], 7.4);
    beatIn(beats[4], 7.75);
    tl.to(q(".sheet-go"), { scale: 0.96, duration: 0.1 }, 7.45);
    tl.to(q(".sheet-go"), { scale: 1, duration: 0.15 }, 7.55);
    tl.to(sheet, { yPercent: 105, duration: 0.45, ease: "power3.in" }, 7.65);
    tl.to(q(".dim"), { opacity: 0, duration: 0.3 }, 7.7);
    tl.fromTo(S("official"), { xPercent: 100, x: 0 }, { xPercent: 0, duration: 0.5, ease: "power3.inOut" }, 7.7);
    tl.fromTo($(".toast", S("official")), { yPercent: 160, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "expo.out" }, 8.3);
    tl.to(move, { ...pose(18, 5, 0, 1), duration: 1.1, ease: "power3.inOut" }, 7.5);
    tl.to({}, { duration: 0.9 }, 9.1);
  }

  if (hasGsap) {
    const mm = gsap.matchMedia();
    mm.add({ desktop: "(min-width: 861px)", mobile: "(max-width: 860px)" }, (ctx) => buildScene(ctx.conditions));
    tilt($("[data-rig]"), scenePhone, scene, 14);
  } else {
    layoutScene();
  }

  // pause the floating spam while the scene is off screen
  new IntersectionObserver(([e]) => scene.classList.toggle("is-idle", !e.isIntersecting)).observe(scene);

  /* ------------------------------------------------------------------ demo */

  const OFFICIAL_ANTAI = {
    url: "antai.gouv.fr",
    head: "Site officiel",
    headSub: "Paiement des amendes",
    title: "Payer une amende",
    sub: "Munissez-vous de votre avis de contravention.",
    field: "Numéro de télépaiement",
    ph: "00 0000 0000 0000",
    btn: "Continuer",
    tip: "Un site de l'État se termine toujours par <b>.gouv.fr</b>",
  };

  const MSGS = [
    {
      id: "amende",
      from: "AMENDES-INFO",
      av: "AI",
      time: "14:32",
      text: "Amende impayée : 35 €. Majoration à 375 € sous 24 h. Payez ici :",
      url: "antai-paiement-gouv.com",
      fake: { org: "SERVICE DES AMENDES", sub: "Paiement en ligne", gov: true, title: "Régularisez votre amende", ref: "Avis n° 25-4877-31", label: "Montant à payer", amount: "35,00 €", urgent: "Majoration à 375 € dans", pay: "Payer 35,00 €" },
      reasons: ["Imite un service de l'État", "Domaine créé il y a 2 jours", "Demande votre carte bancaire"],
      risk: 97,
      line: "imitait le service des amendes de l'État",
      official: OFFICIAL_ANTAI,
    },
    {
      id: "colis",
      from: "COLIS",
      av: "CO",
      time: "13:05",
      text: "Votre colis est bloqué au centre de tri. Frais de réexpédition : 1,99 € :",
      url: "suivi-colis-livraison.net",
      fake: { org: "SUIVI DE COLIS", sub: "Service livraison", title: "Reprogrammez votre livraison", ref: "Colis n° FR 8841 2207", label: "Frais de réexpédition", amount: "1,99 €", urgent: "Retour à l'expéditeur dans", pay: "Payer 1,99 €" },
      reasons: ["Petit montant pour obtenir votre carte", "Domaine créé il y a 5 jours", "Aucun lien avec un transporteur"],
      risk: 94,
      line: "utilisait un faux suivi de colis pour obtenir votre carte",
      advice: "Suivez votre colis depuis le site ou l'appli de votre transporteur, en tapant l'adresse vous-même.",
    },
    {
      id: "lea",
      from: "Léa",
      av: "L",
      friend: true,
      time: "12:20",
      text: "Pour vérifier une amende, passe toujours par le site officiel :",
      url: "antai.gouv.fr",
      legit: true,
      official: OFFICIAL_ANTAI,
    },
    {
      id: "banque",
      from: "BANQUE",
      av: "BQ",
      time: "11:48",
      text: "Activité inhabituelle. Votre compte sera suspendu. Confirmez vos accès :",
      url: "secure-banque-verif.com",
      fake: { org: "ESPACE CLIENT", sub: "Vérification de sécurité", title: "Confirmez votre identité", ref: "Dossier n° 55-0193", label: "Statut du compte", amount: "Suspendu", amountRed: true, urgent: "Suspension définitive dans", pay: "Valider ma carte" },
      reasons: ["Se fait passer pour votre banque", "Domaine créé il y a 4 jours", "Demande votre carte bancaire"],
      risk: 96,
      line: "se faisait passer pour votre banque",
      advice: "Votre banque ne vous demande jamais vos codes par SMS. Appelez le numéro au dos de votre carte.",
    },
    {
      id: "cpf",
      from: "MON CPF",
      av: "CP",
      time: "hier",
      text: "Vos droits CPF expirent ce soir. Il vous reste 1 240 € :",
      url: "moncompte-cpf-droits.fr",
      fake: { org: "MON COMPTE FORMATION", sub: "Espace titulaire", gov: true, title: "Utilisez vos droits avant ce soir", ref: "Dossier n° CPF-2291", label: "Droits disponibles", amount: "1 240 €", urgent: "Vos droits expirent dans", pay: "Valider avec ma carte" },
      reasons: ["Imite un service de l'État", "Ce n'est pas une adresse .gouv.fr", "Demande votre carte bancaire"],
      risk: 95,
      line: "imitait le site officiel du CPF",
      official: {
        url: "moncompteformation.gouv.fr",
        head: "Site officiel",
        headSub: "Mon compte formation",
        title: "Mes droits formation",
        sub: "Connectez-vous à votre espace personnel pour consulter vos droits.",
        field: "Identifiant",
        ph: "Adresse e-mail",
        btn: "Se connecter",
        tip: "Le site officiel du CPF se termine par <b>.gouv.fr</b>",
      },
    },
  ];

  const STATUS = (light) =>
    `<div class="status${light ? " light" : ""}"><span data-clock></span><span class="icons">${use("i-signal", "", "0 0 18 12")}${use("i-wifi", "", "0 0 16 12")}${use("i-bat", "", "0 0 27 12")}</span></div>`;
  const BROWSER = (url, safe) =>
    `<div class="browser"><div class="addr${safe ? " is-safe" : ""}"><button class="addr-btn" type="button" data-back aria-label="Revenir aux messages">${use("i-chev-l", "addr-back", "0 0 9 15")}</button>` +
    `${use("i-lock", "", "0 0 11 13")}<span>${url}</span><i class="addr-bar"></i></div></div>`;

  const inboxHTML = () =>
    `<div class="scr scr-inbox">${STATUS()}<div class="inbox-title">Messages</div><div class="inbox-search">${use("i-search", "", "0 0 16 16")}Rechercher</div>` +
    `<ul class="inbox-list">${MSGS.map(
      (m) =>
        `<li><div class="inbox-av${m.friend ? " is-friend" : ""}" aria-hidden="true">${m.av}</div><div class="inbox-main"><div class="inbox-top"><b>${m.from}</b><time>${m.time}</time></div>` +
        `<p class="inbox-text">${m.text}</p><button class="inbox-link" type="button" data-open="${m.id}">${m.url}</button></div></li>`
    ).join("")}</ul></div>`;

  const loadHTML = (url, on) =>
    `<div class="scr scr-load">${STATUS()}${BROWSER(url)}<p class="load-note${on ? " is-virio" : ""}">${on ? "Virio vérifie le lien…" : "Chargement…"}</p></div>`;

  const fakeHTML = (m) => {
    const f = m.fake;
    return (
      `<div class="scr scr-fake">${STATUS()}${BROWSER(m.url)}<div class="page">` +
      (f.gov ? `<div class="tricolor"><i></i><i></i><i></i></div>` : `<div class="tricolor" style="opacity:0"><i></i><i></i><i></i></div>`) +
      `<div class="fk-org">${f.gov ? `<div class="fk-flag"><i></i><i></i><i></i></div>` : ""}<div><b>${f.org}</b><span>${f.sub}</span></div><span class="secure">${use("i-lock", "", "0 0 11 13")}sécurisé</span></div>` +
      `<div class="fk-title">${f.title}</div>` +
      `<div class="fk-box"><small>${f.ref}</small><div><span>${f.label}</span><b${f.amountRed ? ' style="color:var(--gov-red)"' : ""}>${f.amount}</b></div></div>` +
      `<div class="fk-urgent">${f.urgent} <span class="mono" data-countdown>00:14:58</span></div>` +
      `<div class="fk-label">Numéro de carte</div><div class="fk-field" data-digits><span class="ph">0000 0000 0000 0000</span></div>` +
      `<div class="fk-row" style="margin-top:10px"><div class="fk-field" data-exp="08 / 29">MM / AA</div><div class="fk-field" data-exp="417">CVC</div></div>` +
      `<div class="fk-pay">${f.pay}</div><div class="fk-foot">Paiement 100 % sécurisé · Service officiel</div></div></div>`
    );
  };

  const paidHTML = (m) =>
    `<div class="scr scr-paid">${STATUS()}${BROWSER(m.url)}<div class="paid"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#1d2f6f"/>` +
    `<path d="M20 33l8 8 16-17" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>` +
    `<b>Paiement accepté</b><span>Merci. Votre paiement a bien été enregistré.<br>${m.fake.ref}</span></div></div>`;

  const sheetHTML = (m) =>
    `<div class="dim"></div><div class="sheet" role="dialog" aria-label="Virio a bloqué un site frauduleux">` +
    `<div class="sheet-head sh-a">${use("i-mark", "safe", MARK_VB)}<div><b>Virio</b><span>Protection active</span></div></div>` +
    `<div class="pill-threat sh-a">ARNAQUE DÉTECTÉE</div><div class="sheet-title sh-a">Site frauduleux<br>bloqué</div>` +
    `<div class="risk sh-a"><div class="risk-top">Niveau de risque<span class="mono" data-risk>${m.risk} %</span></div><div class="risk-bar"><i data-risk-bar style="transform:scaleX(${m.risk / 100})"></i></div></div>` +
    `<ul class="reasons">${m.reasons.map((r) => `<li class="sh-a">${use("i-cross", "", "0 0 24 24")}${r}</li>`).join("")}</ul>` +
    `<div class="compare sh-a"><div><s>${m.url}</s><small class="threat">Faux</small></div>` +
    (m.official ? `<div><span class="ok">${m.official.url}</span><small class="safe">Officiel</small></div>` : `<div class="advice">${m.advice}</div>`) +
    `</div>` +
    (m.official
      ? `<button class="sheet-go sh-a" type="button" data-go>Aller sur le site officiel</button><button class="sheet-back sh-a" type="button" data-back>Revenir aux messages</button>`
      : `<button class="sheet-go sh-a" type="button" data-back>Revenir aux messages</button>`) +
    `</div>`;

  const officialHTML = (o, toast) =>
    `<div class="scr scr-official">${STATUS()}${BROWSER(o.url, toast)}<div class="page">` +
    `<div class="of-head"><b>${o.head}</b><span>${o.headSub}</span></div><div class="of-title">${o.title}</div><div class="of-sub">${o.sub}</div>` +
    `<div class="fk-label">${o.field}</div><div class="fk-field"><span class="ph">${o.ph}</span></div><div class="fk-pay">${o.btn}</div>` +
    `<div class="of-tip">${use("i-tick", "", "0 0 24 24")}<span>${o.tip}</span></div></div>` +
    (toast ? `<div class="toast">${use("i-mark", "safe", MARK_VB)}<div><b>Site officiel vérifié</b><span>Virio confirme cette adresse</span></div></div>` : "") +
    `</div>`;

  const demoStage = $("[data-demo-stage]");
  const demoPhone = $("[data-demo-phone]");
  const dscreen = $("[data-demo-screen]");
  const island = document.createElement("div");
  island.className = "island";
  dscreen.append(island);

  const sw = $("[data-switch]");
  const swState = $("[data-switch-state]");
  const outEl = $("[data-outcome]");
  const state = { on: true, blocked: 0, trapped: 0 };
  let current = null;
  let busy = false;
  let runId = 0;
  let active = null;

  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? Math.min(ms, 250) : ms));
  const animate = hasGsap && !reduce;

  function push(html, from = "right") {
    const t = document.createElement("div");
    t.innerHTML = html;
    const el = t.firstElementChild;
    const hadFocus = dscreen.contains(document.activeElement);
    dscreen.insertBefore(el, island);
    clock();
    const prev = current;
    current = el;
    if (animate) {
      gsap.fromTo(el, { xPercent: from === "right" ? 100 : -30, opacity: from === "right" ? 1 : 0 }, { xPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
      if (prev) gsap.to(prev, { xPercent: from === "right" ? -30 : 100, duration: 0.5, ease: "power3.out", onComplete: () => prev.remove() });
    } else if (prev) prev.remove();
    if (hadFocus) {
      const f = $("button", el);
      if (f) f.focus({ preventScroll: true });
    }
    return el;
  }

  const OUT = {
    idle: () => ["i-hand", "var(--muted)", "Touchez un lien bleu dans le téléphone."],
    off: () => ["i-info", "var(--muted)", "Protection désactivée. Touchez un lien pour voir ce qui se passe sans Virio."],
    blocked: (m) => ["i-mark", "var(--safe)", `<span class="safe">Bloqué.</span> <span class="mono">${m.url}</span> ${m.line}. Vous n'avez rien tapé.`],
    trapped: () => [
      "i-cross",
      "",
      `<span class="threat">Piégé.</span> Sans protection, le faux site s'est ouvert comme un vrai. En payant, vous avez donné votre numéro de carte, sa date d'expiration et son cryptogramme à un escroc.`,
      true,
    ],
    verified: (m) => ["i-mark", "var(--safe)", `<span class="safe">Site officiel vérifié.</span> <span class="mono">${m.url}</span> est bien le site de l'État.`],
    legitOff: () => ["i-info", "var(--muted)", "Ce lien était le bon. Avec Virio activé, vous en auriez eu la confirmation avant d'y aller."],
    redirected: (m) => ["i-mark", "var(--safe)", `<span class="safe">Au bon endroit.</span> Vous êtes sur <span class="mono">${m.official.url}</span>, le site officiel.`],
  };

  function outcome(kind, m) {
    const [icon, color, text, retry] = OUT[kind](m);
    const vb = icon === "i-mark" ? MARK_VB : "0 0 24 24";
    outEl.innerHTML =
      `<p class="outcome-msg"><svg viewBox="${vb}" aria-hidden="true"${color ? ` style="color:${color}"` : ""}><use href="#${icon}"/></svg><span>${text}</span></p>` +
      (retry ? `<button class="btn btn-safe btn-sm" type="button" data-retry>Rejouer avec Virio activé</button>` : "");
    if (animate) gsap.from(outEl.children, { opacity: 0, y: 8, duration: 0.4, stagger: 0.08, ease: "expo.out" });
  }

  function tally() {
    [
      ["blocked", state.blocked],
      ["trapped", state.trapped],
    ].forEach(([k, v]) => {
      const el = $(`[data-tally="${k}"]`);
      if (el.textContent !== String(v)) {
        el.textContent = v;
        if (animate) gsap.fromTo(el, { scale: 1.35 }, { scale: 1, duration: 0.5, ease: "expo.out" });
      }
    });
  }

  function goInbox(from = "left") {
    runId++;
    busy = false;
    active = null;
    push(inboxHTML(), from);
  }

  function setSwitch(on) {
    state.on = on;
    sw.setAttribute("aria-checked", String(on));
    swState.textContent = on ? "Activée : chaque lien est vérifié" : "Désactivée : les liens s'ouvrent sans contrôle";
  }

  async function openLink(id) {
    if (busy) return;
    busy = true;
    const run = ++runId;
    const m = MSGS.find((x) => x.id === id);
    active = m;
    const on = state.on;
    const el = push(loadHTML(m.url, on));
    const bar = $(".addr-bar", el);
    if (animate) gsap.to(bar, { scaleX: 1, duration: on ? 1 : 0.6, ease: "power2.inOut" });
    else bar.style.transform = "scaleX(1)";
    await wait(on ? 1050 : 650);
    if (run !== runId) return;

    if (m.legit) {
      const of = push(officialHTML(m.official, on));
      if (on && animate) gsap.from($(".toast", of), { yPercent: 160, opacity: 0, duration: 0.6, delay: 0.35, ease: "expo.out" });
      outcome(on ? "verified" : "legitOff", m);
      busy = false;
      return;
    }

    if (on) {
      el.insertAdjacentHTML("beforeend", sheetHTML(m));
      const dim = $(".dim", el);
      const sh = $(".sheet", el);
      if (animate) {
        gsap.to(dim, { opacity: 0.6, duration: 0.3 });
        gsap.fromTo(sh, { yPercent: 105, y: 0 }, { yPercent: 0, duration: 0.6, ease: "expo.out" });
        gsap.from($$(".sh-a", sh), { opacity: 0, y: 12, stagger: 0.06, duration: 0.4, delay: 0.2, ease: "expo.out" });
        const r = { v: 0 };
        const num = $("[data-risk]", sh);
        const rb = $("[data-risk-bar]", sh);
        gsap.to(r, {
          v: m.risk,
          duration: 0.8,
          delay: 0.35,
          ease: "power3.inOut",
          onUpdate: () => {
            num.textContent = `${Math.round(r.v)} %`;
            rb.style.transform = `scaleX(${r.v / 100})`;
          },
        });
      } else {
        dim.style.opacity = "0.6";
        sh.style.transform = "none";
      }
      if (dscreen.contains(document.activeElement) || document.activeElement === document.body) $(".sheet-go", sh).focus({ preventScroll: true });
      state.blocked++;
      tally();
      outcome("blocked", m);
      busy = false;
      return;
    }

    // no protection: the fake site opens like a real one, and the victim pays
    const fk = push(fakeHTML(m));
    await wait(800);
    const field = $("[data-digits]", fk);
    for (let n = 1; n <= 16; n++) {
      if (run !== runId) return;
      field.classList.add("is-focus");
      field.innerHTML = DIGITS.slice(0, n).replace(/(\d{4})(?=\d)/g, "$1 ") + '<span class="fk-caret"></span>';
      await wait(65);
    }
    if (run !== runId) return;
    field.querySelector(".fk-caret")?.remove();
    field.classList.remove("is-focus");
    $$("[data-exp]", fk).forEach((e) => {
      e.textContent = e.dataset.exp;
      e.style.color = "var(--page-text)";
    });
    await wait(500);
    if (run !== runId) return;
    const pay = $(".fk-pay", fk);
    if (animate) await gsap.to(pay, { scale: 0.96, duration: 0.12, yoyo: true, repeat: 1 });
    await wait(250);
    if (run !== runId) return;
    push(paidHTML(m));
    state.trapped++;
    tally();
    outcome("trapped", m);
    busy = false;
  }

  dscreen.addEventListener("click", (e) => {
    const open = e.target.closest("[data-open]");
    if (open) return openLink(open.dataset.open);
    if (e.target.closest("[data-back]")) return goInbox();
    if (e.target.closest("[data-go]") && active && active.official) {
      const m = active;
      const of = push(officialHTML(m.official, true));
      if (animate) gsap.from($(".toast", of), { yPercent: 160, opacity: 0, duration: 0.6, delay: 0.35, ease: "expo.out" });
      outcome("redirected", m);
    }
  });

  sw.addEventListener("click", () => {
    setSwitch(!state.on);
    goInbox("left");
    outcome(state.on ? "idle" : "off");
  });

  outEl.addEventListener("click", (e) => {
    if (!e.target.closest("[data-retry]")) return;
    setSwitch(true);
    goInbox("left");
    outcome("idle");
    const first = $("[data-open]", dscreen);
    if (first) first.focus({ preventScroll: true });
  });

  function layoutDemo() {
    const H = demoStage.clientHeight;
    const W = demoStage.clientWidth;
    const mobile = innerWidth <= 860;
    const pw = Math.min(mobile ? 320 : 360, (H * 0.9) / 2.055, W * (mobile ? 0.86 : 0.7));
    sizePhone(demoPhone, Math.max(220, pw), $(".floor", demoStage));
  }

  push(inboxHTML());
  tilt($("[data-demo-rig]"), demoPhone, demoStage, 9);

  /* ------------------------------------------------------------------ figures */

  const live = $("[data-live]");
  const PER_SECOND = 1.03e12 / (365 * 24 * 3600);
  const t0 = performance.now();
  const nf0 = nf(0);
  let liveOn = false;
  function tickLive() {
    live.textContent = nf0.format(Math.floor(((performance.now() - t0) / 1000) * PER_SECOND));
    if (liveOn && !reduce) requestAnimationFrame(tickLive);
  }
  tickLive();
  new IntersectionObserver(([e]) => {
    liveOn = e.isIntersecting;
    if (liveOn) tickLive();
  }).observe(live);
  if (reduce) setInterval(() => liveOn && tickLive(), 1000);

  if (hasGsap && !reduce) {
    $$("[data-count]").forEach((el) => {
      const to = parseFloat(el.dataset.count);
      const f = nf(+el.dataset.dec || 0);
      const o = { v: 0 };
      el.textContent = f.format(0);
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        once: true,
        onEnter: () => gsap.to(o, { v: to, duration: 1.6, ease: "expo.out", onUpdate: () => (el.textContent = f.format(o.v)) }),
      });
    });
  }

  /* ------------------------------------------------------------------ signs */

  const signs = $("[data-signs]");
  const rbtn = $("[data-reveal]");
  const rlab = $("[data-reveal-label]");
  let revealTouched = false;
  function setReveal(on) {
    signs.classList.toggle("is-on", on);
    rbtn.setAttribute("aria-pressed", String(on));
    rlab.textContent = on ? "Cacher les pièges" : "Montrer les pièges";
  }
  rbtn.addEventListener("click", () => {
    revealTouched = true;
    setReveal(!signs.classList.contains("is-on"));
  });
  if (hasGsap) {
    ScrollTrigger.create({
      trigger: ".sign-grid",
      start: "top 55%",
      once: true,
      onEnter: () => setTimeout(() => !revealTouched && setReveal(true), 700),
    });
  }

  /* ------------------------------------------------------------------ how */

  function initHow() {
    if (!hasGsap) return;
    const chips = $$(".how-vis .strike");
    gsap.from(chips, {
      opacity: 0,
      scale: 0.6,
      duration: 0.5,
      stagger: 0.25,
      ease: "back.out(2)",
      scrollTrigger: { trigger: chips[0], start: "top 80%" },
    });
    const sheetLis = $$("[data-mini-sheet] .reasons li");
    gsap.from(sheetLis, { opacity: 0, x: -12, duration: 0.5, stagger: 0.15, ease: "expo.out", scrollTrigger: { trigger: "[data-mini-sheet]", start: "top 75%" } });

    const morph = $("[data-morph]");
    const drop = $(".m-drop", morph);
    const add = $(".m-add", morph);
    const tick = $(".morph-tick", morph);
    if (reduce) {
      drop.style.display = "none";
      return;
    }
    const split = (el) => {
      el.innerHTML = [...el.textContent].map((c) => `<span>${c}</span>`).join("");
      return $$("span", el);
    };
    const dw = drop.offsetWidth;
    const aw = add.offsetWidth;
    const dch = split(drop);
    const ach = split(add);
    gsap.set(add, { width: 0 });
    gsap.set(ach, { opacity: 0, y: -24 });
    gsap.set(tick, { scale: 0, opacity: 0 });
    const mtl = gsap.timeline({ repeat: -1, repeatDelay: 0.4, paused: true });
    mtl
      .to({}, { duration: 1.1 })
      .to(dch, { y: () => gsap.utils.random(40, 90), rotation: () => gsap.utils.random(-50, 50), opacity: 0, duration: 0.6, ease: "power2.in", stagger: { each: 0.025, from: "random" } })
      .to(drop, { width: 0, duration: 0.5, ease: "power3.inOut" }, "-=0.15")
      .to(add, { width: aw, duration: 0.45, ease: "power3.inOut" }, "<")
      .to(ach, { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: "expo.out" }, "-=0.2")
      .to(tick, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.2)" }, "-=0.2")
      .to({}, { duration: 2.2 })
      .to([add, tick], { opacity: 0, duration: 0.3 })
      .set(dch, { y: 0, rotation: 0, opacity: 1 })
      .set(drop, { width: dw })
      .set(add, { width: 0, opacity: 1 })
      .set(ach, { opacity: 0, y: -24 })
      .set(tick, { scale: 0 });
    ScrollTrigger.create({ trigger: morph, start: "top 90%", end: "bottom 10%", onToggle: (self) => (self.isActive ? mtl.play() : mtl.pause()) });
  }

  /* ------------------------------------------------------------------ close */

  if (hasGsap && !reduce) {
    const cm = $("[data-close-mark]");
    gsap
      .timeline({ scrollTrigger: { trigger: cm, start: "top 78%" } })
      .fromTo($(".cm-draw", cm), { strokeDashoffset: 700 }, { strokeDashoffset: 0, duration: 1.2, ease: "power3.inOut" })
      .fromTo($(".cm-pupil", cm), { scaleY: 0, transformOrigin: "50% 50%" }, { scaleY: 1, duration: 0.6, ease: "expo.out" }, "-=0.35")
      .fromTo($(".cm-fill", cm), { opacity: 0 }, { opacity: 1, duration: 0.6 }, "<");
  }

  /* ------------------------------------------------------------------ notify form */

  const form = $("[data-notify]");
  const input = $("#email");
  const row = $("[data-notify-row]");
  const msg = $("[data-notify-msg]");
  const btn = $("[data-notify-btn]");
  const setMsg = (kind, text) => {
    msg.className = `notify-msg${kind ? ` is-${kind}` : ""}`;
    msg.textContent = text;
  };
  input.addEventListener("input", () => {
    if (row.classList.contains("is-error")) {
      row.classList.remove("is-error");
      input.removeAttribute("aria-invalid");
      setMsg("", "Votre adresse sert uniquement à vous prévenir du lancement.");
    }
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      row.classList.add("is-error");
      input.setAttribute("aria-invalid", "true");
      setMsg("error", "Entrez une adresse e-mail valide, par exemple nom@exemple.fr.");
      input.focus();
      return;
    }
    btn.disabled = true;
    btn.textContent = "Envoi…";
    try {
      const res = await fetch(form.getAttribute("action"), {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(String(res.status));
      form.reset();
      setMsg("ok", "C'est noté. On vous prévient dès que Virio est disponible.");
      btn.textContent = "Inscrit";
    } catch (err) {
      const local = ["localhost", "127.0.0.1", ""].includes(location.hostname);
      setMsg(
        local ? "" : "error",
        local ? "Formulaire prêt : il enregistrera les e-mails une fois le site en ligne." : "L'envoi n'a pas abouti. Vérifiez votre connexion et réessayez."
      );
      btn.disabled = false;
      btn.textContent = "Me prévenir";
    }
  });

  /* ------------------------------------------------------------------ nav, smooth scroll, anchors, layout */

  const nav = $("[data-nav]");
  const onScroll = (y) => nav.classList.toggle("is-scrolled", y > 8);
  let lenis = null;
  if (hasGsap && !reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.11 });
    lenis.on("scroll", (e) => {
      ScrollTrigger.update();
      onScroll(e.scroll);
    });
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    addEventListener("scroll", () => onScroll(scrollY), { passive: true });
  }
  onScroll(scrollY);

  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const t = id.length > 1 && $(id);
      if (!t) return;
      e.preventDefault();
      const after = () => {
        if (id === "#prevenu") input.focus({ preventScroll: true });
        else {
          t.setAttribute("tabindex", "-1");
          t.focus({ preventScroll: true });
        }
      };
      if (lenis) lenis.scrollTo(id === "#top" ? 0 : t, { duration: 1.4, onComplete: after });
      else {
        t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        setTimeout(after, reduce ? 0 : 700);
      }
      history.replaceState(null, "", id);
    })
  );

  layoutDemo();
  let lastW = innerWidth;
  let rT;
  addEventListener("resize", () => {
    clearTimeout(rT);
    rT = setTimeout(() => {
      if (coarse && innerWidth === lastW) return;
      lastW = innerWidth;
      layoutScene();
      layoutDemo();
      if (hasGsap) ScrollTrigger.refresh();
    }, 150);
  });

  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    layoutScene();
    initHow();
    if (hasGsap) ScrollTrigger.refresh();
  });
})();
