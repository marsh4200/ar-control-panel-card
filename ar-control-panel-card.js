// AR Control Panel — a phone control in the AR Elegant style.
//
// A Home Assistant dashboard card (any user): HA hands it `hass` (live states,
// service calls, areas, the logged-in user). The rooms come from Home
// Assistant's own areas, so it works on its own — no wall panel needed.
// Plain web component, no build step.

const CATS = [
  { key: "lights", title: "Lights", icon: "bulb" },
  { key: "climate", title: "Climate", icon: "thermo" },
  { key: "music", title: "Music", icon: "music" },
  { key: "cameras", title: "Cameras", icon: "cam" },
  { key: "security", title: "Security", icon: "shield" },
  { key: "shades", title: "Shades", icon: "shades" },
  { key: "utilities", title: "Utilities", icon: "plug" },
  { key: "garage", title: "Garage", icon: "garage" },
  { key: "autoscenes", title: "Scenes", home: "Scenes & Automations", icon: "magic" },
];
const ROOM_KEYS = ["lights", "climate", "music", "shades", "scenes", "presence"];
const WX = {
  "clear-night": "Clear", cloudy: "Cloudy", exceptional: "Severe weather", fog: "Fog", hail: "Hail",
  lightning: "Thunderstorms", "lightning-rainy": "Thunderstorms", partlycloudy: "Partly cloudy", pouring: "Heavy rain",
  rainy: "Rain", snowy: "Snow", "snowy-rainy": "Sleet", sunny: "Sunny", windy: "Windy", "windy-variant": "Windy",
};
const MODE_NAME = { cool: "Cool", heat: "Heat", heat_cool: "Heat/Cool", auto: "Auto", dry: "Dry", fan_only: "Fan", off: "Off" };
const MODE_ICON = { cool: "snow", heat: "flame", heat_cool: "auto", auto: "auto", dry: "drop", fan_only: "fan", off: "power" };

const P = {
  home: '<path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
  thermo: '<path d="M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  cam: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M22 8l-6 4 6 4z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  shades: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 8h18M3 13h18M3 18h18"/>',
  plug: '<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/>',
  chev: '<path d="M6 9l6 6 6-6"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  minus: '<path d="M5 12h14"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  play: '<path d="M7 4l13 8-13 8z"/>',
  pause: '<path d="M7 4h4v16H7zM13 4h4v16h-4z"/>',
  prev: '<path d="M19 20L9 12l10-8zM5 4v16"/>',
  next: '<path d="M5 4l10 8-10 8zM19 4v16"/>',
  power: '<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.8 0"/>',
  snow: '<path d="M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1L19.1 4.9"/>',
  flame: '<path d="M12 22a6 6 0 0 0 6-6c0-4-6-10-6-14-1 4-6 8-6 14a6 6 0 0 0 6 6z"/>',
  auto: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  drop: '<path d="M12 2.7l5.7 5.7a8 8 0 1 1-11.3 0z"/>',
  fan: '<path d="M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2M17.5 8a2.5 2.5 0 1 1 2 4H2"/>',
  up: '<path d="M6 15l6-6 6 6"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  lock: '<rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  unlock: '<rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
  expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  cloud: '<path d="M7 19h10a4 4 0 0 0 0-8 6 6 0 0 0-11.6 2A3 3 0 0 0 7 19z"/>',
  close: '<path d="M18 6L6 18M6 6l12 12"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  garage: '<path d="M2 21V9l10-6 10 6v12"/><path d="M6 21v-9h12v9M6 15h12M6 18h12"/>',
  garageOpen: '<path d="M2 21V9l10-6 10 6v12"/><path d="M6 21v-9h12v9M6 14h12"/>',
  magic: '<path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8l1.4 1.4M17.8 6.2l1.4-1.4M12.2 6.2l-1.4-1.4"/><path d="M3 21l9-9"/>',
  robot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6"/>',
  pencil: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
  shuffle: '<path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
  back: '<path d="M15 18l-6-6 6-6"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  speaker: '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="14" r="4"/><path d="M12 6h.01"/>',
};
const svg = (n, size, extra) =>
  `<svg width="${size || 22}" height="${size || 22}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${extra || ""}>${P[n] || ""}</svg>`;
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const uniq = (a) => a.filter((x, i) => a.indexOf(x) === i);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pad = (n) => (n < 10 ? "0" : "") + n;

const CSS = `
:host{display:block;height:100%;min-height:calc(100vh - var(--header-height, 56px));font-family:Roboto,"Segoe UI",system-ui,sans-serif;color:#f3f1ec;--ink:#f3f1ec;--ink-rgb:243,241,236;--acc:#f2b866;--acc-rgb:242,184,102;--glass:rgba(22,24,30,.46);--line:rgba(255,255,255,.12)}
*{box-sizing:border-box}
button{font:inherit;color:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
.root{position:relative;min-height:100%;height:100%;overflow-y:auto;overflow-x:hidden;font-family:Roboto,"Segoe UI",system-ui,sans-serif;color:var(--ink);
  background:radial-gradient(70% 45% at 12% 12%,rgba(var(--acc-rgb),.26),transparent 60%),radial-gradient(60% 40% at 100% 100%,rgba(90,120,170,.22),transparent 65%),linear-gradient(165deg,#2b2620 0%,#1a1916 45%,#101317 100%);background-attachment:fixed}
.wrap{max-width:560px;margin:0 auto;padding:calc(env(safe-area-inset-top,0px) + 18px) 16px calc(env(safe-area-inset-bottom,0px) + 118px)}
.top{display:flex;align-items:center;gap:10px;padding:0 6px}
.top h1{flex:1;margin:0;font-size:30px;font-weight:600;letter-spacing:-.01em;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hi{font-size:13px;font-weight:600;color:rgba(var(--ink-rgb),.66)}
.iconbtn{width:44px;height:44px;flex:none;border-radius:50%;background:var(--glass);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;color:rgba(var(--ink-rgb),.85)}
.chip{display:flex;align-items:center;gap:6px;height:44px;padding:0 14px;border-radius:999px;background:var(--glass);border:1px solid var(--line);color:rgba(var(--ink-rgb),.85);font-size:14px;font-weight:600;max-width:52vw}
.chip span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.glass{background:var(--glass);border:1px solid var(--line);border-radius:22px;box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 12px 28px -18px rgba(0,0,0,.7);-webkit-backdrop-filter:blur(18px) saturate(1.15);backdrop-filter:blur(18px) saturate(1.15)}
.hero{margin-top:18px;padding:18px 20px;display:flex;align-items:center;gap:14px}
.clock{font-size:52px;font-weight:300;letter-spacing:-.03em;line-height:1}
.date{margin-top:8px;font-size:14px;font-weight:600;color:rgba(var(--ink-rgb),.66)}
.wx{display:flex;flex-direction:column;align-items:flex-end;gap:6px;text-align:right}
.wx b{display:flex;align-items:center;gap:8px;font-size:28px;font-weight:400;color:var(--ink)}
.wx b svg{color:var(--acc)}
.wx small{font-size:12px;font-weight:600;color:rgba(var(--ink-rgb),.66)}
.row{margin-top:14px;display:grid;gap:8px}
.r4{grid-template-columns:repeat(4,minmax(0,1fr))}
.pill{min-height:44px;padding:0 10px;border-radius:14px;background:rgba(255,255,255,.07);border:1px solid var(--line);color:rgba(var(--ink-rgb),.88);font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pill.hit{background:rgba(var(--acc-rgb),.30);border-color:rgba(var(--acc-rgb),.6);color:#fff}
.grid{margin-top:14px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.card{position:relative;overflow:hidden;text-align:left;padding:16px;display:flex;flex-direction:column;gap:14px;min-width:0}
.card .t{font-size:16px;font-weight:700}
.card .s{margin-top:2px;font-size:13px;font-weight:600;color:rgba(var(--ink-rgb),.66);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ic{width:44px;height:44px;border-radius:14px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;color:rgba(var(--ink-rgb),.8)}
.ic.lit{background:linear-gradient(145deg,var(--acc),#e89a3c);color:#2a1a06;box-shadow:0 0 20px rgba(var(--acc-rgb),.45)}
.ic.ok{background:rgba(80,190,140,.16);color:#8ee3b0}
.ic.warn{background:rgba(255,107,107,.18);color:#ffb0b0}
.glow{position:absolute;right:-36px;top:-36px;width:130px;height:130px;border-radius:50%;background:radial-gradient(circle,rgba(var(--acc-rgb),.28),transparent 70%);pointer-events:none}
.bar{margin-top:16px;display:flex;align-items:center;gap:8px;padding:0 4px}
.bar .lbl{flex:1;font-size:14px;font-weight:600;color:rgba(var(--ink-rgb),.66);min-width:0}
.act{height:44px;padding:0 18px;border-radius:999px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.16);font-size:14px;font-weight:700;color:rgba(var(--ink-rgb),.88)}
.act.on{background:rgba(var(--acc-rgb),.16);border-color:rgba(var(--acc-rgb),.5);color:#ffe2b8}
.light{position:relative;overflow:hidden;min-height:132px;padding:14px;border-radius:22px;display:flex;flex-direction:column;justify-content:space-between;gap:10px}
.light.on{background:rgba(40,33,24,.62);border-color:rgba(var(--acc-rgb),.45);box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 0 24px -8px rgba(var(--acc-rgb),.55)}
.light .tap{all:unset;cursor:pointer;display:flex;flex-direction:column;gap:10px;-webkit-tap-highlight-color:transparent}
.light .tap:focus-visible{outline:2px solid var(--acc);outline-offset:4px;border-radius:12px}
.bulbrow{display:flex;align-items:center;justify-content:space-between}
.bulb{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);color:rgba(var(--ink-rgb),.5)}
.on .bulb{background:radial-gradient(circle at 40% 35%,#ffe2b0,var(--acc) 60%,#e89a3c);color:#3a2408;box-shadow:0 0 22px rgba(var(--acc-rgb),.55)}
.lvl{font-size:13px;font-weight:700;color:rgba(var(--ink-rgb),.66)}
.lgs{margin-top:14px;display:flex;flex-direction:column;gap:12px}
.rsec{margin-top:22px}
.rsec + .rsec{padding-top:18px;border-top:1px solid var(--line)}
.rsh{display:flex;align-items:center;gap:10px;padding:0 4px}
.rsh .tap{all:unset;cursor:pointer;flex:1;min-width:0;display:flex;align-items:baseline;gap:10px;-webkit-tap-highlight-color:transparent}
.rsh .tap:focus-visible{outline:2px solid var(--acc);outline-offset:4px;border-radius:10px}
.rsh .rn{font-size:20px;font-weight:700;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rsh .rc{font-size:13px;font-weight:600;color:rgba(var(--ink-rgb),.55);white-space:nowrap}
.rsh .rc.lit{color:var(--acc)}
.rsh .chv{align-self:center;margin-left:auto}
.rsec .lgs,.rsec .grid,.rsec .list{margin-top:12px}
.rsh.col .tap{flex-direction:column;align-items:flex-start;gap:2px}
.rsh.col .rl{display:flex;align-items:center;gap:8px;min-width:0;max-width:100%}
.rsh.col .rl .chv{margin-left:0}
.rsh .seg{flex:none;flex-wrap:nowrap}
.rsh .seg button{width:44px;height:44px;padding:0;display:flex;align-items:center;justify-content:center}
.lgrp{position:relative;overflow:hidden;padding:14px;border-radius:22px;display:flex;flex-direction:column;gap:10px}
.lgrp.on{background:rgba(40,33,24,.62);border-color:rgba(var(--acc-rgb),.45);box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 0 24px -8px rgba(var(--acc-rgb),.55)}
.lgh{display:flex;align-items:center;gap:12px}
.lgh .tap{all:unset;cursor:pointer;flex:1;min-width:0;display:flex;align-items:center;gap:12px;-webkit-tap-highlight-color:transparent}
.lgh .tap:focus-visible{outline:2px solid var(--acc);outline-offset:4px;border-radius:12px}
.gt{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.gs{font-size:13px;font-weight:600;color:rgba(var(--ink-rgb),.66);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gs b{color:var(--acc);font-weight:700}
.chv{flex:none;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.07);color:rgba(var(--ink-rgb),.7);transition:transform .2s}
.chv.open{transform:rotate(180deg)}
.sw{flex:none;position:relative;width:52px;height:30px;border-radius:999px;background:rgba(255,255,255,.12);border:1px solid var(--line);padding:0}
.sw i{position:absolute;left:3px;top:3px;width:22px;height:22px;border-radius:50%;background:#d8d4cc;transition:left .18s}
.sw.on{background:linear-gradient(145deg,var(--acc),#e89a3c);border-color:transparent}
.sw.on i{left:25px;background:#fff8ec}
.lgl{display:flex;flex-direction:column;gap:6px;margin-top:2px;padding-top:10px;border-top:1px solid var(--line)}
.lrow{padding:8px 10px;border-radius:16px;background:rgba(255,255,255,.04)}
.lrow.on{background:rgba(var(--acc-rgb),.08)}
.lrow .tap{all:unset;cursor:pointer;width:100%;display:flex;align-items:center;gap:10px}
.lrow .bulb{width:32px;height:32px}
.lrow .nm{flex:1;min-width:0;font-size:14px}
.lrow input[type=range]{margin-top:2px}
.lgrp .lrow:not(.on) .bulb{background:rgba(255,255,255,.08);color:rgba(var(--ink-rgb),.5);box-shadow:none}
.lrow:not(.on) .nm{color:rgba(var(--ink-rgb),.75)}
.nm{font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:28px;background:transparent;margin:0}
input[type=range]::-webkit-slider-runnable-track{height:8px;border-radius:999px;background:linear-gradient(90deg,#c9853a var(--p,0%),rgba(0,0,0,.35) var(--p,0%))}
input[type=range]::-moz-range-track{height:8px;border-radius:999px;background:linear-gradient(90deg,#c9853a var(--p,0%),rgba(0,0,0,.35) var(--p,0%))}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;margin-top:-7px;border-radius:50%;background:#fff3d9;box-shadow:0 2px 8px rgba(0,0,0,.5)}
input[type=range]::-moz-range-thumb{width:22px;height:22px;border:0;border-radius:50%;background:#fff3d9}
input[type=range]:disabled{opacity:.35}
.tabs{margin-top:14px;display:flex;gap:8px;overflow-x:auto;padding:0 2px 2px;scrollbar-width:none}
.tabs::-webkit-scrollbar{display:none}
.tab{flex:none;height:40px;padding:0 16px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid var(--line);color:rgba(var(--ink-rgb),.66);font-size:13px;font-weight:700}
.tab.on{background:rgba(255,255,255,.16);color:var(--ink)}
.tab .lk{display:inline-flex;vertical-align:-3px;margin-right:5px;color:var(--acc)}
.grp{width:100%;padding:12px 14px;border-radius:16px;background:rgba(var(--acc-rgb),.08);border:1px solid rgba(var(--acc-rgb),.28)}
.grp .gh{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--acc)}
.grp .gh span{flex:1;min-width:0}
.grp .gm{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.grp .gm button{display:flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:999px;background:rgba(255,255,255,.07);border:1px solid var(--line);font-size:12px;font-weight:700;color:rgba(var(--ink-rgb),.85)}
.grp .gm button.me{background:rgba(255,255,255,.16);color:var(--ink)}
.grp .gm i{font-style:normal;font-size:10px;letter-spacing:.04em;text-transform:uppercase;color:var(--acc)}
.grp .gm .pl{width:7px;height:7px;border-radius:50%;background:#7ee2a8}
.grp .leave{height:30px;padding:0 12px;border-radius:999px;background:none;border:1px solid var(--line);font-size:12px;font-weight:700;color:rgba(var(--ink-rgb),.75)}
.dialbox{margin-top:16px;padding:22px 18px 20px;display:flex;flex-direction:column;align-items:center}
.dial{position:relative;width:250px;height:250px}
.dial svg{position:absolute;left:0;top:0}
.dial .in{position:absolute;left:0;right:0;top:66px;text-align:center}
.dial .k{font-size:13px;font-weight:700;letter-spacing:.08em;color:#9fd3ff;text-transform:uppercase}
.dial .v{font-size:64px;font-weight:300;letter-spacing:-.04em;line-height:1.05}
.dial .v sup{font-size:30px}
.pm{margin-top:4px;display:flex;gap:40px}
.round{width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center}
.modes{margin-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(64px,1fr));gap:8px}
.mode{height:58px;border-radius:16px;background:rgba(255,255,255,.06);border:1px solid var(--line);color:rgba(var(--ink-rgb),.72);font-size:12px;font-weight:700;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}
.mode.on{background:rgba(125,211,252,.16);border-color:rgba(125,211,252,.55);color:#d4efff}
.mode.on.heat{background:rgba(255,150,90,.16);border-color:rgba(255,150,90,.55);color:#ffd9c2}
.line{margin-top:12px;padding:14px 16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.line .nm{flex:1;min-width:90px}
.seg{display:flex;gap:6px;flex-wrap:wrap}
.seg button{height:36px;padding:0 12px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid var(--line);color:rgba(var(--ink-rgb),.72);font-size:12px;font-weight:700}
.seg button.on{background:rgba(255,255,255,.16);color:var(--ink)}
.np{margin-top:16px;padding:18px;display:flex;flex-direction:column;align-items:center;gap:14px}
.art{width:min(260px,70vw);aspect-ratio:1;border-radius:20px;background:linear-gradient(160deg,#3a3229,#1d1b19);display:flex;align-items:center;justify-content:center;color:rgba(var(--ink-rgb),.3);overflow:hidden;box-shadow:0 20px 40px -20px rgba(0,0,0,.8)}
.art img{width:100%;height:100%;object-fit:cover}
.np .tt{font-size:19px;font-weight:700;text-align:center}
.np .ar{font-size:14px;font-weight:600;color:rgba(var(--ink-rgb),.66);text-align:center;margin-top:-8px}
.ctl{display:flex;align-items:center;gap:22px}
.big{width:72px;height:72px;border-radius:50%;background:linear-gradient(145deg,var(--acc),#e89a3c);color:#2a1a06;border:0;display:flex;align-items:center;justify-content:center;box-shadow:0 0 26px rgba(var(--acc-rgb),.4)}
.vol{width:100%;display:flex;align-items:center;gap:10px}
.camhero{position:relative;margin-top:16px;width:100%;aspect-ratio:16/9;border-radius:22px;overflow:hidden;border:1px solid var(--line);background:linear-gradient(160deg,#3a4048,#22272d 55%,#15181c);padding:0;display:block}
.camhero img,.camsm img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.camhero .cap,.camsm .cap{position:absolute;left:0;right:0;bottom:0;padding:26px 14px 12px;background:linear-gradient(transparent,rgba(0,0,0,.65));text-align:left;font-size:16px;font-weight:700}
.camhero .cap small{display:block;font-size:12px;font-weight:600;color:rgba(var(--ink-rgb),.72)}
.live{position:absolute;left:12px;top:12px;display:flex;align-items:center;gap:6px;padding:5px 10px;border-radius:999px;background:rgba(0,0,0,.55);font-size:11px;font-weight:700;letter-spacing:.06em}
.live i{width:7px;height:7px;border-radius:50%;background:#ff6b6b}
.camsm{position:relative;height:128px;border-radius:20px;overflow:hidden;border:1px solid var(--line);background:linear-gradient(160deg,#343a41,#1b1f24);padding:0}
.camsm .cap{font-size:14px;padding:18px 12px 10px}
.camsm .ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(var(--ink-rgb),.35)}
.camsm.sel{border-color:rgba(var(--acc-rgb),.7);box-shadow:0 0 0 1px rgba(var(--acc-rgb),.5)}
.camrtc{position:relative;margin-top:16px;width:100%;aspect-ratio:16/9;border-radius:22px;overflow:hidden;border:1px solid var(--line);background:#000}
.camrtc webrtc-camera{position:absolute;inset:0;display:block;width:100%;height:100%}
.camname{display:flex;align-items:center;gap:8px;margin:16px 4px 0;font-size:16px;font-weight:700}
.camname .live{position:static}
.camname .cn{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.note{margin-top:14px;padding:12px 14px;border-radius:16px;background:rgba(255,255,255,.05);border:1px dashed rgba(255,255,255,.16);font-size:13px;font-weight:600;color:rgba(var(--ink-rgb),.66)}
.alarm{margin-top:16px;padding:20px;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}
.alarm .st{font-size:26px;font-weight:600}
.alarm .ic{width:64px;height:64px;border-radius:20px}
.list{margin-top:12px;display:flex;flex-direction:column;gap:10px}
.item{padding:12px 14px;display:flex;align-items:center;gap:12px;border-radius:18px}
.item .nm{flex:1}
.item .val{font-size:13px;font-weight:700;color:rgba(var(--ink-rgb),.66)}
.dock{position:fixed;left:var(--dock-l,12px);width:var(--dock-w,calc(100% - 24px));bottom:calc(env(safe-area-inset-bottom,0px) + 14px);display:flex;gap:4px;padding:7px;border-radius:24px;background:rgba(14,15,19,.78);border:1px solid var(--line);box-shadow:0 14px 30px -12px rgba(0,0,0,.6);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);overflow:hidden;z-index:5}
.dock::-webkit-scrollbar{display:none}
.dock button{flex:1 1 0;min-width:0;height:56px;padding:0 2px;border-radius:17px;background:none;border:0;color:rgba(var(--ink-rgb),.6);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:11px;font-weight:700;white-space:nowrap;overflow:hidden}
.dock.many button{font-size:10px;letter-spacing:-.01em}
.dock.many button svg{width:20px;height:20px}
.dock.many button span{display:none}
.dock.many button.on{flex-grow:2.2}
.dock.many button.on span{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis}
.dock button.on{background:rgba(255,255,255,.12);color:var(--ink)}
.dock button.on svg{color:var(--acc)}
.sheet{position:fixed;inset:0;z-index:10;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center}
.sheet .box{width:min(560px,100%);max-height:80vh;overflow-y:auto;padding:18px 16px calc(env(safe-area-inset-bottom,0px) + 18px);border-radius:24px 24px 0 0;background:#1b1a18;border:1px solid var(--line)}
.sheet h2{margin:0 0 12px;font-size:18px;font-weight:700;display:flex;align-items:center;justify-content:space-between}
.opt{width:100%;min-height:52px;margin-top:6px;padding:0 16px;border-radius:16px;background:rgba(255,255,255,.06);border:1px solid var(--line);text-align:left;font-size:15px;font-weight:600}
.opt.on{background:rgba(var(--acc-rgb),.18);border-color:rgba(var(--acc-rgb),.5);color:#ffe2b8}
.keys{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:12px}
.keys button{height:60px;border-radius:18px;background:rgba(255,255,255,.08);border:1px solid var(--line);font-size:24px;font-weight:400}
.dots{display:flex;justify-content:center;gap:10px;height:16px}
.dots i{width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.2)}
.dots i.f{background:var(--acc)}
.empty{margin-top:40px;text-align:center;font-size:15px;font-weight:600;color:rgba(var(--ink-rgb),.66);line-height:1.5;padding:0 20px}
.toast{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 92px);max-width:calc(100% - 32px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transform:translateX(-50%);padding:10px 16px;border-radius:999px;background:rgba(14,15,19,.9);border:1px solid var(--line);font-size:14px;font-weight:700;z-index:9}
/* ---- Scenes & Automations (Auto & Scenes) ---- */
.asgrid{margin-top:14px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.astile{position:relative;min-height:118px;border-radius:22px;background:var(--glass);border:1px solid var(--line);box-shadow:inset 0 1px 0 rgba(255,255,255,.10);transition:background .3s,border-color .3s,box-shadow .3s}
.astile.hit{background:rgba(40,33,24,.7);border-color:rgba(var(--acc-rgb),.5);box-shadow:0 0 24px -8px rgba(var(--acc-rgb),.6)}
.astile.hit .asic{background:linear-gradient(145deg,var(--acc),#e89a3c);color:#2a1a06}
.astm,.astile.new{all:unset;box-sizing:border-box;cursor:pointer;width:100%;height:100%;min-height:118px;padding:14px;display:flex;flex-direction:column;gap:6px;-webkit-tap-highlight-color:transparent}
.astm:focus-visible,.astile.new:focus-visible{outline:2px solid var(--acc);outline-offset:2px;border-radius:22px}
.astile.new{border:1px dashed rgba(var(--acc-rgb),.5);color:var(--acc)}
.asic{width:44px;height:44px;border-radius:14px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;color:rgba(var(--ink-rgb),.85);margin-bottom:4px}
.astile.new .asic{background:rgba(var(--acc-rgb),.12);color:var(--acc)}
.astile b{font-size:15px;padding-right:30px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.astile small{font-size:12px;font-weight:600;color:rgba(var(--ink-rgb),.55)}
.ased{position:absolute;right:6px;top:6px;width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.07);color:rgba(var(--ink-rgb),.75);display:flex;align-items:center;justify-content:center}
.ascard{display:flex;align-items:center;gap:8px;padding:10px 12px 10px 10px;border-radius:20px}
.asm{all:unset;flex:1;min-width:0;display:flex;gap:12px;align-items:center;cursor:pointer}
.asm:focus-visible{outline:2px solid var(--acc);outline-offset:3px;border-radius:12px}
.asav{width:42px;height:42px;flex:none;border-radius:14px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;color:var(--acc)}
.ast{display:flex;flex-direction:column;min-width:0}.ast b{font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ast small{font-size:12px;font-weight:600;color:rgba(var(--ink-rgb),.66)}.ast em{font-style:normal;font-size:11px;font-weight:600;color:rgba(var(--ink-rgb),.45);margin-top:2px}
.asside{display:flex;flex-direction:column;align-items:center;gap:8px}
.asgo{width:44px;height:44px;border-radius:50%;border:1px solid rgba(var(--acc-rgb),.45);background:rgba(var(--acc-rgb),.12);color:var(--acc);display:flex;align-items:center;justify-content:center}
.asadd{all:unset;box-sizing:border-box;cursor:pointer;margin-top:12px;width:100%;height:48px;border-radius:16px;border:1px dashed rgba(var(--acc-rgb),.5);color:var(--acc);display:flex;align-items:center;justify-content:center;gap:8px;font-size:14px;font-weight:700}
.asadd:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
.asfoot{margin:10px 4px 0;font-size:12px;color:rgba(var(--ink-rgb),.5);font-weight:600}
.asbar{margin-top:14px;display:flex;align-items:center;gap:10px}.asbar b{flex:1;text-align:center;font-size:15px}
.aslbl{display:block;margin:16px 4px 6px;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:rgba(var(--ink-rgb),.55)}
.astin{all:unset;box-sizing:border-box;display:block;width:100%;height:48px;border-radius:14px;padding:0 14px;font-size:16px;color:var(--ink);background:var(--glass);border:1px solid var(--line)}
.astin:focus{border-color:rgba(var(--acc-rgb),.6)}
.asicons{display:flex;gap:8px;flex-wrap:wrap}.asicons button{width:44px;height:44px;border-radius:14px;border:1px solid var(--line);background:rgba(255,255,255,.05);color:rgba(var(--ink-rgb),.75);display:flex;align-items:center;justify-content:center}
.asicons button.on{border-color:rgba(var(--acc-rgb),.6);background:rgba(var(--acc-rgb),.16);color:var(--acc)}
.asblk{padding:12px 14px;border-radius:18px;margin-bottom:10px}
.asdh{display:flex;align-items:center;gap:10px;color:var(--acc)}.asdh b{flex:1;min-width:0;color:var(--ink);font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.asdx{flex:none;width:36px;height:36px;border-radius:50%;border:0;background:rgba(255,255,255,.06);color:rgba(var(--ink-rgb),.6);display:flex;align-items:center;justify-content:center}
.asseg{margin-top:10px;display:flex;gap:6px;flex-wrap:wrap}.asseg button{flex:1;min-width:64px;height:40px;border-radius:12px;border:1px solid var(--line);background:rgba(255,255,255,.05);color:rgba(var(--ink-rgb),.7);font-size:13px;font-weight:700}
.asseg button.on{background:rgba(var(--acc-rgb),.18);border-color:rgba(var(--acc-rgb),.55);color:#ffe2b8}
.asslab{display:flex;justify-content:space-between;margin:12px 2px 2px;font-size:13px;font-weight:600;color:rgba(var(--ink-rgb),.66)}.asslab b{color:var(--ink)}
.astwo{margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:8px}.astwo .act{padding:0 8px;font-size:12px;display:flex;align-items:center;justify-content:center;gap:6px}
.asdel{all:unset;box-sizing:border-box;cursor:pointer;margin-top:18px;width:100%;height:46px;border-radius:16px;border:1px solid rgba(255,107,107,.4);color:#ffb0b0;display:flex;align-items:center;justify-content:center;gap:8px;font-size:14px;font-weight:700}
.asdel.sure{background:rgba(255,107,107,.18)}
/* ---- Spotify on the Music page ---- */
.spdot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#1ed760;margin-right:7px;vertical-align:1px;box-shadow:0 0 8px rgba(30,215,96,.7)}
.sto{all:unset;box-sizing:border-box;cursor:pointer;margin-top:14px;width:100%;display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:18px;-webkit-tap-highlight-color:transparent}
.sto:focus-visible{outline:2px solid var(--acc);outline-offset:3px}
.sto>svg:first-child{color:var(--acc);flex:none}
.sto span{flex:1;min-width:0;display:flex;flex-direction:column}
.sto small{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(var(--ink-rgb),.55)}
.sto b{font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sto em{flex:none;font-style:normal;font-size:11px;font-weight:700;color:#1ed760;background:rgba(30,215,96,.12);border:1px solid rgba(30,215,96,.3);padding:4px 8px;border-radius:999px}
.ssearch{margin-top:12px;display:flex;align-items:center;gap:10px;height:48px;padding:0 6px 0 14px;border-radius:16px;color:rgba(var(--ink-rgb),.6)}
.ssearch input{all:unset;flex:1;min-width:0;height:100%;font-size:16px;color:var(--ink)}
.ssearch input::placeholder{color:rgba(var(--ink-rgb),.45)}
.ssearch input::-webkit-search-cancel-button{display:none}
.ssearch button{all:unset;cursor:pointer;width:40px;height:40px;display:flex;align-items:center;justify-content:center;color:rgba(var(--ink-rgb),.6)}
.sart{flex:none;width:44px;height:44px;border-radius:8px;overflow:hidden;display:flex;align-items:center;justify-content:center;color:rgba(var(--ink-rgb),.45);background:linear-gradient(160deg,#3a3229,#1d1b19)}
.sart img{width:100%;height:100%;object-fit:cover}
.sart.round{border-radius:50%}
.sart.liked{background:linear-gradient(135deg,#5b3df5,#a8c8ff);color:#fff}
.sgrid{margin-top:14px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.srow{margin-top:10px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.spl{position:relative;min-width:0}
.spo{all:unset;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;gap:6px;width:100%;min-width:0;-webkit-tap-highlight-color:transparent}
.spo:focus-visible{outline:2px solid var(--acc);outline-offset:3px;border-radius:14px}
.spl .sart{width:100%;height:auto;aspect-ratio:1;border-radius:14px;box-shadow:0 12px 24px -14px rgba(0,0,0,.8)}
.spl .sart.round{border-radius:50%}
.spl b{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.spl small{font-size:12px;font-weight:600;color:rgba(var(--ink-rgb),.55);margin-top:-4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.srow .spl b{font-size:12px}
.splp{position:absolute;right:8px;top:8px;width:44px;height:44px;border-radius:50%;border:0;background:linear-gradient(145deg,var(--acc),#e89a3c);color:#2a1a06;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,.45)}
.srow .splp{width:36px;height:36px;right:6px;top:6px}
.sh{margin:18px 4px 0;font-size:16px;font-weight:700}
.stop{margin-top:10px;padding:12px;display:flex;align-items:center;gap:14px;border-radius:20px}
.stop .spo{flex-direction:row;align-items:center;gap:14px;flex:1}
.stop .sart{width:84px;height:84px;border-radius:14px}
.stop .sart.round{border-radius:50%}
.st2{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.st2 b{font-size:17px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.st2 small{font-size:13px;color:rgba(var(--ink-rgb),.6);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.splay{flex:none;width:52px;height:52px;border-radius:50%;border:0;background:linear-gradient(145deg,var(--acc),#e89a3c);color:#2a1a06;display:flex;align-items:center;justify-content:center;box-shadow:0 0 22px rgba(var(--acc-rgb),.4)}
.strk{all:unset;box-sizing:border-box;cursor:pointer;width:100%;display:flex;align-items:center;gap:12px;padding:8px 12px 8px 8px;-webkit-tap-highlight-color:transparent}
.strk.glass{border-radius:16px}
.strk:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
.strk .nm{flex:1;display:flex;flex-direction:column;min-width:0}
.strk .nm b{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.strk .nm small{font-size:12px;font-weight:600;color:rgba(var(--ink-rgb),.55);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.strk.now{border-color:rgba(var(--acc-rgb),.45)}
.strk.now .nm b{color:var(--acc)}
.tn{flex:none;width:22px;text-align:center;font-size:13px;font-weight:700;color:rgba(var(--ink-rgb),.5)}
.eq{display:inline-flex;gap:2px;align-items:flex-end;height:14px}.eq i{width:3px;background:var(--acc);border-radius:2px;animation:eq 1s ease-in-out infinite}.eq i:nth-child(2){animation-delay:-.3s}.eq i:nth-child(3){animation-delay:-.6s}
@keyframes eq{0%,100%{height:30%}50%{height:100%}}
.shero{margin-top:16px;display:flex;flex-direction:column;align-items:center;gap:14px}
.shero .sart{width:min(190px,52vw);height:auto;aspect-ratio:1;border-radius:18px;box-shadow:0 20px 40px -20px rgba(0,0,0,.8)}
.shero .sart.round{border-radius:50%}
.sht{text-align:center;display:flex;flex-direction:column;gap:4px}
.sht b{font-size:22px}.sht small{font-size:13px;font-weight:600;color:rgba(var(--ink-rgb),.6)}
.sbtns{margin:16px 0 4px;display:flex;align-items:center;gap:14px}
.sbig{width:60px;height:60px;flex:none}
.sbl{flex:1;min-width:0;display:flex;flex-direction:column}
.sbl b{font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sbl small{font-size:12px;color:rgba(var(--ink-rgb),.55);font-weight:600}
.sround{width:48px;height:48px;flex:none;color:rgba(var(--ink-rgb),.85)}
.mini{position:sticky;bottom:calc(env(safe-area-inset-bottom,0px) + 96px);margin-top:16px;display:flex;align-items:center;gap:12px;padding:8px 10px 8px 8px;border-radius:18px;background:rgba(30,28,25,.88);z-index:3}
.mini .sart{width:44px;height:44px;border-radius:10px}
.mt{flex:1;display:flex;flex-direction:column;min-width:0}
.mt b{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mt small{font-size:12px;font-weight:600;color:rgba(var(--ink-rgb),.55);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mb{flex:none;width:44px;height:44px;border-radius:50%;border:0;background:rgba(255,255,255,.08);color:var(--ink);display:flex;align-items:center;justify-content:center}
.sdev{display:flex;flex-direction:column;gap:8px;margin-top:6px;max-height:55vh;overflow-y:auto}
.sdev button{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:16px;background:rgba(255,255,255,.05);border:1px solid var(--line)}
.sdev button span{flex:1;min-width:0;display:flex;flex-direction:column}
.sdev b{font-size:15px}.sdev small{font-size:12px;font-weight:600;color:rgba(var(--ink-rgb),.55)}
.sdev button.on{border-color:rgba(var(--acc-rgb),.55);background:rgba(var(--acc-rgb),.12)}
.sdev button.on svg{color:var(--acc)}
.swake{margin-top:14px;padding:14px;border-radius:18px;display:flex;flex-wrap:wrap;align-items:center;gap:12px}
.swake>svg{color:var(--acc);flex:none}
.swake>div{flex:1;min-width:180px;display:flex;flex-direction:column;gap:4px}
.swake b{font-size:15px}.swake small{font-size:12px;font-weight:600;line-height:1.45;color:rgba(var(--ink-rgb),.66)}
.swake .act{flex:none;margin-left:auto}
.sdh{margin:8px 4px 0;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(var(--ink-rgb),.55)}
.sdev .sdmore{justify-content:center;font-size:14px;font-weight:700;color:var(--acc);border-style:dashed}
.hint2{margin:14px 2px 2px;font-size:13px;color:rgba(var(--ink-rgb),.6);font-weight:600}
@media (prefers-reduced-motion:reduce){.eq i{animation:none}}
/* ---- garage doors: the door rolls up to show the garage inside ---- */
.gds{margin-top:16px;display:flex;flex-direction:column;gap:14px}
.gd{all:unset;box-sizing:border-box;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;width:100%;height:200px;border-radius:22px;cursor:pointer;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;color:#fff;text-align:center;text-shadow:0 2px 8px rgba(0,0,0,.9);
  --la:#00e676;--lb:#00c853;--lg:rgba(0,230,118,.5);--sc:#8ef0b0;
  background:linear-gradient(180deg,#3a3d43,#202227) 50% 12px/46px 16px no-repeat,
  linear-gradient(180deg,#2c2f34,#17181b) 50% 18px/38% 3px no-repeat,
  linear-gradient(90deg,#d9a92c,#f0c64a,#d9a92c) 50% calc(100% - 11px)/32% 3px no-repeat,
  linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.65)) 0 calc(100% - 30px)/100% 2px no-repeat,
  linear-gradient(180deg,#2e2c27,#1b1a17) 0 100%/100% 30px no-repeat,
  repeating-linear-gradient(180deg,#4a3e32 0 3px,rgba(0,0,0,.25) 3px 5px,transparent 5px 34px) 14px 44px/15% 108px no-repeat,
  repeating-linear-gradient(180deg,#4a3e32 0 3px,rgba(0,0,0,.25) 3px 5px,transparent 5px 34px) calc(100% - 14px) 44px/15% 108px no-repeat,
  radial-gradient(circle,rgba(255,255,255,.06) 1px,transparent 1.6px) 0 0/9px 9px,
  linear-gradient(180deg,#1a1c20 0%,#0f1013 70%,#0a0b0d 100%);
  box-shadow:0 20px 42px rgba(0,0,0,.55),0 4px 10px rgba(0,0,0,.4)}
.gd.open,.gd.moving{background:radial-gradient(26px 9px at 50% 30px,rgba(255,244,220,1),transparent 75%),radial-gradient(190px 120px at 50% 20px,rgba(255,208,140,.42),transparent 72%),radial-gradient(55% 26px at 50% 100%,rgba(255,210,150,.18),transparent 80%),linear-gradient(180deg,#3a3d43,#202227) 50% 12px/46px 16px no-repeat,
  linear-gradient(180deg,#2c2f34,#17181b) 50% 18px/38% 3px no-repeat,
  linear-gradient(90deg,#d9a92c,#f0c64a,#d9a92c) 50% calc(100% - 11px)/32% 3px no-repeat,
  linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.65)) 0 calc(100% - 30px)/100% 2px no-repeat,
  linear-gradient(180deg,#2e2c27,#1b1a17) 0 100%/100% 30px no-repeat,
  repeating-linear-gradient(180deg,#4a3e32 0 3px,rgba(0,0,0,.25) 3px 5px,transparent 5px 34px) 14px 44px/15% 108px no-repeat,
  repeating-linear-gradient(180deg,#4a3e32 0 3px,rgba(0,0,0,.25) 3px 5px,transparent 5px 34px) calc(100% - 14px) 44px/15% 108px no-repeat,
  radial-gradient(circle,rgba(255,255,255,.06) 1px,transparent 1.6px) 0 0/9px 9px,
  linear-gradient(180deg,#1a1c20 0%,#0f1013 70%,#0a0b0d 100%);
  --la:#ffb300;--lb:#ff8f00;--lg:rgba(255,179,0,.55);--sc:#ffd180}
.gd.long{--la:#ff5252;--lb:#c62828;--lg:rgba(255,82,82,.6);--sc:#ff8a80;animation:gd-alert 2s ease-in-out infinite}
.gd.dead,.gd.nos{--la:#8a8f96;--lb:#5c6066;--lg:rgba(140,145,150,.25);--sc:#9aa0a6}
@keyframes gd-alert{0%,100%{box-shadow:0 20px 42px rgba(0,0,0,.55),0 0 0 0 rgba(255,82,82,0)}50%{box-shadow:0 20px 42px rgba(0,0,0,.55),0 0 0 3px rgba(255,82,82,.55),0 0 26px rgba(255,82,82,.45)}}
.gd:focus-visible{outline:2px solid var(--acc);outline-offset:3px}
.gd.hit{filter:brightness(1.15)}
.gd>*{position:relative;z-index:6;pointer-events:none}
.gd::before{content:"";position:absolute;inset:0;z-index:2;
  background:linear-gradient(180deg,#c3c8ce,#868b92 50%,#55595f) 50% calc(100% - 24px)/64px 7px no-repeat,
  linear-gradient(180deg,#2d2f33,#0d0e0f) 0 100%/100% 7px no-repeat,
  linear-gradient(90deg,transparent 0 10px,#0c1117 10px 11px,#22313f 11px,#3a5268 30%,#6d8eaa 36%,#3a5268 44%,#1c2833 calc(100% - 11px),rgba(255,255,255,.20) calc(100% - 11px) calc(100% - 10px),transparent calc(100% - 10px)) 0 14px/calc(100% / 6) 22px repeat-x,
  linear-gradient(90deg,transparent 0 8px,rgba(255,255,255,.13) 8px 9px,transparent 9px calc(100% - 9px),rgba(0,0,0,.38) calc(100% - 9px) calc(100% - 8px),transparent calc(100% - 8px)) 0 10px/calc(100% / 6) 30px repeat-x,
  linear-gradient(90deg,transparent 0 8px,rgba(255,255,255,.13) 8px 9px,transparent 9px calc(100% - 9px),rgba(0,0,0,.38) calc(100% - 9px) calc(100% - 8px),transparent calc(100% - 8px)) 0 60px/calc(100% / 6) 30px repeat-x,
  linear-gradient(90deg,transparent 0 8px,rgba(255,255,255,.13) 8px 9px,transparent 9px calc(100% - 9px),rgba(0,0,0,.38) calc(100% - 9px) calc(100% - 8px),transparent calc(100% - 8px)) 0 110px/calc(100% / 6) 30px repeat-x,
  linear-gradient(90deg,transparent 0 8px,rgba(255,255,255,.13) 8px 9px,transparent 9px calc(100% - 9px),rgba(0,0,0,.38) calc(100% - 9px) calc(100% - 8px),transparent calc(100% - 8px)) 0 160px/calc(100% / 6) 30px repeat-x,
  linear-gradient(180deg,transparent 0 9px,rgba(255,255,255,.16) 9px 10px,rgba(255,255,255,.03) 10px 40px,rgba(0,0,0,.38) 40px 41px,transparent 41px) 0 0/100% 50px repeat-y,
  linear-gradient(180deg,rgba(255,255,255,.14) 0 1px,transparent 1px calc(100% - 3px),rgba(0,0,0,.6) calc(100% - 3px)) 0 0/100% 50px repeat-y,
  repeating-linear-gradient(90deg,rgba(255,255,255,.025) 0 1px,transparent 1px 3px),
  linear-gradient(180deg,rgba(255,255,255,.07),transparent 40%,rgba(0,0,0,.25)),
  linear-gradient(90deg,rgba(0,0,0,.38),transparent 12%,transparent 88%,rgba(0,0,0,.38)),
  linear-gradient(180deg,#4a4f57,#383c43);
  transform:translateY(0);transition:transform 3.6s cubic-bezier(.38,.02,.22,1);
  box-shadow:inset 0 -10px 18px rgba(0,0,0,.35),0 10px 22px rgba(0,0,0,.6)}
.gd.open::before{transform:translateY(calc(-100% + 16px))}
.gd.was-open::before{transform:translateY(calc(-100% + 16px));transition:none}
.gd.was-shut::before{transform:translateY(0);transition:none}
.gd::after{content:"";position:absolute;inset:0;z-index:5;pointer-events:none;border-radius:22px;
  background:radial-gradient(44px 14px at 50% 6px,var(--lg),transparent 72%) 0 0/100% 100% no-repeat,
  linear-gradient(90deg,var(--la),var(--lb)) 50% 4px/34px 4px no-repeat,
  linear-gradient(180deg,#1d1e21,#0f1012) 0 0/100% 9px no-repeat,
  linear-gradient(90deg,#0b0c0e,#3a3d42 45%,#16171a) 0 0/7px 100% no-repeat,
  linear-gradient(90deg,#16171a,#3a3d42 55%,#0b0c0e) 100% 0/7px 100% no-repeat;
  box-shadow:inset 0 0 0 2px rgba(20,20,22,.95),inset 0 14px 22px rgba(0,0,0,.55),inset 0 -8px 16px rgba(0,0,0,.4)}
.gdi{display:flex;margin-top:14px;opacity:.92;color:#fff;filter:drop-shadow(0 2px 6px rgba(0,0,0,.85));transition:color .6s ease}
.gd.open .gdi{color:#ffd180}
.gdn{font-size:21px;font-weight:800;letter-spacing:1px;line-height:1.2;max-width:calc(100% - 32px);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gdl{font-size:11px;font-weight:800;letter-spacing:3px;color:var(--sc)}
@media (prefers-reduced-motion:reduce){.gd::before{transition:none}.gd.long{animation:none;box-shadow:0 20px 42px rgba(0,0,0,.55),0 0 0 3px rgba(255,82,82,.55)}}
@media (max-width:360px){.clock{font-size:44px}.grid{gap:10px}}
`;

