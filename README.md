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

### Light groups

When a room has several lights of one kind, group them: a group shows as **one tile** with an on/off switch, one brightness slider for all of them, and "3 of 5 on". Tap it and it opens into the list of its lights, each with its own switch and slider.

In the editor, inside a room, tap **+ Add a light group**, name it (e.g. *Downlights*) and pick its lights. Lights in a group don't need adding to the room's Lights as well. In YAML:

```yaml
rooms:
  - name: Lounge
    lights: [light.floor_lamp]
    light_groups:
      - name: Downlights
        lights: [light.dl_1, light.dl_2, light.dl_3, light.dl_4, light.dl_5]
      - name: Feature lights
        lights: [light.pendant_left, light.pendant_right]
```

Home Assistant's own light groups (Settings > Helpers > Group > Light group) open into their lights the same way, in both modes. On **Whole house**, groups are named with their room ("Lounge · Downlights").

### Drag rooms and lights into order

In the editor, grab the **⠿** handle and drag. This works with a mouse and with your finger on a phone, and a focused handle also moves with the ↑ ↓ arrow keys.

- **Room order:** drag a room up or down the list at the top of *Rooms*. The room picker on the card and the Whole house page follow this order.
- **Order of lights:** inside each room, drag its lights and light groups. For example, put *Downlights* first, then *Toilet light*. Groups and single lights can be mixed in any order. Until you drag anything, groups come first.

In automatic mode the room list is under **Order**, and each room's lights are under **↕ Order of lights in each room**. In YAML:

```yaml
# I pick my own rooms: the rooms list is the order; each room has light_order
rooms:
  - name: Bathroom
    light_order: [group:Downlights, light.toilet]
# Automatic mode: by area id ("_other" is the Other room)
room_order: [bathroom, kitchen, lounge]
light_order:
  bathroom: [light.downlights, light.toilet]
```

### Rename lights

A light can show on the card with a different name from the one it has in Home Assistant (e.g. *Shelly Dimmer 2* → *Dining Pendant*). In the editor, inside a room, open **✏️ Rename lights (optional)**: there's a box for each of that room's lights (including the lights in its groups). Type the name you want, or leave it empty to keep the Home Assistant name. In automatic mode the same box lists every light the card found. Nothing changes in Home Assistant itself. In YAML:

```yaml
names:
  light.shelly_dimmer_2: Dining Pendant
  switch.sonoff_4ch_1: Patio Lights
```

### Whole house: lights sorted by room

Choose **Whole house** and open **Lights**: every light is listed under its room's name (Dining, Kitchen, Lounge…), with the room's light groups inside it. Each room heading shows how many are on and has its own switch for all that room's lights; tap a room's name to fold it away.

The rooms appear in **your room order**: in the editor, move rooms with ↑ ↓ (in "I pick my own" mode), or in automatic mode use *Only these areas* to set the order. Lights inside a room follow the order you picked them in.

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

## Garage doors

Add a garage door and a **Garage** page appears in the bottom bar, in every room and on Whole house. With no garage doors, there's no Garage page.

Each door is a big tile showing an anthracite sectional door. When the door opens, it rolls up to show the lit garage inside:

- **Status light** on the lintel: green = closed, amber = open, red and pulsing = open longer than 10 minutes, grey = unavailable.
- The status line reads *CLOSED*, *OPEN · 5 MIN* or *UNAVAILABLE*.
- **Tap** to open or close the door. **Hold** to open the sensor's details.

In the editor, under **Garage doors**, tap **+ Add a garage door** and pick:

1. **What opens and closes it:** the relay switch, a cover, a button or a script.
2. **Door sensor (optional):** the binary sensor that says if the door is open. Without one, the card can't tell open from closed, unless the door is a `cover`.
3. **Name (optional)**

In automatic mode, `cover`s with the garage device class are added for you. In YAML:

```yaml
garage:
  - name: Garage door
    entity: switch.garage_door_open_close_garage_door
    sensor: binary_sensor.garage_door_garage_door_sensor
    alert_minutes: 10        # optional: turn red after this long open
```

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
