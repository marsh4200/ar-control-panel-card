# AR Control Panel

A Home Assistant dashboard card in the AR NSPanel Pro wall panels' Elegant style, made for phones.
It shows the same rooms as the wall panels: Home, Lights, Climate, Music (with Music Assistant / Spotify and a Library), Cameras, Security, Shades and Utilities.

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
        # panel: Showroom panel   # optional: which wall panel's rooms to use
```

3. Save. It's in the sidebar and in the Home Assistant phone app.

## Needs

- Home Assistant 2024.7 or newer
- The **AR NSPanel Pro** integration (the version with phone support: the `mobile_layout` command), with at least one panel on the Elegant dashboard. The card reads the rooms from it, so nothing is set up twice.

States and controls use Home Assistant's own login and permissions. Phones never receive panel secrets (RTSP passwords, PINs, logins).