// --- where the rooms come from ---------------------------------------------------------
const arr = (v) => (Array.isArray(v) ? v : v ? [v] : []).filter((x) => typeof x === "string" && x);
const blankRoom = (name) => ({ name, lights: [], climate: [], music: [], shades: [], scenes: [], presence: [], groups: [] });
const isManual = (cfg) => (cfg.mode ? cfg.mode === "manual" : Array.isArray(cfg.rooms) && cfg.rooms.some((r) => r && typeof r === "object"));
const friendly = (h, id) => {
  const s = h.states[id];
  return (s && s.attributes.friendly_name) || id.split(".")[1].replace(/_/g, " ");
};
// Garage doors: [{ entity, sensor, name }]. `entity` is what you tap (a
// switch / relay, a cover, a button or a script); `sensor` (optional) is a
// binary_sensor that says if the door is open. A plain entity id works too.
const GD_TAP = ["switch", "cover", "button", "script", "input_boolean", "input_button"];
const normGarage = (v) => (Array.isArray(v) ? v : v ? [v] : [])
  .map((d) => (typeof d === "string" ? { entity: d } : d && typeof d === "object" ? d : null))
  .filter((d) => d && typeof d.entity === "string" && d.entity)
  .map((d) => ({ entity: d.entity, sensor: typeof d.sensor === "string" && d.sensor ? d.sensor : "", name: typeof d.name === "string" ? d.name : "", alert: Number(d.alert_minutes) > 0 ? Number(d.alert_minutes) : 10 }));
// The Spotify account: a media_player from the SpotifyPlus or the Spotify
// integration. Only by integration, or by name when it can browse media
// (an amp called "Spotify…" is not the account).
function spFind(h) {
  const reg = h.entities || {};
  const ids = Object.keys(h.states).filter((e) => e.indexOf("media_player.") === 0);
  const browses = (e) => ((h.states[e].attributes.supported_features || 0) & 131072) === 131072;
  return ids.find((e) => (reg[e] || {}).platform === "spotifyplus") || ids.find((e) => (reg[e] || {}).platform === "spotify")
    || ids.find((e) => !(reg[e] || {}).platform && /^media_player\.spotify/.test(e) && browses(e)) || null;
}
// --- Auto & Scenes (separate integration) ------------------------------------------
// The card reads and saves through its websocket API (auto_and_scenes/info,
// list, save, delete), using exactly the same scene format as its own panel,
// so both always show the same scenes. Nothing in that integration changes.
const AS_ICONS = ["mdi:palette", "mdi:weather-night", "mdi:white-balance-sunny", "mdi:sofa", "mdi:movie-open", "mdi:silverware-fork-knife", "mdi:bed", "mdi:party-popper", "mdi:home-export-outline", "mdi:home-import-outline", "mdi:book-open-variant", "mdi:candle"];
const AS_SCENE_STATES = {
  light: [["on", "On"], ["off", "Off"]], switch: [["on", "On"], ["off", "Off"]], fan: [["on", "On"], ["off", "Off"]],
  input_boolean: [["on", "On"], ["off", "Off"]], media_player: [["on", "On"], ["off", "Off"]],
  cover: [["open", "Open"], ["closed", "Closed"]], lock: [["locked", "Locked"], ["unlocked", "Unlocked"]],
};
const AS_DAYS = [["mon", "Mon"], ["tue", "Tue"], ["wed", "Wed"], ["thu", "Thu"], ["fri", "Fri"], ["sat", "Sat"], ["sun", "Sun"]];
const asList = (v) => (v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]);
const asDomain = (eid) => String(eid || "").split(".")[0];
function asParseScene(cfg) {
  const m = { name: cfg.name || "", icon: cfg.icon || "mdi:palette", entities: [] };
  for (const [eid, raw] of Object.entries(cfg.entities || {})) {
    const val = typeof raw === "object" && raw !== null ? Object.assign({}, raw) : { state: raw === true ? "on" : raw === false ? "off" : raw };
    const row = { entity_id: eid, state: String(val.state != null ? val.state : "on"), extra: {} };
    delete val.state;
    if ("brightness" in val) { row.brightness_pct = Math.max(1, Math.round(Number(val.brightness) / 2.55)); delete val.brightness; }
    if ("current_position" in val) { row.position = Number(val.current_position); delete val.current_position; }
    if ("temperature" in val) { row.temperature = Number(val.temperature); delete val.temperature; }
    row.extra = val;
    m.entities.push(row);
  }
  return m;
}
function asBuildScene(m) {
  const entities = {};
  for (const row of m.entities) {
    const d = asDomain(row.entity_id);
    const out = { state: row.state };
    const isOff = row.state === "off" || row.state === "closed";
    if (!isOff) Object.assign(out, row.extra || {});
    if (d === "light" && row.state === "on" && row.brightness_pct) out.brightness = Math.round(Number(row.brightness_pct) * 2.55);
    if (d === "cover" && row.state === "open" && row.position !== undefined && row.position !== "") out.current_position = Number(row.position);
    if (d === "climate" && row.state !== "off" && row.temperature) out.temperature = Number(row.temperature);
    entities[row.entity_id] = out;
  }
  const cfg = { name: m.name.trim(), entities };
  if (m.icon) cfg.icon = m.icon;
  return cfg;
}
function asMinutes(d) {
  if (d === undefined || d === null || d === "") return 0;
  if (typeof d === "number") return d / 60;
  if (typeof d === "object") return (d.hours || 0) * 60 + (d.minutes || 0) + (d.seconds || 0) / 60;
  const neg = String(d).trim().indexOf("-") === 0;
  const parts = String(d).replace("-", "").split(":").map(Number);
  const total = (parts[0] || 0) * 60 + (parts[1] || 0) + (parts[2] || 0) / 60;
  return neg ? -total : total;
}
// "At sunset · Weekdays" - the same wording as the Auto & Scenes panel.
function asSummary(cfg, nameOf) {
  const parts = asList(cfg.triggers != null ? cfg.triggers : cfg.trigger).map((t) => {
    const kind = t.trigger || t.platform;
    if (kind === "time" && typeof t.at === "string") return "At " + t.at.slice(0, 5);
    if (kind === "sun") {
      const o = Math.round(asMinutes(t.offset));
      return (o === 0 ? "At" : Math.abs(o) + " min " + (o < 0 ? "before" : "after")) + " " + t.event;
    }
    if (kind === "state") {
      const to = t.to == null || t.to === "" ? "changes" : t.to === "on" ? "turns on" : t.to === "off" ? "turns off" : t.to === "home" ? "arrives home" : t.to === "not_home" ? "leaves home" : t.to === "open" ? "opens" : t.to === "closed" ? "closes" : "becomes " + t.to;
      const m = Math.round(asMinutes(t.for));
      return "When " + nameOf(asList(t.entity_id)[0]) + " " + to + (m > 0 ? " for " + m + " min" : "");
    }
    throw new Error("advanced");
  });
  let text = parts.join(" or ") || "No trigger";
  asList(cfg.conditions != null ? cfg.conditions : cfg.condition).forEach((c) => {
    if (c.condition !== "time") return;
    const days = asList(c.weekday);
    if (days.length && days.length < 7) {
      const wk = ["mon", "tue", "wed", "thu", "fri"];
      if (days.length === 5 && wk.every((d) => days.indexOf(d) >= 0)) text += " · Weekdays";
      else if (days.length === 2 && days.indexOf("sat") >= 0 && days.indexOf("sun") >= 0) text += " · Weekends";
      else text += " · " + AS_DAYS.filter(([k]) => days.indexOf(k) >= 0).map(([, l]) => l).join(", ");
    }
    if (c.after && c.before) text += " · " + String(c.after).slice(0, 5) + "–" + String(c.before).slice(0, 5);
  });
  return text;
}
function asRan(iso) {
  if (!iso) return "Never ran";
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "Ran just now";
  if (s < 3600) return "Ran " + Math.round(s / 60) + " min ago";
  if (s < 86400) return "Ran " + Math.round(s / 3600) + " h ago";
  return "Ran " + Math.round(s / 86400) + " d ago";
}
// Put things in the order you dragged them into. Anything not in `order` keeps
// its usual place, after the ones you ordered.
const byOrder = (items, order, keyOf) => {
  const pos = new Map(arr(order).map((k, i) => [k, i]));
  return items
    .map((x, i) => [x, pos.has(keyOf(x)) ? pos.get(keyOf(x)) : 1e6 + i])
    .sort((a, b) => a[1] - b[1])
    .map((p) => p[0]);
};
// What a room's Lights page lists, in order: light groups (key "group:<name>"
// for ones set up in the card, the entity for Home Assistant light groups)
// and the lights on their own (key: the entity).
function roomLightItems(h, lights, cardGroups, order, nameOf) {
  const S = h.states;
  const has = (e) => !!S[e];
  const es = arr(lights).filter(has);
  const groups = (cardGroups || []).map((g) => ({ key: "group:" + g.name, id: g.id, name: g.name, ids: arr(g.lights).filter(has) }));
  es.forEach((e) => {
    const m = arr(S[e].attributes.entity_id).filter((x) => has(x) && x !== e);
    if (e.indexOf("light.") === 0 && m.length) groups.push({ key: e, id: "ha:" + e, name: nameOf(e), ids: m, entity: e });
  });
  const gs = groups.filter((g) => g.ids.length);
  const inGroup = new Set();
  gs.forEach((g) => { g.ids.forEach((e) => inGroup.add(e)); if (g.entity) inGroup.add(g.entity); });
  const loose = es.filter((e) => !inGroup.has(e));
  const items = byOrder(gs.map((g) => ({ key: g.key, g })).concat(loose.map((e) => ({ key: e, e }))), order, (x) => x.key);
  return { groups: gs, loose, items };
}

