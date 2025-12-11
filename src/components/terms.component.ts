
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto fade-in py-12 px-4">
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight uppercase">
          Điều khoản sử dụng <br>
          <span class="text-indigo-600 text-xl md:text-2xl mt-2 block">Hệ thống tương tác & Học tập thông minh LimVA</span>
        </h1>
        <p class="text-slate-500 font-medium bg-slate-100 inline-block px-4 py-1 rounded-full text-sm">Cập nhật lần cuối: 29/11/2025</p>
      </div>
      
      <div class="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-12 space-y-8 text-slate-700 leading-relaxed text-justify">
        
        <!-- Intro -->
        <div class="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
           <p class="mb-4">Chào mừng bạn đến với <strong>LimVA</strong> – hệ thống học tập thông minh hỗ trợ học sinh tự học, kiểm tra kiến thức, sinh đề tự động và trải nghiệm các tiện ích học tập như thí nghiệm vật lý, hình học không gian và thi thử.</p>
           <p>Khi sử dụng LimVA, bạn đồng ý tuân theo các Điều khoản Sử dụng (sau đây gọi là “Điều khoản”). Vui lòng đọc kỹ trước khi sử dụng dịch vụ.</p>
        </div>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
             <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">1</span>
             Chấp nhận Điều khoản
          </h2>
          <p class="mb-2">Bằng việc truy cập hoặc sử dụng LimVA, bạn xác nhận rằng:</p>
          <ul class="list-disc pl-6 space-y-2 marker:text-indigo-500">
            <li>Bạn đã đọc, hiểu và đồng ý tuân thủ toàn bộ Điều khoản này.</li>
            <li>Nếu bạn dưới 12 tuổi, việc sử dụng LimVA phải được sự đồng ý của cha mẹ hoặc người giám hộ hợp pháp.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
             <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">2</span>
             Mục đích sử dụng
          </h2>
          <p class="mb-2">LimVA được thiết kế dành cho học sinh nhằm:</p>
          <ul class="list-disc pl-6 space-y-2 marker:text-indigo-500 mb-4">
            <li>Kiểm tra bài làm và đánh giá.</li>
            <li>Sinh câu hỏi, sinh đề thi, đề kiểm tra theo ma trận hoặc theo đề cương.</li>
            <li>Sử dụng các tiện ích học tập như:
               <ul class="list-[circle] pl-6 mt-2 space-y-1 text-slate-600">
                  <li>Thí nghiệm vật lý mô phỏng.</li>
                  <li>Công cụ hình học không gian.</li>
                  <li>Nền tảng thi thử trực tuyến.</li>
               </ul>
            </li>
          </ul>
          <p class="font-bold text-slate-800 bg-red-50 p-3 rounded-lg border border-red-100 text-sm">⚠️ Người dùng cam kết sử dụng LimVA đúng mục đích học tập, không sử dụng cho hành vi gian lận trong thi cử thực tế hoặc các hành vi vi phạm pháp luật.</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
             <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">3</span>
             Tài khoản và bảo mật
          </h2>
          <ul class="list-disc pl-6 space-y-2 marker:text-indigo-500">
            <li>Người dùng phải cung cấp thông tin chính xác khi đăng ký tài khoản.</li>
            <li>Bạn chịu trách nhiệm bảo mật tài khoản và mật khẩu của mình.</li>
            <li>Mọi hoạt động xảy ra dưới tài khoản của bạn đều được coi là do chính bạn thực hiện.</li>
            <li>LimVA có quyền khóa hoặc tạm ngưng tài khoản nếu phát hiện hành vi bất thường, gian lận hoặc vi phạm Điều khoản.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
             <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">4</span>
             Quyền và nghĩa vụ của người dùng
          </h2>
          <div class="space-y-4">
             <div>
                <strong class="text-indigo-700 block mb-1">Người dùng được quyền:</strong>
                <ul class="list-disc pl-6 space-y-1 marker:text-indigo-500">
                   <li>Truy cập và sử dụng đầy đủ các tính năng của hệ thống.</li>
                   <li>Báo lỗi, góp ý và yêu cầu hỗ trợ kỹ thuật.</li>
                   <li>Xóa hoặc yêu cầu xóa tài khoản và dữ liệu cá nhân theo quy định pháp luật.</li>
                </ul>
             </div>
             <div>
                <strong class="text-red-600 block mb-1">Người dùng không được phép:</strong>
                <ul class="list-disc pl-6 space-y-1 marker:text-red-500">
                   <li>Sử dụng hệ thống để gian lận trong kiểm tra hoặc thi cử chính thức.</li>
                   <li>Tạo nội dung, câu hỏi hoặc đề thi vi phạm pháp luật, thuần phong mỹ tục.</li>
                   <li>Can thiệp trái phép vào hệ thống, thay đổi dữ liệu hoặc cố gắng truy cập vào tài khoản của người khác.</li>
                   <li>Sao chép, phân phối, bán hoặc sử dụng nội dung của LimVA cho mục đích thương mại mà không được phép.</li>
                </ul>
             </div>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
             <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">5</span>
             Quyền sở hữu trí tuệ
          </h2>
          <ul class="list-disc pl-6 space-y-2 marker:text-indigo-500">
            <li>Toàn bộ nội dung, công cụ, thuật toán sinh đề, giao diện, mã nguồn và dữ liệu trên LimVA thuộc sở hữu của Ban phát triển LimVA.</li>
            <li>Người dùng chỉ được phép sử dụng nội dung cho mục đích học tập cá nhân.</li>
            <li>Mọi hành vi sao chép hoặc sử dụng trái phép đều bị cấm.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
             <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">6</span>
             Dữ liệu và quyền riêng tư
          </h2>
          <p class="mb-2">LimVA cam kết bảo vệ thông tin người dùng. Thông tin thu thập bao gồm:</p>
          <ul class="list-disc pl-6 space-y-1 marker:text-indigo-500 mb-4">
            <li>Thông tin tài khoản (email, tên hiển thị…)</li>
            <li>Lịch sử học tập, bài làm, kết quả kiểm tra.</li>
            <li>Dữ liệu sử dụng hệ thống nhằm cải thiện chất lượng dịch vụ.</li>
          </ul>
          <p class="mb-2 font-bold text-slate-800">Cam kết từ LimVA:</p>
          <ul class="list-disc pl-6 space-y-1 marker:text-indigo-500">
            <li>Không bán, chia sẻ dữ liệu cá nhân của bạn cho bên thứ ba.</li>
            <li>Chỉ sử dụng dữ liệu để phân tích, tối ưu tính năng học tập và đảm bảo trải nghiệm cá nhân hóa.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
             <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">7</span>
             Sinh đề và chấm bài bằng AI
          </h2>
          <ul class="list-disc pl-6 space-y-2 marker:text-indigo-500">
            <li>Các tính năng sinh đề, sinh câu hỏi, chấm bài và gợi ý được hỗ trợ bởi trí tuệ nhân tạo.</li>
            <li>Kết quả sinh ra có thể không hoàn toàn chính xác 100%; người dùng cần tự kiểm tra và sử dụng có trách nhiệm.</li>
            <li>LimVA không chịu trách nhiệm trong trường hợp người dùng sử dụng kết quả AI vào kỳ thi chính thức hoặc các mục đích ngoài phạm vi học tập.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
             <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">8</span>
             Trách nhiệm và giới hạn trách nhiệm
          </h2>
          <div class="space-y-4">
             <div>
                <strong class="text-slate-800 block mb-1">LimVA không chịu trách nhiệm đối với:</strong>
                <ul class="list-disc pl-6 space-y-1 marker:text-slate-400">
                   <li>Thiệt hại phát sinh từ việc sử dụng sai mục đích.</li>
                   <li>Sự gián đoạn dịch vụ do bảo trì, sự cố kỹ thuật, hoặc nguyên nhân bất khả kháng.</li>
                   <li>Nội dung người dùng tự tải lên hoặc tạo ra từ hệ thống.</li>
                   <li>Lịch sử sinh đề và chấm bài sẽ không được lưu lại.</li>
                </ul>
             </div>
             <div>
                <strong class="text-slate-800 block mb-1">Người dùng tự chịu trách nhiệm về:</strong>
                <ul class="list-disc pl-6 space-y-1 marker:text-slate-400">
                   <li>Mọi hành vi sử dụng tài khoản của mình.</li>
                   <li>Việc sử dụng nội dung sinh ra từ AI cho mục đích học tập.</li>
                   <li>Lịch sử sinh đề và chấm bài người dùng cần thì phải lưu lại.</li>
                </ul>
             </div>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
             <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">9</span>
             Thay đổi hoặc ngừng cung cấp dịch vụ
          </h2>
          <p class="mb-2">LimVA có thể:</p>
          <ul class="list-disc pl-6 space-y-2 marker:text-indigo-500">
             <li>Cập nhật, thay đổi giao diện hoặc chức năng mà không cần thông báo trước.</li>
             <li>Tạm dừng hoặc chấm dứt một phần hoặc toàn bộ dịch vụ trong trường hợp cần thiết.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
             <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">10</span>
             Sửa đổi Điều khoản
          </h2>
          <ul class="list-disc pl-6 space-y-2 marker:text-indigo-500">
             <li>LimVA có quyền điều chỉnh Điều khoản bất kỳ lúc nào.</li>
             <li>Khi Điều khoản được cập nhật, hệ thống sẽ thông báo cho người dùng.</li>
             <li>Việc tiếp tục sử dụng LimVA đồng nghĩa với việc bạn chấp nhận phiên bản Điều khoản mới.</li>
          </ul>
        </section>

        <section class="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg mt-8">
          <h2 class="text-xl font-bold mb-3 flex items-center gap-3">
             <span class="w-8 h-8 rounded-lg bg-white text-indigo-900 flex items-center justify-center text-sm font-bold shadow-sm">11</span>
             Liên hệ
          </h2>
          <p class="mb-4 text-indigo-100">Mọi thắc mắc, yêu cầu hỗ trợ hoặc báo cáo vi phạm, vui lòng liên hệ:</p>
          <div class="flex items-center gap-3 bg-white/10 p-4 rounded-xl border border-white/20">
             <div class="w-10 h-10 rounded-full bg-white text-indigo-900 flex items-center justify-center text-xl">📧</div>
             <div>
                <p class="text-xs text-indigo-200 uppercase font-bold tracking-wider">Email hỗ trợ</p>
                <a href="mailto:admin@limva.edu.vn" class="text-lg font-bold hover:text-white transition-colors underline decoration-indigo-400 underline-offset-4">admin@limva.edu.vn</a>
             </div>
          </div>
        </section>

      </div>
    </div>
  `
})
export class TermsComponent {}
