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

## Live cameras with WebRTC

If you have the **WebRTC Camera** integration installed (HACS, by AlexxIT), the Cameras page plays your cameras live through it, with very little delay. Tap a camera tile to switch the big player to it.

- **Home Assistant cameras** (`camera.*`) play live through WebRTC too.
- **RTSP cameras that aren't in Home Assistant**: in the card editor under **RTSP cameras**, tap **+ Add an RTSP camera**, give it a name and paste its RTSP link, e.g. `rtsp://admin:password@192.168.1.20:554/stream1`.
- **Keep passwords out of the dashboard:** anyone who can edit the dashboard can read an RTSP link in its settings. Instead, set the stream up in WebRTC / go2rtc and put just the **stream name** (e.g. `driveway`) in the link box.
- Turn **Play cameras live with WebRTC** off to go back to snapshots.

YAML:

```yaml
rtsp:
  - name: Driveway
    url: driveway              # go2rtc stream name, or an rtsp:// link
  - name: Back yard
    url: rtsp://admin:password@192.168.1.21:554/stream1
webrtc: true                   # default; false shows snapshots instead
```

Without WebRTC Camera installed, Home Assistant cameras show snapshots (tap for live view) and RTSP cameras show a note asking for it.

## Grouped speakers

The Music page shows when speakers are playing together. Grouped speakers have a link icon on their tab, and the player shows who's in the group: which speaker leads, which ones are playing, and a **Leave group** / **Ungroup** button. Music Assistant speaker groups show their speakers too, and the Home page says how many speakers are grouped ("Playing · Kitchen + 2 grouped").

## Needs

- Home Assistant 2024.7 or newer
- For live RTSP cameras: the **WebRTC Camera** integration (HACS)

States and controls use Home Assistant's own login and permissions. RTSP links you put in the card are stored in the dashboard's settings, so use go2rtc stream names if other people can edit your dashboards.