// Manual: exactly what was picked in the card editor.
function manualLayout(h, cfg) {
  const rooms = (cfg.rooms || [])
    .filter((r) => r && typeof r === "object")
    .map((r, i) => {
      // light_groups: [{name, lights}] - shown as one tile that opens into its lights
      const groups = (Array.isArray(r.light_groups) ? r.light_groups : [])
        .filter((g) => g && typeof g === "object")
        .map((g, j) => ({ id: i + ":" + j, name: g.name || "Group " + (j + 1), lights: arr(g.lights) }));
      return Object.assign(blankRoom(r.name || "Room " + (i + 1)), {
        lights: uniq(arr(r.lights).concat([].concat.apply([], groups.map((g) => g.lights)))),
        climate: arr(r.climate), music: arr(r.music), shades: arr(r.shades), scenes: arr(r.scenes), groups,
        order: arr(r.light_order),
      });
    });
  const security = arr(cfg.security);
  security.sort((a, b) => (b.indexOf("alarm_control_panel.") === 0) - (a.indexOf("alarm_control_panel.") === 0));
  return { rooms, cameras: arr(cfg.cameras), security, utilities: arr(cfg.utilities), garage: normGarage(cfg.garage) };
}

// Automatic: one room per Home Assistant area, entities sorted by domain.
function autoLayout(h, cfg) {
  const S = h.states;
  const reg = h.entities || {};
  const devs = h.devices || {};
  const areas = h.areas || {};
  const skip = new Set(arr(cfg.exclude));
  const lightSwitches = new Set(arr(cfg.light_switches));
  const LIGHTISH = /light|lamp|lumi|down ?light|spot|chandelier|pendant|sconce|led|strip|bulb|lux/i;
  const SEC_DC = ["door", "window", "garage_door", "opening", "motion", "occupancy", "presence", "smoke", "gas", "moisture", "safety", "tamper", "vibration", "lock"];
  const byArea = {};
  const other = blankRoom(cfg.unassigned_name || "Other");
  const house = { cameras: [], security: [], utilities: [], garage: normGarage(cfg.garage) };
  const gdTaken = new Set(house.garage.map((d) => d.entity));
  const areaOf = (id) => {
    const r = reg[id];
    if (!r) return null;
    if (r.area_id) return r.area_id;
    const d = r.device_id && devs[r.device_id];
    return (d && d.area_id) || null;
  };
  const roomFor = (id) => {
    const a = areaOf(id);
    if (!a || !areas[a]) return other;
    return byArea[a] || (byArea[a] = Object.assign(blankRoom(areas[a].name), { area_id: a }));
  };
  Object.keys(S).sort((a, b) => friendly(h, a).localeCompare(friendly(h, b))).forEach((id) => {
    if (skip.has(id) || gdTaken.has(id)) return; // a garage door's switch lives on the Garage page
    const r = reg[id];
    if (r && (r.hidden || r.entity_category)) return; // config/diagnostic and hidden entities stay out
    const st = S[id];
    const dom = id.split(".")[0];
    const dc = st.attributes.device_class;
    switch (dom) {
      case "light": roomFor(id).lights.push(id); break;
      case "switch":
        if (lightSwitches.has(id) || (dc !== "outlet" && LIGHTISH.test(id + " " + (st.attributes.friendly_name || "")))) roomFor(id).lights.push(id);
        else house.utilities.push(id);
        break;
      case "fan": case "water_heater": case "vacuum": case "humidifier": house.utilities.push(id); break;
      case "climate": roomFor(id).climate.push(id); break;
      case "media_player": if (!r || (r.platform !== "spotify" && r.platform !== "spotifyplus")) roomFor(id).music.push(id); break;
      // garage-door covers get the Garage page (unless you set them up yourself)
      case "cover": if (dc === "garage") { if (!gdTaken.has(id)) house.garage.push({ entity: id, sensor: "", name: "", alert: 10 }); } else roomFor(id).shades.push(id); break;
      case "scene": roomFor(id).scenes.push(id); break;
      case "script": if (areaOf(id)) roomFor(id).scenes.push(id); break;
      case "camera": house.cameras.push(id); break;
      case "alarm_control_panel": house.security.unshift(id); break;
      case "lock": house.security.push(id); break;
      case "binary_sensor": if (SEC_DC.indexOf(dc) >= 0) house.security.push(id); break;
      default: break;
    }
  });
  const has = (r) => ROOM_KEYS.some((k) => r[k].length);
  let rooms = Object.keys(byArea).map((k) => byArea[k]).filter(has).sort((a, b) => a.name.localeCompare(b.name));
  const pick = arr(cfg.areas).concat(arr(cfg.rooms)); // area ids or names, in the order to show
  if (pick.length) {
    rooms = pick.map((w) => rooms.find((r) => r.area_id === w || r.name.toLowerCase() === String(w).toLowerCase())).filter(Boolean);
  }
  if (has(other) && cfg.show_unassigned !== false) rooms.push(other);
  // Dragged into order in the card editor: rooms (room_order) and the lights
  // inside each room (light_order, per room). Rooms are keyed by area id.
  rooms.forEach((r) => (r.key = r.area_id || "_other"));
  rooms = byOrder(rooms, cfg.room_order, (r) => r.key);
  const lo = cfg.light_order && typeof cfg.light_order === "object" && !Array.isArray(cfg.light_order) ? cfg.light_order : {};
  rooms.forEach((r) => (r.order = arr(lo[r.key])));
  return Object.assign({ rooms }, house);
}

function buildLayout(h, cfg) {
  const L = isManual(cfg) ? manualLayout(h, cfg) : autoLayout(h, cfg);
  if (!L.rooms.length && (L.cameras.length || L.security.length || L.utilities.length || L.garage.length || (Array.isArray(cfg.rtsp) && cfg.rtsp.length))) L.rooms.push(blankRoom("Home"));
  if (!L.rooms.length) return null;
  const rtsp = (Array.isArray(cfg.rtsp) ? cfg.rtsp : []).filter((r) => r && r.url).map((r, i) => ({ name: r.name || "Camera " + (i + 1), url: String(r.url) }));
  const at = Number(cfg.whole_house_at);
  return Object.assign(L, { name: cfg.title || "Home", wholeHouse: cfg.whole_house !== false, wholeAt: Number.isFinite(at) && at >= 0 ? Math.floor(at) : null, start: 0, rtsp, music: {} });
}

class ArControlPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._s = this._load();
    this._layout = null;
    this._err = null;
    this._raf = 0;
    this._busy = 0; // a slider is being dragged: don't redraw under the finger
    this._pendTemp = {};
    this._pin = null;
    this._sheet = null;
    this._toast = null;
    this._camT = 0;
    this._clockT = 0;
    this._lib = null; // {player, stack:[{title,id,type}], items, loading, err}
  }

  // --- HA plumbing ----------------------------------------------------------------
  set hass(h) {
    const prev = this._hass;
    this._hass = h;
    if (h && h.callWS) this._asCheck(h);
    // Rebuild the rooms when areas, devices or entities change (HA replaces
    // these objects on every registry update) or an entity appears/disappears.
    const n = h && h.states ? Object.keys(h.states).length : 0;
    if (!prev || !this._layout || h.areas !== prev.areas || h.devices !== prev.devices || h.entities !== prev.entities || n !== this._nStates) {
      this._nStates = n;
      this._build();
    }
    if (this._rtc) this._rtc.el.hass = h;
    this._schedule();
  }
  get hass() { return this._hass; }
  // Auto & Scenes: look for it once (and again if its panel appears later).
  _asCheck(h) {
    const has = h.panels ? !!h.panels["auto-scenes"] : null;
    if (!this._as) { this._as = { ok: null }; if (has !== false) this.asDetect(); else this._as.ok = false; return; }
    if (this._as.ok === false && has && !this._as.retried) { this._as.retried = true; this.asDetect(); }
  }
  async asDetect() {
    try {
      const info = await this._hass.callWS({ type: "auto_and_scenes/info" });
      this._as = Object.assign(this._as || {}, { ok: true, info, scenes: null, autos: null });
      await this.asLoad();
    } catch (e) {
      this._as = Object.assign(this._as || {}, { ok: false });
    }
    this._schedule(true);
  }
  async asLoad() {
    const A = this._as;
    if (!A || !A.ok) return;
    try {
      const [sc, au] = await Promise.all([
        this._hass.callWS({ type: "auto_and_scenes/list", kind: "scene" }),
        this._hass.callWS({ type: "auto_and_scenes/list", kind: "automation" }),
      ]);
      const byName = (a, b) => String(a.name || "").localeCompare(String(b.name || ""));
      A.scenes = (sc || []).sort(byName);
      A.autos = (au || []).sort(byName);
      A.err = null;
    } catch (e) {
      A.err = (e && e.message) || "Couldn't load from Auto & Scenes";
    }
    this._schedule(true);
  }
  asEnt(kind, item) {
    if (item.entity_id && this.has(item.entity_id)) return item.entity_id;
    const S = this._hass.states;
    const hit = Object.keys(S).find((e) => e.indexOf(kind + ".") === 0 && S[e].attributes.id === item.id);
    return hit || item.entity_id || null;
  }
  asIcon(icon, size) {
    return customElements.get("ha-icon") ? `<ha-icon icon="${esc(icon)}" style="--mdc-icon-size:${size || 24}px"></ha-icon>` : svg("magic", size || 24);
  }
  asRow(eid) {
    const st = this.st(eid);
    const d = asDomain(eid);
    const row = { entity_id: eid, state: "on", extra: {} };
    if (!st) return row;
    if (d === "climate") { row.state = st.state; if (st.attributes.temperature) row.temperature = st.attributes.temperature; return row; }
    const valid = (AS_SCENE_STATES[d] || []).map(([v]) => v);
    row.state = valid.indexOf(st.state) >= 0 ? st.state : valid[0] || st.state;
    if (d === "light" && st.state === "on" && st.attributes.brightness) row.brightness_pct = Math.max(1, Math.round(st.attributes.brightness / 2.55));
    if (d === "cover" && st.attributes.current_position !== undefined) row.position = st.attributes.current_position;
    return row;
  }
  asOpenPanel() {
    history.pushState(null, "", "/auto-scenes");
    window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
  }
  async asSave() {
    const d = this._asEd;
    if (!d.name.trim()) { this._say("Give the scene a name"); return; }
    if (!d.entities.length) { this._say("Add at least one device"); return; }
    const msg = { type: "auto_and_scenes/save", kind: "scene", config: asBuildScene(d) };
    if (d.id) msg.item_id = d.id;
    try {
      await this._hass.callWS(msg);
      this._asEd = null;
      this._say("Saved " + d.name.trim());
      await this.asLoad();
    } catch (e) {
      this._say((e && e.message) || "Couldn't save");
    }
  }
  async asDelete() {
    const d = this._asEd;
    if (!this._asConfirm) { this._asConfirm = true; this._schedule(true); setTimeout(() => { this._asConfirm = false; this._schedule(true); }, 4000); return; }
    this._asConfirm = false;
    try {
      await this._hass.callWS({ type: "auto_and_scenes/delete", kind: "scene", item_id: d.id });
      this._asEd = null;
      this._say("Deleted " + d.name);
      await this.asLoad();
    } catch (e) {
      this._say((e && e.message) || "Couldn't delete");
    }
  }
  _asPickHtml() {
    const A = this._as || {};
    const doms = new Set(((A.info && A.info.allowed_domains) || Object.keys(AS_SCENE_STATES).concat(["climate"])).filter((x) => x !== "lock" || (A.info && A.info.allowed_domains)));
    const taken = new Set(((this._asEd && this._asEd.entities) || []).map((r) => r.entity_id));
    const q = (this._asQ || "").trim().toLowerCase();
    const reg = this._hass.entities || {};
    const list = Object.keys(this._hass.states)
      .filter((e) => doms.has(asDomain(e)) && !(reg[e] && reg[e].hidden) && !taken.has(e))
      .map((e) => ({ e, n: this.name(e) }))
      .filter((x) => !q || x.n.toLowerCase().indexOf(q) >= 0 || x.e.indexOf(q) >= 0)
      .sort((a, b) => a.n.localeCompare(b.n))
      .slice(0, 150);
    const ic = { light: "bulb", cover: "shades", climate: "thermo", media_player: "speaker", fan: "fan", lock: "lock" };
    return list.length ? list.map((x) => `<button data-a="aspick" data-e="${esc(x.e)}">${svg(ic[asDomain(x.e)] || "plug", 20)}<span><b>${esc(x.n)}</b><small>${esc(this.st(x.e).state)}</small></span></button>`).join("") : `<div class="note">Nothing found</div>`;
  }
  set narrow(v) { this._narrow = v; this._schedule(); }
  set panel(v) { this._panel = v; }

  connectedCallback() {
    this.shadowRoot.addEventListener("click", (e) => this._click(e));
    this.shadowRoot.addEventListener("input", (e) => this._input(e));
    this.shadowRoot.addEventListener("change", (e) => this._change(e));
    this.shadowRoot.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.getAttribute && e.target.getAttribute("data-a") === "spq") { clearTimeout(this._spT); this.spSearch(e.target.value); e.target.blur(); }
    });
    // after typing in Spotify search, catch up with anything skipped meanwhile
    this.shadowRoot.addEventListener("focusout", (e) => { if (e.target.getAttribute && (e.target.getAttribute("data-a") === "spq" || e.target.getAttribute("data-keep"))) setTimeout(() => this._schedule(true), 0); });
    this.shadowRoot.addEventListener("pointerdown", (e) => { if (e.target.type === "range") this._busy++; });
    this.shadowRoot.addEventListener("pointerup", () => setTimeout(() => (this._busy = Math.max(0, this._busy - 1)), 300));
    // Hold a garage door for its details (like Home Assistant's hold action).
    const stopHold = () => clearTimeout(this._holdT);
    this.shadowRoot.addEventListener("pointerdown", (e) => {
      const t = e.target.closest && e.target.closest("[data-hold]");
      if (!t) return;
      this._held = false;
      stopHold();
      this._holdT = setTimeout(() => { this._held = true; this.more(t.getAttribute("data-hold")); }, 550);
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((n) => this.shadowRoot.addEventListener(n, stopHold));
    this.shadowRoot.addEventListener("contextmenu", (e) => { if (e.target.closest && e.target.closest("[data-hold]")) e.preventDefault(); });
    this._loadRtc();
    this._onResize = () => this._placeDock();
    window.addEventListener("resize", this._onResize);
    this._clockT = setInterval(() => this._schedule(), 20000);
    this._camT = setInterval(() => { if (this._s.tab === "cameras" || this._s.tab === "home") this._refreshCams(); }, 4000);
    this._schedule();
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this._onResize);
    clearInterval(this._clockT);
    clearInterval(this._camT);
  }

  // Rooms come from the card's own settings (manual mode: you pick every
  // entity from Home Assistant's dropdowns in the card editor) or, by
  // default, straight from Home Assistant's areas. No wall panel needed.
  _build() {
    const h = this._hass;
    if (!h || !h.states) return;
    const cfg = this._config || {};
    const L = buildLayout(h, cfg);
    this._layout = L ? [L] : [];
    // Start on Whole house the first time (it's added last, after the rooms).
    if (this._s.room == null && L && L.rooms.length > 1 && L.wholeHouse) this._s.room = L.wholeAt == null ? L.rooms.length : Math.min(L.wholeAt, L.rooms.length);
    this._err = null;
    this._schedule(true);
  }

  _load() {
    try {
      return Object.assign({ panel: 0, room: null, tab: "home", clim: 0, mus: null, mview: "now" }, JSON.parse(localStorage.getItem("ar-control-panel") || "{}"));
    } catch (e) {
      return { panel: 0, room: null, tab: "home", clim: 0, mus: null, mview: "now" };
    }
  }
  _save() {
    try { localStorage.setItem("ar-control-panel", JSON.stringify(this._s)); } catch (e) { /* private mode */ }
  }
  _set(patch) {
    Object.assign(this._s, patch);
    this._save();
    this._schedule(true);
  }

  _schedule(force) {
    if (this._busy && !force) return;
    if (this._raf) return;
    this._raf = requestAnimationFrame(() => {
      this._raf = 0;
      this._render();
    });
  }

  // --- data helpers ---------------------------------------------------------------
  st(e) { return (this._hass && this._hass.states[e]) || null; }
  has(e) { return !!this.st(e); }
  name(e) {
    // names: { light.x: "Pendant" } - your own name for an entity, set in the card editor
    const own = this._config && this._config.names && this._config.names[e];
    if (typeof own === "string" && own.trim()) return own.trim();
    const s = this.st(e);
    return (s && s.attributes.friendly_name) || e.split(".")[1].replace(/_/g, " ");
  }
  isOn(e) {
    const s = this.st(e);
    if (!s) return false;
    return ["on", "open", "opening", "playing", "unlocked", "home"].indexOf(s.state) >= 0;
  }
  call(domain, service, data) {
    return this._hass.callService(domain, service, data).catch((err) => this._say((err && err.message) || "That didn't work"));
  }
  _say(msg) {
    this._toast = msg;
    this._schedule(true);
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => { this._toast = null; this._schedule(true); }, 2600);
  }
  more(e) {
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: e }, bubbles: true, composed: true }));
  }

  panelCfg() {
    const L = this._layout || [];
    return L[clamp(this._s.panel || 0, 0, Math.max(0, L.length - 1))] || null;
  }
  rooms() {
    const p = this.panelCfg();
    if (!p) return [];
    const rs = p.rooms.map((r) => r);
    if (p.wholeHouse && rs.length > 1) {
      const all = { name: "Whole house", icon: "home", whole: true };
      ROOM_KEYS.forEach((k) => (all[k] = uniq([].concat.apply([], rs.map((r) => r[k] || [])))));
      all.groups = [].concat.apply([], rs.map((r) => (r.groups || []).map((g) => Object.assign({}, g, { name: r.name + " · " + g.name }))));
      const at = p.wholeAt == null ? rs.length : Math.min(p.wholeAt, rs.length);
      rs.splice(at, 0, all);
    }
    return rs;
  }
  room() {
    const rs = this.rooms();
    const p = this.panelCfg();
    let i = this._s.room;
    if (i == null || i >= rs.length) i = p ? clamp(p.start || 0, 0, rs.length - 1) : 0;
    return rs[i] || null;
  }
  ents(cat) {
    const p = this.panelCfg();
    const r = this.room();
    if (!p || !r) return [];
    if (cat === "music") return this.speakers();
    if (cat === "garage") return this.doors().map((d) => d.entity);
    if (cat === "autoscenes") return [];
    const src = cat === "cameras" || cat === "security" || cat === "utilities" ? p[cat] : r[cat];
    return (src || []).filter((e) => this.has(e));
  }
  // Music: the room's speakers from Device Setup; when the panel plays through
  // Music Assistant or Spotify instead (like its own Music page), their players
  // as Home Assistant has them.
  speakers() {
    const p = this.panelCfg();
    const r = this.room();
    if (!p || !r) return [];
    const acct = this.spAcct();
    const only = arr(this._config && this._config.speakers); // empty = every speaker
    const own = (r.music || []).filter((e) => this.has(e) && e !== acct && (!only.length || only.indexOf(e) >= 0));
    if (own.length) return own;
    const m = p.music || {};
    if (!m.ma && !m.spotify) return [];
    const S = this._hass.states;
    return Object.keys(S)
      .filter((e) => e.indexOf("media_player.") === 0 && S[e].state !== "unavailable")
      .filter((e) => (m.ma && (S[e].attributes.mass_player_type != null || S[e].attributes.mass_player_id != null || /^media_player\.(mass_|ma_)/.test(e))) || (m.spotify && /^media_player\.spotify/.test(e)))
      .sort((a, b) => this.name(a).localeCompare(this.name(b)));
  }
  // Live cameras through the WebRTC Camera integration (AlexxIT), when it's
  // installed: its <webrtc-camera> player streams RTSP links, go2rtc stream
  // names and camera entities with very little delay.
  rtcWanted() { return !this._config || this._config.webrtc !== false; }
  _loadRtc() {
    if (!this.rtcWanted() || customElements.get("webrtc-camera") || ArControlPanel._rtcTried) return;
    ArControlPanel._rtcTried = true;
    // The integration serves its player here; load it if the dashboard hasn't yet.
    const sc = document.createElement("script");
    sc.type = "module";
    sc.src = "/webrtc/webrtc-camera.js";
    document.head.appendChild(sc);
    customElements.whenDefined("webrtc-camera").then(() => this._schedule(true));
  }
  rtcOk() { return this.rtcWanted() && !!customElements.get("webrtc-camera"); }
  camList() {
    const p = this.panelCfg();
    const ents = this.ents("cameras").map((e) => ({ key: e, name: this.name(e), entity: e }));
    const streams = ((p && p.rtsp) || []).map((r, i) => ({ key: "rtsp:" + i, name: r.name, url: r.url }));
    return ents.concat(streams);
  }
  // Keep one live player alive across redraws (the page is redrawn on every
  // state change; re-creating the player would restart the stream).
  _mountRtc() {
    const slot = this.shadowRoot.querySelector("[data-rtc]");
    if (!slot) {
      if (this._rtc) { this._rtc.el.remove(); this._rtc = null; }
      return;
    }
    const key = slot.getAttribute("data-rtc");
    if (!this._rtc || this._rtc.key !== key) {
      const cam = this.camList().find((c) => c.key === key);
      if (!cam) return;
      const el = document.createElement("webrtc-camera");
      const conf = Object.assign({ ui: true, muted: true }, cam.url ? { url: cam.url } : { entity: cam.entity }, (this._config && this._config.webrtc_options) || {});
      try {
        el.setConfig(conf);
      } catch (e) {
        this._say((e && e.message) || "WebRTC couldn't open this camera");
        return;
      }
      el.hass = this._hass;
      this._rtc = { key, el };
    }
    slot.appendChild(this._rtc.el);
  }

  // Speaker grouping. Home Assistant puts the whole group (leader first) in
  // `group_members` on each grouped player; a speaker-group player (Music
  // Assistant group, or HA's own media_player group) lists its members.
  groupInfo(e) {
    const s = this.st(e);
    if (!s) return null;
    const a = s.attributes;
    const S = this._hass.states;
    const own = arr(a.group_members);
    const isGroupPlayer = /group/.test(String(a.mass_player_type || "")) || (Array.isArray(a.entity_id) && a.entity_id.length > 0);
    if (isGroupPlayer) {
      const members = uniq(own.concat(arr(a.entity_id))).filter((x) => x !== e);
      return members.length ? { kind: "group", leader: e, members } : null;
    }
    const groupPlayer = (k) => /group/.test(String(S[k].attributes.mass_player_type || "")) || Array.isArray(S[k].attributes.entity_id);
    const lists = (k) => uniq(arr(S[k].attributes.group_members).concat(arr(S[k].attributes.entity_id))).indexOf(e) >= 0;
    let members = own;
    if (members.length < 2) {
      // some players only list the group on the leader: look for one that includes us
      const lead = Object.keys(S).find((k) => k !== e && k.indexOf("media_player.") === 0 && !groupPlayer(k) && arr(S[k].attributes.group_members).length > 1 && lists(k));
      if (lead) members = arr(S[lead].attributes.group_members);
    }
    if (members.length >= 2) return { kind: "sync", leader: members[0], members };
    // playing as part of a speaker group right now (a group that's only set up doesn't count)
    const via = Object.keys(S).find((k) => k !== e && k.indexOf("media_player.") === 0 && groupPlayer(k) && ["playing", "paused", "buffering"].indexOf(S[k].state) >= 0 && lists(k));
    if (via) {
      const all = uniq(arr(S[via].attributes.group_members).concat(arr(S[via].attributes.entity_id)));
      return { kind: "in", leader: via, members: all };
    }
    return null;
  }
  canGroup(e) {
    const s = this.st(e);
    return !!s && ((s.attributes.supported_features || 0) & 524288) === 524288;
  }
  cats() {
    const p = this.panelCfg();
    return CATS.filter((c) => (c.key === "autoscenes" ? !!(this._as && this._as.ok) : this.ents(c.key).length || (c.key === "cameras" && p && p.rtsp && p.rtsp.length) || (c.key === "music" && this.spAcct())));
  }
  weather() {
    const h = this._hass;
    const id = Object.keys(h.states).find((k) => k.indexOf("weather.") === 0);
    return id ? h.states[id] : null;
  }
  doors() {
    const p = this.panelCfg();
    return ((p && p.garage) || []).filter((d) => this.has(d.entity) || this.has(d.sensor));
  }
  // Where a garage door is, from its sensor (or the cover itself).
  doorState(d) {
    const src = d.sensor && this.has(d.sensor) ? d.sensor : d.entity.indexOf("cover.") === 0 ? d.entity : "";
    const s = src ? this.st(src) : null;
    if (!src) return { kind: "nos", open: false, label: "TAP TO OPEN / CLOSE" };
    if (!s || s.state === "unavailable" || s.state === "unknown") return { kind: "dead", open: false, label: "UNAVAILABLE" };
    const st = s.state;
    const open = st === "on" || st === "open" || st === "opening";
    const since = (Date.now() - new Date(s.last_changed).getTime()) / 1000;
    const ago = (t) => (t < 60 ? "JUST NOW" : t < 3600 ? Math.floor(t / 60) + " MIN" : t < 86400 ? Math.floor(t / 3600) + " H" : Math.floor(t / 86400) + (t < 172800 ? " DAY" : " DAYS"));
    if (st === "opening") return { kind: "open", open: true, label: "OPENING…" };
    if (st === "closing") return { kind: "moving", open: false, label: "CLOSING…" };
    if (!open) return { kind: "shut", open: false, label: "CLOSED" };
    const long = since > d.alert * 60;
    return { kind: long ? "long" : "open", open: true, label: "OPEN · " + ago(since) };
  }
  alarm() {
    return this.ents("security").find((e) => e.indexOf("alarm_control_panel.") === 0) || null;
  }
  camUrl(e) {
    const s = this.st(e);
    if (!s) return "";
    const tok = s.attributes.access_token;
    return s.attributes.entity_picture || (tok ? `/api/camera_proxy/${e}?token=${tok}` : "");
  }
  async _browse(player, node) {
    const lib = this._lib && this._lib.player === player ? this._lib : { player, stack: [], items: [] };
    lib.loading = true;
    lib.err = null;
    this._lib = lib;
    this._schedule(true);
    const msg = { type: "media_player/browse_media", entity_id: player };
    if (node && node.media_content_id) {
      msg.media_content_id = node.media_content_id;
      msg.media_content_type = node.media_content_type;
    }
    try {
      const r = await this._hass.callWS(msg);
      if (this._lib !== lib) return;
      lib.items = (r && r.children) || [];
      lib.stack.push({ title: node ? node.title : (r && r.title) || "Library", media_content_id: node && node.media_content_id, media_content_type: node && node.media_content_type });
    } catch (e) {
      lib.items = [];
      lib.err = (e && e.message) || "This speaker can't browse a library.";
    }
    lib.loading = false;
    this._schedule(true);
  }
  // --- Spotify -------------------------------------------------------------------
  // The Spotify account (a media_player from the SpotifyPlus or the official
  // Spotify integration). Plays go to an amp through Spotify Connect.
  spAcct() {
    const h = this._hass;
    if (!h || !h.states) return null;
    const c = this._config && this._config.spotify;
    if (c === false || (c && c.enabled === false)) return null;
    const want = typeof c === "string" ? c : c && c.entity;
    if (want) return this.has(want) ? want : null;
    return spFind(h);
  }
  // SpotifyPlus: search, playlists, liked songs... through its own actions.
  spPlus(acct) {
    const h = this._hass;
    if (!h.services || !h.services.spotifyplus) return false;
    const r = (h.entities || {})[acct];
    return r ? r.platform === "spotifyplus" : /spotifyplus/.test(acct);
  }
  spCanSearch(acct) {
    const s = this.st(acct);
    return this.spPlus(acct) || !!(s && (s.attributes.supported_features || 0) & 4194304);
  }
  // The Spotify Connect name of an amp: set in the editor, picked on the card,
  // or matched by name from Spotify's device list.
  spNames() {
    const s = this.st(this.spAcct());
    return uniq(((s && s.attributes.source_list) || []).filter((n) => typeof n === "string" && n.trim()));
  }
  // Your amps: the speakers you picked in the settings, else every speaker
  // in your rooms.
  spAmps() {
    const acct = this.spAcct();
    const only = arr(this._config && this._config.speakers);
    const all = only.length ? only : uniq([].concat.apply([], this.rooms().filter((r) => !r.whole).map((r) => r.music || [])));
    return all.filter((e) => this.has(e) && e !== acct);
  }
  spDevice(amp) {
    const acct = this.spAcct();
    const s = this.st(acct);
    const list = this.spNames();
    const key = amp || "_none";
    const picked = this._s.spDev && this._s.spDev[key];
    if (picked) return picked;
    const map = (this._config && this._config.spotify && this._config.spotify.devices) || {};
    if (amp && typeof map[amp] === "string" && map[amp].trim()) return map[amp].trim();
    if (!amp) return (s && typeof s.attributes.source === "string" && s.attributes.source.trim()) || "";
    const norm = (x) => String(x).toLowerCase().replace(/[^a-z0-9]/g, "");
    const names = uniq([this.name(amp), friendly(this._hass, amp), amp.split(".")[1]]).map(norm).filter(Boolean);
    const hit = list.find((n) => names.indexOf(norm(n)) >= 0) || list.find((n) => names.some((m) => norm(n) && (m.indexOf(norm(n)) >= 0 || norm(n).indexOf(m) >= 0)));
    return hit || this.name(amp);
  }
  _spState(acct) {
    if (!this._sp || this._sp.acct !== acct) this._sp = { acct, view: null, q: "", filter: "all", lists: {}, res: null, detail: null, loading: null, err: null };
    return this._sp;
  }
  async spCall(service, data) {
    const r = await this._hass.callWS({ type: "call_service", domain: "spotifyplus", service, service_data: Object.assign({ entity_id: this._sp.acct }, data), return_response: true });
    return r && r.response ? r.response.result : null;
  }
  // One Spotify Web API object (from SpotifyPlus) as a row/tile.
  spItem(x) {
    if (!x || typeof x !== "object") return null;
    let o = x.track && typeof x.track === "object" ? x.track : x;
    if (!o.uri && x.album && typeof x.album === "object") o = x.album; // a saved album
    if (!o.uri) return null;
    const imgs = (a) => (a && (a.image_url || (a.images && a.images[0] && a.images[0].url))) || "";
    const artists = (o.artists || []).map((a) => a.name).filter(Boolean).join(", ");
    const type = o.type || String(o.uri).split(":")[1];
    const sub = type === "track" ? artists : type === "album" ? artists || "Album" : type === "playlist" ? (o.tracks && o.tracks.total != null ? o.tracks.total + " songs" : (o.owner && o.owner.display_name) || "Playlist") : type === "artist" ? "Artist" : "";
    return { uri: o.uri, id: o.id || String(o.uri).split(":").pop(), type, title: o.name || "", sub, img: imgs(o) || imgs(o.album), dur: o.duration_ms };
  }
  spItems(r) {
    const a = Array.isArray(r) ? r : (r && r.items) || [];
    return a.map((x) => this.spItem(x)).filter(Boolean);
  }
  // A browse_media node (official Spotify integration, or HA search results).
  spNode(c) {
    const t = String(c.media_content_type || "").replace("spotify://", "");
    const type = t === "current_user_saved_tracks" ? "liked" : c.media_class === "track" ? "track" : c.media_class === "playlist" ? "playlist" : c.media_class === "album" ? "album" : c.media_class === "artist" ? "artist" : t;
    return { uri: c.media_content_id, id: String(c.media_content_id || "").split(":").pop(), type, title: c.title || "", sub: type === "track" ? "" : type === "artist" ? "Artist" : type === "album" ? "Album" : type === "playlist" ? "Playlist" : "", img: c.thumbnail || "", raw: c };
  }
  async spLoad(view) {
    const sp = this._sp;
    sp.view = view;
    sp.err = null;
    sp.detail = null;
    if (sp.lists[view]) { this._schedule(true); return; }
    if (this.spAsleep(sp.acct)) { this._schedule(true); return; }
    sp.loading = view;
    this._schedule(true);
    try {
      let items;
      if (this.spPlus(sp.acct)) {
        const svc = {
          playlists: ["get_playlist_favorites", { limit_total: 200 }],
          liked: ["get_track_favorites", { limit_total: 200 }],
          recent: ["get_player_recent_tracks", { limit_total: 50 }],
          albums: ["get_album_favorites", { limit_total: 100 }],
          artists: ["get_artists_followed", { limit_total: 100 }],
        }[view];
        items = this.spItems(await this.spCall(svc[0], svc[1]));
      } else {
        const id = { playlists: "current_user_playlists", liked: "current_user_saved_tracks", recent: "current_user_recently_played", albums: "current_user_saved_albums", artists: "current_user_followed_artists" }[view];
        const r = await this._hass.callWS({ type: "media_player/browse_media", entity_id: sp.acct, media_content_type: "spotify://" + id, media_content_id: id });
        items = ((r && r.children) || []).map((c) => this.spNode(c));
      }
      if (view === "recent") { const seen = {}; items = items.filter((x) => !seen[x.uri] && (seen[x.uri] = 1)); }
      sp.lists[view] = items;
    } catch (e) {
      sp.err = this.spErr(e);
    }
    if (sp.loading === view) sp.loading = null;
    this._schedule(true);
  }
  // Spotify sometimes lists a device by a long code instead of a name.
  spLabel(n) {
    const m = (this._config && this._config.spotify && this._config.spotify.devices) || {};
    const amp = Object.keys(m).find((k) => m[k] === n);
    if (amp) return this.name(amp);
    return /^[0-9a-f]{24,}$/i.test(String(n)) ? "Spotify device " + n.slice(0, 4) + "…" + n.slice(-4) : n;
  }
  spFeat(acct) { const s = this.st(acct); return (s && s.attributes.supported_features) || 0; }
  // Home Assistant's own Spotify integration only browses and plays while
  // something is active on the account. Waking it = making the amp the
  // active Spotify Connect device (paused), which turns everything back on.
  spAsleep(acct) { return !this.spPlus(acct) && !(this.spFeat(acct) & 131072); }
  async spWake(amp) {
    const acct = this._sp.acct;
    const s = this.st(acct);
    const dev = this.spDevice(amp);
    const list = (s && s.attributes.source_list) || [];
    if (!(this.spFeat(acct) & 2048)) { this._say("Your Spotify account needs Premium for this"); return false; }
    if (!dev || list.indexOf(dev) < 0) { this._sheet = "spdev"; this._schedule(true); this._say("Pick which Spotify device this amp is"); return false; }
    this._sp.waking = true;
    this._schedule(true);
    try {
      await this._hass.callService("media_player", "select_source", { entity_id: acct, source: dev });
      for (let i = 0; i < 16 && this.spAsleep(acct); i++) await new Promise((r) => setTimeout(r, 500));
      if (this.spAsleep(acct)) await this._hass.callService("homeassistant", "update_entity", { entity_id: acct }).catch(() => {});
      for (let i = 0; i < 8 && this.spAsleep(acct); i++) await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      this._say((e && e.message) || "Couldn't wake Spotify on " + this.spLabel(dev));
    }
    this._sp.waking = false;
    const ok = !this.spAsleep(acct);
    if (ok) { this._sp.lists = {}; this._sp.err = null; this.spLoad(this._sp.view === "detail" || this._sp.view === "search" ? "playlists" : this._sp.view || "playlists"); }
    else { this._say("Spotify didn't wake up on " + this.spLabel(dev)); this._schedule(true); }
    return ok;
  }
  spErr(e) {
    const m = (e && e.message) || "Couldn't reach Spotify.";
    const acct = this._sp && this._sp.acct;
    if (/brows|not support|not found|unknown/i.test(m) && acct) {
      const plat = ((this._hass.entities || {})[acct] || {}).platform;
      return "The card is using " + friendly(this._hass, acct) + " (" + acct + (plat ? ", from " + plat : "") + ") as your Spotify account, but it can't browse Spotify (" + m + "). In the card settings under Spotify, pick the media player made by the Spotify or SpotifyPlus integration.";
    }
    return m;
  }
  async spSearch(q) {
    const sp = this._sp;
    sp.q = q;
    sp.detail = null;
    if (!q.trim()) { sp.res = null; sp.view = sp.lastView || "playlists"; this._schedule(true); return; }
    if (sp.view !== "search") sp.lastView = sp.view;
    sp.view = "search";
    sp.err = null;
    if (!this.spCanSearch(sp.acct)) {
      sp.err = "Search needs the SpotifyPlus integration (from HACS). Your playlists, liked songs and recent plays work without it.";
      this._schedule(true);
      return;
    }
    const tok = (this._spTok = (this._spTok || 0) + 1);
    sp.loading = "search";
    this._schedule(true);
    try {
      let res;
      if (this.spPlus(sp.acct)) {
        const r = (await this.spCall("search_all", { criteria: q, criteria_type: "track,artist,album,playlist", limit_total: 10 })) || {};
        res = { tracks: this.spItems(r.tracks), artists: this.spItems(r.artists), albums: this.spItems(r.albums), playlists: this.spItems(r.playlists) };
      } else {
        const r = await this._hass.callWS({ type: "media_player/search_media", entity_id: sp.acct, search_query: q });
        const all = ((r && r.result) || []).map((c) => this.spNode(c));
        res = { tracks: all.filter((x) => x.type === "track"), artists: all.filter((x) => x.type === "artist"), albums: all.filter((x) => x.type === "album"), playlists: all.filter((x) => x.type === "playlist") };
      }
      if (tok !== this._spTok) return;
      sp.res = res;
    } catch (e) {
      if (tok !== this._spTok) return;
      sp.err = (e && e.message) || "Search didn't work.";
      sp.res = null;
    }
    sp.loading = null;
    this._schedule(true);
  }
  // Open a playlist / album / artist / Liked Songs and list its songs.
  async spOpen(item) {
    const sp = this._sp;
    const back = sp.view === "detail" && sp.detail ? sp.detail.back : sp.view;
    sp.detail = { item, tracks: null, back };
    sp.view = "detail";
    sp.err = null;
    this._schedule(true);
    try {
      let tracks;
      if (item.type === "liked") {
        if (!sp.lists.liked) await this.spLoad("liked");
        sp.view = "detail";
        sp.detail = { item, tracks: null, back };
        tracks = sp.lists.liked || [];
      } else if (this.spPlus(sp.acct)) {
        if (item.type === "playlist") tracks = this.spItems(await this.spCall("get_playlist_items", { playlist_id: item.id, limit_total: 200 }));
        else if (item.type === "album") tracks = this.spItems(await this.spCall("get_album_tracks", { album_id: item.id, limit_total: 100 })).map((t) => Object.assign(t, { img: t.img || item.img }));
        else if (item.type === "artist") tracks = this.spItems(await this.spCall("get_artist_top_tracks", { artist_id: item.id }));
        else tracks = [];
      } else {
        const raw = item.raw || {};
        const r = await this._hass.callWS({ type: "media_player/browse_media", entity_id: sp.acct, media_content_type: raw.media_content_type || "spotify://" + item.type, media_content_id: raw.media_content_id || item.uri });
        tracks = ((r && r.children) || []).map((c) => this.spNode(c));
      }
      if (sp.detail && sp.detail.item === item) sp.detail.tracks = tracks;
    } catch (e) {
      if (sp.detail && sp.detail.item === item) { sp.detail.tracks = []; sp.err = (e && e.message) || "Couldn't open that."; }
    }
    this._schedule(true);
  }
  // Play on the amp: a whole playlist/album/artist/Liked Songs, or a song
  // (inside an opened playlist or album, it carries on with the rest).
  async spPlay(item, opt) {
    const o = opt || {};
    const sp = this._sp;
    const acct = sp.acct;
    const dev = this.spDevice(o.amp);
    const h = this._hass;
    try {
      if (this.spPlus(acct)) {
        const base = { entity_id: acct };
        if (dev) base.device_id = dev;
        if (item.type === "liked") await h.callService("spotifyplus", "player_media_play_track_favorites", Object.assign(base, { shuffle: !!o.shuffle }));
        else if (item.type === "track" && o.context && o.context.type !== "liked" && o.context.type !== "artist")
          await h.callService("spotifyplus", "player_media_play_context", Object.assign(base, { context_uri: o.context.uri, offset_position: o.index || 0 }));
        else if (item.type === "track") {
          const list = (o.list || [item]).slice(o.index || 0, (o.index || 0) + 50).filter((t) => t.type === "track");
          await h.callService("spotifyplus", "player_media_play_tracks", Object.assign(base, { uris: (list.length ? list : [item]).map((t) => t.uri).join(",") }));
        } else await h.callService("spotifyplus", "player_media_play_context", Object.assign(base, { context_uri: item.uri, shuffle: !!o.shuffle }));
      } else {
        if (this.spAsleep(acct) && !(await this.spWake(o.amp))) return;
        const s = this.st(acct);
        const list = (s && s.attributes.source_list) || [];
        if (dev && list.indexOf(dev) >= 0 && s.attributes.source !== dev) await h.callService("media_player", "select_source", { entity_id: acct, source: dev });
        if (o.shuffle != null && item.type !== "track") await h.callService("media_player", "shuffle_set", { entity_id: acct, shuffle: !!o.shuffle });
        const raw = item.raw || {};
        const type = item.type === "liked" ? "current_user_saved_tracks" : String(raw.media_content_type || item.type).replace("spotify://", "");
        await h.callService("media_player", "play_media", { entity_id: acct, media_content_id: item.type === "liked" ? "current_user_saved_tracks" : item.uri, media_content_type: type });
      }
      this._say("Playing " + item.title + (dev ? " on " + dev : ""));
    } catch (e) {
      this._say((e && e.message) || "Spotify didn't start");
    }
  }
  // Move what's playing to another amp (and play there from now on).
  async spMove(amp, dev) {
    const acct = this._spState(this.spAcct()).acct;
    const spDev = Object.assign({}, this._s.spDev || {});
    spDev[amp || "_none"] = dev;
    this._sheet = null;
    this._set({ spDev });
    const s = this.st(acct);
    if (this.spAsleep(acct)) { this.spWake(amp); return; } // picking the amp also wakes Spotify there
    if (!s || (s.state !== "playing" && s.state !== "paused")) { this._say("Spotify will play on " + this.spLabel(dev)); return; }
    try {
      if (this.spPlus(acct)) await this._hass.callService("spotifyplus", "player_transfer_playback", { entity_id: acct, device_id: dev, play: s.state === "playing" });
      else await this._hass.callService("media_player", "select_source", { entity_id: acct, source: dev });
      this._say("Moved to " + this.spLabel(dev));
    } catch (e) {
      this._say((e && e.message) || "Couldn't move to " + dev);
    }
  }

  _refreshCams() {
    const imgs = this.shadowRoot.querySelectorAll("img[data-cam]");
    imgs.forEach((im) => {
      const base = this.camUrl(im.getAttribute("data-cam"));
      if (base) im.src = base + (base.indexOf("?") >= 0 ? "&" : "?") + "t=" + Date.now();
    });
  }

  // --- summaries for the Home cards ---------------------------------------------
  summary(cat) {
    const es = this.ents(cat);
    if (cat === "lights") {
      const n = es.filter((e) => this.isOn(e)).length;
      return { s: n ? `${n} of ${es.length} on` : "All off", lit: n > 0 };
    }
    if (cat === "climate") {
      const s = this.st(es[0]);
      if (!s) return { s: "" };
      const a = s.attributes;
      if (s.state === "off") return { s: "Off" + (a.current_temperature != null ? ` · ${a.current_temperature}°` : "") };
      return { s: `${MODE_NAME[s.state] || s.state}${a.temperature != null ? " to " + a.temperature + "°" : ""}`, lit: true };
    }
    if (cat === "music") {
      const p = es.find((e) => this.st(e).state === "playing");
      if (!p) return { s: "Nothing playing" };
      const g = this.groupInfo(p);
      const n = g ? g.members.length - (g.kind === "group" ? 0 : 1) : 0;
      return { s: "Playing · " + this.name(p) + (n > 0 ? ` + ${n} grouped` : ""), lit: true };
    }
    if (cat === "shades") {
      const n = es.filter((e) => this.isOn(e)).length;
      return { s: n ? `${n} open` : "All closed" };
    }
    if (cat === "cameras") {
      const p = this.panelCfg();
      return { s: `${es.length + ((p && p.rtsp.length) || 0)} cameras` };
    }
    if (cat === "security") {
      const a = this.alarm();
      if (!a) return { s: `${es.length} sensors` };
      const st = this.st(a).state;
      return { s: this.alarmName(st), warn: st === "triggered", ok: st === "disarmed" };
    }
    if (cat === "autoscenes") {
      const A = this._as || {};
      const sc = (A.scenes || []).length;
      const au = A.autos || [];
      const on = au.filter((it) => { const e = this.asEnt("automation", it); return e && this.st(e).state === "on"; }).length;
      return { s: sc + (sc === 1 ? " scene" : " scenes") + " · " + (au.length ? on + " of " + au.length + " automations on" : "no automations") };
    }
    if (cat === "garage") {
      const st = this.doors().map((d) => this.doorState(d));
      const n = st.filter((x) => x.open).length;
      if (!n) return { s: st.length === 1 ? (st[0].kind === "shut" ? "Closed" : st[0].kind === "dead" ? "Unavailable" : st[0].kind === "moving" ? "Closing…" : "Tap to open") : "All closed", ok: st.some((x) => x.kind === "shut") && !st.some((x) => x.kind === "dead") };
      return { s: st.length === 1 ? "Open" : `${n} of ${st.length} open`, warn: st.some((x) => x.kind === "long"), lit: true };
    }
    if (cat === "utilities") {
      const n = es.filter((e) => this.isOn(e)).length;
      return { s: n ? `${n} running` : "All off", lit: n > 0 };
    }
    return { s: "" };
  }
  alarmName(st) {
    return { disarmed: "Disarmed", armed_home: "Armed home", armed_away: "Armed away", armed_night: "Armed night", armed_vacation: "Armed vacation",
      armed_custom_bypass: "Armed", arming: "Arming…", pending: "Pending…", triggered: "ALARM", disarming: "Disarming…" }[st] || st;
  }

  // --- events -------------------------------------------------------------------------
  _click(ev) {
    const b = ev.target.closest("[data-a]");
    if (!b) return;
    // a tap on a button ends typing (iPhones don't always do that themselves)
    const typing = this.shadowRoot.activeElement;
    if (typing && typing !== b && typing.getAttribute && typing.getAttribute("data-keep")) typing.blur();
    const a = b.getAttribute("data-a");
    const v = b.getAttribute("data-v");
    const e = b.getAttribute("data-e");
    const h = this._hass;
    switch (a) {
      case "menu": this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true })); break;
      case "go": this._set({ tab: v }); this.shadowRoot.querySelector(".root").scrollTop = 0; break;
      case "rooms": this._sheet = "rooms"; this._schedule(true); break;
      case "room": {
        this._sheet = null;
        this._lib = null;
        const patch = { room: Number(v), mus: null, clim: 0 };
        // Setting "Changing room goes to its Home page": a new room starts on Home.
        if (this._config && this._config.room_home && Number(v) !== this._s.room) patch.tab = "home";
        this._set(patch);
        if (patch.tab) { const rt = this.shadowRoot.querySelector(".root"); if (rt) rt.scrollTop = 0; }
        break;
      }
      case "panel": this._sheet = null; this._lib = null; this._set({ panel: Number(v), room: null, mus: null, clim: 0 }); break;
      case "close": this._spAll = false; this._sheet = null; this._pin = null; this._schedule(true); break;
      case "scene": {
        const d = e.split(".")[0];
        this.call(d === "script" ? "script" : d === "scene" ? "scene" : "homeassistant", "turn_on", { entity_id: e });
        b.classList.add("hit");
        setTimeout(() => b.classList.remove("hit"), 700);
        this._say(this.name(e));
        break;
      }
      case "toggle": this.call("homeassistant", "toggle", { entity_id: e }); break;
      case "gd": {
        if (this._held) { this._held = false; break; } // that was a hold: details already open
        const d = e.split(".")[0];
        if (d === "cover") this.call("cover", "toggle", { entity_id: e });
        else if (d === "button" || d === "input_button") this.call(d, "press", { entity_id: e });
        else if (d === "script") this.call("script", "turn_on", { entity_id: e });
        else this.call("homeassistant", "toggle", { entity_id: e });
        b.classList.add("hit");
        setTimeout(() => b.classList.remove("hit"), 500);
        this._say(v || "Garage door");
        break;
      }
      case "gopen": {
        const o = Object.assign({}, this._s.open || {});
        o[v] = !o[v];
        this._set({ open: o });
        break;
      }
      case "gtog": {
        const g = this._groups && this._groups[v];
        if (!g) break;
        const anyOn = g.ids.some((x) => this.isOn(x));
        this.call("homeassistant", anyOn ? "turn_off" : "turn_on", { entity_id: g.entity ? [g.entity] : g.ids });
        break;
      }
      case "all": {
        const ids = this.ents(v === "util" ? "utilities" : "lights");
        if (ids.length) this.call("homeassistant", b.getAttribute("data-on") === "1" ? "turn_on" : "turn_off", { entity_id: ids });
        break;
      }
      case "clim": this._set({ clim: Number(v) }); break;
      case "temp": {
        const s = this.st(e);
        if (!s) break;
        const a2 = s.attributes;
        const step = a2.target_temp_step || (h.config.unit_system && h.config.unit_system.temperature === "°F" ? 1 : 0.5);
        const cur = this._pendTemp[e] != null ? this._pendTemp[e] : a2.temperature != null ? a2.temperature : 21;
        const nv = clamp(Math.round((cur + Number(v) * step) * 10) / 10, a2.min_temp != null ? a2.min_temp : 7, a2.max_temp != null ? a2.max_temp : 35);
        this._pendTemp[e] = nv;
        clearTimeout(this._tempT);
        this._tempT = setTimeout(() => {
          this.call("climate", "set_temperature", { entity_id: e, temperature: nv });
          setTimeout(() => { delete this._pendTemp[e]; this._schedule(); }, 4000);
        }, 700);
        this._schedule(true);
        break;
      }
      case "hvac": this.call("climate", "set_hvac_mode", { entity_id: e, hvac_mode: v }); break;
      case "fan": this.call("climate", "set_fan_mode", { entity_id: e, fan_mode: v }); break;
      case "mus": this._lib = null; this._set({ mus: Number(v) }); break;
      case "mview": this._set({ mview: v }); if (v === "lib" && !this._lib) this._browse(e, null); break;
      case "spv": this._sp.res = null; this._sp.q = ""; this.spLoad(v); break;
      case "spf": this._sp.filter = v; this._schedule(true); break;
      case "spclear": this._sp.q = ""; this.spSearch(""); break;
      case "spo": { const it = (this._spRefs || [])[Number(v)]; if (it) this.spOpen(it); break; }
      case "spp": { const r = (this._spRefs || [])[Number(v)]; if (r) this.spPlay(r.item || r, Object.assign({ amp: this._spAmp }, r.opt || {})); break; }
      case "spback": { const d = this._sp.detail; this._sp.detail = null; this._sp.view = (d && d.back) || "playlists"; this._schedule(true); break; }
      case "spdev": this._sheet = "spdev"; this._schedule(true); break;
      case "spsel": this._spAll = false; this.spMove(this._spAmp, v); break;
      case "spall": this._spAll = true; this._schedule(true); break;
      case "spwake": this.spWake(this._spAmp); break;
      // --- Auto & Scenes
      case "asv": this._set({ asv: v }); this.asLoad(); break;
      case "asrun": {
        const it = (this._asRefs || [])[Number(v)];
        const ent = it && this.asEnt("scene", it);
        if (!ent) { this._say("Still loading, try again in a moment"); break; }
        this.call("scene", "turn_on", { entity_id: ent });
        this._asHit = it.id;
        clearTimeout(this._asHitT);
        this._asHitT = setTimeout(() => { this._asHit = null; this._schedule(true); }, 1600);
        this._say((it.name || "Scene") + " on");
        break;
      }
      case "asedit": { const it = (this._asRefs || [])[Number(v)]; if (it) { this._asEd = Object.assign({ id: it.id }, asParseScene(it.config || {})); this._asConfirm = false; const rt = this.shadowRoot.querySelector(".root"); if (rt) rt.scrollTop = 0; this._schedule(true); } break; }
      case "asnew": this._asEd = { name: "", icon: "mdi:palette", entities: [] }; this._asConfirm = false; this._schedule(true); break;
      case "asback": this._asEd = null; this._schedule(true); break;
      case "asicon": this._asEd.icon = v; this._schedule(true); break;
      case "asst": { const [i, val] = v.split("|"); const row = this._asEd.entities[Number(i)]; if (row) row.state = val; this._schedule(true); break; }
      case "asrm": this._asEd.entities.splice(Number(v), 1); this._schedule(true); break;
      case "asadd": this._asQ = ""; this._sheet = "aspick"; this._schedule(true); setTimeout(() => { const q = this.shadowRoot.querySelector('[data-a="asq"]'); if (q) q.focus(); }, 60); break;
      case "aspick": this._asEd.entities.push(this.asRow(e)); this._sheet = null; this._schedule(true); break;
      case "ascap": this._asEd.entities = this._asEd.entities.map((r) => Object.assign(this.asRow(r.entity_id), { extra: r.extra || {} })); this._say("Copied how your devices are now"); break;
      case "astry": { const cfg = asBuildScene(this._asEd); if (!Object.keys(cfg.entities).length) { this._say("Add a device first"); break; } this.call("scene", "apply", { entities: cfg.entities }); this._say("Trying it on your devices"); break; }
      case "assave": this.asSave(); break;
      case "asdel": this.asDelete(); break;
      case "astog": { const s2 = this.st(e); if (s2) this.call("automation", s2.state === "on" ? "turn_off" : "turn_on", { entity_id: e }); break; }
      case "asgo": if (!e) { this._say("Still loading, try again in a moment"); break; } this.call("automation", "trigger", { entity_id: e, skip_condition: true }); this._say("Automation started"); break;
      case "asopen": this.asOpenPanel(); break;
      case "spm": this.call("media_player", v, { entity_id: e }); break;
      case "lib": {
        const it = this._lib && this._lib.items[Number(v)];
        if (!it) break;
        if (it.can_expand && !it.can_play) this._browse(this._lib.player, it);
        else if (it.can_play) {
          this.call("media_player", "play_media", { entity_id: this._lib.player, media_content_id: it.media_content_id, media_content_type: it.media_content_type });
          this._say("Playing " + it.title);
          this._set({ mview: "now" });
        }
        break;
      }
      case "libopen": {
        const it = this._lib && this._lib.items[Number(v)];
        if (it) this._browse(this._lib.player, it);
        break;
      }
      case "libback": {
        if (!this._lib || !this._lib.stack.length) break;
        this._lib.stack.pop();
        const prev = this._lib.stack.pop() || null;
        this._browse(this._lib.player, prev);
        break;
      }
      case "media": {
        const s = this.st(e);
        if (v === "power") this.call("media_player", s && s.state === "off" ? "turn_on" : "turn_off", { entity_id: e });
        else this.call("media_player", v, { entity_id: e });
        break;
      }
      case "cover": this.call("cover", v, { entity_id: e }); break;
      case "covers": {
        const ids = (this._shGroups || {})[b.getAttribute("data-g")] || [];
        if (ids.length) this.call("cover", v, { entity_id: ids });
        break;
      }
      case "unjoin": {
        const g = this.groupInfo(e);
        // the leader ungroups everyone; a member just leaves
        const ids = g && g.leader === e ? g.members.filter((m) => m !== e) : [e];
        this.call("media_player", "unjoin", { entity_id: ids });
        this._say(g && g.leader === e ? "Ungrouped" : "Left the group");
        break;
      }
      case "lock": this.call("lock", this.st(e).state === "locked" ? "unlock" : "lock", { entity_id: e }); break;
      case "more": this.more(e); break;
      case "cam": this._set({ cam: v }); this.shadowRoot.querySelector(".root").scrollTop = 0; break;
      case "arm": {
        const s = this.st(e);
        if (s && s.attributes.code_format && s.attributes.code_arm_required !== false) {
          this._pin = { e, svc: v, code: "" };
          this._schedule(true);
        } else if (s && s.attributes.code_format && v === "alarm_disarm") {
          this._pin = { e, svc: v, code: "" };
          this._schedule(true);
        } else this.call("alarm_control_panel", v, { entity_id: e });
        break;
      }
      case "key": {
        if (!this._pin) break;
        if (v === "del") this._pin.code = this._pin.code.slice(0, -1);
        else if (v === "ok") {
          const p = this._pin;
          this._pin = null;
          this.call("alarm_control_panel", p.svc, { entity_id: p.e, code: p.code });
        } else if (this._pin.code.length < 12) this._pin.code += v;
        this._schedule(true);
        break;
      }
      default: break;
    }
  }
  _input(ev) {
    const t = ev.target;
    const ia = t.getAttribute && t.getAttribute("data-a");
    if (ia === "asname" && this._asEd) { this._asEd.name = t.value; return; }
    if (ia === "asq") { this._asQ = t.value; const box = this.shadowRoot.querySelector("[data-aslist]"); if (box) box.innerHTML = this._asPickHtml(); return; }
    if (ia === "asval") { const o = t.parentNode.querySelector("[data-asout]"); if (o) o.textContent = t.value + (t.getAttribute("data-k") === "temperature" ? "°" : "%"); }
    if (t.getAttribute && t.getAttribute("data-a") === "spq" && this._sp) {
      this._sp.q = t.value;
      clearTimeout(this._spT);
      this._spT = setTimeout(() => this.spSearch(t.value), 500);
      return;
    }
    if (t.type === "range") t.style.setProperty("--p", ((t.value - t.min) / (t.max - t.min)) * 100 + "%");
  }
  _change(ev) {
    const t = ev.target;
    const e = t.getAttribute("data-e");
    const a = t.getAttribute("data-a");
    const v = Number(t.value);
    if (a === "gbri") {
      const g = this._groups && this._groups[t.getAttribute("data-g")];
      if (g) {
        const dims = g.ids.filter((x) => this.dimmable(x));
        const rest = g.ids.filter((x) => dims.indexOf(x) < 0);
        this._holdBri(dims, v);
        if (v > 0) {
          if (dims.length) this.call("light", "turn_on", { entity_id: dims, brightness_pct: v });
          if (rest.length) this.call("homeassistant", "turn_on", { entity_id: rest });
        } else this.call("homeassistant", "turn_off", { entity_id: g.ids });
      }
    } else if (a === "asval") {
      const row = this._asEd && this._asEd.entities[Number(t.getAttribute("data-i"))];
      if (row) row[t.getAttribute("data-k")] = v;
    } else if (a === "bri") this._holdBri([e], v), this.call("light", v > 0 ? "turn_on" : "turn_off", v > 0 ? { entity_id: e, brightness_pct: v } : { entity_id: e });
    else if (a === "vol") this.call("media_player", "volume_set", { entity_id: e, volume_level: v / 100 });
    else if (a === "pos") this.call("cover", "set_cover_position", { entity_id: e, position: v });
    this._busy = 0;
  }

  // --- rendering -----------------------------------------------------------------------
  _render() {
    if (!this._hass) return;
    const s = this._s;
    const L = this._layout;
    let body;
    if (L == null) body = `<div class="empty">Loading…</div>`;
    else if (!L.length)
      body = `<div class="empty">${this._err ? esc(this._err) + "<br><br>" : ""}Nothing to control yet.<br>Add lights, climate, speakers or blinds to Home Assistant and give them an <b>area</b> (Settings › Areas), and they appear here.</div>`;
    else {
      const cats = this.cats();
      if (s.tab !== "home" && !cats.some((c) => c.key === s.tab)) s.tab = "home";
      body = this._top() + (this["_" + s.tab] ? this["_" + s.tab]() : this._home()) + this._dock(cats);
    }
    const sheet = this._sheet === "rooms" ? this._roomsSheet() : this._sheet === "spdev" ? this._spDevSheet() : this._sheet === "aspick" && this._asEd ? this._asPickSheet() : this._pin ? this._pinSheet() : "";
    const toast = this._toast ? `<div class="toast" role="status">${esc(this._toast)}</div>` : "";
    const html = `<div class="root"><div class="wrap">${body}</div></div>${sheet}${toast}`;
    // Typing in Spotify search: only refresh the results under the box, so
    // the keyboard stays up.
    const act = this.shadowRoot.activeElement;
    if (act && act.getAttribute && act.getAttribute("data-keep")) { this._lastHtml = null; return; }
    if (act && act.getAttribute && act.getAttribute("data-a") === "spq" && this._spBody != null) {
      const box = this.shadowRoot.querySelector("[data-spbody]");
      if (box) {
        if (box._h !== this._spBody) { box.innerHTML = this._spBody; box._h = this._spBody; }
        this._lastHtml = null;
        return;
      }
    }
    // Nothing on screen changed (e.g. a state change elsewhere in the house):
    // leave the page alone, so a live camera keeps streaming untouched.
    if (html === this._lastHtml && this.shadowRoot.querySelector(".root")) { this._placeDock(); return; }
    this._lastHtml = html;
    if (this._rtc && this._rtc.el.parentNode) this._rtc.el.parentNode.removeChild(this._rtc.el);
    const keepScroll = this.shadowRoot.querySelector(".root");
    const y = keepScroll ? keepScroll.scrollTop : 0;
    this.shadowRoot.innerHTML = `<style>${CSS}</style>${html}`;
    const nr = this.shadowRoot.querySelector(".root");
    if (nr) nr.scrollTop = y;
    this.shadowRoot.querySelectorAll("input[type=range]").forEach((t) => t.style.setProperty("--p", ((t.value - t.min) / (t.max - t.min)) * 100 + "%"));
    this._mountRtc();
    this._animateDoors();
    this._placeDock();
  }
  // The page is redrawn from scratch, so start each door where it was last
  // shown and let it roll to where it is now.
  _animateDoors() {
    const shown = this._gdShown || (this._gdShown = {});
    const tiles = Array.from(this.shadowRoot.querySelectorAll("[data-gd]"));
    tiles.forEach((el) => {
      const k = el.getAttribute("data-gd");
      const now = el.getAttribute("data-open") === "1";
      if (k in shown && shown[k] !== now) el.classList.add(shown[k] ? "was-open" : "was-shut");
      shown[k] = now;
    });
    if (tiles.some((el) => el.classList.contains("was-open") || el.classList.contains("was-shut"))) {
      void this.shadowRoot.host.offsetWidth;
      requestAnimationFrame(() => tiles.forEach((el) => el.classList.remove("was-open", "was-shut")));
    }
  }

  // Centre the bottom bar on the card itself (not the whole screen), so it
  // lines up with the content whatever the sidebar or screen size.
  _placeDock() {
    const d = this.shadowRoot.querySelector(".dock");
    if (!d) return;
    const r = this.getBoundingClientRect();
    if (!r.width) return;
    const w = Math.min(536, r.width - 24);
    d.style.setProperty("--dock-w", w + "px");
    d.style.setProperty("--dock-l", Math.round(r.left + (r.width - w) / 2) + "px");
  }

  _top() {
    const r = this.room();
    const t = this._s.tab;
    const title = t === "home" ? "Home" : (CATS.find((c) => c.key === t) || {}).title;
    const hi = new Date().getHours();
    const greet = hi < 12 ? "Good morning" : hi < 18 ? "Good afternoon" : "Good evening";
    const user = this._hass.user && this._hass.user.name ? ", " + this._hass.user.name.split(" ")[0] : "";
    return `<div class="top">
      ${this._narrow ? `<button class="iconbtn" data-a="menu" aria-label="Home Assistant menu">${svg("menu", 20)}</button>` : ""}
      <div style="flex:1;min-width:0">${t === "home" ? `<div class="hi">${esc(greet + user)}</div>` : ""}<h1>${esc(title)}</h1></div>
      ${r ? `<button class="chip" data-a="rooms" aria-label="Choose room"><span>${esc(r.name || "Room")}</span>${svg("chev", 12)}</button>` : ""}
    </div>`;
  }

  _dock(cats) {
    const items = [{ key: "home", title: "Home", icon: "home" }].concat(cats);
    return `<nav class="dock${items.length > 5 ? " many" : ""}" aria-label="Sections">${items
      .map((c) => `<button data-a="go" data-v="${c.key}" aria-label="${esc(c.title)}" class="${this._s.tab === c.key ? "on" : ""}"${this._s.tab === c.key ? ' aria-current="page"' : ""}>${svg(c.icon)}<span>${esc(c.title)}</span></button>`)
      .join("")}</nav>`;
  }

  _home() {
    const d = new Date();
    const w = this.weather();
    let wx = "";
    if (w) {
      const a = w.attributes;
      const u = a.temperature_unit || "°";
      wx = `<div class="wx"><b>${svg(/sun|clear/.test(w.state) ? "sun" : "cloud", 30, ' stroke-width="1.6"')}${a.temperature != null ? Math.round(a.temperature) + "°" : ""}</b><small>${esc(WX[w.state] || w.state)}${a.humidity != null ? " · " + a.humidity + "%" : ""}</small></div>`;
      void u;
    }
    const date = d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
    const r = this.room();
    const scenes = (r && r.scenes ? r.scenes : []).filter((e) => this.has(e)).slice(0, 8);
    const sc = scenes.length
      ? `<div class="row r4">${scenes.map((e) => `<button class="pill" data-a="scene" data-e="${esc(e)}">${esc(this.name(e))}</button>`).join("")}</div>`
      : "";
    const cards = this.cats()
      .map((c) => {
        const sm = this.summary(c.key);
        const cls = sm.warn ? "warn" : sm.ok ? "ok" : sm.lit && c.key === "lights" ? "lit" : "";
        return `<button class="glass card" data-a="go" data-v="${c.key}">${sm.lit && c.key === "lights" ? '<div class="glow"></div>' : ""}<div class="ic ${cls}">${svg(c.icon)}</div><div><div class="t">${esc(c.home || c.title)}</div><div class="s">${esc(sm.s)}</div></div></button>`;
      })
      .join("");
    return `<div class="glass hero"><div style="flex:1"><div class="clock">${pad(d.getHours())}:${pad(d.getMinutes())}</div><div class="date">${esc(date)}</div></div>${wx}</div>${sc}<div class="grid">${cards}</div>`;
  }

  dimmable(e) {
    const s = this.st(e);
    if (!s || e.indexOf("light.") !== 0) return false;
    const modes = s.attributes.supported_color_modes || [];
    return modes.length > 0 && !(modes.length === 1 && modes[0] === "onoff");
  }
  pct(e) {
    const s = this.st(e);
    const real = this.isOn(e) ? (s.attributes.brightness != null ? Math.round((s.attributes.brightness / 255) * 100) : 100) : 0;
    // Just set with a slider: show that until the light reports it (some
    // lights report late or not at all), so the slider doesn't jump back.
    const p = this._pendBri && this._pendBri[e];
    if (p) {
      if (Math.abs(real - p.v) <= 2 || Date.now() - p.t > 8000) delete this._pendBri[e];
      else return p.v;
    }
    return real;
  }
  _holdBri(ids, v) {
    this._pendBri = this._pendBri || {};
    ids.forEach((x) => (this._pendBri[x] = { v, t: Date.now() }));
    clearTimeout(this._pendBriT);
    this._pendBriT = setTimeout(() => this._schedule(true), 8100);
  }
  // Light groups: ones set up in the card (light_groups) plus Home Assistant's
  // own light groups (a light whose `entity_id` lists its members).
  lightGroups(es, room) {
    const r = room || this.room();
    return roomLightItems(this._hass, es, r && r.groups, r && r.order, (e) => this.name(e)).groups;
  }

  _lights() {
    this._groups = {};
    const open = this._s.open || {};
    // One room's lights: its light groups and the lights on their own, in the
    // order set in the card editor (groups first if none was set).
    const split = (es, room) => {
      const b = roomLightItems(this._hass, es, room && room.groups, room && room.order, (e) => this.name(e));
      b.groups.forEach((g) => (this._groups[g.id] = g));
      b.every = uniq(b.loose.concat([].concat.apply([], b.groups.map((g) => g.ids))));
      return b;
    };

    const tile = (e) => {
      const s = this.st(e);
      const on = this.isOn(e);
      const dim = this.dimmable(e);
      const pct = this.pct(e);
      const lvl = s.state === "unavailable" ? "Offline" : on ? (dim ? pct + "%" : "On") : "Off";
      return `<div class="glass light ${on ? "on" : ""}">${on ? '<div class="glow"></div>' : ""}
          <button class="tap" data-a="toggle" data-e="${esc(e)}" aria-pressed="${on}"><span class="bulbrow"><span class="bulb">${svg("bulb", 20)}</span><span class="lvl">${lvl}</span></span><span class="nm">${esc(this.name(e))}</span></button>
          ${dim ? `<input type="range" min="0" max="100" step="1" value="${pct}" data-a="bri" data-e="${esc(e)}" aria-label="${esc(this.name(e))} brightness">` : ""}
        </div>`;
    };
    const row = (e) => {
      const s = this.st(e);
      const on = this.isOn(e);
      const dim = this.dimmable(e);
      const pct = this.pct(e);
      const lvl = s.state === "unavailable" ? "Offline" : on ? (dim ? pct + "%" : "On") : "Off";
      return `<div class="lrow ${on ? "on" : ""}"><button class="tap" data-a="toggle" data-e="${esc(e)}" aria-pressed="${on}"><span class="bulb">${svg("bulb", 16)}</span><span class="nm">${esc(this.name(e))}</span><span class="lvl">${lvl}</span></button>
        ${dim ? `<input type="range" min="0" max="100" step="1" value="${pct}" data-a="bri" data-e="${esc(e)}" aria-label="${esc(this.name(e))} brightness">` : ""}</div>`;
    };
    const card = (g) => {
      const onN = g.ids.filter((e) => this.isOn(e)).length;
      const dims = g.ids.filter((e) => this.dimmable(e));
      const lit = dims.filter((e) => this.isOn(e));
      const avg = lit.length ? Math.round(lit.reduce((t, e) => t + this.pct(e), 0) / lit.length) : 0;
      const isOpen = !!open[g.id];
      const sub = onN ? `<b>${onN} of ${g.ids.length} on</b>${lit.length ? " · " + avg + "%" : ""}` : `${g.ids.length} lights · all off`;
      return `<div class="glass lgrp ${onN ? "on" : ""}">${onN ? '<div class="glow"></div>' : ""}
        <div class="lgh">
          <button class="tap" data-a="gopen" data-v="${esc(g.id)}" aria-expanded="${isOpen}" aria-label="${esc(g.name)}, ${onN} of ${g.ids.length} on. ${isOpen ? "Hide" : "Show"} lights">
            <span class="bulb">${svg("bulb", 20)}</span><span class="gt"><span class="nm">${esc(g.name)}</span><span class="gs">${sub}</span></span>
            <span class="chv ${isOpen ? "open" : ""}">${svg("chev", 14)}</span>
          </button>
          <button class="sw ${onN ? "on" : ""}" role="switch" aria-checked="${onN > 0}" data-a="gtog" data-v="${esc(g.id)}" aria-label="${esc(g.name)} ${onN ? "off" : "on"}"><i></i></button>
        </div>
        ${dims.length ? `<input type="range" min="0" max="100" step="1" value="${avg}" data-a="gbri" data-g="${esc(g.id)}" aria-label="${esc(g.name)} brightness">` : ""}
        ${isOpen ? `<div class="lgl">${g.ids.map(row).join("")}</div>` : ""}
      </div>`;
    };
    // Groups are full-width cards, single lights sit two to a row: lay out each
    // run of the same kind together, in order.
    const block = (b) => {
      const runs = [];
      b.items.forEach((x) => {
        const kind = x.g ? "g" : "l";
        if (!runs.length || runs[runs.length - 1].kind !== kind) runs.push({ kind, list: [] });
        runs[runs.length - 1].list.push(x);
      });
      return runs.map((r) => r.kind === "g"
        ? `<div class="lgs">${r.list.map((x) => card(x.g)).join("")}</div>`
        : `<div class="grid">${r.list.map((x) => tile(x.e)).join("")}</div>`).join("");
    };
    const bar = (n, total) => `<div class="bar"><div class="lbl">${n} of ${total} on</div><button class="act on" data-a="all" data-v="lights" data-on="1">All on</button><button class="act" data-a="all" data-v="lights" data-on="0">All off</button></div>`;
    const cur = this.room();

    // Whole house: the lights sorted under each room's name, in your room order.
    if (cur && cur.whole) {
      const sections = this.rooms()
        .filter((rm) => !rm.whole)
        .map((rm, i) => Object.assign({ id: "room:" + i, name: rm.name }, split((rm.lights || []).filter((e) => this.has(e)), rm)))
        .filter((sec) => sec.every.length);
      const all = uniq([].concat.apply([], sections.map((sec) => sec.every)));
      const n = all.filter((e) => this.isOn(e)).length;
      const body = sections.map((sec) => {
        this._groups[sec.id] = { id: sec.id, name: sec.name, ids: sec.every };
        const onN = sec.every.filter((e) => this.isOn(e)).length;
        const shut = !!open[sec.id]; // sections start open; tap the name to fold one away
        return `<section class="rsec" aria-label="${esc(sec.name)}">
          <div class="rsh">
            <button class="tap" data-a="gopen" data-v="${esc(sec.id)}" aria-expanded="${!shut}"><span class="rn">${esc(sec.name)}</span><span class="rc ${onN ? "lit" : ""}">${onN ? onN + " of " + sec.every.length + " on" : sec.every.length + (sec.every.length === 1 ? " light" : " lights") + " · off"}</span><span class="chv ${shut ? "" : "open"}">${svg("chev", 14)}</span></button>
            <button class="sw ${onN ? "on" : ""}" role="switch" aria-checked="${onN > 0}" data-a="gtog" data-v="${esc(sec.id)}" aria-label="All ${esc(sec.name)} lights ${onN ? "off" : "on"}"><i></i></button>
          </div>
          ${shut ? "" : block(sec)}
        </section>`;
      }).join("");
      return bar(n, all.length) + body;
    }

    const b = split(this.ents("lights"), cur);
    return bar(b.every.filter((e) => this.isOn(e)).length, b.every.length) + block(b);
  }

  _climate() {
    const es = this.ents("climate");
    const i = clamp(this._s.clim || 0, 0, es.length - 1);
    const e = es[i];
    const s = this.st(e);
    const a = s.attributes;
    const tabs = es.length > 1 ? `<div class="tabs">${es.map((x, k) => `<button class="tab ${k === i ? "on" : ""}" data-a="clim" data-v="${k}">${esc(this.name(x))}</button>`).join("")}</div>` : "";
    const target = this._pendTemp[e] != null ? this._pendTemp[e] : a.temperature;
    const min = a.min_temp != null ? a.min_temp : 7;
    const max = a.max_temp != null ? a.max_temp : 35;
    const frac = target != null ? clamp((target - min) / (max - min), 0, 1) : 0;
    const off = s.state === "off";
    const heat = s.state === "heat" || a.hvac_action === "heating";
    const col = off ? "rgba(255,255,255,.25)" : heat ? "#ff9b5a" : "#7dd3fc";
    const actn = a.hvac_action ? { cooling: "Cooling to", heating: "Heating to", idle: "Holding", off: "Off", fan: "Fan", drying: "Drying" }[a.hvac_action] : null;
    const k = off ? "Off" : actn || (MODE_NAME[s.state] || s.state) + " to";
    const total = 490;
    const dial = `<div class="dial"><svg width="250" height="250" viewBox="0 0 250 250" aria-hidden="true">
        <circle cx="125" cy="125" r="104" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="16" stroke-linecap="round" stroke-dasharray="${total} 654" transform="rotate(135 125 125)"/>
        <circle cx="125" cy="125" r="104" fill="none" stroke="${col}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${Math.max(1, Math.round(total * frac))} 654" transform="rotate(135 125 125)" style="filter:drop-shadow(0 0 10px ${col})"/>
        <circle cx="125" cy="125" r="80" fill="rgba(10,12,15,.35)"/></svg>
      <div class="in"><div class="k" style="color:${heat && !off ? "#ffc29a" : ""}">${esc(k)}</div><div class="v">${target != null && !off ? esc(target) + "<sup>°</sup>" : "–"}</div><div class="hi">${a.current_temperature != null ? "Inside now " + esc(a.current_temperature) + "°" : ""}</div></div></div>`;
    const modes = (a.hvac_modes || [])
      .map((m) => `<button class="mode ${s.state === m ? "on" : ""} ${m === "heat" ? "heat" : ""}" data-a="hvac" data-e="${esc(e)}" data-v="${esc(m)}">${svg(MODE_ICON[m] || "auto", 18)}${esc(MODE_NAME[m] || m)}</button>`)
      .join("");
    const fans = a.fan_modes && a.fan_modes.length
      ? `<div class="glass line">${svg("fan", 22)}<div class="nm">Fan</div><div class="seg">${a.fan_modes.map((f) => `<button class="${a.fan_mode === f ? "on" : ""}" data-a="fan" data-e="${esc(e)}" data-v="${esc(f)}">${esc(f.charAt(0).toUpperCase() + f.slice(1))}</button>`).join("")}</div></div>`
      : "";
    return `${tabs}<div class="glass dialbox">${dial}<div class="pm"><button class="round" data-a="temp" data-e="${esc(e)}" data-v="-1" aria-label="Lower the temperature"${off ? " disabled" : ""}>${svg("minus", 24)}</button><button class="round" data-a="temp" data-e="${esc(e)}" data-v="1" aria-label="Raise the temperature"${off ? " disabled" : ""}>${svg("plus", 24)}</button></div></div><div class="modes">${modes}</div>${fans}`;
  }

  _music() {
    const es = this.ents("music");
    const acct = this.spAcct();
    if (!es.length) return acct ? this._spotify(null) : "";
    // until a speaker is picked: the one that's playing
    const playingIdx = Math.max(0, es.findIndex((x) => this.st(x).state === "playing"));
    const i = clamp(this._s.mus == null ? playingIdx : this._s.mus, 0, es.length - 1);
    const e = es[i];
    const s = this.st(e);
    const a = s.attributes;
    const tabs = es.length > 1 ? `<div class="tabs">${es.map((x, k) => `<button class="tab ${k === i ? "on" : ""}" data-a="mus" data-v="${k}"${this.groupInfo(x) ? ' aria-description="Grouped"' : ""}>${this.groupInfo(x) ? `<span class="lk">${svg("link", 15)}</span>` : ""}${esc(this.name(x))}</button>`).join("")}</div>` : "";
    const playing = s.state === "playing";
    const off = s.state === "off" || s.state === "unavailable";
    const art = a.entity_picture ? `<img src="${esc(a.entity_picture)}" alt="">` : svg("music", 64, ' stroke-width="1.4"');
    const vol = a.volume_level != null ? Math.round(a.volume_level * 100) : null;
    const mv = this._s.mview === "sp" && !acct ? "now" : this._s.mview;
    const seg = `<div class="tabs"><button class="tab ${mv !== "lib" && mv !== "sp" ? "on" : ""}" data-a="mview" data-v="now">Now playing</button><button class="tab ${mv === "lib" ? "on" : ""}" data-a="mview" data-v="lib" data-e="${esc(e)}">Library</button>${acct ? `<button class="tab ${mv === "sp" ? "on" : ""}" data-a="mview" data-v="sp"><i class="spdot"></i>Spotify</button>` : ""}</div>`;
    if (mv === "sp") return tabs + seg + this._spotify(e);
    if (this._s.mview === "lib") {
      if (!this._lib || this._lib.player !== e) { this._lib = null; setTimeout(() => this._browse(e, null), 0); }
      return tabs + seg + this._library();
    }
    return `${tabs}${seg}<div class="glass np"><div class="art">${art}</div>
      <div class="tt">${esc(a.media_title || (off ? "Off" : "Nothing playing"))}</div>
      <div class="ar">${esc(a.media_artist || a.media_album_name || this.name(e))}</div>
      ${this._groupBox(e, es)}
      <div class="ctl">
        <button class="round" data-a="media" data-e="${esc(e)}" data-v="media_previous_track" aria-label="Previous">${svg("prev", 22)}</button>
        <button class="big" data-a="media" data-e="${esc(e)}" data-v="${off ? "power" : "media_play_pause"}" aria-label="${off ? "Turn on" : playing ? "Pause" : "Play"}">${svg(off ? "power" : playing ? "pause" : "play", 30)}</button>
        <button class="round" data-a="media" data-e="${esc(e)}" data-v="media_next_track" aria-label="Next">${svg("next", 22)}</button>
      </div>
      ${vol != null ? `<div class="vol">${svg("music", 18)}<input type="range" min="0" max="100" value="${vol}" data-a="vol" data-e="${esc(e)}" aria-label="Volume"><button class="iconbtn" data-a="media" data-e="${esc(e)}" data-v="power" aria-label="Power">${svg("power", 18)}</button></div>` : ""}
    </div>`;
  }

  // Spotify on the Music page: plays on the amp picked above (Spotify Connect).
  _spotify(amp) {
    const acct = this.spAcct();
    const sp = this._spState(acct);
    this._spAmp = amp;
    const refs = (this._spRefs = []);
    const ref = (x) => refs.push(x) - 1;
    if (!sp.view) { sp.view = "playlists"; setTimeout(() => this.spLoad("playlists"), 0); }
    // woke up by itself (something started playing): load what's on screen
    const asleep = this.spAsleep(acct);
    if (sp.wasAsleep && !asleep && sp.view !== "detail" && sp.view !== "search" && !sp.lists[sp.view]) { sp.err = null; setTimeout(() => this.spLoad(sp.view), 0); }
    sp.wasAsleep = asleep;
    const dev = this.spDevice(amp);
    const as = this.st(acct);
    const known = ((as && as.attributes.source_list) || []).indexOf(dev) >= 0;
    const target = `<button class="sto glass" data-a="spdev">${svg("speaker", 18)}<span><small>Playing to</small><b>${esc(dev ? this.spLabel(dev) : "Pick an amp")}</b></span><em>Spotify Connect</em>${svg("chev", 14)}</button>`;
    const search = `<label class="ssearch glass">${svg("search", 18)}<input type="search" enterkeyhint="search" autocomplete="off" data-a="spq" value="${esc(sp.q)}" placeholder="${this.spCanSearch(acct) ? "Search songs, artists, playlists" : "Search needs SpotifyPlus"}" aria-label="Search Spotify">${sp.q ? `<button data-a="spclear" aria-label="Clear search">${svg("close", 16)}</button>` : ""}</label>`;

    const art = (it, big) => it.type === "liked"
      ? `<span class="sart liked">${svg("heart", big ? 40 : 18, ' fill="currentColor" stroke-width="0"')}</span>`
      : `<span class="sart${it.type === "artist" ? " round" : ""}">${it.img ? `<img src="${esc(it.img)}" alt="" loading="lazy">` : svg("music", big ? 34 : 18, ' stroke-width="1.6"')}</span>`;
    const tile = (it) => `<div class="spl"><button class="spo" data-a="spo" data-v="${ref(it)}" aria-label="Open ${esc(it.title)}">${art(it, true)}<b>${esc(it.title)}</b>${it.sub ? `<small>${esc(it.sub)}</small>` : ""}</button><button class="splp" data-a="spp" data-v="${ref({ item: it })}" aria-label="Play ${esc(it.title)} on ${esc(dev)}">${svg("play", 16, ' fill="currentColor" stroke-width="0"')}</button></div>`;
    const mmss = (ms) => (ms ? Math.floor(ms / 60000) + ":" + pad(Math.floor((ms % 60000) / 1000)) : "");
    const nowUri = as && as.attributes.media_content_id;
    const row = (t, i, list, ctx) => `<button class="glass item strk ${nowUri && nowUri === t.uri ? "now" : ""}" data-a="spp" data-v="${ref({ item: t, opt: { list, index: i, context: ctx } })}" aria-label="Play ${esc(t.title)}">${ctx && ctx.type !== "artist" && ctx.type !== "liked" ? `<span class="tn">${nowUri && nowUri === t.uri ? '<i class="eq"><i></i><i></i><i></i></i>' : i + 1}</span>` : ""}${art(t)}<span class="nm"><b>${esc(t.title)}</b>${t.sub ? `<small>${esc(t.sub)}</small>` : ""}</span><span class="val">${mmss(t.dur)}</span></button>`;
    const loading = (w) => `<div class="empty" style="margin-top:28px">${esc(w)}</div>`;

    let body = "";
    if (sp.view === "detail" && sp.detail) {
      const d = sp.detail;
      const it = d.item;
      const tracks = d.tracks;
      body = `<button class="act" data-a="spback" style="margin-top:14px">${svg("back", 14)} Back</button>
        <div class="shero">${art(it, true)}<div class="sht"><b>${esc(it.title)}</b><small>${esc(tracks ? tracks.length + (tracks.length === 1 ? " song" : " songs") : it.sub || "")}</small></div></div>
        <div class="sbtns"><button class="big sbig" data-a="spp" data-v="${ref({ item: it, opt: { shuffle: false } })}" aria-label="Play ${esc(it.title)}">${svg("play", 26, ' fill="currentColor" stroke-width="0"')}</button><span class="sbl"><b>Play on ${esc(dev)}</b><small>or tap a song to start there</small></span><button class="round sround" data-a="spp" data-v="${ref({ item: it, opt: { shuffle: true } })}" aria-label="Shuffle ${esc(it.title)}">${svg("shuffle", 20)}</button></div>
        ${sp.err ? `<div class="note">${esc(sp.err)}</div>` : ""}
        ${tracks == null ? loading("Loading songs…") : `<div class="list">${tracks.map((t, i) => row(t, i, tracks, it)).join("")}</div>`}`;
    } else if (sp.view === "search") {
      const r = sp.res;
      const f = sp.filter || "all";
      const chips = `<div class="tabs">${[["all", "All"], ["tracks", "Songs"], ["artists", "Artists"], ["playlists", "Playlists"], ["albums", "Albums"]].map(([k, t]) => `<button class="tab ${f === k ? "on" : ""}" data-a="spf" data-v="${k}">${t}</button>`).join("")}</div>`;
      if (sp.err) body = chips + `<div class="note">${esc(sp.err)}</div>`;
      else if (!r) body = chips + loading("Searching…");
      else {
        const n = r.tracks.length + r.artists.length + r.albums.length + r.playlists.length;
        const q = sp.q.trim().toLowerCase();
        const top = [].concat(r.artists, r.playlists, r.albums).find((x) => x.title.toLowerCase() === q) || r.artists[0] || r.playlists[0] || r.tracks[0];
        const sec = (k, title, max) => {
          const L = r[k];
          if (!L.length) return "";
          const list = f === "all" ? L.slice(0, max) : L;
          return `<div class="sh">${title}</div>${k === "tracks" ? `<div class="list">${list.map((t, i) => row(t, i, L, null)).join("")}</div>` : `<div class="${f === "all" ? "srow" : "sgrid"}">${list.map(tile).join("")}</div>`}`;
        };
        body = chips + (!n ? `<div class="note">Nothing found for “${esc(sp.q)}”.</div>`
          : f === "all"
            ? (top ? `<div class="sh">Top result</div><div class="glass stop"><button class="spo" data-a="${top.type === "track" ? "spp" : "spo"}" data-v="${top.type === "track" ? ref({ item: top }) : ref(top)}">${art(top, true)}<span class="st2"><b>${esc(top.title)}</b><small>${esc(top.type === "track" ? "Song · " + top.sub : top.type === "artist" ? "Artist" : top.type === "album" ? "Album · " + top.sub : "Playlist" + (top.sub ? " · " + top.sub : ""))}</small></span></button><button class="splay" data-a="spp" data-v="${ref({ item: top })}" aria-label="Play ${esc(top.title)}">${svg("play", 22, ' fill="currentColor" stroke-width="0"')}</button></div>` : "")
              + sec("tracks", "Songs", 4) + sec("artists", "Artists", 3) + sec("playlists", "Playlists", 3) + sec("albums", "Albums", 3)
            : sec(f, { tracks: "Songs", artists: "Artists", playlists: "Playlists", albums: "Albums" }[f], 999));
      }
    } else {
      const v = sp.view;
      const chips = `<div class="tabs">${[["playlists", "Playlists"], ["liked", svg("heart", 13, ' style="vertical-align:-2px"') + " Liked"], ["recent", "Recent"], ["albums", "Albums"], ["artists", "Artists"]].map(([k, t]) => `<button class="tab ${v === k ? "on" : ""}" data-a="spv" data-v="${k}">${t}</button>`).join("")}</div>`;
      const L = sp.lists[v];
      if (sp.err && !L) body = chips + `<div class="note">${esc(sp.err)}</div>`;
      else if (!L) body = chips + loading("Loading your Spotify…");
      else if (v === "liked" || v === "recent") body = chips + (L.length ? `<div class="list">${L.map((t, i) => row(t, i, L, v === "liked" ? { type: "liked", uri: "", title: "Liked Songs" } : null)).join("")}</div>` : `<div class="note">Nothing here yet.</div>`);
      else {
        const items = v === "playlists" ? [{ type: "liked", uri: "liked", title: "Liked Songs", sub: sp.lists.liked ? sp.lists.liked.length + " songs" : "Your saved songs" }].concat(L) : L;
        body = chips + (items.length ? `<div class="sgrid">${items.map(tile).join("")}</div>` : `<div class="note">Nothing here yet.</div>`);
      }
    }
    const srcs = (as && as.attributes.source_list) || [];
    const tip = dev && !known && srcs.length ? `<div class="note">Spotify doesn't list “${esc(dev)}” by that name. Tap <b>Playing to</b> and pick which Spotify device is this amp (try one, see which amp plays), or set it in the card settings under Spotify.</div>` : "";
    const feat = this.spFeat(acct);
    const wake = asleep && !this.spPlus(acct)
      ? `<div class="glass swake">${svg("speaker", 22)}<div><b>${sp.waking ? "Waking Spotify…" : "Spotify is asleep"}</b><small>${!(feat & 2048) ? "Home Assistant's Spotify integration needs a Spotify Premium account." : "Nothing is playing on your Spotify account, so Home Assistant's Spotify integration won't open your library. Wake it on this amp (it stays paused), or add SpotifyPlus from HACS so this never happens."}</small></div>${feat & 2048 ? `<button class="act on" data-a="spwake"${sp.waking ? " disabled" : ""}>${sp.waking ? "…" : "Wake on " + esc(known ? this.spLabel(dev) : "amp")}</button>` : ""}</div>`
      : "";
    this._spBody = tip + (wake ? wake + body.replace(/<div class="note">[^<]*(Player does not support|can't browse)[\s\S]*?<\/div>/, "").replace(/<div class="empty"[^>]*>Loading your Spotify…<\/div>/, "") : body);
    // a small player while Spotify plays (on any amp)
    const playing = as && (as.state === "playing" || as.state === "paused");
    const a = (as && as.attributes) || {};
    const mini = playing ? `<div class="mini glass">${a.entity_picture ? `<span class="sart"><img src="${esc(a.entity_picture)}" alt=""></span>` : `<span class="sart">${svg("music", 18)}</span>`}<span class="mt"><b>${esc(a.media_title || "Spotify")}</b><small>${esc([a.media_artist, a.source].filter(Boolean).join(" · "))}</small></span><button class="mb" data-a="spm" data-e="${esc(acct)}" data-v="media_play_pause" aria-label="${as.state === "playing" ? "Pause" : "Play"}">${svg(as.state === "playing" ? "pause" : "play", 18)}</button><button class="mb" data-a="spm" data-e="${esc(acct)}" data-v="media_next_track" aria-label="Next">${svg("next", 18)}</button></div>` : "";
    return `${target}${search}<div data-spbody>${this._spBody}</div>${mini}`;
  }
  _spDevSheet() {
    const acct = this.spAcct();
    const s = this.st(acct);
    const names = this.spNames();
    const cur = this.spDevice(this._spAmp);
    const active = s && s.attributes.source;
    const playing = s && s.state === "playing";
    // your amps (by their own name), matched to Spotify's devices
    const mine = [];
    this.spAmps().forEach((amp) => {
      const dev = this.spDevice(amp);
      if (dev && names.indexOf(dev) >= 0 && !mine.some((m) => m.dev === dev)) mine.push({ dev, label: this.name(amp), sub: dev !== this.name(amp) ? "Spotify: " + this.spLabel(dev) : "" });
    });
    mine.sort((x, y) => (y.dev === cur) - (x.dev === cur)); // this room's amp first
    const others = names.filter((n) => !mine.some((m) => m.dev === n));
    const only = arr(this._config && this._config.speakers).length > 0;
    const showOthers = !mine.length || !only || this._spAll || others.indexOf(cur) >= 0;
    const btn = (n, label, sub) => `<button class="${n === cur ? "on" : ""}" data-a="spsel" data-v="${esc(n)}">${svg("speaker", 20)}<span><b>${esc(label)}</b><small>${esc(n === active && playing ? "Playing now" + (sub ? " · " + sub : "") : sub || "Spotify Connect")}</small></span>${n === cur ? svg("check", 18) : ""}</button>`;
    const body = !names.length
      ? `<div class="note">Spotify doesn't list any devices yet. Play something on an amp from the Spotify app once, then try again.</div>`
      : (mine.length ? `<div class="sdh">Your speakers</div>${mine.map((m) => btn(m.dev, m.label, m.sub)).join("")}` : "")
        + (others.length ? (showOthers
          ? `${mine.length ? `<div class="sdh">Other Spotify devices</div>` : ""}${others.map((n) => btn(n, this.spLabel(n), "")).join("")}`
          : `<button class="sdmore" data-a="spall">Show other Spotify devices (${others.length})</button>`) : "");
    return `<div class="sheet" role="dialog" aria-modal="true" aria-label="Play Spotify on"><div class="box">
      <h2>Play Spotify on <button class="iconbtn" data-a="close" aria-label="Close">${svg("close", 18)}</button></h2>
      <div class="sdev">${body}</div>
      <p class="hint2">Music moves to the amp you pick and keeps playing from where it was.</p>
      <p class="hint2" style="opacity:.75">Spotify account: ${esc(acct ? friendly(this._hass, acct) + " · " + acct : "none found")}</p></div></div>`;
  }

  _groupBox(e, roomSpeakers) {
    const g = this.groupInfo(e);
    if (!g) return "";
    const chip = (m) => {
      const ms = this.st(m);
      const k = roomSpeakers.indexOf(m);
      const lead = g.kind === "sync" && m === g.leader;
      const inner = `${ms && ms.state === "playing" ? '<span class="pl"></span>' : ""}${esc(this.name(m))}${lead ? "<i>lead</i>" : ""}`;
      // a speaker in this room: tap to switch to it; otherwise its more-info
      return k >= 0
        ? `<button class="${m === e ? "me" : ""}" data-a="mus" data-v="${k}">${inner}</button>`
        : `<button class="${m === e ? "me" : ""}" data-a="more" data-e="${esc(m)}">${inner}</button>`;
    };
    let head;
    if (g.kind === "group") head = `Speaker group · ${g.members.length} speakers`;
    else if (g.kind === "in") head = `Playing in ${this.name(g.leader)}`;
    else if (g.leader === e) head = `Grouped · leading ${g.members.length - 1} other${g.members.length > 2 ? "s" : ""}`;
    else head = `Grouped · playing with ${this.name(g.leader)}`;
    const leave = g.kind === "sync" && this.canGroup(e)
      ? `<button class="leave" data-a="unjoin" data-e="${esc(e)}">${g.leader === e ? "Ungroup" : "Leave group"}</button>`
      : "";
    return `<div class="grp" role="group" aria-label="Speaker group"><div class="gh">${svg("link", 16)}<span>${esc(head)}</span>${leave}</div><div class="gm">${g.members.map(chip).join("")}</div></div>`;
  }

  _library() {
    const L = this._lib;
    if (!L || (L.loading && !L.items.length)) return `<div class="empty">Loading the library…</div>`;
    const crumb = L.stack.length > 1
      ? `<button class="act" data-a="libback" style="margin-top:14px">${svg("chev", 14, ' style="transform:rotate(90deg)"')} ${esc(L.stack[L.stack.length - 2].title)}</button>`
      : "";
    const head = `<div class="hi" style="margin:14px 4px 0">${esc((L.stack[L.stack.length - 1] || {}).title || "Library")}</div>`;
    if (L.err) return crumb + `<div class="note">${esc(L.err)}</div>`;
    if (!L.items.length) return crumb + head + `<div class="note">Nothing here.</div>`;
    const rows = L.items
      .map((it, i) => {
        const th = it.thumbnail ? `<img src="${esc(it.thumbnail)}" alt="" style="width:100%;height:100%;object-fit:cover">` : svg(it.can_expand ? "music" : "play", 20);
        const right = it.can_play && it.can_expand
          ? `<button class="iconbtn" data-a="libopen" data-v="${i}" aria-label="Open ${esc(it.title)}">${svg("chev", 16, ' style="transform:rotate(-90deg)"')}</button>`
          : "";
        return `<div class="glass item"><button data-a="lib" data-v="${i}" style="all:unset;cursor:pointer;flex:1;min-width:0;display:flex;align-items:center;gap:12px" aria-label="${it.can_play ? "Play" : "Open"} ${esc(it.title)}">
          <span class="ic" style="overflow:hidden;flex:none">${th}</span>
          <span class="nm">${esc(it.title)}</span>
          ${it.can_play ? `<span class="val" style="color:var(--acc)">${svg("play", 16)}</span>` : svg("chev", 16, ' style="transform:rotate(-90deg);opacity:.5"')}
        </button>${right}</div>`;
      })
      .join("");
    return crumb + head + `<div class="list">${rows}</div>`;
  }

  _shades() {
    const one = (e) => {
        const s = this.st(e);
        const pos = s.attributes.current_position;
        const canPos = pos != null && (s.attributes.supported_features & 4) === 4;
        const val = s.state === "opening" ? "Opening…" : s.state === "closing" ? "Closing…" : pos != null ? (pos === 0 ? "Closed" : pos === 100 ? "Open" : pos + "% open") : s.state === "open" ? "Open" : "Closed";
        return `<div class="glass item" style="flex-wrap:wrap">
          <div class="ic">${svg("shades")}</div><div class="nm">${esc(this.name(e))}<div class="val">${esc(val)}</div></div>
          <div class="seg"><button data-a="cover" data-e="${esc(e)}" data-v="open_cover" aria-label="Open ${esc(this.name(e))}">${svg("up", 18)}</button><button data-a="cover" data-e="${esc(e)}" data-v="stop_cover" aria-label="Stop">${svg("stop", 16)}</button><button data-a="cover" data-e="${esc(e)}" data-v="close_cover" aria-label="Close ${esc(this.name(e))}">${svg("down", 18)}</button></div>
          ${canPos ? `<input type="range" min="0" max="100" value="${pos}" data-a="pos" data-e="${esc(e)}" aria-label="${esc(this.name(e))} position">` : ""}
        </div>`;
    };
    const cur = this.room();
    if (!(cur && cur.whole)) return `<div class="list">${this.ents("shades").map(one).join("")}</div>`;
    // Whole house: each room's shades under its name, in your room order.
    // A room's buttons open / stop / close all of its shades; tap the name to fold it.
    const open = this._s.open || {};
    this._shGroups = {};
    const secs = this.rooms()
      .filter((rm) => !rm.whole)
      .map((rm, i) => ({ id: "sh:" + i, name: rm.name, ids: uniq((rm.shades || []).filter((e) => this.has(e))) }))
      .filter((sec) => sec.ids.length);
    const all = uniq([].concat.apply([], secs.map((sec) => sec.ids)));
    this._shGroups.all = all;
    const n = all.filter((e) => this.isOn(e)).length;
    const bar = `<div class="bar"><div class="lbl">${n} of ${all.length} open</div><button class="act on" data-a="covers" data-g="all" data-v="open_cover">Open all</button><button class="act" data-a="covers" data-g="all" data-v="close_cover">Close all</button></div>`;
    return bar + secs.map((sec) => {
      this._shGroups[sec.id] = sec.ids;
      const on = sec.ids.filter((e) => this.isOn(e)).length;
      const shut = !!open[sec.id];
      const rc = on ? on + " of " + sec.ids.length + " open" : sec.ids.length === 1 ? "closed" : sec.ids.length + " shades · all closed";
      return `<section class="rsec" aria-label="${esc(sec.name)}">
        <div class="rsh col">
          <button class="tap" data-a="gopen" data-v="${esc(sec.id)}" aria-expanded="${!shut}"><span class="rl"><span class="rn">${esc(sec.name)}</span><span class="chv ${shut ? "" : "open"}">${svg("chev", 14)}</span></span><span class="rc ${on ? "lit" : ""}">${esc(rc)}</span></button>
          <div class="seg"><button data-a="covers" data-g="${esc(sec.id)}" data-v="open_cover" aria-label="Open all ${esc(sec.name)} shades">${svg("up", 18)}</button><button data-a="covers" data-g="${esc(sec.id)}" data-v="stop_cover" aria-label="Stop ${esc(sec.name)} shades">${svg("stop", 16)}</button><button data-a="covers" data-g="${esc(sec.id)}" data-v="close_cover" aria-label="Close all ${esc(sec.name)} shades">${svg("down", 18)}</button></div>
        </div>
        ${shut ? "" : `<div class="list">${sec.ids.map(one).join("")}</div>`}
      </section>`;
    }).join("");
  }

  _cameras() {
    const list = this.camList();
    if (!list.length) return "";
    const cur = list.find((c) => c.key === this._s.cam) || list[0];
    const rtc = this.rtcOk();
    let hero;
    if (rtc) {
      hero = `<div class="camname"><span class="live"><i></i>LIVE</span><span class="cn">${esc(cur.name)}</span>${cur.entity ? `<button class="iconbtn" data-a="more" data-e="${esc(cur.entity)}" aria-label="More about ${esc(cur.name)}">${svg("expand", 18)}</button>` : ""}</div><div class="camrtc" data-rtc="${esc(cur.key)}"></div>`;
    } else if (cur.entity) {
      hero = `<button class="camhero" data-a="more" data-e="${esc(cur.entity)}" aria-label="Open ${esc(cur.name)} live"><img data-cam="${esc(cur.entity)}" src="${esc(this.camUrl(cur.entity))}" alt=""><span class="live"><i></i>LIVE</span><span class="cap">${esc(cur.name)}<small>Tap for live view</small></span></button>`;
    } else {
      hero = `<div class="camhero"><span class="cap">${esc(cur.name)}</span></div><div class="note">${this.rtcWanted() ? "Install the <b>WebRTC Camera</b> integration (HACS) to watch RTSP cameras here." : "Turn on WebRTC in the card settings to watch RTSP cameras here."}</div>`;
    }
    const tiles = list.length > 1
      ? `<div class="grid">${list.map((c) => `<button class="camsm ${c.key === cur.key ? "sel" : ""}" data-a="cam" data-v="${esc(c.key)}" aria-label="Show ${esc(c.name)}"${c.key === cur.key ? ' aria-current="true"' : ""}>${c.entity ? `<img data-cam="${esc(c.entity)}" src="${esc(this.camUrl(c.entity))}" alt="">` : `<span class="ph">${svg("cam", 30, ' stroke-width="1.5"')}</span>`}<span class="cap">${esc(c.name)}</span></button>`).join("")}</div>`
      : "";
    return hero + tiles;
  }

  _security() {
    const al = this.alarm();
    let top = "";
    if (al) {
      const s = this.st(al);
      const st = s.state;
      const armed = st.indexOf("armed") === 0;
      const sf = s.attributes.supported_features || 0;
      const btns = [];
      if (armed || st === "triggered" || st === "pending" || st === "arming") btns.push(["alarm_disarm", "Disarm"]);
      else {
        if (sf & 1) btns.push(["alarm_arm_home", "Arm home"]);
        if (sf & 2) btns.push(["alarm_arm_away", "Arm away"]);
        if (sf & 4) btns.push(["alarm_arm_night", "Arm night"]);
        if (!btns.length) btns.push(["alarm_arm_away", "Arm"]);
      }
      top = `<div class="glass alarm"><div class="ic ${st === "triggered" ? "warn" : st === "disarmed" ? "ok" : "lit"}">${svg("shield", 32)}</div><div class="st">${esc(this.alarmName(st))}</div><div class="hi">${esc(this.name(al))}</div>
        <div class="row" style="width:100%;grid-template-columns:repeat(${btns.length},minmax(0,1fr))">${btns.map((b) => `<button class="act ${b[0] === "alarm_disarm" ? "" : "on"}" data-a="arm" data-e="${esc(al)}" data-v="${b[0]}">${b[1]}</button>`).join("")}</div></div>`;
    }
    const others = this.ents("security").filter((e) => e !== al);
    const items = others
      .map((e) => {
        const s = this.st(e);
        const d = e.split(".")[0];
        if (d === "lock") {
          const locked = s.state === "locked";
          return `<div class="glass item"><div class="ic ${locked ? "ok" : "warn"}">${svg(locked ? "lock" : "unlock")}</div><div class="nm">${esc(this.name(e))}<div class="val">${locked ? "Locked" : esc(s.state)}</div></div><button class="act ${locked ? "" : "on"}" data-a="lock" data-e="${esc(e)}">${locked ? "Unlock" : "Lock"}</button></div>`;
        }
        const on = s.state === "on" || s.state === "open";
        const dc = s.attributes.device_class;
        const val = dc === "door" || dc === "window" || dc === "opening" || dc === "garage_door" ? (on ? "Open" : "Closed") : dc === "motion" || dc === "occupancy" ? (on ? "Motion" : "Clear") : s.state;
        return `<button class="glass item" data-a="more" data-e="${esc(e)}" style="width:100%;text-align:left"><div class="ic ${on ? "warn" : ""}">${svg("shield")}</div><div class="nm">${esc(this.name(e))}</div><div class="val">${esc(val)}</div></button>`;
      })
      .join("");
    return `${top}${items ? `<div class="list">${items}</div>` : ""}`;
  }

  _garage() {
    const ds = this.doors();
    if (!ds.length) return `<div class="empty">No garage doors yet. Add one in the card settings.</div>`;
    return `<div class="gds">${ds.map((d) => {
      const st = this.doorState(d);
      const nm = (d.name && d.name.trim()) || this.name(d.entity);
      const cls = st.kind === "long" ? "open long" : st.kind;
      return `<button class="gd ${cls}" data-a="gd" data-e="${esc(d.entity)}" data-v="${esc(nm)}" data-hold="${esc(d.sensor && this.has(d.sensor) ? d.sensor : d.entity)}" data-gd="${esc(d.entity)}" data-open="${st.open ? 1 : 0}"
        aria-label="${esc(nm)}, ${esc(st.label.toLowerCase())}. Tap to ${st.open ? "close" : "open"}, hold for details.">
        <span class="gdi">${svg(st.open ? "garageOpen" : "garage", 44, ' stroke-width="1.7"')}</span>
        <span class="gdn">${esc(nm.toUpperCase())}</span>
        <span class="gdl">${esc(st.label)}</span>
      </button>`;
    }).join("")}</div>`;
  }

  // Scenes & Automations, from the Auto & Scenes integration.
  _autoscenes() {
    const A = this._as || {};
    if (!A.ok) return `<div class="empty">Install the Auto &amp; Scenes integration to see your scenes and automations here.</div>`;
    if (this._asEd) return this._asEditor();
    const refs = (this._asRefs = []);
    const ref = (x) => refs.push(x) - 1;
    const v = this._s.asv === "a" ? "a" : "s";
    const seg = `<div class="tabs"><button class="tab ${v === "s" ? "on" : ""}" data-a="asv" data-v="s">Scenes</button><button class="tab ${v === "a" ? "on" : ""}" data-a="asv" data-v="a">Automations</button></div>`;
    const err = A.err ? `<div class="note">${esc(A.err)}</div>` : "";
    if (v === "s") {
      if (!A.scenes) return seg + err + `<div class="empty">Loading scenes…</div>`;
      const tiles = A.scenes.map((it) => {
        const ent = this.asEnt("scene", it);
        const icon = (it.config && it.config.icon) || (ent && this.st(ent) && this.st(ent).attributes.icon) || "mdi:palette";
        const n = Object.keys((it.config && it.config.entities) || {}).length;
        const i = ref(it);
        return `<div class="astile ${this._asHit === it.id ? "hit" : ""}"><button class="astm" data-a="asrun" data-v="${i}" aria-label="Activate ${esc(it.name || "scene")}"><span class="asic">${this.asIcon(icon, 26)}</span><b>${esc(it.name || "Unnamed")}</b><small>${n} device${n === 1 ? "" : "s"}</small></button>${it.editable !== false ? `<button class="ased" data-a="asedit" data-v="${i}" aria-label="Change ${esc(it.name || "scene")}">${svg("pencil", 15)}</button>` : ""}</div>`;
      }).join("");
      return seg + err + `<div class="asgrid">${tiles}<button class="astile new" data-a="asnew"><span class="asic">${svg("plus", 26)}</span><b>New scene</b></button></div>`;
    }
    if (!A.autos) return seg + err + `<div class="empty">Loading automations…</div>`;
    const cards = A.autos.map((it) => {
      const ent = this.asEnt("automation", it);
      const st = ent && this.st(ent);
      const on = !!(st && st.state === "on");
      let sub;
      try { sub = asSummary(it.config || {}, (e) => (e ? this.name(e) : "a device")); } catch (x) { sub = "Advanced automation"; }
      return `<div class="glass ascard"><button class="asm" data-a="asopen" aria-label="Change ${esc(it.name || "automation")} in Auto & Scenes"><span class="asav">${svg("robot", 20)}</span><span class="ast"><b>${esc(it.name || "Unnamed")}</b><small>${esc(sub)}</small><em>${esc(asRan(st && st.attributes.last_triggered))}</em></span></button><div class="asside"><button class="sw ${on ? "on" : ""}" role="switch" aria-checked="${on}" data-a="astog" data-e="${esc(ent || "")}" aria-label="${esc(it.name || "Automation")} ${on ? "off" : "on"}"><i></i></button><button class="asgo" data-a="asgo" data-e="${esc(ent || "")}" aria-label="Run ${esc(it.name || "automation")} now">${svg("play", 15, ' fill="currentColor" stroke-width="0"')}</button></div></div>`;
    }).join("");
    return seg + err + (cards ? `<div class="list">${cards}</div>` : `<div class="note">No automations yet.</div>`) + `<button class="asadd" data-a="asopen">${svg("plus", 16)} New automation</button><p class="asfoot">Tap an automation to change it in Auto &amp; Scenes.</p>`;
  }
  _asEditor() {
    const d = this._asEd;
    const rows = d.entities.map((r, i) => {
      const dom = asDomain(r.entity_id);
      const st = this.st(r.entity_id);
      let opts = AS_SCENE_STATES[dom];
      if (dom === "climate") opts = ((st && st.attributes.hvac_modes) || ["off", "heat", "cool"]).map((x) => [x, x.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase())]);
      opts = opts || [["on", "On"], ["off", "Off"]];
      const slide = (k, label, val, min, max, step, unit) => `<div class="asslab"><span>${label}</span><b data-asout>${val}${unit}</b></div><input type="range" min="${min}" max="${max}" step="${step}" value="${val}" data-a="asval" data-i="${i}" data-k="${k}" aria-label="${esc(this.name(r.entity_id))} ${label.toLowerCase()}">`;
      let extra = "";
      if (dom === "light" && r.state === "on") extra = slide("brightness_pct", "Brightness", r.brightness_pct != null ? r.brightness_pct : 100, 1, 100, 1, "%");
      if (dom === "cover" && r.state === "open") extra = slide("position", "Position", r.position != null ? r.position : 100, 0, 100, 1, "%");
      if (dom === "climate" && r.state !== "off") extra = slide("temperature", "Temperature", r.temperature != null ? r.temperature : 22, 10, 32, 0.5, "°");
      const ic = { light: "bulb", cover: "shades", climate: "thermo", media_player: "speaker", fan: "fan", lock: "lock" }[dom] || "plug";
      return `<div class="glass asblk"><div class="asdh">${svg(ic, 18)}<b>${esc(this.name(r.entity_id))}</b><button class="asdx" data-a="asrm" data-v="${i}" aria-label="Take ${esc(this.name(r.entity_id))} out">${svg("close", 14)}</button></div><div class="asseg">${opts.map(([val, lab]) => `<button class="${r.state === val ? "on" : ""}" data-a="asst" data-v="${i}|${esc(val)}">${esc(lab)}</button>`).join("")}</div>${extra}</div>`;
    }).join("");
    return `<div class="asbar"><button class="act" data-a="asback">${svg("back", 14)} Back</button><b>${d.id ? "Change scene" : "New scene"}</b><button class="act on" data-a="assave">Save</button></div>
      <label class="aslbl" for="asname">Name</label><input id="asname" class="astin glass" data-a="asname" data-keep="1" placeholder="e.g. Movie night" value="${esc(d.name)}" autocomplete="off">
      <div class="aslbl">Icon</div><div class="asicons">${AS_ICONS.map((ic) => `<button class="${d.icon === ic ? "on" : ""}" data-a="asicon" data-v="${esc(ic)}" aria-label="${esc(ic.replace("mdi:", "").replace(/-/g, " "))}">${this.asIcon(ic, 22)}</button>`).join("")}</div>
      <div class="aslbl">Devices in this scene</div>
      ${rows || `<div class="note">Add the lights and devices this scene should set. Tip: set them the way you like first, then tap “Use how they are now”.</div>`}
      <button class="asadd" data-a="asadd">${svg("plus", 16)} Add a device</button>
      ${d.entities.length ? `<div class="astwo"><button class="act" data-a="ascap">${svg("camera", 15)} Use how they are now</button><button class="act" data-a="astry">${svg("eye", 15)} Try it</button></div>` : ""}
      ${d.id ? `<button class="asdel ${this._asConfirm ? "sure" : ""}" data-a="asdel">${svg("trash", 16)} ${this._asConfirm ? "Tap again to delete" : "Delete scene"}</button>` : ""}`;
  }
  _asPickSheet() {
    return `<div class="sheet" role="dialog" aria-modal="true" aria-label="Add a device"><div class="box">
      <h2>Add a device <button class="iconbtn" data-a="close" aria-label="Close">${svg("close", 18)}</button></h2>
      <label class="ssearch glass">${svg("search", 18)}<input type="search" data-a="asq" data-keep="1" autocomplete="off" placeholder="Search" value="${esc(this._asQ || "")}" aria-label="Search devices"></label>
      <div class="sdev" data-aslist style="margin-top:10px">${this._asPickHtml()}</div></div></div>`;
  }

  _utilities() {
    const es = this.ents("utilities");
    return `<div class="bar"><div class="lbl">${es.filter((e) => this.isOn(e)).length} running</div><button class="act" data-a="all" data-v="util" data-on="0">All off</button></div><div class="grid">${es
      .map((e) => {
        const on = this.isOn(e);
        return `<button class="glass card" data-a="toggle" data-e="${esc(e)}" aria-pressed="${on}"><div class="ic ${on ? "lit" : ""}">${svg("plug")}</div><div><div class="t">${esc(this.name(e))}</div><div class="s">${on ? "Running" : "Off"}</div></div></button>`;
      })
      .join("")}</div>`;
  }

  _roomsSheet() {
    const rs = this.rooms();
    const cur = this.room();
    const panels = "";
    return `<div class="sheet" role="dialog" aria-modal="true" aria-label="Choose room"><div class="box">
      <h2>Rooms <button class="iconbtn" data-a="close" aria-label="Close">${svg("close", 18)}</button></h2>
      ${rs.map((r, i) => `<button class="opt ${cur && r.name === cur.name ? "on" : ""}" data-a="room" data-v="${i}">${esc(r.name || "Room " + (i + 1))}</button>`).join("")}
      ${panels}</div></div>`;
  }

  _pinSheet() {
    const p = this._pin;
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "del", "0", "ok"];
    return `<div class="sheet" role="dialog" aria-modal="true" aria-label="Alarm code"><div class="box">
      <h2>Alarm code <button class="iconbtn" data-a="close" aria-label="Cancel">${svg("close", 18)}</button></h2>
      <div class="dots">${Array.from({ length: Math.max(4, p.code.length) }, (_, i) => `<i class="${i < p.code.length ? "f" : ""}"></i>`).join("")}</div>
      <div class="keys">${keys.map((k) => `<button data-a="key" data-v="${k}" aria-label="${k === "del" ? "Delete" : k === "ok" ? "Enter" : k}">${k === "del" ? "⌫" : k === "ok" ? "✓" : k}</button>`).join("")}</div>
    </div></div>`;
  }
}

