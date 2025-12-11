
import { TRUYEN } from './truyen';
import { THO } from './tho';
import { TUY_BUT } from './tuybut';
import { KICH } from './kich';
import { NGHI_LUAN } from './nghiluan';
import { BAO_CHI } from './baochi';

const LIT_MAP: Record<string, string> = {
  'Truyện': TRUYEN,
  'Thơ': THO,
  'Tùy bút': TUY_BUT,
  'Kịch': KICH,
  'Văn nghị luận': NGHI_LUAN,
  'Báo chí': BAO_CHI
};

export const getLiteraturePrompt = (questionType: string, grade: string) => {
    const templateToUse = LIT_MAP[questionType] || LIT_MAP['Truyện'];
    
    return `
MÔN: Ngữ văn.
THỂ LOẠI VĂN BẢN: ${questionType}.
SỐ LƯỢNG NGỮ LIỆU: 1 ngữ liệu (được tạo tự động).
SỐ LƯỢNG CÂU HỎI: 8 câu (chia làm 4 mức độ theo GDPT 2018).

NHIỆM VỤ QUAN TRỌNG:
1. Tạo ra một ngữ liệu (văn bản) sáng tác mới hoặc trích dẫn nổi tiếng thuộc thể loại "${questionType}" phù hợp lớp ${grade}.
    - VĂN BẢN PHẢI CÓ XUỐNG DÒNG RÕ RÀNG. Dùng ký tự \\n trong chuỗi JSON để xuống dòng.
    - Nếu là Thơ: Ngắt dòng thơ bằng \\n.

2. TẠO 8 CÂU HỎI TỰ LUẬN (ESSAY) THEO CẤU TRÚC:
${templateToUse}

QUY TẮC OUTPUT JSON (BẮT BUỘC):
- Tại câu hỏi đầu tiên (id=1):
    + questionText = [Nội dung ngữ liệu văn bản] + " <<<PASSAGE_DIVIDER>>> " + [Nội dung câu hỏi số 1].
- Các câu sau (id=2...8): Chỉ chứa nội dung câu hỏi.
- type: "Essay" (TUYỆT ĐỐI KHÔNG DÙNG MultipleChoice).
- options: [] (Mảng rỗng).
- correctAnswer: "Xem lời giải chi tiết".
- explanation: ĐÂY LÀ PHẦN ĐÁP ÁN CHI TIẾT.
    + Yêu cầu: Trả lời gạch đầu dòng rõ ràng, đi thẳng vào trọng tâm, ngắn gọn, súc tích.
    + KHÔNG viết lời dẫn dắt dài dòng (như "Câu trả lời là...", "Theo đoạn trích ta thấy...").
    + Viết thẳng ý chính.
`;
};
