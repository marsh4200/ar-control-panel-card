# AR Control Panel

A Home Assistant dashboard card for your phone, in the AR Elegant style.
It shows your home as rooms: Home, Lights, Climate, Music (with a Library), Cameras, Security, Shades and Utilities.

**No wall panel needed.** The rooms come straight from Home Assistant's own **areas**, so anything you've already set up in Home Assistant just appears.

## Install with HACS

1. HACS > three dots (top right) > **Custom repositories**
2. Repository: `https://github.com/marsh4200/ar-control-panel-card` — Type: **Dashboard** > Add
3. Search HACS for **AR Control Panel** > **Download**
4. Refresh the browser (or close and reopen the Home Assistant app)

HACS adds the card to your dashboard resources by itself.

## Make the dashboard

1. Settings > Dashboards > **Add dashboard** > New dashboard from scratch
   Title: `AR Control Panel`, icon `mdi:cellphone-link`, Show in sidebar: on
2. Open it > pencil (Edit) > three dots > **Raw configuration editor**, paste:

```yaml
title: AR Control Panel
views:
  - title: Home
    path: home
    type: panel
    cards:
      - type: custom:ar-control-panel-card
```

3. Save. It's in the sidebar and in the Home Assistant phone app.

## How things are sorted

Give your devices an **area** (Settings > Areas) and each area becomes a room. A **Whole house** room covers everything.

| Section | What goes there |
|---|---|
| Lights | `light.*`, plus switches whose name sounds like a light (light, lamp, downlight, LED…) |
| Climate | `climate.*` |
| Music | `media_player.*` |
| Shades | `cover.*` |
| Scenes (Home page) | `scene.*`, and scripts that have an area |
| Cameras | `camera.*` |
| Security | alarm panels, locks, door / window / motion / smoke sensors |
| Utilities | other switches, fans, geysers (water heaters) |

Hidden entities and config/diagnostic entities are left out. Anything without an area goes in an **Other** room.

## Options (all optional)

```yaml
type: custom:ar-control-panel-card
title: My Home                     # name of the home
rooms: [Lounge, Kitchen, Bedroom]  # only these areas, in this order
exclude:                           # leave these out
  - switch.server_rack
light_switches:                    # switches that are really lights
  - switch.relay_3
show_unassigned: false             # hide the "Other" room
whole_house: false                 # hide the "Whole house" room
```

## Needs

- Home Assistant 2024.7 or newer

States and controls use Home Assistant's own login and permissions.