// --- as a dashboard card -------------------------------------------------------------
// type: custom:ar-control-panel-card
// Set up from the card editor (dropdowns of your Home Assistant entities), or
// in YAML - see the README. With no settings, rooms come from your HA areas.
class ArControlPanelCard extends ArControlPanel {
  setConfig(config) {
    this._config = config || {};
    this._s.panel = 0;
    if (this._hass) this._build();
  }
  getCardSize() { return 14; }
  static getStubConfig() { return {}; }
  static getConfigElement() { return document.createElement("ar-control-panel-card-editor"); }
}

// --- the card editor: everything picked from Home Assistant dropdowns ------------------
const ENT = (domain) => ({ entity: { multiple: true, filter: { domain } } });
const LABELS = {
  title: "Name of your home",
  mode: "Where the rooms come from",
  room_home: "Changing room goes to its Home page (off: stay on the page you're on, e.g. Lights)",
  areas: "Only these areas (in this order, leave empty for all)",
  exclude: "Leave these out",
  light_switches: "Switches that are really lights",
  show_unassigned: "Show an \"Other\" room for things with no area",
  whole_house: "Show a \"Whole house\" room",
  name: "Room name",
  lights: "Lights",
  climate: "Climate (AC, heating)",
  music: "Music (speakers / media players)",
  shades: "Shades, blinds, curtains, gates",
  scenes: "Scenes and scripts (buttons on the Home page)",
  cameras: "Cameras",
  security: "Security (alarm, locks, door and motion sensors)",
  utilities: "Utilities (geyser, pumps, plugs, fans)",
  url: "RTSP link or go2rtc stream name",
  group_lights: "Lights in this group",
  webrtc: "Play cameras live with WebRTC (needs the WebRTC Camera integration)",
  speakers: "Only show these speakers (leave empty for all)",
  sp_entity: "Spotify account (leave empty and it's found by itself)",
  sp_on: "Show Spotify on the Music page",
  gd_name: "Name on the tile (optional)",
  gd_entity: "What opens and closes it (relay switch, cover, button or script)",
  gd_sensor: "Door sensor that says open / closed (optional)",
};
const SPK_SCHEMA = [{ name: "speakers", selector: ENT(["media_player"]) }];
const ED_TABS = [["general", "General"], ["rooms", "Rooms"], ["house", "Whole house"], ["music", "Music"], ["garage", "Garage"], ["cameras", "Cameras"]];
const SP_SCHEMA = [
  { name: "sp_on", selector: { boolean: {} } },
  { name: "sp_entity", selector: { entity: { filter: { domain: ["media_player"] } } } },
];
const GD_SCHEMA = [
  { name: "gd_name", selector: { text: {} } },
  { name: "gd_entity", selector: { entity: { filter: { domain: GD_TAP } } } },
  { name: "gd_sensor", selector: { entity: { filter: { domain: ["binary_sensor"] } } } },
];
// One text box per light, labelled with its Home Assistant name. Empty = keep that name.
const NAME_HINT = "Optional: type a different name to show on the card. Leave empty to keep the Home Assistant name.";
const RTSP_SCHEMA = [
  { name: "name", selector: { text: {} } },
  { name: "url", selector: { text: {} } },
];
const RTC_SCHEMA = [{ name: "webrtc", selector: { boolean: {} } }];
const MODE_SCHEMA = [
  { name: "title", selector: { text: {} } },
  { name: "mode", selector: { select: { mode: "list", options: [
    { value: "manual", label: "I pick my own rooms and entities" },
    { value: "areas", label: "Automatic, from my Home Assistant areas" },
  ] } } },
  { name: "room_home", selector: { boolean: {} } },
];
const AUTO_SCHEMA = [
  { name: "areas", selector: { area: { multiple: true } } },
  { name: "exclude", selector: { entity: { multiple: true } } },
  { name: "light_switches", selector: ENT(["switch"]) },
  { name: "show_unassigned", selector: { boolean: {} } },
  { name: "whole_house", selector: { boolean: {} } },
];
const ROOM_SCHEMA = [
  { name: "name", selector: { text: {} } },
  { name: "lights", selector: ENT(["light", "switch", "input_boolean"]) },
  { name: "climate", selector: ENT(["climate"]) },
  { name: "music", selector: ENT(["media_player"]) },
  { name: "shades", selector: ENT(["cover"]) },
  { name: "scenes", selector: ENT(["scene", "script"]) },
];
const HOUSE_SCHEMA = [
  { name: "cameras", selector: ENT(["camera"]) },
  { name: "security", selector: ENT(["alarm_control_panel", "lock", "binary_sensor"]) },
  { name: "utilities", selector: ENT(["switch", "fan", "water_heater", "input_boolean", "vacuum", "humidifier"]) },
  { name: "whole_house", selector: { boolean: {} } },
];
const ROOM_FIELDS = ["lights", "climate", "music", "shades", "scenes"];
const LGROUP_SCHEMA = [
  { name: "name", selector: { text: {} } },
  { name: "group_lights", selector: ENT(["light", "switch", "input_boolean"]) },
];

