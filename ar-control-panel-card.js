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
@media (max-width:360px){.clock{font-size:44px}.grid{gap:10px}}
`;

// --- where the rooms come from ---------------------------------------------------------
const arr = (v) => (Array.isArray(v) ? v : v ? [v] : []).filter((x) => typeof x === "string" && x);
const blankRoom = (name) => ({ name, lights: [], climate: [], music: [], shades: [], scenes: [], presence: [] });
const isManual = (cfg) => (cfg.mode ? cfg.mode === "manual" : Array.isArray(cfg.rooms) && cfg.rooms.some((r) => r && typeof r === "object"));
const friendly = (h, id) => {
  const s = h.states[id];
  return (s && s.attributes.friendly_name) || id.split(".")[1].replace(/_/g, " ");
};

// Manual: exactly what was picked in the card editor.
function manualLayout(h, cfg) {
  const rooms = (cfg.rooms || [])
    .filter((r) => r && typeof r === "object")
    .map((r, i) => Object.assign(blankRoom(r.name || "Room " + (i + 1)), {
      lights: arr(r.lights), climate: arr(r.climate), music: arr(r.music), shades: arr(r.shades), scenes: arr(r.scenes),
    }));
  const security = arr(cfg.security);
  security.sort((a, b) => (b.indexOf("alarm_control_panel.") === 0) - (a.indexOf("alarm_control_panel.") === 0));
  return { rooms, cameras: arr(cfg.cameras), security, utilities: arr(cfg.utilities) };
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
  const house = { cameras: [], security: [], utilities: [] };
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
    if (skip.has(id)) return;
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
      case "media_player": roomFor(id).music.push(id); break;
      case "cover": roomFor(id).shades.push(id); break;
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
  return Object.assign({ rooms }, house);
}

function buildLayout(h, cfg) {
  const L = isManual(cfg) ? manualLayout(h, cfg) : autoLayout(h, cfg);
  if (!L.rooms.length && (L.cameras.length || L.security.length || L.utilities.length)) L.rooms.push(blankRoom("Home"));
  if (!L.rooms.length) return null;
  return Object.assign(L, { name: cfg.title || "Home", wholeHouse: cfg.whole_house !== false, start: 0, rtsp: [], music: {} });
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
    // Rebuild the rooms when areas, devices or entities change (HA replaces
    // these objects on every registry update) or an entity appears/disappears.
    const n = h && h.states ? Object.keys(h.states).length : 0;
    if (!prev || !this._layout || h.areas !== prev.areas || h.devices !== prev.devices || h.entities !== prev.entities || n !== this._nStates) {
      this._nStates = n;
      this._build();
    }
    this._schedule();
  }
  get hass() { return this._hass; }
  set narrow(v) { this._narrow = v; this._schedule(); }
  set panel(v) { this._panel = v; }

  connectedCallback() {
    this.shadowRoot.addEventListener("click", (e) => this._click(e));
    this.shadowRoot.addEventListener("input", (e) => this._input(e));
    this.shadowRoot.addEventListener("change", (e) => this._change(e));
    this.shadowRoot.addEventListener("pointerdown", (e) => { if (e.target.type === "range") this._busy++; });
    this.shadowRoot.addEventListener("pointerup", () => setTimeout(() => (this._busy = Math.max(0, this._busy - 1)), 300));
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
    if (this._s.room == null && L && L.rooms.length > 1 && L.wholeHouse) this._s.room = L.rooms.length;
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
      rs.push(all);
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
    const own = (r.music || []).filter((e) => this.has(e));
    if (own.length) return own;
    const m = p.music || {};
    if (!m.ma && !m.spotify) return [];
    const S = this._hass.states;
    return Object.keys(S)
      .filter((e) => e.indexOf("media_player.") === 0 && S[e].state !== "unavailable")
      .filter((e) => (m.ma && (S[e].attributes.mass_player_type != null || S[e].attributes.mass_player_id != null || /^media_player\.(mass_|ma_)/.test(e))) || (m.spotify && /^media_player\.spotify/.test(e)))
      .sort((a, b) => this.name(a).localeCompare(this.name(b)));
  }
  cats() {
    const p = this.panelCfg();
    return CATS.filter((c) => this.ents(c.key).length || (c.key === "cameras" && p && p.rtsp && p.rtsp.length));
  }
  weather() {
    const h = this._hass;
    const id = Object.keys(h.states).find((k) => k.indexOf("weather.") === 0);
    return id ? h.states[id] : null;
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
      return p ? { s: "Playing · " + this.name(p), lit: true } : { s: "Nothing playing" };
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
    const a = b.getAttribute("data-a");
    const v = b.getAttribute("data-v");
    const e = b.getAttribute("data-e");
    const h = this._hass;
    switch (a) {
      case "menu": this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true })); break;
      case "go": this._set({ tab: v }); this.shadowRoot.querySelector(".root").scrollTop = 0; break;
      case "rooms": this._sheet = "rooms"; this._schedule(true); break;
      case "room": this._sheet = null; this._lib = null; this._set({ room: Number(v), mus: null, clim: 0 }); break;
      case "panel": this._sheet = null; this._lib = null; this._set({ panel: Number(v), room: null, mus: null, clim: 0 }); break;
      case "close": this._sheet = null; this._pin = null; this._schedule(true); break;
      case "scene": {
        const d = e.split(".")[0];
        this.call(d === "script" ? "script" : d === "scene" ? "scene" : "homeassistant", "turn_on", { entity_id: e });
        b.classList.add("hit");
        setTimeout(() => b.classList.remove("hit"), 700);
        this._say(this.name(e));
        break;
      }
      case "toggle": this.call("homeassistant", "toggle", { entity_id: e }); break;
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
      case "lock": this.call("lock", this.st(e).state === "locked" ? "unlock" : "lock", { entity_id: e }); break;
      case "more": this.more(e); break;
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
    if (t.type === "range") t.style.setProperty("--p", ((t.value - t.min) / (t.max - t.min)) * 100 + "%");
  }
  _change(ev) {
    const t = ev.target;
    const e = t.getAttribute("data-e");
    const a = t.getAttribute("data-a");
    const v = Number(t.value);
    if (a === "bri") this.call("light", v > 0 ? "turn_on" : "turn_off", v > 0 ? { entity_id: e, brightness_pct: v } : { entity_id: e });
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
    const sheet = this._sheet === "rooms" ? this._roomsSheet() : this._pin ? this._pinSheet() : "";
    const toast = this._toast ? `<div class="toast" role="status">${esc(this._toast)}</div>` : "";
    const keepScroll = this.shadowRoot.querySelector(".root");
    const y = keepScroll ? keepScroll.scrollTop : 0;
    this.shadowRoot.innerHTML = `<style>${CSS}</style><div class="root"><div class="wrap">${body}</div></div>${sheet}${toast}`;
    const nr = this.shadowRoot.querySelector(".root");
    if (nr) nr.scrollTop = y;
    this.shadowRoot.querySelectorAll("input[type=range]").forEach((t) => t.style.setProperty("--p", ((t.value - t.min) / (t.max - t.min)) * 100 + "%"));
    this._placeDock();
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
        return `<button class="glass card" data-a="go" data-v="${c.key}">${sm.lit && c.key === "lights" ? '<div class="glow"></div>' : ""}<div class="ic ${cls}">${svg(c.icon)}</div><div><div class="t">${esc(c.title)}</div><div class="s">${esc(sm.s)}</div></div></button>`;
      })
      .join("");
    return `<div class="glass hero"><div style="flex:1"><div class="clock">${pad(d.getHours())}:${pad(d.getMinutes())}</div><div class="date">${esc(date)}</div></div>${wx}</div>${sc}<div class="grid">${cards}</div>`;
  }

  _lights() {
    const es = this.ents("lights");
    const n = es.filter((e) => this.isOn(e)).length;
    const cards = es
      .map((e) => {
        const s = this.st(e);
        const on = this.isOn(e);
        const isLight = e.indexOf("light.") === 0;
        const modes = (s.attributes.supported_color_modes || []);
        const dim = isLight && !(modes.length === 1 && modes[0] === "onoff") && modes.length > 0;
        const pct = on ? (s.attributes.brightness != null ? Math.round((s.attributes.brightness / 255) * 100) : 100) : 0;
        const lvl = s.state === "unavailable" ? "Offline" : on ? (dim ? pct + "%" : "On") : "Off";
        return `<div class="glass light ${on ? "on" : ""}">${on ? '<div class="glow"></div>' : ""}
          <button class="tap" data-a="toggle" data-e="${esc(e)}" aria-pressed="${on}"><span class="bulbrow"><span class="bulb">${svg("bulb", 20)}</span><span class="lvl">${lvl}</span></span><span class="nm">${esc(this.name(e))}</span></button>
          ${dim ? `<input type="range" min="0" max="100" step="1" value="${pct}" data-a="bri" data-e="${esc(e)}" aria-label="${esc(this.name(e))} brightness">` : ""}
        </div>`;
      })
      .join("");
    return `<div class="bar"><div class="lbl">${n} of ${es.length} on</div><button class="act on" data-a="all" data-v="lights" data-on="1">All on</button><button class="act" data-a="all" data-v="lights" data-on="0">All off</button></div><div class="grid">${cards}</div>`;
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
    // until a speaker is picked: the one that's playing
    const playingIdx = Math.max(0, es.findIndex((x) => this.st(x).state === "playing"));
    const i = clamp(this._s.mus == null ? playingIdx : this._s.mus, 0, es.length - 1);
    const e = es[i];
    const s = this.st(e);
    const a = s.attributes;
    const tabs = es.length > 1 ? `<div class="tabs">${es.map((x, k) => `<button class="tab ${k === i ? "on" : ""}" data-a="mus" data-v="${k}">${esc(this.name(x))}</button>`).join("")}</div>` : "";
    const playing = s.state === "playing";
    const off = s.state === "off" || s.state === "unavailable";
    const art = a.entity_picture ? `<img src="${esc(a.entity_picture)}" alt="">` : svg("music", 64, ' stroke-width="1.4"');
    const vol = a.volume_level != null ? Math.round(a.volume_level * 100) : null;
    const seg = `<div class="tabs"><button class="tab ${this._s.mview !== "lib" ? "on" : ""}" data-a="mview" data-v="now">Now playing</button><button class="tab ${this._s.mview === "lib" ? "on" : ""}" data-a="mview" data-v="lib" data-e="${esc(e)}">Library</button></div>`;
    if (this._s.mview === "lib") {
      if (!this._lib || this._lib.player !== e) { this._lib = null; setTimeout(() => this._browse(e, null), 0); }
      return tabs + seg + this._library();
    }
    return `${tabs}${seg}<div class="glass np"><div class="art">${art}</div>
      <div class="tt">${esc(a.media_title || (off ? "Off" : "Nothing playing"))}</div>
      <div class="ar">${esc(a.media_artist || a.media_album_name || this.name(e))}</div>
      <div class="ctl">
        <button class="round" data-a="media" data-e="${esc(e)}" data-v="media_previous_track" aria-label="Previous">${svg("prev", 22)}</button>
        <button class="big" data-a="media" data-e="${esc(e)}" data-v="${off ? "power" : "media_play_pause"}" aria-label="${off ? "Turn on" : playing ? "Pause" : "Play"}">${svg(off ? "power" : playing ? "pause" : "play", 30)}</button>
        <button class="round" data-a="media" data-e="${esc(e)}" data-v="media_next_track" aria-label="Next">${svg("next", 22)}</button>
      </div>
      ${vol != null ? `<div class="vol">${svg("music", 18)}<input type="range" min="0" max="100" value="${vol}" data-a="vol" data-e="${esc(e)}" aria-label="Volume"><button class="iconbtn" data-a="media" data-e="${esc(e)}" data-v="power" aria-label="Power">${svg("power", 18)}</button></div>` : ""}
    </div>`;
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
    return `<div class="list">${this.ents("shades")
      .map((e) => {
        const s = this.st(e);
        const pos = s.attributes.current_position;
        const canPos = pos != null && (s.attributes.supported_features & 4) === 4;
        const val = s.state === "opening" ? "Opening…" : s.state === "closing" ? "Closing…" : pos != null ? (pos === 0 ? "Closed" : pos === 100 ? "Open" : pos + "% open") : s.state === "open" ? "Open" : "Closed";
        return `<div class="glass item" style="flex-wrap:wrap">
          <div class="ic">${svg("shades")}</div><div class="nm">${esc(this.name(e))}<div class="val">${esc(val)}</div></div>
          <div class="seg"><button data-a="cover" data-e="${esc(e)}" data-v="open_cover" aria-label="Open ${esc(this.name(e))}">${svg("up", 18)}</button><button data-a="cover" data-e="${esc(e)}" data-v="stop_cover" aria-label="Stop">${svg("stop", 16)}</button><button data-a="cover" data-e="${esc(e)}" data-v="close_cover" aria-label="Close ${esc(this.name(e))}">${svg("down", 18)}</button></div>
          ${canPos ? `<input type="range" min="0" max="100" value="${pos}" data-a="pos" data-e="${esc(e)}" aria-label="${esc(this.name(e))} position">` : ""}
        </div>`;
      })
      .join("")}</div>`;
  }

  _cameras() {
    const es = this.ents("cameras");
    const p = this.panelCfg();
    const first = es[0];
    const hero = first
      ? `<button class="camhero" data-a="more" data-e="${esc(first)}" aria-label="Open ${esc(this.name(first))} live"><img data-cam="${esc(first)}" src="${esc(this.camUrl(first))}" alt=""><span class="live"><i></i>LIVE</span><span class="cap">${esc(this.name(first))}<small>Tap for live view</small></span></button>`
      : "";
    const rest = es.slice(1).map((e) => `<button class="camsm" data-a="more" data-e="${esc(e)}" aria-label="Open ${esc(this.name(e))} live"><img data-cam="${esc(e)}" src="${esc(this.camUrl(e))}" alt=""><span class="cap">${esc(this.name(e))}</span></button>`).join("");
    const rtsp = p && p.rtsp.length ? `<div class="note">${esc(p.rtsp.join(", "))}: these RTSP cameras play on the wall panel only. Add them to Home Assistant as cameras to see them here.</div>` : "";
    return `${hero}${rest ? `<div class="grid">${rest}</div>` : ""}${rtsp}`;
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
};
const MODE_SCHEMA = [
  { name: "title", selector: { text: {} } },
  { name: "mode", selector: { select: { mode: "list", options: [
    { value: "manual", label: "I pick my own rooms and entities" },
    { value: "areas", label: "Automatic, from my Home Assistant areas" },
  ] } } },
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

const EDITOR_CSS = `
:host{display:block}
.sec{margin:18px 0 6px;font-size:15px;font-weight:600;color:var(--primary-text-color)}
.hint{margin:0 0 10px;font-size:13px;color:var(--secondary-text-color)}
.room{border:1px solid var(--divider-color,#444);border-radius:12px;padding:10px 12px 12px;margin:10px 0}
.rhead{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.rhead b{flex:1;font-size:14px;color:var(--primary-text-color)}
.ib{width:34px;height:34px;border-radius:50%;border:1px solid var(--divider-color,#444);background:none;color:var(--primary-text-color);cursor:pointer;font-size:15px;line-height:1}
.ib:disabled{opacity:.35;cursor:default}
.add{margin-top:6px;width:100%;height:44px;border-radius:12px;border:1px dashed var(--primary-color);background:none;color:var(--primary-color);font:inherit;font-weight:600;cursor:pointer}
`;

class ArControlPanelCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._cfg = {};
    this._shape = null;
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
  _shapeOf() { return this._cfg.mode + ":" + (this._cfg.mode === "manual" ? this._rooms().length : 0); }

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
    if (key === "mode") return { title: c.title || "", mode: c.mode };
    if (key === "auto") return { areas: arr(c.areas), exclude: arr(c.exclude), light_switches: arr(c.light_switches), show_unassigned: c.show_unassigned !== false, whole_house: c.whole_house !== false };
    if (key === "house") return { cameras: arr(c.cameras), security: arr(c.security), utilities: arr(c.utilities), whole_house: c.whole_house !== false };
    const r = this._rooms()[Number(key.slice(5))] || {};
    const d = { name: r.name || "" };
    ROOM_FIELDS.forEach((k) => (d[k] = arr(r[k])));
    return d;
  }
  _feed() {
    this.shadowRoot.querySelectorAll("ha-form").forEach((f) => (f.data = this._data(f.getAttribute("data-k"))));
    this.shadowRoot.querySelectorAll(".rhead b").forEach((b, i) => (b.textContent = (this._rooms()[i] || {}).name || "Room " + (i + 1)));
  }

  _changed(key, v) {
    const c = this._cfg;
    if (key === "mode") {
      if (v.title) c.title = v.title; else delete c.title;
      if (v.mode !== c.mode) {
        c.mode = v.mode;
        if (v.mode === "manual" && !this._rooms().length) this._prefill();
      }
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
    const L = h && h.states ? autoLayout(h, Object.assign({}, this._cfg, { rooms: [] })) : { rooms: [], cameras: [], security: [], utilities: [] };
    this._cfg.rooms = L.rooms.map((r) => {
      const o = { name: r.name };
      ROOM_FIELDS.forEach((k) => { if (r[k].length) o[k] = r[k].slice(); });
      return o;
    });
    if (!this._cfg.rooms.length) this._cfg.rooms = [{ name: "Lounge" }];
    ["cameras", "security", "utilities"].forEach((k) => { if (L[k].length) this._cfg[k] = L[k].slice(); });
  }

  _room(op, i) {
    const rooms = this._rooms();
    if (op === "add") rooms.push({ name: "Room " + (rooms.length + 1) });
    else if (op === "del") rooms.splice(i, 1);
    else if (op === "up" && i > 0) rooms.splice(i - 1, 0, rooms.splice(i, 1)[0]);
    else if (op === "down" && i < rooms.length - 1) rooms.splice(i + 1, 0, rooms.splice(i, 1)[0]);
    this._cfg.rooms = rooms;
    this._shape = null; // order or count changed: redraw
    this._emit();
    this._render();
  }

  _emit() {
    const out = Object.assign({}, this._cfg);
    if (out.mode === "areas" && !isManual(Object.assign({}, out, { mode: undefined }))) delete out.mode; // the default
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: out }, bubbles: true, composed: true }));
  }

  _render() {
    if (!this._hass) return;
    this._shape = this._shapeOf();
    const root = this.shadowRoot;
    root.innerHTML = `<style>${EDITOR_CSS}</style>`;
    const add = (html) => { const d = document.createElement("div"); d.innerHTML = html; root.appendChild(d.firstElementChild); };
    root.appendChild(this._form("mode", MODE_SCHEMA, this._data("mode")));
    if (this._cfg.mode !== "manual") {
      add(`<div class="sec">Automatic rooms</div>`);
      add(`<p class="hint">Each Home Assistant area becomes a room. Choose "I pick my own rooms and entities" above to choose every light, AC, speaker and blind yourself.</p>`);
      root.appendChild(this._form("auto", AUTO_SCHEMA, this._data("auto")));
      return;
    }
    add(`<div class="sec">Rooms</div>`);
    add(`<p class="hint">Pick what's in each room from the dropdowns. Use the arrows to change the order.</p>`);
    const rooms = this._rooms();
    rooms.forEach((r, i) => {
      const box = document.createElement("div");
      box.className = "room";
      box.innerHTML = `<div class="rhead"><b></b>
        <button class="ib" data-op="up" title="Move up"${i === 0 ? " disabled" : ""}>↑</button>
        <button class="ib" data-op="down" title="Move down"${i === rooms.length - 1 ? " disabled" : ""}>↓</button>
        <button class="ib" data-op="del" title="Remove room">✕</button></div>`;
      box.querySelector("b").textContent = r.name || "Room " + (i + 1);
      box.querySelectorAll("[data-op]").forEach((b) => b.addEventListener("click", () => this._room(b.getAttribute("data-op"), i)));
      box.appendChild(this._form("room:" + i, ROOM_SCHEMA, this._data("room:" + i)));
      root.appendChild(box);
    });
    add(`<button class="add">+ Add a room</button>`);
    root.querySelector(".add").addEventListener("click", () => this._room("add"));
    add(`<div class="sec">Whole house</div>`);
    add(`<p class="hint">These show on their own pages for the whole home.</p>`);
    root.appendChild(this._form("house", HOUSE_SCHEMA, this._data("house")));
  }
}

if (!customElements.get("ar-control-panel-card-editor")) customElements.define("ar-control-panel-card-editor", ArControlPanelCardEditor);
if (!customElements.get("ar-control-panel-card")) customElements.define("ar-control-panel-card", ArControlPanelCard);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "ar-control-panel-card"))
  window.customCards.push({ type: "ar-control-panel-card", name: "AR Control Panel", description: "A phone control in the AR Elegant style: pick your rooms, lights, climate, music, cameras and security from your Home Assistant entities. No wall panel needed.", preview: false });
