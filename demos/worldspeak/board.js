/*! WorldSpeak offline board — generated from catalog essentials.v1; do not edit by hand. */
"use strict";
const DATA = {"objects":[{"id":"water","en":"water","ta":"தண்ணீர்"},{"id":"food","en":"food","ta":"உணவு"},{"id":"toilet","en":"toilet","ta":"கழிப்பறை"},{"id":"rest","en":"rest","ta":"ஓய்வு"},{"id":"medicine","en":"medicine","ta":"மருந்து"},{"id":"chair","en":"chair","ta":"நாற்காலி"},{"id":"phone","en":"phone","ta":"தொலைபேசி"},{"id":"light","en":"light","ta":"வெளிச்சம்"},{"id":"fan","en":"fan","ta":"மின்விசிறி"},{"id":"blanket","en":"blanket","ta":"போர்வை"},{"id":"music","en":"music","ta":"இசை"},{"id":"family","en":"family","ta":"குடும்பம்"},{"id":"doctor","en":"doctor","ta":"மருத்துவர்"},{"id":"pain","en":"pain","ta":"வலி"}],"templates":{"en":[{"id":"request-object.want","kind":"request-object","polarity":"want","act":null,"objectSlot":"required","text":"I want {object}."},{"id":"request-object.do-not-want","kind":"request-object","polarity":"do-not-want","act":null,"objectSlot":"required","text":"I do not want {object}."},{"id":"ask-location.object","kind":"ask-location","polarity":null,"act":null,"objectSlot":"required","text":"Where is {object}?"},{"id":"request-help.object","kind":"request-help","polarity":null,"act":null,"objectSlot":"required","text":"Please help me with {object}."},{"id":"request-help.generic","kind":"request-help","polarity":null,"act":null,"objectSlot":"none","text":"Please help me."},{"id":"social.yes","kind":"social","polarity":null,"act":"yes","objectSlot":"none","text":"Yes."},{"id":"social.no","kind":"social","polarity":null,"act":"no","objectSlot":"none","text":"No."},{"id":"social.thank-you","kind":"social","polarity":null,"act":"thank-you","objectSlot":"none","text":"Thank you."},{"id":"social.please-wait","kind":"social","polarity":null,"act":"please-wait","objectSlot":"none","text":"Please wait."}],"ta":[{"id":"request-object.want","kind":"request-object","polarity":"want","act":null,"objectSlot":"required","text":"எனக்கு {object} வேண்டும்."},{"id":"request-object.do-not-want","kind":"request-object","polarity":"do-not-want","act":null,"objectSlot":"required","text":"எனக்கு {object} வேண்டாம்."},{"id":"ask-location.object","kind":"ask-location","polarity":null,"act":null,"objectSlot":"required","text":"{object} எங்கே?"},{"id":"request-help.object","kind":"request-help","polarity":null,"act":null,"objectSlot":"required","text":"தயவுசெய்து {object} தொடர்பாக எனக்கு உதவுங்கள்."},{"id":"request-help.generic","kind":"request-help","polarity":null,"act":null,"objectSlot":"none","text":"தயவுசெய்து எனக்கு உதவுங்கள்."},{"id":"social.yes","kind":"social","polarity":null,"act":"yes","objectSlot":"none","text":"ஆம்."},{"id":"social.no","kind":"social","polarity":null,"act":"no","objectSlot":"none","text":"இல்லை."},{"id":"social.thank-you","kind":"social","polarity":null,"act":"thank-you","objectSlot":"none","text":"நன்றி."},{"id":"social.please-wait","kind":"social","polarity":null,"act":"please-wait","objectSlot":"none","text":"தயவுசெய்து காத்திருங்கள்."}]},"tiles":[{"id":"water-want","category":"needs","label":{"en":"Water","ta":"தண்ணீர்"},"intent":{"kind":"request-object","object":{"catalogId":"water","selectedObjectId":null},"polarity":"want"}},{"id":"food-want","category":"needs","label":{"en":"Food","ta":"உணவு"},"intent":{"kind":"request-object","object":{"catalogId":"food","selectedObjectId":null},"polarity":"want"}},{"id":"food-do-not-want","category":"needs","label":{"en":"No food","ta":"உணவு வேண்டாம்"},"intent":{"kind":"request-object","object":{"catalogId":"food","selectedObjectId":null},"polarity":"do-not-want"}},{"id":"water-do-not-want","category":"needs","label":{"en":"No water","ta":"தண்ணீர் வேண்டாம்"},"intent":{"kind":"request-object","object":{"catalogId":"water","selectedObjectId":null},"polarity":"do-not-want"}},{"id":"toilet-where","category":"needs","label":{"en":"Toilet?","ta":"கழிப்பறை?"},"intent":{"kind":"ask-location","object":{"catalogId":"toilet","selectedObjectId":null}}},{"id":"rest-want","category":"needs","label":{"en":"Rest","ta":"ஓய்வு"},"intent":{"kind":"request-object","object":{"catalogId":"rest","selectedObjectId":null},"polarity":"want"}},{"id":"rest-do-not-want","category":"needs","label":{"en":"No rest","ta":"ஓய்வு வேண்டாம்"},"intent":{"kind":"request-object","object":{"catalogId":"rest","selectedObjectId":null},"polarity":"do-not-want"}},{"id":"medicine-want","category":"needs","label":{"en":"Medicine","ta":"மருந்து"},"intent":{"kind":"request-object","object":{"catalogId":"medicine","selectedObjectId":null},"polarity":"want"}},{"id":"chair-want","category":"needs","label":{"en":"Chair","ta":"நாற்காலி"},"intent":{"kind":"request-object","object":{"catalogId":"chair","selectedObjectId":null},"polarity":"want"}},{"id":"phone-want","category":"needs","label":{"en":"Phone","ta":"தொலைபேசி"},"intent":{"kind":"request-object","object":{"catalogId":"phone","selectedObjectId":null},"polarity":"want"}},{"id":"help-me","category":"help","label":{"en":"Help me","ta":"எனக்கு உதவுங்கள்"},"intent":{"kind":"request-help","object":null}},{"id":"pain-help","category":"help","label":{"en":"Pain help","ta":"வலி தொடர்பான உதவி"},"intent":{"kind":"request-help","object":{"catalogId":"pain","selectedObjectId":null}}},{"id":"medicine-help","category":"help","label":{"en":"Medicine help","ta":"மருந்து தொடர்பான உதவி"},"intent":{"kind":"request-help","object":{"catalogId":"medicine","selectedObjectId":null}}},{"id":"toilet-help","category":"help","label":{"en":"Toilet help","ta":"கழிப்பறைக்குச் செல்ல உதவி"},"intent":{"kind":"request-help","object":{"catalogId":"toilet","selectedObjectId":null}}},{"id":"doctor-where","category":"help","label":{"en":"Doctor?","ta":"மருத்துவர்?"},"intent":{"kind":"ask-location","object":{"catalogId":"doctor","selectedObjectId":null}}},{"id":"blanket-want","category":"comfort","label":{"en":"Blanket","ta":"போர்வை"},"intent":{"kind":"request-object","object":{"catalogId":"blanket","selectedObjectId":null},"polarity":"want"}},{"id":"blanket-do-not-want","category":"comfort","label":{"en":"No blanket","ta":"போர்வை வேண்டாம்"},"intent":{"kind":"request-object","object":{"catalogId":"blanket","selectedObjectId":null},"polarity":"do-not-want"}},{"id":"music-want","category":"comfort","label":{"en":"Music","ta":"இசை"},"intent":{"kind":"request-object","object":{"catalogId":"music","selectedObjectId":null},"polarity":"want"}},{"id":"music-do-not-want","category":"comfort","label":{"en":"No music","ta":"இசை வேண்டாம்"},"intent":{"kind":"request-object","object":{"catalogId":"music","selectedObjectId":null},"polarity":"do-not-want"}},{"id":"family-where","category":"comfort","label":{"en":"Family?","ta":"குடும்பம்?"},"intent":{"kind":"ask-location","object":{"catalogId":"family","selectedObjectId":null}}},{"id":"fan-want","category":"comfort","label":{"en":"Fan","ta":"மின்விசிறி"},"intent":{"kind":"request-object","object":{"catalogId":"fan","selectedObjectId":null},"polarity":"want"}},{"id":"light-want","category":"comfort","label":{"en":"Light","ta":"வெளிச்சம்"},"intent":{"kind":"request-object","object":{"catalogId":"light","selectedObjectId":null},"polarity":"want"}},{"id":"social-yes","category":"social","label":{"en":"Yes","ta":"ஆம்"},"intent":{"kind":"social","act":"yes"}},{"id":"social-no","category":"social","label":{"en":"No","ta":"இல்லை"},"intent":{"kind":"social","act":"no"}},{"id":"social-thanks","category":"social","label":{"en":"Thank you","ta":"நன்றி"},"intent":{"kind":"social","act":"thank-you"}},{"id":"social-wait","category":"social","label":{"en":"Please wait","ta":"காத்திருங்கள்"},"intent":{"kind":"social","act":"please-wait"}}]};
const state = { tileId: null, locale: "en", polarity: null, customText: null, voiceName: "", rate: 1, notice: "" };

