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

## Pick your own rooms and entities

Open the dashboard > pencil (Edit) > click the card > **Edit**. Everything is picked from dropdowns of your Home Assistant entities:

1. **Where the rooms come from** > choose **I pick my own rooms and entities**. It starts you off with what it found in your areas, so you only change what's wrong.
2. For each room, set the **name**, then pick its **Lights**, **Climate**, **Music**, **Shades** and **Scenes** from the dropdowns.
3. **+ Add a room** for more rooms; ↑ ↓ change the order, ✕ removes one.
4. Under **Whole house**, pick your **Cameras**, **Security** (alarm, locks, door and motion sensors) and **Utilities** (geyser, pumps, plugs).
5. Save.

Prefer YAML? The same thing looks like this:

```yaml
type: custom:ar-control-panel-card
title: My Home
mode: manual
rooms:
  - name: Lounge
    lights: [light.lounge_downlights, switch.lounge_lamp]
    climate: [climate.lounge_ac]
    music: [media_player.lounge_speaker]
    shades: [cover.lounge_curtain]
    scenes: [scene.movie_night]
  - name: Kitchen
    lights: [light.kitchen_pendants]
cameras: [camera.gate]
security: [alarm_control_panel.house, lock.front_door]
utilities: [switch.geyser, switch.pool_pump]
```

## Automatic mode (the default)

With no settings, each Home Assistant **area** becomes a room and a **Whole house** room covers everything:

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

Hidden and config/diagnostic entities are left out, and anything without an area goes in an **Other** room. In the editor you can still choose which areas to show, leave entities out, and mark switches that are really lights.

## Needs

- Home Assistant 2024.7 or newer

States and controls use Home Assistant's own login and permissions.
