
export const READING_INSTRUCTION = (subType: string, cefrLevel: string) => `
2. Dạng 2: Reading Comprehension (${subType}):
    - Tạo bài đọc phù hợp độ dài "${subType}" và trình độ ${cefrLevel}. Xuống dòng các đoạn rõ ràng.
    - Tạo 5 câu hỏi đọc hiểu.
    - Câu 1 chứa: [Bài đọc] + " <<<PASSAGE_DIVIDER>>> " + [Câu hỏi 1].
`;