function noun(id, locale) {
  const o = DATA.objects.find((x) => x.id === id);
  if (!o) throw new Error("Unknown object " + id);
  return locale === "ta" ? o.ta : o.en;
}
function findTemplate(intent, locale) {
  return DATA.templates[locale].find((tm) => {
    if (tm.kind !== intent.kind) return false;
    if (intent.kind === "request-object") return tm.polarity === intent.polarity;
    if (intent.kind === "social") return tm.act === intent.act;
    if (intent.kind === "ask-location") return tm.objectSlot === "required";
    if (intent.kind === "request-help") return intent.object === null ? tm.objectSlot === "none" : tm.objectSlot === "required";
    return false;
  }) || null;
}
function renderCurrent() {
  const tile = DATA.tiles.find((x) => x.id === state.tileId);
  if (state.customText) return { text: state.customText, meta: "user-text · " + state.locale };
  if (!tile) return null;
  const intent = tile.intent.kind === "request-object" && state.polarity
    ? { kind: "request-object", object: tile.intent.object, polarity: state.polarity }
    : tile.intent;
  const tm = findTemplate(intent, state.locale);
  if (!tm) return { text: "", meta: "no template", error: true };
  let text = tm.text;
  if (tm.objectSlot === "required") text = text.split("{object}").join(noun(intent.object.catalogId, state.locale));
  const chips = [intent.kind];
  if (intent.kind === "request-object") chips.push(intent.polarity);
  if (intent.kind === "social") chips.push(intent.act);
  if (intent.object) chips.push(intent.object.catalogId);
  return { text, meta: chips.join(" · ") + " · " + state.locale };
}
function pickVoice(voices, locale) {
  return voices.find((v) => (v.lang || "").toLowerCase().indexOf(locale) === 0) || null;
}
function refreshVoices() {
  const sel = document.getElementById("voice");
  if (!sel || !window.speechSynthesis) return;
  sel.innerHTML = "";
  const auto = document.createElement("option");
  auto.value = "";
  auto.textContent = "Automatic (match language)";
  sel.appendChild(auto);
  for (const v of window.speechSynthesis.getVoices()) {
    const o = document.createElement("option");
    o.value = v.name;
    o.textContent = v.name + " (" + v.lang + ")";
    if (state.voiceName === v.name) o.selected = true;
    sel.appendChild(o);
  }
}
if (window.speechSynthesis && !window.__wsVoices) {
  window.__wsVoices = true;
  window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
}
function speakCurrent() {
  // ONLY invoked from the Speak button click handler with current state.
  try {
    const r = renderCurrent();
    if (!r || !r.text || r.error) { setNotice("Review the preview, then press Speak again."); return; }
    const synth = window.speechSynthesis;
    if (!synth) { setNotice("Speech is unavailable on this device — the large text above is the message."); return; }
    const voices = synth.getVoices();
    const chosen = (state.voiceName && voices.find((v) => v.name === state.voiceName)) || pickVoice(voices, state.locale);
    if (!chosen || (chosen.lang || "").toLowerCase().indexOf(state.locale) !== 0) {
      setNotice("No matching voice for this language. Showing large text instead — no other voice will be substituted.");
      return;
    }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(r.text);
    u.lang = chosen.lang; u.voice = chosen; u.rate = state.rate;
    synth.speak(u);
    setNotice(state.locale === "ta" ? "முன்னோட்டம் பேசப்படுகிறது." : "Speaking the exact preview.");
  } catch (e) { setNotice("Speech failed. The text above remains the message."); }
}
function setNotice(msg) { state.notice = msg; render(); }
function el(tag, attrs, text) {
  const n = document.createElement(tag);
  if (attrs) for (const k of Object.keys(attrs)) { if (k === "onclick") n.addEventListener("click", attrs[k]); else n.setAttribute(k, attrs[k]); }
  if (text != null) n.textContent = text;
  return n;
}
function render() {
  const root = document.getElementById("board");
  root.innerHTML = "";
  const cats = ["needs", "help", "comfort", "social"];
  for (const cat of cats) {
    root.appendChild(el("h2", null, cat));
    const ul = el("ul", { class: "tile-grid" });
    for (const tile of DATA.tiles.filter((x) => x.category === cat)) {
      const li = document.createElement("li");
      const b = el("button", { type: "button", class: "tile" });
      if (state.tileId === tile.id && !state.customText) b.setAttribute("aria-pressed", "true");
      else b.setAttribute("aria-pressed", "false");
      b.textContent = tile.label[state.locale] || tile.label.en;
      b.addEventListener("click", () => { state.tileId = tile.id; state.customText = null; state.polarity = null; state.notice = ""; render(); });
      li.appendChild(b); ul.appendChild(li);
    }
    root.appendChild(ul);
  }
  const tile = DATA.tiles.find((x) => x.id === state.tileId);
  if (tile && tile.intent.kind === "request-object") {
    const row = el("div", { class: "btn-row" });
    for (const p of ["want", "do-not-want"]) {
      const b = el("button", { type: "button", class: "btn btn-secondary" }, p === "want" ? "I want" : "I do not want");
      b.setAttribute("aria-pressed", (state.polarity || tile.intent.polarity) === p ? "true" : "false");
      b.addEventListener("click", () => { state.polarity = p; state.customText = null; state.notice = ""; render(); });
      row.appendChild(b);
    }
    root.appendChild(row);
  }
  const locRow = el("div", { class: "btn-row" });
  for (const loc of ["en", "ta"]) {
    const b = el("button", { type: "button", class: "btn btn-secondary" }, loc === "en" ? "English" : "தமிழ்");
    b.setAttribute("aria-pressed", state.locale === loc ? "true" : "false");
    b.addEventListener("click", () => { state.locale = loc; state.customText = null; state.notice = ""; document.documentElement.lang = loc; render(); });
    locRow.appendChild(b);
  }
  root.appendChild(locRow);
  const vRow = el("div", { class: "btn-row" });
  const sel = document.createElement("select");
  sel.setAttribute("id", "voice");
  sel.setAttribute("aria-label", "Voice");
  sel.addEventListener("change", () => { state.voiceName = sel.value || ""; });
  vRow.appendChild(sel);
  const tb = el("button", { type: "button", class: "btn btn-secondary" }, "Test voice");
  tb.addEventListener("click", () => {
    // Own click gesture — previews the selected voice, never the composition.
    const synth = window.speechSynthesis;
    if (!synth) { setNotice("Speech is unavailable on this device."); return; }
    const voices = synth.getVoices();
    const chosen = (state.voiceName && voices.find((v) => v.name === state.voiceName)) || pickVoice(voices, state.locale);
    if (!chosen || (chosen.lang || "").toLowerCase().indexOf(state.locale) !== 0) {
      setNotice("No matching voice for this language. Showing large text instead.");
      return;
    }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(state.locale === "ta" ? "எனக்கு தண்ணீர் வேண்டும்." : "I want water.");
    u.lang = chosen.lang; u.voice = chosen;
    synth.speak(u);
  });
  vRow.appendChild(tb);
  root.appendChild(vRow);
  refreshVoices();
  const ta = el("textarea", { id: "own", class: "field", rows: "2", maxlength: "280" });
  ta.setAttribute("aria-label", "Type your own exact sentence");
  root.appendChild(ta);
  const useBtn = el("button", { type: "button", class: "btn btn-secondary" }, "Use this sentence");
  useBtn.addEventListener("click", () => {
    const v = ta.value;
    if (!v.trim()) return;
    state.customText = v; state.tileId = null; state.notice = ""; render();
  });
  root.appendChild(useBtn);
  const prev = el("div", { class: "preview" });
  const r = renderCurrent();
  prev.appendChild(el("p", { class: "status" }, "Exact sentence to speak:"));
  if (r && r.text && !r.error) {
    const s = el("p", { class: "preview-sentence" }, r.text);
    s.setAttribute("lang", state.locale);
    prev.appendChild(s);
    prev.appendChild(el("p", { class: "preview-meta" }, r.meta));
  } else {
    prev.appendChild(el("p", { class: "notice" }, "Choose a tile or type a sentence to preview it here."));
  }
  const speakBtn = el("button", { type: "button", class: "btn" }, state.locale === "ta" ? "இந்த வாக்கியத்தைப் பேசுக" : "Speak this sentence");
  speakBtn.addEventListener("click", () => speakCurrent());
  const stopBtn = el("button", { type: "button", class: "btn btn-secondary" }, state.locale === "ta" ? "நிறுத்து" : "Stop");
  stopBtn.addEventListener("click", () => { if (window.speechSynthesis) window.speechSynthesis.cancel(); setNotice("Stopped."); });
  const row2 = el("div", { class: "btn-row" });
  row2.appendChild(speakBtn); row2.appendChild(stopBtn);
  prev.appendChild(row2);
  if (state.notice) prev.appendChild(el("p", { class: "notice", role: "status" }, state.notice));
  root.appendChild(prev);
  const hidden = () => { if (document.visibilityState === "hidden" && window.speechSynthesis) window.speechSynthesis.cancel(); };
  document.removeEventListener("visibilitychange", window.__wsHidden || (() => {}));
  window.__wsHidden = hidden;
  document.addEventListener("visibilitychange", hidden);
}
document.addEventListener("DOMContentLoaded", render);
