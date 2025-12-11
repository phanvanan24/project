
import { CLOZE_TEST_INSTRUCTION } from './dang1';
import { READING_INSTRUCTION } from './dang2';
import { REARRANGEMENT_INSTRUCTION } from './dang3';
import { NOTICE_INSTRUCTION } from './dang4';
import { LEAFLET_INSTRUCTION } from './dang5';

export const getEnglishPrompt = (questionType: string, subType: string, cefrLevel: string, numTasks: number) => {
    return `
MÔN: Tiếng Anh (Ngoại ngữ).
DẠNG BÀI CHÍNH: ${questionType}.
CHI TIẾT DẠNG (Sub-type): ${subType}.
TRÌNH ĐỘ CEFR MỤC TIÊU: ${cefrLevel}.

YÊU CẦU: HÃY TẠO ĐÚNG ${numTasks} BÀI TẬP (TASKS) RIÊNG BIỆT.
Ví dụ: Nếu yêu cầu 2 Tasks, hãy tạo Task 1 (Câu 1-5) và Task 2 (Câu 6-10).

QUY TẮC FORMAT BÀI ĐỌC/ĐỀ BÀI (RẤT QUAN TRỌNG):
- Ngữ liệu và câu hỏi phải phù hợp với trình độ ${cefrLevel}.
- Trong phần nội dung bài đọc (Passage), hãy dùng \\n để ngắt đoạn văn rõ ràng.
- QUY TẮC TÁCH NGỮ LIỆU: Với MỖI Task mới (bài đọc mới), câu hỏi đầu tiên của Task đó PHẢI chứa Ngữ liệu theo định dạng:
    [Nội dung bài đọc/đề bài] + " <<<PASSAGE_DIVIDER>>> " + [Nội dung câu hỏi đầu tiên của Task]
    
Ví dụ Logic:
- Task 1 (Câu 1-5): Câu 1 chứa: Bài đọc 1 <<<PASSAGE_DIVIDER>>> Câu hỏi 1. Câu 2,3,4,5 chỉ chứa câu hỏi.
- Task 2 (Câu 6-10): Câu 6 chứa: Bài đọc 2 <<<PASSAGE_DIVIDER>>> Câu hỏi 6. Câu 7,8,9,10 chỉ chứa câu hỏi.

HƯỚNG DẪN CHI TIẾT DẠNG BÀI:
${CLOZE_TEST_INSTRUCTION(cefrLevel)}
${READING_INSTRUCTION(subType, cefrLevel)}
${REARRANGEMENT_INSTRUCTION(subType)}
${NOTICE_INSTRUCTION(cefrLevel)}
${LEAFLET_INSTRUCTION(cefrLevel)}
`;
};
