
import * as C1 from './chuong1';
import * as C2 from './chuong2';
import * as C3 from './chuong3';
import * as C4 from './chuong4';
import * as C5 from './chuong5';
import * as C6 from './chuong6';

const CHAPTER_MAP: Record<string, any> = {
  'Chương 1': C1,
  'Chương 2': C2,
  'Chương 3': C3,
  'Chương 4': C4,
  'Chương 5': C5,
  'Chương 6': C6
};

export function getMath12Prompt(chapterFullName: string, difficulty: string): string {
  // Extract simple key (e.g. "Chương 1" from "Chương 1. Ứng dụng đạo hàm...")
  const key = Object.keys(CHAPTER_MAP).find(k => chapterFullName.startsWith(k));
  
  if (!key) return "";
  
  const module = CHAPTER_MAP[key];
  
  // Map difficulty string to export constant
  switch (difficulty) {
    case 'Dễ': return module.NHAN_BIET;
    case 'Trung bình': return module.THONG_HIEU;
    case 'Khó': return module.VAN_DUNG;
    default: return module.THONG_HIEU;
  }
}
