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
        </style>
      </head>
      <body>
        ${data?.lines
          ?.map(
            l => `
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
                      : `<span class="word">${w.text_uthmani}</span>`
                  }
                  `;
                })
                .join(' ')}
            </div>
          `,
          )
          .join('')}
      </body>
    </html>
  `;
};
