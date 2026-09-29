// import React from "react";
import { FaInstagram, FaSnapchat, FaWhatsapp, FaTiktok, FaXTwitter } from "react-icons/fa6";
import boluIcon from "../assets/bolu-icon.png";
/* ---------------------------------------------------------------
   SINISDEATH — Footer
   Pull the Google Font in your document head:
   https://fonts.googleapis.com/css2?family=Big+Shoulders+Condensed:ital,wght@0,500;0,600;1,700;1,800;1,900&display=swap
------------------------------------------------------------------ */

const LOGO_PATH_SIN = `M1135 5688 c-12 -50 -22 -129 -16 -132 19 -12 550 -103 1016 -175
1060 -164 2457 -304 3368 -338 l177 -6 0 64 c0 35 -4 69 -8 76 -5 8 -73 16
-202 23 -932 52 -1656 115 -2455 216 -287 36 -936 129 -1100 158 -77 14 -279
50 -450 80 -170 31 -313 56 -317 56 -4 0 -10 -10 -13 -22z M1422 5098 c-43
-408 -109 -1275 -98 -1286 2 -1 100 11 217 27 271 38 766 101 798 101 19 0 22
-4 18 -22 -3 -13 -9 -98 -13 -189 l-7 -167 -212 -41 c-117 -23 -218 -41 -225
-41 -9 0 -10 32 -4 125 6 111 5 125 -10 131 -16 6 -547 -74 -566 -86 -10 -6
-37 -817 -27 -827 4 -3 91 17 195 46 424 120 825 228 1172 317 124 31 230 61
236 65 7 6 13 81 18 196 7 201 27 506 51 771 8 89 15 172 15 183 0 21 -3 21
-147 15 -667 -29 -876 -36 -881 -31 -5 5 9 202 25 343 l6 52 156 0 c86 0 187
-3 224 -7 68 -6 69 -7 64 -32 -3 -15 -9 -66 -13 -114 l-7 -87 294 2 293 3 37
300 c25 199 34 302 27 306 -5 3 -40 9 -76 13 -37 3 -107 11 -157 16 -293 31
-501 52 -740 74 -258 24 -617 56 -634 56 -4 0 -17 -96 -29 -212z M3165 5128
c-6 -19 -62 -476 -85 -698 -39 -379 -89 -1135 -76 -1148 6 -5 560 124 577 134
4 2 9 61 13 131 20 383 75 915 142 1392 10 67 15 123 13 126 -4 3 -552 75
-576 75 -2 0 -6 -6 -8 -12z M3846 5023 c-13 -64 -67 -475 -90 -683 -37 -330
-81 -888 -72 -898 3 -2 118 22 258 53 354 80 328 72 328 98 0 78 74 784 83
793 2 2 23 -40 47 -94 109 -245 294 -602 311 -602 6 0 7 -5 3 -11 -5 -9 1 -10
22 -5 16 4 147 32 292 61 145 29 265 55 268 58 3 3 16 87 30 188 26 198 93
583 124 716 16 68 18 113 6 113 -2 0 -124 20 -272 45 -148 25 -276 45 -285 45
-16 0 -49 -166 -99 -495 -35 -227 -23 -218 -92 -75 -70 146 -140 312 -214 500
-42 108 -57 136 -76 142 -26 8 -515 78 -546 78 -14 0 -22 -8 -26 -27z M5515
3569 c-1509 -96 -2957 -421 -4285 -964 -91 -37 -187 -76 -215 -87 -75 -29 -77
-34 -48 -100 14 -31 32 -59 40 -62 8 -3 45 7 81 23 37 16 166 68 287 116 1320
523 2732 835 4143 917 l212 12 0 78 0 78 -42 -1 c-24 -1 -101 -6 -173 -10z`;

