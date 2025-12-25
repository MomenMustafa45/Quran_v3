export enum WORD_TYPES {
  word = 'word',
  end = 'end',
}

export type QuranWordType = {
  word_qpc_v4: string;
  audio_url: string;
  ayat_id: number;
  line_number: number;
  page_number: number;
  text_uthmani: number;
  type: WORD_TYPES;
  word_id: number;
  word_number: number;
};
