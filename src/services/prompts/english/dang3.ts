
export const REARRANGEMENT_INSTRUCTION = (subType: string) => `
3. Dạng 3: Rearrangement (${subType}):
    - Nếu là Sắp xếp hội thoại: Cho các câu lộn xộn. Xuống dòng từng câu thoại A, B, C...
    - Nếu là Sắp xếp đoạn văn: Cho các câu ý lộn xộn.
    - Output dưới dạng câu hỏi trắc nghiệm. Options là các phương án sắp xếp (VD: "A. 1-3-2-4").
`;