const EDITOR_CSS = `
:host{display:block}
.etabs{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;border-bottom:1px solid var(--divider-color,#444);margin:0 0 14px;position:sticky;top:0;z-index:3;background:var(--card-background-color,var(--ha-card-background,#1c1c1c))}
.etabs::-webkit-scrollbar{display:none}
.etabs button{flex:none;background:none;border:0;border-bottom:2px solid transparent;padding:12px 12px;font:inherit;font-size:14px;font-weight:500;color:var(--secondary-text-color);cursor:pointer}
.etabs button.on{color:var(--primary-color);border-bottom-color:var(--primary-color)}
.etabs button:focus-visible{outline:2px solid var(--primary-color);outline-offset:-2px}
.chips{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.chips li{display:flex;align-items:center;height:36px;padding:0 14px;border-radius:18px;border:1px solid var(--divider-color,#444);background:rgba(127,127,127,.08);color:var(--primary-text-color);font-size:14px;cursor:pointer;user-select:none;-webkit-user-select:none;touch-action:pan-y}
.chips li.whole{border-style:dashed}
.chips li.on{border-color:var(--primary-color);background:rgba(3,169,244,.16);font-weight:600}
.chips li.drag{position:relative;z-index:2;box-shadow:0 6px 18px rgba(0,0,0,.35);border-color:var(--primary-color)}
.chips li:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}
.chipbar{display:flex;align-items:center;gap:10px;margin:10px 0 4px;flex-wrap:wrap}
.chipbar span{font-size:12px;color:var(--secondary-text-color)}
.add.mini{width:auto;height:36px;margin:0;padding:0 14px;border-radius:18px;font-size:14px}
.rbody{margin-top:12px;border-top:1px solid var(--divider-color,#444);padding-top:12px}
.rhead2{display:flex;align-items:center;gap:6px;margin-bottom:10px}
.rhead2 b{flex:1;min-width:0;font-size:17px;color:var(--primary-text-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.del{height:34px;padding:0 12px;border-radius:17px;border:1px solid rgba(239,83,80,.5);background:none;color:var(--error-color,#ef5350);font:inherit;font-size:13px;cursor:pointer}
.sec{margin:18px 0 6px;font-size:15px;font-weight:600;color:var(--primary-text-color)}
.hint{margin:0 0 10px;font-size:13px;color:var(--secondary-text-color)}
.room{border:1px solid var(--divider-color,#444);border-radius:12px;padding:10px 12px 12px;margin:10px 0}
.rhead{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.rhead b{flex:1;font-size:14px;color:var(--primary-text-color)}
.ib{width:34px;height:34px;border-radius:50%;border:1px solid var(--divider-color,#444);background:none;color:var(--primary-text-color);cursor:pointer;font-size:15px;line-height:1}
.ib:disabled{opacity:.35;cursor:default}
.room .room{margin:8px 0 0;padding:8px 10px 10px;background:rgba(127,127,127,.06)}
.sub{margin-top:6px;height:38px;font-size:13px}
.olabel{margin:14px 0 0;font-size:13px;font-weight:600;color:var(--primary-text-color)}
.olabel span{font-weight:400;color:var(--secondary-text-color)}
.sort{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-direction:column;gap:6px}
.sort .hint{margin:4px 0}
.sort li{display:flex;align-items:center;gap:4px;min-height:44px;padding-right:10px;border:1px solid var(--divider-color,#444);border-radius:10px;background:var(--card-background-color,#1c1c1c);font-size:14px;color:var(--primary-text-color);user-select:none;-webkit-user-select:none}
.sort li.drag{position:relative;z-index:2;border-color:var(--primary-color);box-shadow:0 6px 18px rgba(0,0,0,.35)}
.sort .t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sort .k{flex:none;font-size:12px;color:var(--secondary-text-color)}
.grip{flex:none;width:44px;height:44px;display:flex;align-items:center;justify-content:center;border:0;background:none;color:var(--secondary-text-color);font-size:20px;cursor:grab;touch-action:none}
.sort li.drag .grip{cursor:grabbing;color:var(--primary-color)}
.names{margin-top:10px;border-top:1px solid var(--divider-color,#444);padding-top:8px}
.names summary{cursor:pointer;font-size:14px;font-weight:600;color:var(--primary-text-color);padding:6px 0}
.names .hint{margin:4px 0 8px}
.add{margin-top:6px;width:100%;height:44px;border-radius:12px;border:1px dashed var(--primary-color);background:none;color:var(--primary-color);font:inherit;font-weight:600;cursor:pointer}
`;

class ArControlPanelCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._cfg = {};
    this._shape = null;
    this._tab = "general";
    this._ri = 0; // the room shown on the Rooms tab
    this._folds = {}; // fold-outs left open
    this._wireSort(this.shadowRoot);
    // tabs and room tabs
    this.shadowRoot.addEventListener("click", (e) => {
      const t = e.target.closest && e.target.closest("[data-tab]");
      if (t) { this._tab = t.getAttribute("data-tab"); this._shape = null; this._render(); return; }
      const r = e.target.closest && e.target.closest("[data-room]");
      if (r && !this._chipDragged) { this._ri = Number(r.getAttribute("data-room")); this._shape = null; this._render(); }
    });
    this.shadowRoot.addEventListener("keydown", (e) => {
      const r = e.target.closest && e.target.closest("[data-room]");
      if (!r) return;
      const i = Number(r.getAttribute("data-room"));
      const n = this._rooms().length;
      let to = null;
      if (e.key === "Enter" || e.key === " ") to = i;
      else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const lis = Array.from(this.shadowRoot.querySelectorAll("ul.chips li[data-room]"));
        const k = lis.indexOf(r) + (e.key === "ArrowRight" ? 1 : -1);
        if (lis[k]) to = Number(lis[k].getAttribute("data-room"));
      }
      if (to == null) return;
      e.preventDefault();
      this._ri = to; this._shape = null; this._render();
      const li = this.shadowRoot.querySelector(`ul.chips li[data-room="${to}"]`);
      if (li) li.focus();
    });
    this.shadowRoot.addEventListener("toggle", (e) => {
      const k = e.target.getAttribute && e.target.getAttribute("data-fold");
      if (k) this._folds[k] = e.target.open;
    }, true);
  }
  setConfig(config) {
    this._cfg = JSON.parse(JSON.stringify(config || {}));
    if (!this._cfg.mode) this._cfg.mode = isManual(this._cfg) ? "manual" : "areas";
    // Only redraw when the layout of the editor changes; otherwise just hand
    // the forms their new values, so typing never loses focus.
    if (this._shapeOf() !== this._shape) this._render();
    else this._feed();
  }
  set hass(h) {
    this._hass = h;
    if (!this._shape) this._render();
    this.shadowRoot.querySelectorAll("ha-form").forEach((f) => (f.hass = h));
    this._refreshSorts();
  }
  connectedCallback() { this._ensure(); }

  // ha-form and the entity dropdowns are loaded lazily by Home Assistant.
  async _ensure() {
    if (customElements.get("ha-form") && customElements.get("ha-selector")) return;
    try {
      const helpers = await window.loadCardHelpers();
      const c = await helpers.createCardElement({ type: "entities", entities: [] });
      if (c && c.constructor.getConfigElement) await c.constructor.getConfigElement();
    } catch (e) { /* older HA: fall through */ }
    this._shape = null;
    this._render();
  }

  _rooms() { return (this._cfg.rooms || []).filter((r) => r && typeof r === "object"); }
  _doors() { return Array.isArray(this._cfg.garage) ? this._cfg.garage.map((d) => (typeof d === "string" ? { entity: d } : d)).filter((d) => d && typeof d === "object") : []; }
  _streams() { return Array.isArray(this._cfg.rtsp) ? this._cfg.rtsp.filter((r) => r && typeof r === "object") : []; }
  _lgs(i) { const r = this._rooms()[i] || {}; return (Array.isArray(r.light_groups) ? r.light_groups : []).filter((g) => g && typeof g === "object"); }
  _shapeOf() { return this._tab + ":" + this._ri + ":" + this._wholeOn() + ":" + this._cfg.mode + ":" + (this._cfg.mode === "manual" ? this._rooms().map((r, i) => this._lgs(i).length).join(",") + "/" + this._rooms().length : 0) + ":" + this._streams().length + ":" + this._doors().length + ":" + this._amps().join(","); }

  // The lights that can be renamed: a room's lights and its groups' lights
  // ("nm:3"), or in automatic mode every light the card found ("nm:auto").
  _nameIds(key) {
    if (key === "nm:auto") {
      const h = this._hass;
      if (!h || !h.states) return [];
      const L = autoLayout(h, this._cfg);
      return uniq([].concat.apply([], L.rooms.map((r) => r.lights)));
    }
    const r = this._rooms()[Number(key.slice(3))] || {};
    return uniq(arr(r.lights).concat([].concat.apply([], this._lgs(Number(key.slice(3))).map((g) => arr(g.lights)))));
  }
  _nameSchema(key) { return this._nameIds(key).map((e) => ({ name: e, selector: { text: {} } })); }
  _nameData(key) {
    const n = this._cfg.names || {};
    const d = {};
    this._nameIds(key).forEach((e) => (d[e] = typeof n[e] === "string" ? n[e] : ""));
    return d;
  }
  _nameBox(key) {
    const box = document.createElement("details");
    box.className = "names";
    box.setAttribute("data-fold", key);
    box.open = !!this._folds[key];
    box.innerHTML = `<summary>✏️ Rename lights (optional)</summary><p class="hint"></p>`;
    box.querySelector("p").textContent = NAME_HINT;
    const f = this._form(key, this._nameSchema(key), this._nameData(key));
    f.computeLabel = (s) => (this._hass ? friendly(this._hass, s.name) : s.name);
    f.computeHelper = (s) => s.name;
    box.appendChild(f);
    const none = document.createElement("p");
    none.className = "hint none";
    none.textContent = "Pick some lights above first.";
    box.appendChild(none);
    none.hidden = this._nameIds(key).length > 0;
    return box;
  }

  // --- drag to reorder: rooms ("rooms"), a room's lights ("lo:3"), or in
  // automatic mode an area's lights ("la:<area id>") ---------------------------------
  _nm(e) {
    const own = this._cfg.names && this._cfg.names[e];
    return typeof own === "string" && own.trim() ? own.trim() : friendly(this._hass, e);
  }
  _autoRooms() {
    const h = this._hass;
    return h && h.states ? autoLayout(h, this._cfg).rooms : [];
  }
  _orderItems(okey) {
    const h = this._hass;
    if (!h || !h.states) return [];
    const lightRow = (x) => (x.g
      ? { key: x.key, label: x.g.name, note: (x.g.entity ? "HA group · " : "Group · ") + x.g.ids.length + (x.g.ids.length === 1 ? " light" : " lights"), group: true }
      : { key: x.key, label: this._nm(x.e) });
    if (okey === "rooms") {
      const list = this._cfg.mode === "manual"
        ? this._rooms().map((r, i) => ({ key: String(i), label: r.name || "Room " + (i + 1) }))
        : this._autoRooms().map((r) => ({ key: r.key, label: r.name }));
      if (this._wholeOn()) list.splice(this._wholeAt(list.length), 0, { key: "_whole", label: "🏠 Whole house", note: "everything" });
      return list;
    }
    if (okey.indexOf("lo:") === 0) {
      const i = Number(okey.slice(3));
      const r = this._rooms()[i] || {};
      const gs = this._lgs(i).map((g, j) => ({ id: i + ":" + j, name: g.name || "Group " + (j + 1), lights: arr(g.lights) }));
      const lights = uniq(arr(r.lights).concat([].concat.apply([], gs.map((g) => g.lights))));
      return roomLightItems(h, lights, gs, r.light_order, (e) => this._nm(e)).items.map(lightRow);
    }
    if (okey.indexOf("la:") === 0) {
      const r = this._autoRooms().find((x) => x.key === okey.slice(3));
      return r ? roomLightItems(h, r.lights, [], r.order, (e) => this._nm(e)).items.map(lightRow) : [];
    }
    return [];
  }
  _wholeOn() { return this._cfg.whole_house !== false; }
  _wholeAt(n) { const a = Number(this._cfg.whole_house_at); return Number.isFinite(a) && a >= 0 ? Math.min(Math.floor(a), n) : n; }
  _setOrder(okey, keys) {
    const c = this._cfg;
    if (okey === "rooms") {
      // Whole house: remember how many rooms come before it (at the end = the default)
      const w = keys.indexOf("_whole");
      if (w >= 0) {
        keys = keys.filter((k) => k !== "_whole");
        if (w >= keys.length) delete c.whole_house_at; else c.whole_house_at = w;
      }
    }
    if (okey === "rooms" && c.mode === "manual") {
      const rooms = this._rooms();
      c.rooms = keys.map((k) => rooms[Number(k)]).filter(Boolean);
      this._ri = this._ri < 0 ? -1 : Math.max(0, keys.indexOf(String(this._ri)));
      this._shape = null; // the room boxes move too: redraw
      this._emit();
      this._render();
      return;
    }
    if (okey === "rooms") c.room_order = keys;
    else if (okey.indexOf("lo:") === 0) {
      const i = Number(okey.slice(3));
      const rooms = this._rooms();
      rooms[i] = Object.assign({}, rooms[i], { light_order: keys });
      c.rooms = rooms;
    } else if (okey.indexOf("la:") === 0) {
      c.light_order = Object.assign({}, c.light_order && typeof c.light_order === "object" ? c.light_order : {}, { [okey.slice(3)]: keys });
    }
    this._emit();
  }
  _sortList(okey) {
    const ul = document.createElement("ul");
    ul.className = "sort";
    ul.setAttribute("data-o", okey);
    this._fillSort(ul);
    return ul;
  }
  _fillSort(ul) {
    const items = this._orderItems(ul.getAttribute("data-o"));
    const sig = JSON.stringify(items);
    if (ul._sig === sig) return;
    ul._sig = sig;
    ul.innerHTML = "";
    if (!items.length) {
      ul.innerHTML = `<p class="hint">Pick some lights above first.</p>`;
      return;
    }
    items.forEach((it) => {
      const li = document.createElement("li");
      li.setAttribute("data-key", it.key);
      li.innerHTML = `<button class="grip" type="button" title="Drag to move">⠿</button><span class="t"></span><span class="k"></span>`;
      li.querySelector(".t").textContent = (it.group ? "💡 " : "") + it.label;
      li.querySelector(".k").textContent = it.note || "";
      li.querySelector(".grip").setAttribute("aria-label", "Move " + it.label + " (drag, or use the up and down arrow keys)");
      ul.appendChild(li);
    });
  }
  _refreshSorts() {
    if (this._dragging) return; // never redraw a list under the finger
    this.shadowRoot.querySelectorAll("ul.sort").forEach((ul) => this._fillSort(ul));
    const box = this.shadowRoot.querySelector("[data-autolights]");
    if (box) {
      const rooms = this._autoRooms().filter((r) => r.lights.length);
      const sig = rooms.map((r) => r.key + "=" + r.name).join("|");
      if (box._sig !== sig) {
        box._sig = sig;
        box.innerHTML = "";
        rooms.forEach((r) => {
          const h = document.createElement("div");
          h.className = "olabel";
          h.textContent = r.name;
          box.appendChild(h);
          box.appendChild(this._sortList("la:" + r.key));
        });
        if (!rooms.length) box.innerHTML = `<p class="hint">No lights found yet.</p>`;
      }
    }
  }
  // Pointer events, so dragging works with a mouse and on a phone. The grip
  // takes the touch (touch-action:none) so the rest of the list still scrolls.
  _wireSort(root) {
    const keysOf = (ul) => Array.from(ul.children).filter((x) => x.tagName === "LI").map((x) => x.getAttribute("data-key"));
    // room tabs: tap selects, drag sideways reorders
    root.addEventListener("pointerdown", (ev) => {
      const chip = ev.target.closest && ev.target.closest("ul.chips li");
      if (!chip || (ev.button != null && ev.button > 0)) return;
      const ul = chip.parentNode;
      const id = ev.pointerId;
      const x0 = ev.clientX;
      const y0 = ev.clientY;
      const before = keysOf(ul).join("\n");
      let on = false;
      this._chipDragged = false;
      const move = (e) => {
        if (e.pointerId !== id) return;
        if (!on) {
          if (Math.abs(e.clientX - x0) + Math.abs(e.clientY - y0) < 8) return;
          on = true;
          this._dragging = true;
          chip.classList.add("drag");
        }
        e.preventDefault();
        let ref = null;
        for (const s of Array.from(ul.children)) {
          if (s === chip || s.tagName !== "LI") continue;
          const r = s.getBoundingClientRect();
          if (e.clientY < r.top || (e.clientY <= r.bottom && e.clientX < r.left + r.width / 2)) { ref = s; break; }
        }
        if (ref !== chip.nextSibling && ref !== chip) ul.insertBefore(chip, ref);
      };
      const end = (e) => {
        if (e && e.pointerId !== id) return;
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
        if (!on) return;
        chip.classList.remove("drag");
        this._dragging = false;
        this._chipDragged = true;
        setTimeout(() => (this._chipDragged = false), 0);
        const after = keysOf(ul);
        if (after.join("\n") !== before) this._setOrder("rooms", after);
      };
      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
    });
    root.addEventListener("pointerdown", (ev) => {
      const grip = ev.target.closest && ev.target.closest(".grip");
      if (!grip || (ev.button != null && ev.button > 0)) return;
      const li = grip.parentNode;
      const ul = li.parentNode;
      ev.preventDefault();
      const id = ev.pointerId;
      const before = keysOf(ul).join("\n");
      this._dragging = true;
      li.classList.add("drag");
      // Listen on the window: the row moves in the page while dragging, which
      // would drop a pointer capture on the grip.
      const move = (e) => {
        if (e.pointerId !== id) return;
        e.preventDefault();
        const y = e.clientY;
        const x = e.clientX;
        const wide = ul.classList.contains("chips");
        let ref = null;
        for (const s of Array.from(ul.children)) {
          if (s === li || s.tagName !== "LI") continue;
          const r = s.getBoundingClientRect();
          if (wide ? y < r.top || (y <= r.bottom && x < r.left + r.width / 2) : y < r.top + r.height / 2) { ref = s; break; }
        }
        if (ref !== li.nextSibling && ref !== li) ul.insertBefore(li, ref);
      };
      const end = (e) => {
        if (e && e.pointerId !== id) return;
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
        li.classList.remove("drag");
        this._dragging = false;
        const after = keysOf(ul);
        if (after.join("\n") !== before) { ul._sig = null; this._setOrder(ul.getAttribute("data-o"), after); }
      };
      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
    });
    root.addEventListener("keydown", (ev) => {
      const grip = ev.target.closest && ev.target.closest(".grip");
      if (!grip || (ev.key !== "ArrowUp" && ev.key !== "ArrowDown")) return;
      ev.preventDefault();
      const li = grip.parentNode;
      const ul = li.parentNode;
      const sib = ev.key === "ArrowUp" ? li.previousElementSibling : li.nextElementSibling;
      if (!sib) return;
      ul.insertBefore(li, ev.key === "ArrowUp" ? sib : sib.nextSibling);
      grip.focus();
      const okey = ul.getAttribute("data-o");
      ul._sig = null;
      this._setOrder(okey, keysOf(ul));
      // after a redraw (rooms), put the focus back on the moved row
      const again = this.shadowRoot.querySelector(`ul.sort[data-o="${okey}"] li:nth-child(${Array.from(ul.children).indexOf(li) + 1}) .grip`);
      if (again) again.focus();
    });
  }

  _form(key, schema, data) {
    const f = document.createElement("ha-form");
    f.hass = this._hass;
    f.schema = schema;
    f.data = data;
    f.computeLabel = (s) => LABELS[s.name] || s.name;
    f.setAttribute("data-k", key);
    f.addEventListener("value-changed", (ev) => { ev.stopPropagation(); this._changed(key, ev.detail.value); });
    return f;
  }
  _data(key) {
    const c = this._cfg;
    if (key === "mode") return { title: c.title || "", mode: c.mode, room_home: !!c.room_home };
    if (key === "auto") return { areas: arr(c.areas), exclude: arr(c.exclude), light_switches: arr(c.light_switches), show_unassigned: c.show_unassigned !== false, whole_house: c.whole_house !== false };
    if (key === "house") return { cameras: arr(c.cameras), security: arr(c.security), utilities: arr(c.utilities), whole_house: c.whole_house !== false };
    if (key === "rtc") return { webrtc: c.webrtc !== false };
    if (key.indexOf("lg:") === 0) {
      const [, i, j] = key.split(":").map(Number);
      const g = this._lgs(i)[j] || {};
      return { name: g.name || "", group_lights: arr(g.lights) };
    }
    if (key === "spk") return { speakers: arr(c.speakers) };
    if (key === "sp") {
      const sp = c.spotify;
      return { sp_on: sp !== false && !(sp && sp.enabled === false), sp_entity: (sp && typeof sp === "object" && sp.entity) || (typeof sp === "string" ? sp : "") };
    }
    if (key === "spd") {
      const m = (c.spotify && typeof c.spotify === "object" && c.spotify.devices) || {};
      const d = {};
      this._amps().forEach((e) => (d[e] = typeof m[e] === "string" ? m[e] : ""));
      return d;
    }
    if (key.indexOf("gd:") === 0) {
      const d = this._doors()[Number(key.slice(3))] || {};
      return { gd_name: d.name || "", gd_entity: d.entity || "", gd_sensor: d.sensor || "" };
    }
    if (key.indexOf("rtsp:") === 0) {
      const r = this._streams()[Number(key.slice(5))] || {};
      return { name: r.name || "", url: r.url || "" };
    }
    const r = this._rooms()[Number(key.slice(5))] || {};
    const d = { name: r.name || "" };
    ROOM_FIELDS.forEach((k) => (d[k] = arr(r[k])));
    return d;
  }
  _feed() {
    this.shadowRoot.querySelectorAll("ha-form").forEach((f) => {
      const k = f.getAttribute("data-k");
      if (k.indexOf("nm:") === 0) {
        // the list of lights may have changed: give the rename box its new rows
        const ids = this._nameIds(k);
        if (ids.join() !== f.schema.map((s) => s.name).join()) f.schema = this._nameSchema(k);
        f.data = this._nameData(k);
        const none = f.parentNode && f.parentNode.querySelector(".none");
        if (none) none.hidden = ids.length > 0;
        return;
      }
      f.data = this._data(k);
    });
    this.shadowRoot.querySelectorAll("ha-form").forEach((f) => {
      const k = f.getAttribute("data-k");
      if (k.indexOf("nm:") === 0) return;
      const b = f.parentNode && f.parentNode.classList && f.parentNode.classList.contains("room") ? f.parentNode.querySelector(".rhead b") : null;
      if (!b) return;
      const i = Number(k.split(":")[1]);
      if (k.indexOf("gd:") === 0) {
        const d = this._doors()[i] || {};
        b.textContent = "🚗 " + (d.name || (d.entity && this._hass ? friendly(this._hass, d.entity) : "") || "Garage door " + (i + 1));
        return;
      }
      if (k.indexOf("lg:") === 0) {
        const [, gi, gj] = k.split(":").map(Number);
        b.textContent = "💡 " + ((this._lgs(gi)[gj] || {}).name || "Group " + (gj + 1));
        return;
      }
      b.textContent = k.indexOf("rtsp:") === 0 ? (this._streams()[i] || {}).name || "Camera " + (i + 1) : (this._rooms()[i] || {}).name || "Room " + (i + 1);
    });
    this.shadowRoot.querySelectorAll("ul.chips li[data-room]").forEach((li) => {
      const i = Number(li.getAttribute("data-room"));
      if (i < 0) return;
      li.textContent = (this._rooms()[i] || {}).name || "Room " + (i + 1);
    });
    const rn = this.shadowRoot.querySelector("[data-roomname]");
    if (rn) rn.textContent = (this._rooms()[this._ri] || {}).name || "Room " + (this._ri + 1);
    this._refreshSorts();
  }

  _changed(key, v) {
    const c = this._cfg;
    if (key.indexOf("nm:") === 0) {
      const names = Object.assign({}, c.names);
      this._nameIds(key).forEach((e) => {
        const t = typeof v[e] === "string" ? v[e] : "";
        if (t.trim()) names[e] = t; else delete names[e];
      });
      if (Object.keys(names).length) c.names = names; else delete c.names;
      this._emit();
      return;
    }
    if (key === "mode") {
      if (v.title) c.title = v.title; else delete c.title;
      if (v.room_home) c.room_home = true; else delete c.room_home;
      if (v.mode !== c.mode) {
        c.mode = v.mode;
        if (v.mode === "manual" && !this._rooms().length) this._prefill();
      }
    } else if (key.indexOf("lg:") === 0) {
      const [, i, j] = key.split(":").map(Number);
      const rooms = this._rooms();
      const gs = this._lgs(i);
      const was = (gs[j] || {}).name || "";
      gs[j] = { name: v.name || "", lights: arr(v.group_lights) };
      rooms[i] = Object.assign({}, rooms[i], { light_groups: gs });
      // a renamed group keeps its place in the light order
      if (was !== gs[j].name && arr(rooms[i].light_order).indexOf("group:" + was) >= 0)
        rooms[i].light_order = arr(rooms[i].light_order).map((k) => (k === "group:" + was ? "group:" + gs[j].name : k));
      c.rooms = rooms;
    } else if (key === "rtc") {
      if (v.webrtc === false) c.webrtc = false; else delete c.webrtc;
    } else if (key === "spk") {
      if (arr(v.speakers).length) c.speakers = arr(v.speakers); else delete c.speakers;
    } else if (key === "sp" || key === "spd") {
      const old = c.spotify;
      const sp = old && typeof old === "object" ? Object.assign({}, old) : typeof old === "string" ? { entity: old } : {};
      if (key === "sp") {
        if (v.sp_entity) sp.entity = v.sp_entity; else delete sp.entity;
        if (v.sp_on === false) sp.enabled = false; else delete sp.enabled;
      } else {
        const m = Object.assign({}, sp.devices);
        this._amps().forEach((e) => { const t = typeof v[e] === "string" ? v[e] : ""; if (t.trim()) m[e] = t; else delete m[e]; });
        if (Object.keys(m).length) sp.devices = m; else delete sp.devices;
      }
      if (Object.keys(sp).length) c.spotify = sp; else delete c.spotify;
    } else if (key.indexOf("gd:") === 0) {
      const list = this._doors();
      const d = { entity: v.gd_entity || "" };
      if (v.gd_sensor) d.sensor = v.gd_sensor;
      if (v.gd_name) d.name = v.gd_name;
      const old = list[Number(key.slice(3))] || {};
      if (old.alert_minutes) d.alert_minutes = old.alert_minutes;
      list[Number(key.slice(3))] = d;
      c.garage = list;
    } else if (key.indexOf("rtsp:") === 0) {
      const list = this._streams();
      list[Number(key.slice(5))] = { name: v.name || "", url: (v.url || "").trim() };
      c.rtsp = list;
    } else if (key === "auto" || key === "house") {
      Object.keys(v).forEach((k) => {
        const val = v[k];
        if ((Array.isArray(val) && !val.length) || val === "" || val == null || (typeof val === "boolean" && val)) delete c[k];
        else c[k] = val;
      });
    } else {
      const i = Number(key.slice(5));
      const rooms = this._rooms();
      const room = Object.assign({}, rooms[i], v);
      ROOM_FIELDS.forEach((k) => { if (Array.isArray(room[k]) && !room[k].length) delete room[k]; });
      rooms[i] = room;
      c.rooms = rooms;
    }
    this._emit();
  }

  // First switch to "I pick": start from what the automatic mode would show,
  // so nothing has to be added from scratch.
  _prefill() {
    const h = this._hass;
    const L = h && h.states ? autoLayout(h, Object.assign({}, this._cfg, { rooms: [] })) : { rooms: [], cameras: [], security: [], utilities: [], garage: [] };
    this._cfg.rooms = L.rooms.map((r) => {
      const o = { name: r.name };
      ROOM_FIELDS.forEach((k) => { if (r[k].length) o[k] = r[k].slice(); });
      return o;
    });
    if (!this._cfg.rooms.length) this._cfg.rooms = [{ name: "Lounge" }];
    ["cameras", "security", "utilities"].forEach((k) => { if (L[k].length) this._cfg[k] = L[k].slice(); });
    if (!this._cfg.garage && L.garage && L.garage.length) this._cfg.garage = L.garage.map((d) => ({ entity: d.entity }));
  }

  _room(op, i) {
    const rooms = this._rooms();
    if (op === "add") { rooms.push({ name: "Room " + (rooms.length + 1) }); this._ri = rooms.length - 1; }
    else if (op === "del") { rooms.splice(i, 1); this._ri = Math.max(0, Math.min(i, rooms.length - 1)); }
    else if (op === "up" && i > 0) { rooms.splice(i - 1, 0, rooms.splice(i, 1)[0]); this._ri = i - 1; }
    else if (op === "down" && i < rooms.length - 1) { rooms.splice(i + 1, 0, rooms.splice(i, 1)[0]); this._ri = i + 1; }
    this._cfg.rooms = rooms;
    this._shape = null; // order or count changed: redraw
    this._emit();
    this._render();
  }

  _lg(op, i, j) {
    const rooms = this._rooms();
    const gs = this._lgs(i);
    if (op === "add") gs.push({ name: "Group " + (gs.length + 1), lights: [] });
    else gs.splice(j, 1);
    const r = Object.assign({}, rooms[i]);
    if (gs.length) r.light_groups = gs; else delete r.light_groups;
    rooms[i] = r;
    this._cfg.rooms = rooms;
    this._shape = null;
    this._emit();
    this._render();
  }

  _stream(op, i) {
    const list = this._streams();
    if (op === "add") list.push({ name: "Camera " + (list.length + 1), url: "" });
    else list.splice(i, 1);
    if (list.length) this._cfg.rtsp = list; else delete this._cfg.rtsp;
    this._shape = null;
    this._emit();
    this._render();
  }

  _door(op, i) {
    const list = this._doors();
    if (op === "add") list.push({ entity: "" });
    else list.splice(i, 1);
    if (list.length) this._cfg.garage = list; else delete this._cfg.garage;
    this._shape = null;
    this._emit();
    this._render();
  }
  // The amps (speakers) on the Music pages, for matching to Spotify Connect.
  _amps() {
    const h = this._hass;
    if (!h || !h.states) return [];
    const reg = h.entities || {};
    const rooms = this._cfg.mode === "manual" ? this._rooms().map((r) => ({ music: arr(r.music) })) : autoLayout(h, this._cfg).rooms;
    const only = arr(this._cfg.speakers);
    return uniq([].concat.apply([], rooms.map((r) => r.music || []))).filter((e) => h.states[e] && !["spotify", "spotifyplus"].includes((reg[e] || {}).platform) && (!only.length || only.indexOf(e) >= 0));
  }
  _spAccount() {
    const h = this._hass;
    const sp = this._cfg.spotify;
    if (!h || !h.states || sp === false || (sp && sp.enabled === false)) return null;
    const want = typeof sp === "string" ? sp : sp && sp.entity;
    if (want) return h.states[want] ? want : null;
    return spFind(h);
  }
  _spSection(root, add) {
    add(`<div class="sec">Spotify</div>`);
    const acct = this._spAccount();
    const h = this._hass;
    const plus = acct && h.services && h.services.spotifyplus && ((h.entities || {})[acct] || {}).platform === "spotifyplus";
    const hint = document.createElement("p");
    hint.className = "hint";
    hint.setAttribute("data-sphint", "");
    hint.textContent = !acct
      ? "No Spotify account found yet. Add the SpotifyPlus integration (HACS, recommended, it can search) or Home Assistant's Spotify integration; it needs Spotify Premium."
      : plus
        ? "Using " + friendly(h, acct) + " (" + acct + ", SpotifyPlus): search, playlists, liked songs and recent plays on the Music page."
        : "Using " + friendly(h, acct) + " (" + acct + (((h.entities || {})[acct] || {}).platform ? ", from " + h.entities[acct].platform : "") + "). Playlists, liked songs and recent plays work; for search, add SpotifyPlus from HACS. If that's not your Spotify account, pick the right one below.";
    root.appendChild(hint);
    root.appendChild(this._form("sp", SP_SCHEMA, this._data("sp")));
    const box = this._fold("spd", "");
    const list = (acct && h.states[acct].attributes.source_list) || [];
    box.innerHTML = `<summary>🔊 Match amps to Spotify Connect (optional)</summary><p class="hint"></p>`;
    box.querySelector("p").textContent = "The card matches each amp to its Spotify Connect device by name. When Spotify lists devices by a code instead of a name, pick the right one for each amp here (not sure which? choose one under Playing to on the card and listen which amp plays).";
    const short = (n) => (/^[0-9a-f]{24,}$/i.test(n) ? "Spotify device " + n.slice(0, 4) + "…" + n.slice(-4) : n);
    const sel = list.length ? { select: { mode: "dropdown", custom_value: true, options: list.map((n) => ({ value: n, label: short(n) })) } } : { text: {} };
    const f = this._form("spd", this._amps().map((e) => ({ name: e, selector: sel })), this._data("spd"));
    f.computeLabel = (sc) => friendly(h, sc.name);
    box.appendChild(f);
    root.appendChild(box);
  }

  _garageSection(root, add) {
    add(`<div class="sec">Garage doors</div>`);
    add(`<p class="hint">Add a garage door and a Garage page appears, in every room and on Whole house. Tap a door to open or close it, hold it for details. Pick the sensor too, so the card knows if it's open (it turns red after 10 minutes open).</p>`);
    this._doors().forEach((d, i) => {
      const box = document.createElement("div");
      box.className = "room";
      box.innerHTML = `<div class="rhead"><b></b><button class="ib" title="Remove garage door">✕</button></div>`;
      box.querySelector("b").textContent = "🚗 " + (d.name || (d.entity && this._hass ? friendly(this._hass, d.entity) : "") || "Garage door " + (i + 1));
      box.querySelector("button").addEventListener("click", () => this._door("del", i));
      box.appendChild(this._form("gd:" + i, GD_SCHEMA, this._data("gd:" + i)));
      root.appendChild(box);
    });
    add(`<button class="add" data-add="gd">+ Add a garage door</button>`);
    root.querySelector('[data-add="gd"]').addEventListener("click", () => this._door("add"));
  }

  _camSection(root, add) {
    add(`<div class="sec">RTSP cameras</div>`);
    add(`<p class="hint">Cameras that aren't in Home Assistant. Paste the RTSP link (rtsp://user:pass@ip:554/...) or, to keep the password out of the dashboard, the name of a stream you've set up in WebRTC / go2rtc.</p>`);
    this._streams().forEach((r, i) => {
      const box = document.createElement("div");
      box.className = "room";
      box.innerHTML = `<div class="rhead"><b></b><button class="ib" title="Remove camera">✕</button></div>`;
      box.querySelector("b").textContent = r.name || "Camera " + (i + 1);
      box.querySelector("button").addEventListener("click", () => this._stream("del", i));
      box.appendChild(this._form("rtsp:" + i, RTSP_SCHEMA, this._data("rtsp:" + i)));
      root.appendChild(box);
    });
    add(`<button class="add" data-add="cam">+ Add an RTSP camera</button>`);
    root.querySelector('[data-add="cam"]').addEventListener("click", () => this._stream("add"));
    root.appendChild(this._form("rtc", RTC_SCHEMA, this._data("rtc")));
  }

  _emit() {
    const out = Object.assign({}, this._cfg);
    if (out.mode === "areas" && !isManual(Object.assign({}, out, { mode: undefined }))) delete out.mode; // the default
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: out }, bubbles: true, composed: true }));
  }

  _fold(key, title) {
    const d = document.createElement("details");
    d.className = "names";
    d.setAttribute("data-fold", key);
    d.open = !!this._folds[key];
    d.innerHTML = `<summary></summary>`;
    d.querySelector("summary").textContent = title;
    return d;
  }

  _render() {
    if (!this._hass) return;
    const manual = this._cfg.mode === "manual";
    const rooms = this._rooms();
    if (this._ri >= rooms.length || (this._ri === -1 && !this._wholeOn())) this._ri = Math.max(0, rooms.length - 1);
    this._shape = this._shapeOf();
    const root = this.shadowRoot;
    root.innerHTML = `<style>${EDITOR_CSS}</style>`;
    const add = (html) => { const d = document.createElement("div"); d.innerHTML = html; root.appendChild(d.firstElementChild); };
    // tabs along the top
    add(`<div class="etabs" role="tablist">${ED_TABS.map(([k, t]) => `<button role="tab" data-tab="${k}" aria-selected="${this._tab === k}" class="${this._tab === k ? "on" : ""}">${t}</button>`).join("")}</div>`);
    const tab = this._tab;

    if (tab === "general") {
      root.appendChild(this._form("mode", MODE_SCHEMA, this._data("mode")));
      add(`<p class="hint">${manual ? "Set up each room on the <b>Rooms</b> tab." : "Each Home Assistant area becomes a room. Choose “I pick my own rooms and entities” to choose every light, AC, speaker and blind yourself."}</p>`);
    }

    if (tab === "rooms" && !manual) {
      add(`<div class="sec">Automatic rooms</div>`);
      root.appendChild(this._form("auto", AUTO_SCHEMA, this._data("auto")));
      add(`<div class="sec">Room order</div>`);
      add(`<p class="hint">Drag ⠿ to put your rooms in the order you want.</p>`);
      root.appendChild(this._sortList("rooms"));
      const lo = this._fold("autolo", "↕ Order of lights in each room");
      lo.insertAdjacentHTML("beforeend", `<p class="hint">Drag ⠿ to move a light or light group up or down in its room.</p><div data-autolights></div>`);
      root.appendChild(lo);
      root.appendChild(this._nameBox("nm:auto"));
    }

    if (tab === "rooms" && manual) {
      // one tab per room; tap to open it, drag sideways to reorder
      const chips = document.createElement("ul");
      chips.className = "chips";
      chips.setAttribute("aria-label", "Rooms");
      const wli = document.createElement("li");
      if (this._wholeOn()) {
        wli.setAttribute("data-room", "-1");
        wli.setAttribute("data-key", "_whole");
        wli.setAttribute("role", "tab");
        wli.setAttribute("tabindex", "0");
        wli.setAttribute("aria-selected", String(this._ri === -1));
        wli.className = "whole" + (this._ri === -1 ? " on" : "");
        wli.textContent = "🏠 Whole house";
      }
      rooms.forEach((r, i) => {
        if (this._wholeOn() && i === this._wholeAt(rooms.length)) chips.appendChild(wli);
        const li = document.createElement("li");
        li.setAttribute("data-room", i);
        li.setAttribute("data-key", String(i));
        li.setAttribute("role", "tab");
        li.setAttribute("tabindex", "0");
        li.setAttribute("aria-selected", String(i === this._ri));
        if (i === this._ri) li.className = "on";
        li.textContent = r.name || "Room " + (i + 1);
        chips.appendChild(li);
      });
      if (this._wholeOn() && this._wholeAt(rooms.length) >= rooms.length) chips.appendChild(wli);
      root.appendChild(chips);
      add(`<div class="chipbar"><button class="add mini" data-add="room">+ Room</button><span>Tap a room to set it up · drag a room sideways to change the order</span></div>`);
      root.querySelector('[data-add="room"]').addEventListener("click", () => this._room("add"));
      const i = this._ri;
      const r = rooms[i];
      if (i === -1) {
        add(`<div class="rbody"><div class="rhead2"><b>🏠 Whole house</b></div><p class="hint">Shows everything from all your rooms together. Drag its tab to put it first, in between, or last; that's where it sits in the card's room list too. To hide it, turn off “Show a ‘Whole house’ room” on the Whole house tab.</p></div>`);
      } else if (r) {
        const box = document.createElement("div");
        box.className = "rbody";
        box.innerHTML = `<div class="rhead2"><b data-roomname></b>
          <button class="ib" data-op="up" title="Move earlier" aria-label="Move room earlier"${i === 0 ? " disabled" : ""}>←</button>
          <button class="ib" data-op="down" title="Move later" aria-label="Move room later"${i === rooms.length - 1 ? " disabled" : ""}>→</button>
          <button class="del" data-op="del">Delete room</button></div>`;
        box.querySelector("[data-roomname]").textContent = r.name || "Room " + (i + 1);
        box.querySelectorAll("[data-op]").forEach((b) => b.addEventListener("click", () => this._room(b.getAttribute("data-op"), i)));
        box.appendChild(this._form("room:" + i, ROOM_SCHEMA, this._data("room:" + i)));
        // light groups
        const lgs = this._lgs(i);
        const gf = this._fold("lg:" + i, "💡 Light groups" + (lgs.length ? " (" + lgs.length + ")" : ""));
        gf.insertAdjacentHTML("beforeend", `<p class="hint">Several lights shown as one tile that opens into a list (e.g. Downlights).</p>`);
        lgs.forEach((g, j) => {
          const sub = document.createElement("div");
          sub.className = "room";
          sub.innerHTML = `<div class="rhead"><b></b><button class="ib" title="Remove light group">✕</button></div>`;
          sub.querySelector("b").textContent = "💡 " + (g.name || "Group " + (j + 1));
          sub.querySelector("button").addEventListener("click", () => this._lg("del", i, j));
          sub.appendChild(this._form("lg:" + i + ":" + j, LGROUP_SCHEMA, this._data("lg:" + i + ":" + j)));
          gf.appendChild(sub);
        });
        const addg = document.createElement("button");
        addg.className = "add sub";
        addg.textContent = "+ Add a light group";
        addg.addEventListener("click", () => { this._folds["lg:" + i] = true; this._lg("add", i); });
        gf.appendChild(addg);
        box.appendChild(gf);
        // order of lights
        const of = this._fold("lo:" + i, "↕ Order of lights");
        of.insertAdjacentHTML("beforeend", `<p class="hint">Drag ⠿ to move a light or light group up or down.</p>`);
        of.appendChild(this._sortList("lo:" + i));
        box.appendChild(of);
        box.appendChild(this._nameBox("nm:" + i));
        root.appendChild(box);
      } else add(`<p class="hint">No rooms yet. Tap + Room.</p>`);
    }

    if (tab === "house") {
      if (manual) {
        add(`<p class="hint">These show on their own pages for the whole home.</p>`);
        root.appendChild(this._form("house", HOUSE_SCHEMA, this._data("house")));
      } else add(`<p class="hint">In automatic mode, cameras, security (alarm, locks, door and motion sensors) and utilities are found by themselves. The “Whole house” switch is on the Rooms tab.</p>`);
    }

    if (tab === "music") {
      add(`<div class="sec">Speakers</div>`);
      add(`<p class="hint">Leave empty to show every speaker, like now. Pick some, and only those show on the Music pages (every room and Whole house) and as Spotify's amps.</p>`);
      root.appendChild(this._form("spk", SPK_SCHEMA, this._data("spk")));
      this._spSection(root, add);
    }
    if (tab === "garage") this._garageSection(root, add);
    if (tab === "cameras") this._camSection(root, add);
    this._refreshSorts();
  }
}

if (!customElements.get("ar-control-panel-card-editor")) customElements.define("ar-control-panel-card-editor", ArControlPanelCardEditor);
if (!customElements.get("ar-control-panel-card")) customElements.define("ar-control-panel-card", ArControlPanelCard);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "ar-control-panel-card"))
  window.customCards.push({ type: "ar-control-panel-card", name: "AR Control Panel", description: "A phone control in the AR Elegant style: pick your rooms, lights, climate, music, cameras and security from your Home Assistant entities. No wall panel needed.", preview: false });
