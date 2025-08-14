import { QuranPageData } from '../types/quranPageData';

export const buildPageHTML = (
  data: QuranPageData,
  pageId: number,
  loadedFont: string,
) => {
  const centerPage = pageId < 3 ? 'center' : 'flex-start';

  return `
    <html lang="ar">
      <head>
        <meta charset="UTF-8" />
        <style>
         @font-face {
            font-family: 'UthmaniHafs';
            src: url(data:font/truetype;base64,${loadedFont}) format('truetype');
          }
          body {
            margin: 0;
            padding: 10px;
            display: flex;
            flex-direction: column;
            justify-content: ${centerPage};
            background-color: #fff;
            padding: 3vh 6vw;
            font-family: 'UthmaniHafs';
            flex: 1;
            padding-bottom: 0;
          }
          .line {
            display: flex;
            flex-direction: row-reverse;
            align-items: flex-start;
            width: 100%;
            white-space: nowrap;
            height:6.5vh;
          }
          .line.center {
            justify-content: center;
          }
          .line.space-between {
            justify-content: space-between;
          }
          .word {
            font-size: 4.8vw;
            white-space: nowrap;
        
          }
            .surah_title{
            display: flex;
            width: 100%;
            white-space: nowrap;
            height:6.5vh;
            background-color: red;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            }
        </style>
      </head>
      <body>
        ${data?.lines
          ?.map(l => {
            if (l.line.line_type === 'surah_name') {
              return `
              <div class="surah_title">
              
              <svg
  viewBox="0 0 1200 300"
  width="1200"
  height="300"
  style="display:block"
  xmlns="http://www.w3.org/2000/svg"
  aria-label="Quran title frame"
>
  <defs>
    <!-- Small diamond motif (gold + red) -->
    <pattern id="diamondRow" patternUnits="userSpaceOnUse" x="0" y="0" width="52" height="50">
      <g transform="translate(26,25)">
        <path d="M0,-18 L14,0 0,18 -14,0 Z" fill="#cf9b2b"/>
        <path d="M0,-11 L8,0 0,11 -8,0 Z" fill="#b0302f"/>
        <path d="M0,-5 L4,0 0,5 -4,0 Z" fill="#fff5cf"/>
      </g>
    </pattern>

    <!-- Interlaced band (green/red) -->
    <pattern id="braid" patternUnits="userSpaceOnUse" width="40" height="16">
      <path d="M0,8 C6,0 14,0 20,8 C26,16 34,16 40,8" fill="none" stroke="#1b7a4a" stroke-width="4"/>
      <path d="M0,8 C6,16 14,16 20,8 C26,0 34,0 40,8" fill="none" stroke="#b0302f" stroke-width="4"/>
    </pattern>

    <!-- Tiny checker edge -->
    <pattern id="checks" patternUnits="userSpaceOnUse" width="8" height="8">
      <rect x="0" y="0" width="8" height="8" fill="#165d3b"/>
      <rect x="0" y="0" width="4" height="4" fill="#ffffff"/>
      <rect x="4" y="4" width="4" height="4" fill="#ffffff"/>
    </pattern>

    <!-- Corner floral (compact) -->
    <g id="cornerFloral">
      <path d="M0,0 C15,-8 34,-8 49,0 C63,7 74,20 78,35 C81,49 77,64 67,75 C58,84 45,89 33,88 C19,87 6,80 0,69"
            fill="none" stroke="#b0302f" stroke-width="6"/>
      <path d="M18,22 C26,14 39,13 48,20 C55,25 58,35 55,44 C52,53 43,60 33,60 C23,60 14,54 11,45"
            fill="#1b7a4a"/>
      <path d="M62,10 C72,16 79,27 80,39" fill="none" stroke="#cf9b2b" stroke-width="6"/>
      <path d="M6,66 C10,75 18,82 27,86" fill="none" stroke="#cf9b2b" stroke-width="6"/>
      <path d="M51,24 a8,8 0 1,0 0.1,0" fill="#b0302f"/>
      <path d="M22,44 a6,6 0 1,0 0.1,0" fill="#fff5cf"/>
    </g>
  </defs>

  <!-- OUTER FRAME (strokes inset; no bleed outside 1200×300) -->
  <rect x="1.5" y="1.5" width="1197" height="297" fill="none" stroke="#165d3b" stroke-width="3"/>
  <rect x="6" y="6" width="1188" height="288" fill="url(#checks)"/>
  <rect x="10.5" y="10.5" width="1179" height="279" fill="none" stroke="#b0302f" stroke-width="3"/>
  <rect x="16" y="16" width="1168" height="268" fill="url(#braid)"/>
  <rect x="20" y="20" width="1160" height="260" fill="#fbf4e2"/>

  <!-- INNER PANEL -->
  <rect x="48" y="48" width="1104" height="204" rx="6" fill="#ffffff"/>

  <!-- Top & bottom motif rows -->
  <rect x="70" y="58" width="1060" height="50" fill="url(#diamondRow)" opacity="0.95"/>
  <rect x="70" y="184" width="1060" height="50" fill="url(#diamondRow)" opacity="0.95"/>

  <!-- Corner florals (mirrored) -->
  <g transform="translate(48,48) scale(0.85)">
    <use href="#cornerFloral"/>
  </g>
  <g transform="translate(1152,48) scale(-0.85,0.85)">
    <use href="#cornerFloral"/>
  </g>
  <g transform="translate(48,252) scale(0.85,-0.85)">
    <use href="#cornerFloral"/>
  </g>
  <g transform="translate(1152,252) scale(-0.85,-0.85)">
    <use href="#cornerFloral"/>
  </g>

  <!-- Center text (edit this) -->
  <text x="600" y="165" text-anchor="middle"
        font-size="54" font-family="UthmanicHafs, 'Scheherazade New', serif"
        fill="#1b1b1b">
${l.line.sura_id || ''}  </text>
</svg>
</div>
`;
            }
            if (l.line.line_type === 'basmallah') {
              return `<div class="line center"><span class="word">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</span></div>`;
            }
            return `
            <div class="line ${
              l.line.is_centered === 1 ? 'center' : 'space-between'
            }">
            
              ${l.words
                .map(w => {
                  const isArabicNumber = /^[\u0660-\u0669]+$/.test(
                    String(w.text_uthmani),
                  );

                  return `
                  ${
                    isArabicNumber
                      ? `
                      <span class="word">&#x${'FD3E'}; ${
                          w.text_uthmani
                        } &#x${'FD3F'};</span>
                      `
                      : `<span class="word" onclick="window.ReactNativeWebView.postMessage('${w.audio_url}')">${w.text_uthmani}</span>`
                  }
                  `;
                })
                .join(' ')}
            </div>
          `;
          })
          .join('')}
      </body>
    </html>
  `;
};
