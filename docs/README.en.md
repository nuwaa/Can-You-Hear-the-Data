# Can You Hear the Data? — English

[Languages / 语言 / 語言 / 言語](../README.md)

An independent, static acoustic data communication web app for Maker Faire Shenzhen 2026. It sends UTF-8 text through a speaker and receives it through a microphone using the official [ggwave](https://github.com/ggerganov/ggwave) WebAssembly package. No Wi-Fi, Bluetooth, server, account, or analytics is used for message delivery. Nearby receivers can hear the same signal.

**Project background:** This work began in [AtomS3R-Acoustic-Modem](https://github.com/nuwaa/AtomS3R-Acoustic-Modem). For a variety of reasons, the web app is now developed in this separate repository. The original repository remains the reference for the ATOM S3R receiver and firmware.

**Use without installing anything:** Open https://nuwaa.github.io/Can-You-Hear-the-Data/ in a supported browser on a PC, tablet, or smartphone. Visitors do not need to install npm or a native app on each device.

**Web app:** https://nuwaa.github.io/Can-You-Hear-the-Data/

**Visitor guide:** https://nuwaa.github.io/Can-You-Hear-the-Data/guide.html

## One sound, many receivers

Communication is not limited to a pair of devices. Like an ordinary spoken conversation, anyone within range of the sound can take part if their device can decode it; no recipient needs to be addressed in advance. A PC can play one signal and multiple visitors can listen with their own phones or tablets at the same time. Each receiver opens the app and taps **Start listening**; the sender selects a preset or enters text and taps **Send with sound**. Any visitor can also use their device to send a reply. No pairing or list of recipients is needed. Reception depends on distance, speaker output, and surrounding noise; playback completion does not confirm that every device decoded the message.

## Development

Requires Node.js 20.19+ or 22.12+ and npm. Run from this repository:

```sh
npm ci
npm run dev
```

Open the Vite URL shown in the terminal. For a phone, deploy the static build over HTTPS; browser microphones generally require a secure context. Do not assume a LAN HTTP URL will have microphone access.

```sh
npm run build
npm test
npm run preview
npm run test:browser # requires Chromium at /usr/bin/chromium, or CHROMIUM_PATH
```

The `dist/` directory can be hosted as a static site on GitHub Pages, Cloudflare Pages, or another HTTPS host. Vite uses relative asset paths, so no domain is hard coded. After the first online load, the service worker caches the HTML, JavaScript, CSS, manifest, icon, and ggwave code for offline use. Reopen once while online before relying on offline mode.

### Install-free access on other devices

The repository includes a GitHub Pages workflow that tests, builds, and deploys the app on every push to `main`. A repository administrator must select **Settings → Pages → Build and deployment → Source: GitHub Actions** once. After a successful `Publish web app` run, use the HTTPS URL shown in the deployment job. The expected URL for the current repository is `https://nuwaa.github.io/Can-You-Hear-the-Data/`; verify that it responds before distributing it or making a QR code. Visitors only need a modern browser—no Node.js or npm installation. The first load requires internet; subsequent loads can use the cached app offline. For microphone access, keep the HTTPS origin and grant browser permission.

The app links to a short [visitor guide](https://nuwaa.github.io/Can-You-Hear-the-Data/guide.html) in Simplified Chinese, Taiwan Mandarin (Traditional Chinese), English, and Japanese. It explains receiving, sending, microphone permission, and troubleshooting. The guide includes a QR code for visitors to open it on their own phones. Visitors can use the preset messages without typing. The guide and its QR code are part of the static build and do not contact a third-party service.

## How it works

- The transmitter uses official ggwave 0.4.0, variable-length framing, **Audible Normal protocol 0**, and a 140 UTF-8 byte limit. It shows playback completion, which is **not** a delivery acknowledgment.
- The receiver asks for microphone permission only after tapping Start listening. It decodes locally, shows recent messages, and lets the visitor copy the newest message. The spectrum and level meter use live microphone analysis.
- The Web Audio context's actual sample rate is passed to ggwave for both input and output. The ATOM S3R web receiver uses its own 24 kHz input path for a 48 kHz browser source; this app does not add another framing format or modify its firmware.
- English, Simplified Chinese, Taiwan Mandarin (Traditional Chinese), and Japanese UI are included. Browser language selects the initial UI language, including `zh-TW`/`zh-Hant` for Traditional Chinese.

This targets current Android Chrome, iOS Safari, and desktop Chromium/Safari/Firefox with WebAssembly, Web Audio, microphone permission, and service worker support. iOS may suspend audio when the page is backgrounded or the screen locks; keep the app open and the display awake during reception. In noisy environments, move devices closer and retry at a comfortable volume.

## Compatibility and testing

The design follows ggwave's public API and the documented Audible Normal mode in [AtomS3R-Acoustic-Modem](https://github.com/nuwaa/AtomS3R-Acoustic-Modem). [Klesis](https://github.com/nolimitwaiz/klesis) was consulted for interoperability behavior only; no Klesis source, styles, or assets were copied. Its reuse license was not established.

Automated tests cover the 140-byte UTF-8 boundary, an actual ggwave Audible Normal encode/decode round trip, production build, mobile and desktop browser UI, microphone denial, and offline reload. These tests do **not** prove over-the-air delivery.

**User-reported physical check (2026-10-25):** The published site displayed and bidirectional acoustic messaging worked among PCs, an iPad, and an Android device. The user also reported successful testing with three PCs. Browser versions, sample rates, distances, message set, and noise level were not recorded, so these results do not establish a measured success rate or coverage of every browser.

The following physical-device checks remain **unverified** for this app:

1. This app → this app: systematically send all five preset messages between devices and compare exact UTF-8 text, including repeated trials in venue noise.
2. Klesis → this app and this app → Klesis: use Audible Normal on both sides and compare exact text.
3. This app → existing ATOM S3R web receiver: enable its `ggwave web on` mode, send the presets from a 48 kHz browser, and compare its display / `GGWAVE WEB RX TEXT:` output.
4. Browser-specific coverage on Android Chrome and iOS Safari, including offline use, permission restart, different sample rates, venue noise, and long listening sessions. iPhone testing has not been reported.

No ATOM S3R firmware is changed here. The ATOM's separate fixed-length DT chat/ACK mode is not the target of this web app. A played sound is not proof that any receiver decoded it.

## License notices

ggwave 0.4.0 is MIT licensed, copyright © 2020 Georgi Gerganov. Its license is included in [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md). Other dependencies retain their respective license terms in npm package metadata. A project license for the new app has not yet been selected.
