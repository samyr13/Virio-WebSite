// Virio — remplit les icônes et les cartes de SMS des gabarits.
(() => {
  const IC = {
    msg: '<svg viewBox="0 0 20 20"><rect width="20" height="20" rx="5" fill="#34c759"/><path d="M10 4.6c-3.3 0-5.9 2.1-5.9 4.8 0 1.5.8 2.8 2.1 3.7l-.5 2.3 2.4-1.3c.6.1 1.2.2 1.9.2 3.3 0 5.9-2.2 5.9-4.9S13.3 4.6 10 4.6z" fill="#fff"/></svg>',
    x: '<svg viewBox="0 0 16 16"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>',
    cross: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#3a1418"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#e5484d" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>',
    tick: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#123b27"/><path d="M7.5 12.4l3 3 6-6.6" stroke="#2bc97a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    lock: '<svg viewBox="0 0 11 13"><path d="M3 5.5V3.8a2.5 2.5 0 015 0v1.7" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x=".5" y="5.5" width="10" height="7" rx="1.6" fill="currentColor"/></svg>',
  };

  // [expéditeur, texte, adresse]
  const SMS = [
    ["AMENDES-INFO", "Amende impayée : 35 €. Majoration à 375 € sous 24 h. Payez ici :", "antai-paiement-gouv.com"],
    ["COLIS", "Votre colis est bloqué. Frais de réexpédition : 1,99 €", "suivi-colis-livraison.net"],
    ["BANQUE", "Activité inhabituelle. Votre compte sera suspendu :", "secure-banque-verif.com"],
    ["IMPOTS", "Remboursement de 214 € en attente :", "impots-remboursement.org"],
    ["ASSURANCE MALADIE", "Carte Vitale expirée. Renouvelez :", "ameli-carte-vitale.info"],
    ["MON CPF", "Vos droits CPF expirent ce soir :", "moncompte-cpf-droits.fr"],
    ["TÉLÉPÉAGE", "Facture impayée : 6,80 €. Régularisez :", "telepeage-facture.info"],
  ];

  document.querySelectorAll("[data-sms]").forEach((el) => {
    const [from, body, url] = SMS[+el.dataset.sms];
    const chip = el.dataset.chip ? `<span class="strike">${IC.x}${el.dataset.chip}</span>` : "";
    el.innerHTML =
      `<div class="notif-head">${IC.msg}Messages<time>${el.dataset.time || "maintenant"}</time></div>` +
      `<div class="notif-from">${from}</div><div class="notif-body">${body}</div>` +
      `<span class="notif-link">${url}</span>${chip}`;
  });

  document.querySelectorAll("[data-ic]").forEach((el) => (el.outerHTML = IC[el.dataset.ic]));
})();
