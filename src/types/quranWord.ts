import { WORD_TYPES } from './wordTypes';

export type QuranWordType = {
  audio_url: string;
  ayat_id: number;
  line_number: number;
  page_number: number;
  text_uthmani: number;
  type: WORD_TYPES;
  word_id: number;
  word_number: number;
};
