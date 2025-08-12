import { LINE_TYPES } from './lineTypes';

export type QuranLineType = {
  line_id: number;
  page_id: number;
  line_number: number;
  line_type: LINE_TYPES;
  is_centered: 0 | 1;
  first_word_id: number;
  last_word_id: number;
  sura_id: number;
};