const LOGO_PATH_ISDEATH = `M10232 5642 c-79 -13 -93 -19 -97 -36 -5 -23 -39 -571 -55 -896 -6
-112 -12 -205 -13 -206 -1 -1 -39 -5 -84 -8 l-83 -7 0 58 c0 71 25 522 46 817
8 120 13 220 12 221 -3 3 -219 -33 -223 -37 -4 -5 -34 -482 -50 -783 -25 -485
-36 -985 -33 -1455 l3 -455 65 -11 c35 -7 85 -15 110 -18 l45 -6 -3 277 c-2
153 -1 396 3 541 l7 263 84 -2 84 -3 0 -553 0 -553 23 -5 c12 -2 51 -9 87 -15
36 -6 76 -13 90 -16 l25 -4 1 617 c2 810 25 1460 80 2206 8 101 21 93 -124 69z
M9375 5492 c-148 -25 -271 -47 -273 -48 -3 -2 -41 -500 -42 -544 l0 -26 86 8
c48 5 89 6 92 4 2 -3 -1 -112 -7 -243 -23 -472 -31 -796 -31 -1250 l0 -462 33
-5 c17 -3 59 -10 91 -16 112 -19 101 -42 98 212 -6 398 33 1766 51 1784 2 3
41 9 86 14 45 5 85 12 90 14 5 3 12 70 16 148 4 79 12 214 19 301 l11 157 -25
-1 c-14 -1 -146 -22 -295 -47z M8743 5386 c-166 -29 -304 -54 -307 -57 -7 -7
-43 -524 -62 -874 -8 -165 -18 -543 -21 -841 l-6 -540 101 -17 c56 -9 105 -17
110 -17 5 0 12 202 15 452 4 248 9 453 11 455 2 2 41 1 87 -3 l84 -6 -3 -467
-2 -467 87 -13 c49 -6 97 -14 109 -17 l21 -5 7 503 c9 686 32 1249 71 1763 17
224 17 205 8 204 -5 -1 -144 -25 -310 -53z m53 -523 c-2 -10 -7 -94 -11 -188
-9 -245 0 -225 -102 -225 l-86 0 6 93 c4 50 9 145 13 209 l7 117 41 4 c111 10
138 8 132 -10z M8075 5274 c-142 -25 -262 -49 -265 -55 -8 -12 -37 -393 -55
-729 -19 -339 -35 -859 -35 -1112 0 -197 0 -198 23 -203 12 -3 132 -23 267
-45 135 -22 257 -43 273 -46 l27 -6 0 255 0 254 -147 12 c-82 7 -163 15 -180
18 l-33 5 0 102 c0 55 3 132 7 169 l6 68 171 -3 171 -3 8 248 c5 137 7 250 5
252 -1 2 -79 0 -172 -3 l-168 -7 6 150 c8 175 10 185 39 185 12 0 87 7 167 15
80 8 150 15 156 15 6 0 15 70 23 183 6 100 15 215 18 255 l6 72 -29 -1 c-16
-1 -146 -21 -289 -45z M7408 5163 l-266 -46 -6 -51 c-26 -224 -63 -874 -71
-1227 -3 -140 -7 -318 -9 -396 -3 -100 -1 -145 7 -150 17 -10 567 -101 571
-94 2 3 13 53 25 111 17 88 22 169 31 500 11 417 22 647 45 975 13 199 13 209
-15 423 0 6 -63 -3 -312 -45z m97 -450 c-10 -86 -25 -381 -37 -731 l-12 -343
-43 6 c-24 3 -62 7 -85 10 l-43 5 7 238 c7 244 25 625 36 767 l7 80 60 6 c126
12 116 15 110 -38z M6778 5056 c-163 -28 -299 -53 -302 -56 -9 -10 -54 -609
-69 -922 -2 -46 -2 -46 33 -52 19 -3 85 -6 145 -6 61 0 134 -3 163 -6 l52 -7
0 -126 c0 -69 -3 -136 -6 -148 -7 -25 -27 -28 -122 -16 l-54 6 4 93 3 94 -40
5 c-22 2 -72 6 -111 7 l-71 3 -7 -119 c-3 -65 -6 -183 -6 -262 l0 -142 28 -6
c62 -13 572 -96 586 -96 14 0 16 27 16 233 0 230 15 701 25 805 l5 53 -201 -7
-202 -7 7 99 c4 54 9 122 12 151 l6 52 57 6 c31 3 69 8 85 10 l29 5 -8 -101
-7 -102 109 8 c59 4 111 9 116 12 4 2 7 24 7 48 0 43 24 360 36 483 5 49 3 62
-7 61 -8 -1 -148 -24 -311 -53z M6316 4979 c-54 -10 -101 -21 -103 -23 -27
-27 -109 -1486 -85 -1506 8 -8 212 -44 216 -38 2 1 8 170 14 373 13 378 21
536 48 870 8 105 18 225 21 268 3 43 2 76 -3 76 -5 -1 -54 -10 -108 -20z`;

