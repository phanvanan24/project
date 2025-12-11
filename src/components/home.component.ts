
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-24 pb-20 overflow-x-hidden">
      
      <!-- 1. HERO SECTION -->
      <section class="relative pt-10 pb-10 sm:pt-20 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 text-center lg:text-left lg:flex lg:items-center lg:justify-between animate-fade-in-up">
        
        <!-- Background Blobs -->
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div class="absolute top-0 right-40 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <!-- Text Content -->
        <div class="relative z-10 lg:w-1/2 space-y-8">
           <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2 hover:bg-indigo-100 cursor-pointer transition shadow-sm">
              <span>Phiên bản LimVA 2.0</span>
              <span class="w-1 h-1 rounded-full bg-indigo-600"></span>
              <span>Tối ưu hóa cho GDPT 2018</span>
           </div>
           
           <h1 class="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
             Bạn muốn tạo gì <br>
             <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-500">HÔM NAY?</span>
           </h1>
           
           <p class="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
             Trải nghiệm hệ thống học tập và tương tác thông minh với khả năng kiểm tra và tạo đề tự động bằng LimVA AI — giúp bạn học nhanh hơn, nắm chắc kiến thức hơn, chinh phục mục tiêu 8+ mỗi môn và tiết kiệm đến 90% thời gian ôn luyện
           </p>

           <div class="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a routerLink="/grader" class="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:-translate-y-1 flex items-center justify-center gap-2">
                 Chấm bài ngay <span class="text-slate-400">→</span>
              </a>
              <a routerLink="/exam" class="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all hover:border-slate-300 flex items-center justify-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/><path d="M3 7h2"/><path d="M3 11h4"/><path d="M3 15h4"/><path d="M3 19h2"/></svg>
                 Sinh đề thi
              </a>
           </div>
           
           <div class="flex items-center gap-6 justify-center lg:justify-start pt-6 opacity-70">
              <div class="flex -space-x-3">
                 <img class="w-10 h-10 rounded-full border-2 border-white" src="https://picsum.photos/100/100?random=1" alt="User">
                 <img class="w-10 h-10 rounded-full border-2 border-white" src="https://picsum.photos/100/100?random=2" alt="User">
                 <img class="w-10 h-10 rounded-full border-2 border-white" src="https://picsum.photos/100/100?random=3" alt="User">
                 <div class="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">+2k</div>
              </div>
              <div class="text-sm">
                 <div class="flex text-yellow-400 text-xs mb-0.5">★★★★★</div>
                 <span class="font-bold text-slate-700">Sẵn sàng phục vụ hàng ngàn học sinh với công nghệ tự học thông minh.</span>
              </div>
           </div>
        </div>

        <!-- Abstract Hero Visual -->
        <div class="relative z-10 mt-16 lg:mt-0 lg:w-5/12 perspective-1000 hidden md:block">
           <div class="relative w-full aspect-square max-w-md mx-auto">
              <!-- Floating Cards Visual -->
              <div class="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] rotate-3 opacity-10 blur-2xl animate-pulse"></div>
              
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-float">
                  <!-- Header Browser-like -->
                  <div class="h-10 border-b border-slate-100 flex items-center px-4 gap-2 bg-slate-50/50">
                     <div class="w-3 h-3 rounded-full bg-red-400"></div>
                     <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                     <div class="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <!-- Content Simulation -->
                  <div class="p-6 space-y-4 flex-grow relative overflow-hidden">
                     <div class="flex justify-between items-center mb-4">
                        <div class="h-4 bg-slate-200 rounded w-1/3"></div>
                        <div class="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">AI</div>
                     </div>
                     <div class="h-32 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-center relative overflow-hidden group">
                        <div class="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
                        <span class="text-indigo-600 font-mono text-lg font-bold z-10 bg-white/80 px-4 py-2 rounded-lg backdrop-blur-sm shadow-sm">LimVA Analysis...</span>
                        
                        <!-- Scanning Effect -->
                        <div class="absolute top-0 left-0 w-full h-1 bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
                     </div>
                     <div class="space-y-2">
                        <div class="flex gap-2">
                           <div class="h-2 bg-green-100 rounded w-1/4"></div>
                           <div class="h-2 bg-slate-100 rounded w-3/4"></div>
                        </div>
                        <div class="flex gap-2">
                           <div class="h-2 bg-red-100 rounded w-1/4"></div>
                           <div class="h-2 bg-slate-100 rounded w-1/2"></div>
                        </div>
                        <div class="h-10 bg-slate-900 rounded-lg w-full mt-2 opacity-10"></div>
                     </div>
                  </div>
              </div>

              <!-- Floating Element 1 -->
              <div class="absolute -right-8 top-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 animate-float-delayed">
                 <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-inner">✓</div>
                    <div>
                       <div class="text-xs text-slate-400 font-bold uppercase">Độ chính xác</div>
                       <div class="text-lg font-bold text-slate-800">98.5%</div>
                    </div>
                 </div>
              </div>
              
               <!-- Floating Element 2 -->
              <div class="absolute -left-8 bottom-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 animate-float" style="animation-delay: 1.5s;">
                 <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">TeX</div>
                    <div>
                       <div class="text-xs text-slate-400 font-bold uppercase">Xuất bản</div>
                       <div class="text-lg font-bold text-slate-800">LaTeX / PDF</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <!-- 2. STATS BAR -->
      <section class="bg-slate-900 py-12 -mx-4 sm:-mx-6 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
           <div class="absolute top-[-50%] left-[-10%] w-[120%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
        </div>
        <div class="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
           <div class="space-y-1">
              <div class="text-4xl font-black text-white tabular-nums">{{ stats().examsCreated | number }}</div>
              <div class="text-indigo-300 font-medium text-sm uppercase tracking-wide">Đề thi đã tạo</div>
           </div>
           <div class="space-y-1">
              <div class="text-4xl font-black text-white tabular-nums">{{ stats().papersGraded | number }}</div>
              <div class="text-indigo-300 font-medium text-sm uppercase tracking-wide">Bài chấm tự động</div>
           </div>
           <div class="space-y-1">
              <div class="text-4xl font-black text-white tabular-nums">{{ stats().studentsRegistered | number }}</div>
              <div class="text-indigo-300 font-medium text-sm uppercase tracking-wide">Học sinh tin dùng</div>
           </div>
           <div class="space-y-1">
              <div class="text-4xl font-black text-white">24/7</div>
              <div class="text-indigo-300 font-medium text-sm uppercase tracking-wide">AI Hỗ trợ học tập</div>
           </div>
        </div>
      </section>

      <!-- 3. HOW IT WORKS -->
      <section class="max-w-6xl mx-auto px-4">
         <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-slate-900 mb-4">Quy trình đơn giản</h2>
            <p class="text-slate-500 max-w-2xl mx-auto">Chỉ mất 3 bước để bạn có thể tạo ra một đề thi chất lượng hoặc chấm xong một bài bất kì.</p>
         </div>
         
         <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <!-- Connector Line -->
            <div class="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 z-0"></div>

            <!-- Step 1 -->
            <div class="relative z-10 flex flex-col items-center text-center group">
               <div class="w-24 h-24 bg-white rounded-2xl shadow-lg border border-indigo-50 flex items-center justify-center text-4xl mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                  📤
               </div>
               <div class="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-md shadow-indigo-200">BƯỚC 1</div>
               <h3 class="text-xl font-bold text-slate-800 mb-2">Tải lên dữ liệu</h3>
               <p class="text-slate-500 text-sm leading-relaxed px-4">Chụp ảnh đề bài, bài làm học sinh hoặc tải lên file PDF ma trận đề thi.</p>
            </div>

            <!-- Step 2 -->
            <div class="relative z-10 flex flex-col items-center text-center group">
               <div class="w-24 h-24 bg-white rounded-2xl shadow-lg border border-indigo-50 flex items-center justify-center text-4xl mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                  🧠
               </div>
               <div class="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-md shadow-indigo-200">BƯỚC 2</div>
               <h3 class="text-xl font-bold text-slate-800 mb-2">AI Phân tích</h3>
               <p class="text-slate-500 text-sm leading-relaxed px-4">LimVA AI xử lý hình ảnh, nhận diện chữ viết và so sánh logic.</p>
            </div>

            <!-- Step 3 -->
            <div class="relative z-10 flex flex-col items-center text-center group">
               <div class="w-24 h-24 bg-white rounded-2xl shadow-lg border border-indigo-50 flex items-center justify-center text-4xl mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                  ✨
               </div>
               <div class="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-md shadow-indigo-200">BƯỚC 3</div>
               <h3 class="text-xl font-bold text-slate-800 mb-2">Nhận kết quả</h3>
               <p class="text-slate-500 text-sm leading-relaxed px-4">Nhận điểm số chi tiết, lời giải mẫu hoặc file đề thi Word/PDF chuẩn form.</p>
            </div>
         </div>
      </section>

      <!-- 4. FEATURES BENTO GRID -->
      <section class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12">
           <h2 class="text-3xl font-bold text-slate-900 mb-4">Công nghệ AI đột phá</h2>
           <p class="text-slate-500 max-w-3xl mx-auto">Chúng tôi ứng dụng LimVA AI kết hợp với các thuật toán xử lý ảnh tiên tiến nhằm tạo ra trải nghiệm học tập trực quan, chính xác và hiệu quả nhất cho người học.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
           
           <!-- Feature 1: Large Card -->
           <div class="md:col-span-2 md:row-span-2 group relative bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col">
              <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="p-8 md:p-12 relative z-10 flex flex-col h-full">
                 <div class="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl border border-slate-100 mb-6 group-hover:scale-110 transition-transform duration-300 text-indigo-600">
                    📸
                 </div>
                 <h3 class="text-3xl font-bold text-slate-900 mb-4">Chấm bài qua Ảnh</h3>
                 <p class="text-slate-500 text-lg leading-relaxed mb-8 flex-grow">
                    Không cần nhập liệu thủ công. Chỉ cần chụp ảnh đề bài và bài làm của học sinh. Hệ thống sẽ:
                    <br><br>
                    • Nhận diện chữ viết tay (Handwriting OCR).<br>
                    • Kiểm tra logic từng bước giải.<br>
                    • Phát hiện lỗi sai đại số, dấu câu.<br>
                    • Đề xuất lời giải mẫu tối ưu.
                 </p>
                 <div class="mt-auto">
                    <a routerLink="/grader" class="inline-flex items-center font-bold text-indigo-600 hover:text-indigo-700">
                       Thử ngay tính năng này <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </a>
                 </div>
              </div>
              <!-- Decorative Image/Pattern -->
              <div class="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none"></div>
           </div>

           <!-- Feature 2: Top Right -->
           <div class="group relative bg-slate-900 rounded-[2rem] border border-slate-800 shadow-sm overflow-hidden text-white flex flex-col justify-between p-8 hover:-translate-y-1 transition-transform duration-300">
              <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full filter blur-[60px] opacity-40"></div>
              <div>
                 <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl mb-4 backdrop-blur-sm">
                    🚀
                 </div>
                 <h3 class="text-xl font-bold mb-2">Sinh Đề Nhanh Chóng</h3>
                 <p class="text-slate-400 text-sm">Tạo đề thi trắc nghiệm, tự luận, đúng sai chỉ trong 30 giây. Hỗ trợ Toán, Văn, Anh lớp 12.</p>
              </div>
           </div>

           <!-- Feature 3: Bottom Right -->
           <div class="group relative bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative z-10">
                 <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl mb-4 border border-purple-100">
                    💬
                 </div>
                 <h3 class="text-xl font-bold text-slate-900 mb-2">Trợ giảng LimVA AI</h3>
                 <p class="text-slate-500 text-sm">Học sinh có thể chat trực tiếp để hỏi về lỗi sai.</p>
              </div>
           </div>
           
        </div>
      </section>

      <!-- 5. FEEDBACK 3D CAROUSEL (UPDATED with Center Pop) -->
      <section class="w-full py-16 bg-slate-50/50 overflow-hidden relative">
         <div class="text-center mb-10 px-4">
            <h2 class="text-3xl font-bold text-slate-900 mb-2">Học sinh nói gì về LimVA?</h2>
            <p class="text-slate-500">Những phản hồi chân thực từ cộng đồng người học</p>
         </div>

         <div class="relative w-full h-[400px] flex items-center justify-center perspective-container">
            <!-- Gradient Masks -->
            <div class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-20 pointer-events-none"></div>
            <div class="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-20 pointer-events-none"></div>

            <!-- Carousel Track -->
            <div #carouselTrack class="flex items-center absolute left-1/2 top-1/2 -translate-y-1/2 transition-transform duration-75 ease-linear will-change-transform">
               @for (img of displayImages; track $index) {
                  <div class="carousel-item mx-4 w-[300px] h-[360px] rounded-2xl shadow-xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 ease-out will-change-transform flex-shrink-0 relative group">
                     <img [src]="img" class="w-full h-full object-cover transition-transform duration-500" alt="Feedback">
                     <!-- Reflection Overlay -->
                     <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-[.active]:opacity-30 transition-opacity"></div>
                  </div>
               }
            </div>
         </div>
      </section>

      <!-- 6. FAQ SECTION -->
      <section class="max-w-4xl mx-auto px-4">
         <h2 class="text-3xl font-bold text-slate-900 mb-8 text-center">Câu hỏi thường gặp</h2>
         <div class="space-y-4">
            <details class="group bg-white rounded-2xl border border-slate-200 shadow-sm open:shadow-md transition-all">
               <summary class="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-slate-800">
                  LimVA có miễn phí không?
                  <span class="transition group-open:rotate-180">
                     <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
               </summary>
               <div class="text-slate-600 px-6 pb-6 text-sm leading-relaxed">
                  <p class="mb-2">LimVA hiện đang hoàn toàn miễn phí với trọn bộ tính năng cốt lõi dành cho học sinh:</p>
                  <ul class="list-disc pl-5 mb-2 space-y-1">
                    <li>Chấm bài tự động</li>
                    <li>Sinh câu hỏi & sinh đề thi theo chủ đề</li>
                    <li>Bộ tiện ích học tập: thí nghiệm vật lý, hình học không gian, thi thử…</li>
                  </ul>
                  <p class="mb-2">Bạn có thể bắt đầu học ngay mà không cần trả bất kỳ khoản phí nào.</p>
                  <p>Và đặc biệt — nhiều tính năng nâng cấp, thông minh hơn đang chuẩn bị ra mắt, hứa hẹn mang đến trải nghiệm học tập nhanh hơn, chính xác hơn và cá nhân hóa hơn bao giờ hết.</p>
               </div>
            </details>
            <details class="group bg-white rounded-2xl border border-slate-200 shadow-sm open:shadow-md transition-all">
               <summary class="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-slate-800">
                  Hệ thống hỗ trợ những môn nào?
                  <span class="transition group-open:rotate-180">
                     <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
               </summary>
               <div class="text-slate-600 px-6 pb-6 text-sm leading-relaxed">
                  Hiện tại, LimVA đang tập trung tối ưu mạnh nhất cho Toán, Ngữ Văn và Tiếng Anh lớp 12 theo chương trình GDPT 2018. Bên cạnh đó, nhiều môn học khác đang được đội ngũ LimVA phát triển và sẽ sớm ra mắt, mở rộng hệ sinh thái học tập thông minh dành cho học sinh trên toàn quốc.
               </div>
            </details>
            <details class="group bg-white rounded-2xl border border-slate-200 shadow-sm open:shadow-md transition-all">
               <summary class="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-slate-800">
                  Đề thi sinh ra có chuẩn cấu trúc không?
                  <span class="transition group-open:rotate-180">
                     <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
               </summary>
               <div class="text-slate-600 px-6 pb-6 text-sm leading-relaxed">
                  Hệ thống LimVA được xây dựng và huấn luyện dựa trên các văn bản hướng dẫn mới nhất của Bộ Giáo dục về cấu trúc đề thi tốt nghiệp từ năm 2025. Mọi đề thi đều được sinh tự động theo đúng ma trận, đúng dạng câu hỏi (trắc nghiệm A,B,C,D ; trắc nghiệm đúng – sai; trả lời ngắn)
               </div>
            </details>
         </div>
      </section>

      <!-- 7. FINAL CTA -->
      <section class="max-w-6xl mx-auto px-4 py-10">
         <div class="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <!-- Glow effects -->
            <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.3)_0,rgba(0,0,0,0)_70%)]"></div>
            
            <div class="relative z-10 space-y-6">
               <h2 class="text-4xl md:text-5xl font-black text-white tracking-tight">Bắt đầu kỷ nguyên tự học số thông minh</h2>
               <p class="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                  Khám phá cách học hoàn toàn mới — chủ động hơn, nhanh hơn và hiệu quả hơn với LimVA. <br class="hidden md:block">
                  Biến mọi bài học thành trải nghiệm cá nhân hóa, nơi AI đồng hành và thúc đẩy bạn tiến bộ mỗi ngày.
               </p>
               <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <button (click)="openAuth()" class="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-all shadow-lg shadow-indigo-900/50 hover:scale-105 cursor-pointer">
                     Dùng thử miễn phí
                  </button>
               </div>
            </div>
         </div>
      </section>

    </div>

    <style>
      .perspective-container {
         perspective: 1000px;
      }
      .carousel-item {
         transform-origin: center center;
         /* Default state for side items */
         opacity: 0.6;
         transform: scale(0.85);
         filter: blur(1px);
         z-index: 10;
      }
      .carousel-item.active {
         opacity: 1;
         transform: scale(1.15) translateZ(50px);
         filter: blur(0px);
         z-index: 50;
         box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }
    </style>
  `
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('carouselTrack') trackRef!: ElementRef<HTMLDivElement>;
  authService = inject(AuthService);
  dbService = inject(DatabaseService);
  
  private ngZone = inject(NgZone);
  private animationFrameId: number | null = null;
  
  // Real-time stats
  stats = signal({
     examsCreated: 124,
     papersGraded: 211,
     studentsRegistered: 41
  });

  // Raw data
  rawTestimonials = [
    "https://sf-static.upanhlaylink.com/img/image_2025112914f4eab66b5b45193c8117bfa25072cb.jpg",
    "https://sf-static.upanhlaylink.com/img/image_20251129a2d0b700800fca9d94f1e4c7fc5bf379.jpg",
    "https://sf-static.upanhlaylink.com/img/image_20251129a1f217aef7f0a3b3a4e64d1512991546.jpg",
    "https://sf-static.upanhlaylink.com/img/image_20251129586c06fada5cffaf8447f9348cfb59c4.jpg",
    "https://sf-static.upanhlaylink.com/img/image_20251129a5705b4ca9ddf0388c4b7f9d09e1b0ac.jpg",
    "https://sf-static.upanhlaylink.com/img/image_20251129602111d378eaef99dcaef7aaaf46c735.jpg",
    "https://sf-static.upanhlaylink.com/img/image_202511294028fbb4f27f40e20ac07168186cb605.jpg"
  ];

  // Tripled array for seamless infinite scrolling
  displayImages = [...this.rawTestimonials, ...this.rawTestimonials, ...this.rawTestimonials];

  async ngOnInit() {
     const fetchedStats = await this.dbService.getSystemStats();
     this.stats.set(fetchedStats);
  }

  ngAfterViewInit() {
    this.startInfiniteScroll();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
       cancelAnimationFrame(this.animationFrameId);
    }
  }

  openAuth() {
    this.authService.showLoginModal.set(true);
  }

  startInfiniteScroll() {
    // Run outside Angular to avoid change detection on every frame (60fps)
    this.ngZone.runOutsideAngular(() => {
       const track = this.trackRef.nativeElement;
       const itemWidth = 332; // 300px width + 32px margin (mx-4 = 16px * 2)
       const totalWidth = itemWidth * this.rawTestimonials.length;
       
       // Start somewhere in the middle set
       let scrollX = totalWidth; 
       
       const animate = () => {
          scrollX += 1.5; // Speed: 1.5px per frame (approx 90px/sec) -> ~3-4 secs for full item pass

          // Infinite Loop Logic: Reset when one full set is scrolled
          if (scrollX >= totalWidth * 2) {
             scrollX = totalWidth;
          }

          // Move the track
          track.style.transform = `translate3d(${-scrollX}px, -50%, 0)`;

          // "Center Pop" Logic
          // We calculate which item is currently in the visual center of the viewport
          const viewportCenter = window.innerWidth / 2;
          const trackRect = track.getBoundingClientRect();
          
          const items = track.children;
          for (let i = 0; i < items.length; i++) {
             const item = items[i] as HTMLElement;
             const itemRect = item.getBoundingClientRect();
             const itemCenter = itemRect.left + itemRect.width / 2;
             
             // Distance from center
             const dist = Math.abs(viewportCenter - itemCenter);
             
             // Threshold for "Active" state (approx half item width)
             if (dist < 150) {
                item.classList.add('active');
             } else {
                item.classList.remove('active');
             }
          }

          this.animationFrameId = requestAnimationFrame(animate);
       };

       this.animationFrameId = requestAnimationFrame(animate);
    });
  }
}
