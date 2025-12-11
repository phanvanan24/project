
export const MATH12_DATA: Record<string, Record<string, string>> = {
  // --- CHƯƠNG 1: Ứng dụng đạo hàm ---
  'Chương 1. Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số': {
    'Dễ': `
VÍ DỤ MẪU (CHƯƠNG 1 - MỨC ĐỘ NHẬN BIẾT):
1. (Tiệm cận) Tiệm cận ngang của đồ thị hàm số $y = \\frac{3x-2}{4-x}$ là:
   A. $y=2$. B. $y=-3$. C. $y=3$. D. $x=4$.
2. (Đơn điệu) Cho hàm số $y=f(x)$ có bảng biến thiên như hình bên. Hàm số đồng biến trên khoảng nào?
3. (Cực trị) Điểm cực đại của đồ thị hàm số $y = x^3 - 3x^2 + 1$ là?
HÃY TẠO CÁC CÂU HỎI TƯƠNG TỰ VỀ TÍNH ĐƠN ĐIỆU, CỰC TRỊ, TIỆM CẬN CƠ BẢN.
`,
    'Trung bình': `
VÍ DỤ MẪU (CHƯƠNG 1 - MỨC ĐỘ THÔNG HIỂU):
1. (Tham số m) Tìm tất cả các giá trị của tham số m để hàm số $y = x^3 - 3mx^2 + 3(2m-1)x + 1$ đồng biến trên $\\mathbb{R}$.
2. (Đồ thị) Đồ thị sau đây là của hàm số nào? (Mô tả đồ thị hàm bậc 3 hoặc trùng phương).
3. (GTLN-GTNN) Giá trị nhỏ nhất của hàm số $y = x + \\frac{4}{x}$ trên đoạn $[1; 3]$ bằng bao nhiêu?
HÃY TẠO CÁC CÂU HỎI YÊU CẦU HIỂU BẢN CHẤT ĐỒ THỊ VÀ TÍNH TOÁN CƠ BẢN VỚI THAM SỐ.
`,
    'Khó': `
VÍ DỤ MẪU (CHƯƠNG 1 - MỨC ĐỘ VẬN DỤNG):
1. (Bài toán thực tế) Một người nông dân muốn rào một mảnh đất hình chữ nhật ven sông... Tìm diện tích lớn nhất.
2. (Tương giao) Tìm m để đồ thị hàm số cắt trục hoành tại 3 điểm phân biệt có hoành độ thỏa mãn điều kiện $x_1^2 + x_2^2 + x_3^2 = 10$.
3. (Hàm hợp) Cho đồ thị $f'(x)$. Hỏi hàm số $g(x) = f(x^2 - 2)$ nghịch biến trên khoảng nào?
HÃY TẠO CÁC CÂU HỎI VẬN DỤNG CAO, BÀI TOÁN THỰC TẾ TỐI ƯU HOÁ HOẶC HÀM HỢP.
`
  },

  // --- CHƯƠNG 2: Vectơ không gian ---
  'Chương 2. Vectơ và hệ trục tọa độ trong không gian': {
    'Dễ': `
VÍ DỤ MẪU (CHƯƠNG 2 - MỨC ĐỘ NHẬN BIẾT):
1. (Tọa độ) Trong không gian Oxyz, cho $\\vec{a} = (1; -2; 3)$. Độ dài của vectơ $\\vec{a}$ là?
2. (Trung điểm) Cho A(1;0;1), B(3;2;-1). Tọa độ trung điểm I của đoạn AB là?
3. (Phép toán) Tính tọa độ $\\vec{u} = 2\\vec{a} - \\vec{b}$.
TẬP TRUNG VÀO CÔNG THỨC TỌA ĐỘ CƠ BẢN.
`,
    'Trung bình': `
VÍ DỤ MẪU (CHƯƠNG 2 - MỨC ĐỘ THÔNG HIỂU):
1. (Tích vô hướng) Trong không gian Oxyz, tính tích vô hướng $\\vec{a} \\cdot \\vec{b}$ và suy ra góc giữa hai vectơ.
2. (Trọng tâm) Tìm tọa độ trọng tâm G của tam giác ABC khi biết tọa độ 3 đỉnh.
3. (Tích có hướng) Tính tích có hướng $[\\vec{a}, \\vec{b}]$ để tìm vectơ pháp tuyến.
`,
    'Khó': `
VÍ DỤ MẪU (CHƯƠNG 2 - MỨC ĐỘ VẬN DỤNG):
1. (Cực trị vectơ) Cho các điểm A, B, C cố định. Tìm điểm M thuộc mặt phẳng (Oxy) sao cho $|\\vec{MA} + \\vec{MB} + 2\\vec{MC}|$ đạt giá trị nhỏ nhất.
2. (Ứng dụng) Ứng dụng tích có hướng để tính diện tích tam giác trong không gian hoặc thể tích tứ diện.
`
  },

  // --- CHƯƠNG 3: Số liệu ghép nhóm ---
  'Chương 3. Các số đo đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm': {
    'Dễ': `
VÍ DỤ MẪU (CHƯƠNG 3 - MỨC ĐỘ NHẬN BIẾT):
1. (Khoảng biến thiên) Cho mẫu số liệu ghép nhóm. Khoảng biến thiên $R$ được tính bằng công thức nào?
2. (Tứ phân vị) Xác định nhóm chứa tứ phân vị thứ nhất $Q_1$.
TẬP TRUNG VÀO ĐỊNH NGHĨA VÀ CÔNG THỨC CƠ BẢN.
`,
    'Trung bình': `
VÍ DỤ MẪU (CHƯƠNG 3 - MỨC ĐỘ THÔNG HIỂU):
1. (Tính toán) Cho bảng số liệu ghép nhóm về thời gian xem tivi. Hãy tính phương sai và độ lệch chuẩn.
2. (So sánh) Cho hai mẫu số liệu. Mẫu nào có độ phân tán lớn hơn dựa trên khoảng tứ phân vị?
`,
    'Khó': `
VÍ DỤ MẪU (CHƯƠNG 3 - MỨC ĐỘ VẬN DỤNG):
1. (Xử lý số liệu) Kết hợp kiến thức xác suất để phân tích độ ổn định của một quy trình sản xuất dựa trên phương sai mẫu số liệu ghép nhóm.
2. (Sai số) Đánh giá ảnh hưởng của số liệu bất thường (outliers) đến độ lệch chuẩn.
`
  },

  // --- CHƯƠNG 4: Nguyên hàm & Tích phân ---
  'Chương 4. Nguyên hàm và tích phân': {
    'Dễ': `
VÍ DỤ MẪU (CHƯƠNG 4 - MỨC ĐỘ NHẬN BIẾT):
1. (Nguyên hàm CB) Nguyên hàm của hàm số $f(x) = x^2 + e^x$ là?
2. (Tích phân CB) Tính tích phân $I = \\int_{0}^{1} 2x dx$.
3. (Tính chất) Nếu $\\int_{1}^{2} f(x)dx = 3$ thì $\\int_{1}^{2} 2f(x)dx$ bằng?
`,
    'Trung bình': `
VÍ DỤ MẪU (CHƯƠNG 4 - MỨC ĐỘ THÔNG HIỂU):
1. (Đổi biến) Tính tích phân $I = \\int_{0}^{\\pi/2} \\sin^2 x \\cos x dx$ bằng phương pháp đổi biến số.
2. (Từng phần) Tính nguyên hàm $\\int x \\ln x dx$.
3. (Diện tích) Diện tích hình phẳng giới hạn bởi $y=x^2$ và $y=x$ là?
`,
    'Khó': `
VÍ DỤ MẪU (CHƯƠNG 4 - MỨC ĐỘ VẬN DỤNG):
1. (Ứng dụng thực tế) Một vật chuyển động với vận tốc $v(t)$. Tính quãng đường đi được.
2. (Thể tích) Tính thể tích vật thể tròn xoay khi quay hình phẳng giới hạn bởi các đường cong phức tạp.
3. (Hàm ẩn) Cho $\\int f(x)dx = ...$. Tính $\\int x f'(x) dx$.
`
  },

  // --- CHƯƠNG 5: Phương pháp tọa độ Oxyz ---
  'Chương 5. Phương pháp tọa độ trong không gian': {
    'Dễ': `
VÍ DỤ MẪU (CHƯƠNG 5 - MỨC ĐỘ NHẬN BIẾT):
1. (Mặt cầu) Mặt cầu $(S): (x-1)^2 + (y+2)^2 + z^2 = 9$ có tâm I và bán kính R là?
2. (Mặt phẳng) Vectơ pháp tuyến của mặt phẳng $(P): 2x - y + 3z - 1 = 0$ là?
3. (Đường thẳng) Vectơ chỉ phương của đường thẳng $d: \\frac{x-1}{2} = \\frac{y}{3} = \\frac{z+1}{-1}$.
`,
    'Trung bình': `
VÍ DỤ MẪU (CHƯƠNG 5 - MỨC ĐỘ THÔNG HIỂU):
1. (Viết PT) Viết phương trình mặt phẳng đi qua A(1;2;3) và vuông góc với đường thẳng d.
2. (Khoảng cách) Tính khoảng cách từ điểm M đến mặt phẳng (P).
3. (Góc) Tính góc giữa đường thẳng và mặt phẳng.
`,
    'Khó': `
VÍ DỤ MẪU (CHƯƠNG 5 - MỨC ĐỘ VẬN DỤNG):
1. (Min/Max hình học) Trong không gian Oxyz, tìm điểm M thuộc (P) sao cho MA + MB nhỏ nhất.
2. (Mặt cầu tiếp xúc) Viết phương trình mặt cầu đi qua 3 điểm và có tâm thuộc mặt phẳng (P).
`
  },

  // --- CHƯƠNG 6: Xác suất ---
  'Chương 6. Xác suất có điều kiện': {
    'Dễ': `
VÍ DỤ MẪU (CHƯƠNG 6 - MỨC ĐỘ NHẬN BIẾT):
1. (Định nghĩa) Công thức tính xác suất có điều kiện $P(A|B)$ là gì?
2. (Nhận diện) Bài toán nào sau đây cần dùng công thức xác suất toàn phần?
`,
    'Trung bình': `
VÍ DỤ MẪU (CHƯƠNG 6 - MỨC ĐỘ THÔNG HIỂU):
1. (Tính toán) Cho $P(A)=0.4, P(B)=0.5, P(A \\cup B)=0.7$. Tính $P(A|B)$.
2. (Sơ đồ cây) Sử dụng sơ đồ hình cây để tính xác suất lấy được phế phẩm từ hai nhà máy.
`,
    'Khó': `
VÍ DỤ MẪU (CHƯƠNG 6 - MỨC ĐỘ VẬN DỤNG):
1. (Bayes) Bài toán xét nghiệm bệnh (Độ nhạy, độ đặc hiệu). Tính xác suất người đó thực sự bị bệnh khi kết quả xét nghiệm dương tính.
2. (Thực tế) Ứng dụng công thức xác suất toàn phần giải quyết bài toán rủi ro trong kinh tế.
`
  }
};