/* Faded background watermark (single colour, uses currentColor) */
function LogoMark({ style }) {
  return (
    <svg viewBox="0 0 1080 756" style={{ display: "block", width: "100%", height: "100%", ...style }}>
      <g transform="translate(0,756) scale(0.1,-0.1)" fill="currentColor">
        <path d={LOGO_PATH_SIN} />
        <path d={LOGO_PATH_ISDEATH} />
      </g>
    </svg>
  );
}

/* SINISDEATH footer logo: yellow SIN + white ISDEATH, cropped tight */
function FooterLogo() {
  return (
    <svg
      viewBox="85 175 960 355"
      role="img"
      aria-label="SINISDEATH"
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      <g transform="translate(0,756) scale(0.1,-0.1)">
        <path fill="#f1c712" d={LOGO_PATH_SIN} />
        <path fill="#ffffff" d={LOGO_PATH_ISDEATH} />
      </g>
    </svg>
  );
}

const BG_MARKS = [
  { top: "6%", left: "27%", width: 70, opacity: 0.16, rotate: -18, color: "#ffffff" },
  { top: "14%", left: "35%", width: 96, opacity: 0.14, rotate: -24, color: "#ffffff" },
  { top: "2%", left: "54%", width: 110, opacity: 0.13, rotate: 16, color: "#ffffff" },
  { top: "56%", left: "63%", width: 190, opacity: 0.55, rotate: -9, color: "#4a4a4a" },
];

const LINKS = ["Privacy Policy", "Terms of Service", "Shipping Rules"];

