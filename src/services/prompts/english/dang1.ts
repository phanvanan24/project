
export const CLOZE_TEST_INSTRUCTION = (cefrLevel: string) => `
1. Dạng 1: Cloze Test (Hoàn thành đoạn văn):
    - Tạo đoạn văn chuẩn CEFR ${cefrLevel} có 5 chỗ trống (1)-(5).
    - Tạo 5 câu hỏi trắc nghiệm tương ứng.
    - Câu 1 chứa: [Đoạn văn] + " <<<PASSAGE_DIVIDER>>> " + [Câu hỏi 1].
`;