export default function Footer() {
  return (
    <footer className="sd-footer">
      <style>{`
            .sd-footer {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  font-family: 'Big Shoulders Condensed', 'Arial Narrow', sans-serif;
  background: linear-gradient(
    180deg,
    #eeeeee 0%,
    #9c9c9c 14%,
    #3c3c3c 30%,
    #0a0a0a 48%,
    #000000 66%,
    #000000 100%
  );
}
.sd-footer::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  opacity: 0.35;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-size: 180px 180px;
}
.sd-bg-mark { position: absolute; z-index: 1; pointer-events: none; width: var(--w); }

.sd-inner {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(20px, 6vw, 72px);
}

/* Three aligned columns: brand | legal | network */
.sd-top {
  display: grid;
  grid-template-columns: minmax(180px, 1.4fr) 1fr 1fr;
  gap: 48px;
  align-items: start;
  padding-top: clamp(90px, 16vw, 190px);
  padding-bottom: 56px;
}
.sd-brand-logo {
  display: block;
  width: clamp(150px, 16vw, 210px);
  transition: transform .3s ease, opacity .3s ease;
}
.sd-brand-logo:hover { transform: scale(1.05); opacity: .85; }

.sd-col h4 {
  margin: 0 0 18px;
  font-style: italic;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 1px;
  color: #ffffff;
  text-transform: uppercase;
}
.sd-link-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;
  padding: 0;
}
.sd-link-list a {
  font-style: italic;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.3px;
  color: #8f8f8f;
  text-decoration: none;
  text-transform: uppercase;
  transition: color .15s ease;
  width: fit-content;
}
.sd-link-list a:hover { color: #f1c712; }

.sd-icon-row { display: flex; align-items: center; gap: 18px; }
.sd-icon-row a { display: inline-flex; color: #ffffff; opacity: .85; transition: opacity .15s ease, color .15s ease; }
.sd-icon-row a:hover { opacity: 1; color: #f1c712; }
.sd-icon-row svg { width: 19px; height: 19px; }

.sd-divider { border: none; border-top: 1px solid rgba(255,255,255,0.14); margin: 0; }

.sd-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 0 40px;
  font-style: italic;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.4px;
  color: #8f8f8f;
  text-transform: uppercase;
}
.sd-built { display: inline-flex; align-items: center; gap: 10px; }
.sd-bolu-icon { display: block; width: 28px; height: auto; }
.sd-bolu-icon:hover {transform: scale(1.1);
    opacity: 0.8;}

/* Tablet: logo on its own row, legal + network side by side */
@media (max-width: 900px) {
  .sd-top { grid-template-columns: 1fr 1fr; gap: 40px 32px; }
  .sd-brand { grid-column: 1 / -1; }
  .sd-bolu-icon{} text-align: 'center'}
}

/* Phone: single column, bigger tap targets */
@media (max-width: 560px) {
  .sd-top {
    grid-template-columns: 1fr;
    gap: 36px;
    padding-top: 120px;
    padding-bottom: 40px;
  }
  .sd-link-list { gap: 0; }
  .sd-link-list a { font-size: 15px; padding: 10px 0; }
  .sd-icon-row { gap: 2px; margin-left: -10px; }
  .sd-icon-row a { padding: 10px; }
  .sd-icon-row svg { width: 22px; height: 22px; }
  .sd-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: 22px 0 32px;
    font-size: 12px;
  }
  .sd-bg-mark { width: calc(var(--w) * 0.6); }
}
      `}</style>

      {BG_MARKS.map((m, i) => (
        <div
          key={i}
          className="sd-bg-mark"
          style={{
            top: m.top,
            left: m.left,
            width: m.width,
            opacity: m.opacity,
            transform: `rotate(${m.rotate}deg)`,
            color: m.color,
          }}
        >
          <LogoMark />
        </div>
      ))}

      <div className="sd-inner">
  <div className="sd-top">
    <div className="sd-brand">
      <a href="/" className="sd-brand-logo" aria-label="SINISDEATH home">
        <FooterLogo />
      </a>
    </div>

    <div className="sd-col">
      <h4>Legal System</h4>
      <nav className="sd-link-list">
        {LINKS.map((label) => (
          <a key={label} href="#">{label}</a>
        ))}
      </nav>
    </div>

    <div className="sd-col">
      <h4>Network</h4>
      <div className="sd-icon-row">
        <a href="#" aria-label="Instagram"><FaInstagram /></a>
        <a href="#" aria-label="Snapchat"><FaSnapchat /></a>
        <a href="#" aria-label="WhatsApp"><FaWhatsapp /></a>
        <a href="#" aria-label="TikTok"><FaTiktok /></a>
        <a href="#" aria-label="X"><FaXTwitter /></a>
      </div>
    </div>
  </div>

  <hr className="sd-divider" />

  <div className="sd-bottom">
    <span>&copy; 2026 SINISDEATH. All rights reserved.</span>
    <span className="sd-built">
      Built by
      <a href="https://www.instagram.com/bolutej?stkn=cjIzZG9oN3IxcGc2&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Bolu on X">
        <img src={boluIcon} alt="Bolu" className="sd-bolu-icon" />
      </a>
    </span>
  </div>
</div>
    </footer>
  );
}