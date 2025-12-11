
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService, ExamConfig } from '../services/gemini.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FileUploaderComponent } from './file-uploader.component';
import { AuthService } from '../services/auth.service';
import { DatabaseService, ExamHistoryItem } from '../services/database.service';

declare var katex: any;

interface FileData {
  data: string;
  type: 'image' | 'pdf';
}

interface ExamPart {
  passage: string | null;
  questions: any[];
}

interface MathChapter {
  name: string;
  lessons: string[];
}

@Component({
  selector: 'app-exam-generator',
  imports: [CommonModule, FormsModule, FileUploaderComponent],
  template: `
    <div class="max-w-6xl mx-auto fade-in pb-12 pt-8">
      
      <!-- CREDIT INFO BAR -->
      <div class="flex justify-end mb-4">
         @if (authService.isAdmin()) {
             <div class="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full font-bold text-sm border border-yellow-200 flex items-center gap-2">
                Infinity
             </div>
         } @else {
             <div class="px-4 py-1.5 rounded-full font-bold text-sm border flex items-center gap-2 shadow-sm transition-all"
               [class.bg-purple-50]="hasCredits()"
               [class.text-purple-700]="hasCredits()"
               [class.border-purple-100]="hasCredits()"
               [class.bg-red-50]="!hasCredits()"
               [class.text-red-600]="!hasCredits()"
               [class.border-red-100]="!hasCredits()"
             >
                @if (hasCredits()) {
                   Bạn còn <b>{{ authService.generatorCredits() }}</b> Token hôm nay
                } @else {
                   <span>🔒</span> Hết lượt sinh đề hôm nay
                }
             </div>
         }
      </div>

      <!-- TABS NAVIGATION -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-1 max-w-4xl mx-auto">
        <div class="flex flex-col sm:flex-row gap-1">
          <button 
            (click)="activeTab.set('topic')"
            [class.bg-indigo-50]="activeTab() === 'topic'"
            [class.text-indigo-700]="activeTab() === 'topic'"
            [class.font-bold]="activeTab() === 'topic'"
            class="flex-1 py-3 px-4 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            1. Sinh Câu Hỏi
          </button>
          <button 
            (click)="activeTab.set('matrix')"
            [class.bg-indigo-50]="activeTab() === 'matrix'"
            [class.text-indigo-700]="activeTab() === 'matrix'"
             [class.font-bold]="activeTab() === 'matrix'"
            class="flex-1 py-3 px-4 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            2. Từ Ma Trận
          </button>
          <button 
            (click)="activeTab.set('document')"
            [class.bg-indigo-50]="activeTab() === 'document'"
            [class.text-indigo-700]="activeTab() === 'document'"
             [class.font-bold]="activeTab() === 'document'"
            class="flex-1 py-3 px-4 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            3. Từ Tài Liệu
          </button>
        </div>
      </div>

      <!-- CONFIGURATION AREA -->
      @if (!examData()) {
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 max-w-4xl mx-auto">
        <!-- ... [Configuration Inputs are same as previous, omitting for brevity to focus on fix] ... -->
        
        <!-- MODE 1: TOPIC / QUESTION GENERATION -->
        @if (activeTab() === 'topic') {
          <div class="animate-fade-in space-y-5">
            <h3 class="font-bold text-gray-800 mb-2 text-lg">Cấu hình sinh câu hỏi</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Môn học</label>
                <select [ngModel]="selectedSubject()" (ngModelChange)="onSubjectChange($event)" style="color-scheme: light;" class="w-full bg-white text-gray-900 rounded-lg border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium">
                  @for (sub of subjects; track sub) { <option [value]="sub">{{ sub }}</option> }
                </select>
                <p class="text-xs text-amber-600 mt-2 italic flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Hệ thống đang cập nhật dữ liệu cho các môn khác.</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Lớp (GDPT 2018)</label>
                <select [ngModel]="grade()" (ngModelChange)="grade.set($event)" style="color-scheme: light;" class="w-full bg-white text-gray-900 rounded-lg border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium">
                  <option value="12">Lớp 12</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Mức độ</label>
                <select [ngModel]="difficulty()" (ngModelChange)="difficulty.set($event)" style="color-scheme: light;" class="w-full bg-white text-gray-900 rounded-lg border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium">
                  <option value="Dễ">Dễ (Nhận biết)</option>
                  <option value="Trung bình">Trung bình (Thông hiểu)</option>
                  <option value="Khó">Khó (Vận dụng)</option>
                </select>
              </div>
            </div>
            @if (selectedSubject() === 'Toán' && grade() === '12') {
              <div class="animate-fade-in bg-orange-50 p-5 rounded-xl border border-orange-100">
                <div>
                   <label class="block text-sm font-bold text-orange-800 mb-2">Chọn Chương</label>
                   <select [ngModel]="selectedChapter()" (ngModelChange)="onChapterChange($event)" style="color-scheme: light;" class="w-full bg-white text-gray-900 rounded-lg border border-orange-200 shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium">
                      <option value="">-- Chọn chương --</option>
                      @for (chap of math12Chapters; track chap.name) { <option [value]="chap.name">{{ chap.name }}</option> }
                   </select>
                </div>
              </div>
            }
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div>
                 <label class="block text-sm font-semibold text-gray-700 mb-2">Loại câu hỏi / Dạng bài</label>
                 <select [ngModel]="selectedType()" (ngModelChange)="onTypeChange($event)" style="color-scheme: light;" class="w-full bg-white text-gray-900 rounded-lg border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium">
                    @for (type of availableQuestionTypes(); track type) { <option [value]="type">{{ type }}</option> }
                 </select>
               </div>
               @if (selectedSubject() !== 'Ngữ văn') {
                 <div class="animate-fade-in">
                   <label class="block text-sm font-semibold text-gray-700 mb-2">{{ quantityLabel() }} <span class="text-xs text-gray-400 font-normal">(Tối đa: {{ maxQuantity() }})</span></label>
                   <input type="number" [ngModel]="quantity()" (ngModelChange)="updateQuantity($event)" min="1" [max]="maxQuantity()" style="color-scheme: light;" class="w-full bg-white text-gray-900 rounded-lg border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium">
                 </div>
               } @else {
                 <div class="flex items-center text-sm text-gray-600 bg-gray-50 px-4 rounded-lg border border-gray-200 h-full mt-8 md:mt-0 font-medium"><span class="italic">Hệ thống tự động tạo 1 ngữ liệu và 8 câu hỏi Tự Luận.</span></div>
               }
            </div>
            @if (showEnglishSubType()) {
              <div class="animate-fade-in">
                 <label class="block text-sm font-semibold text-gray-700 mb-2">Chọn chi tiết dạng</label>
                 <select [ngModel]="selectedSubType()" (ngModelChange)="selectedSubType.set($event)" style="color-scheme: light;" class="w-full bg-white text-gray-900 rounded-lg border border-blue-200 shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium">
                    @for (subType of availableSubTypes(); track subType) { <option [value]="subType">{{ subType }}</option> }
                 </select>
              </div>
            }
            @if (!(selectedSubject() === 'Toán' && grade() === '12')) {
              <div class="animate-fade-in">
                 <label class="block text-sm font-semibold text-gray-700 mb-2">Chủ đề (Topic)</label>
                 <input type="text" [ngModel]="topic()" (ngModelChange)="topic.set($event)" placeholder="VD: Hàm số, Thơ mới, Thì hiện tại hoàn thành..." style="color-scheme: light;" class="w-full bg-white text-gray-900 rounded-lg border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-gray-400">
              </div>
            }
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Yêu cầu chi tiết</label>
              <textarea [ngModel]="detailRequest()" (ngModelChange)="detailRequest.set($event)" rows="3" placeholder="VD: Tập trung vào các bài toán thực tế. Hoặc: Đoạn văn về chủ đề môi trường..." style="color-scheme: light;" class="w-full bg-white text-gray-900 rounded-lg border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-gray-400"></textarea>
            </div>
          </div>
        }

        <!-- MODE 2: MATRIX -->
        @if (activeTab() === 'matrix') {
          <div class="animate-fade-in">
            <h3 class="font-bold text-gray-800 text-lg mb-4">Xây dựng ma trận đề thi</h3>
            <div class="animate-fade-in mb-6">
              <div class="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-4 text-sm text-blue-800 font-medium">
                  Tải lên file PDF chứa bảng ma trận đề thi. AI sẽ tự động phân tích cấu trúc và sinh câu hỏi bám sát GDPT 2018.
              </div>
              <app-file-uploader label="File Ma trận (.pdf)" [allowPdf]="true" (imageSelected)="onMatrixPdfSelected($event)"></app-file-uploader>
            </div>
          </div>
        }

        <!-- MODE 3: DOCUMENT -->
        @if (activeTab() === 'document') {
          <div class="animate-fade-in">
             <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-gray-800 text-lg">Tải lên tài liệu tham khảo</h3>
              <div class="flex bg-gray-100 p-1 rounded-lg">
                <button (click)="documentMode.set('existing_exam')" [class.bg-white]="documentMode() === 'existing_exam'" [class.shadow-sm]="documentMode() === 'existing_exam'" [class.text-indigo-600]="documentMode() === 'existing_exam'" class="px-4 py-1.5 text-sm rounded-md transition font-semibold text-gray-600">Từ đề có sẵn</button>
                <button (click)="documentMode.set('syllabus')" [class.bg-white]="documentMode() === 'syllabus'" [class.shadow-sm]="documentMode() === 'syllabus'" [class.text-indigo-600]="documentMode() === 'syllabus'" class="px-4 py-1.5 text-sm rounded-md transition font-semibold text-gray-600">Từ đề cương</button>
              </div>
            </div>
            @if (documentMode() === 'existing_exam') {
              <div class="mb-4 p-4 bg-purple-50 border border-purple-100 rounded-lg text-sm text-purple-900 font-medium"><b>Chế độ Biến tấu:</b> Tải lên ảnh/PDF một đề thi cũ. AI sẽ phân tích cấu trúc và tạo ra một đề thi MỚI với các câu hỏi tương tự nhưng khó hơn hoặc tư duy logic hơn.</div>
            } @else {
              <div class="mb-4 p-4 bg-teal-50 border border-teal-100 rounded-lg text-sm text-teal-900 font-medium"><b>Chế độ Đề cương:</b> Tải lên ảnh/PDF đề cương ôn tập. Sau đó chọn dạng câu hỏi để AI sinh đề bám sát nội dung.</div>
            }
            <div class="mb-6"><app-file-uploader [label]="documentMode() === 'existing_exam' ? 'File đề thi mẫu (Ảnh/PDF)' : 'File đề cương (Ảnh/PDF)'" [allowPdf]="true" (imageSelected)="onDocFileSelected($event)"></app-file-uploader></div>
            @if (documentMode() === 'syllabus' && docFile()) {
               <div class="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
                 <div>
                   <label class="block text-sm font-semibold text-gray-700 mb-2">Loại câu hỏi cần sinh</label>
                   <select [ngModel]="syllabusQuestionType" (ngModelChange)="onSyllabusTypeChange($event)" style="color-scheme: light;" class="w-full bg-white text-gray-900 rounded-lg border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium">
                      <option value="Trắc nghiệm A,B,C,D">Trắc nghiệm A,B,C,D</option>
                      <option value="Trắc nghiệm đúng sai">Trắc nghiệm đúng sai</option>
                      <option value="Trả lời ngắn">Trả lời ngắn</option>
                   </select>
                 </div>
                 <div>
                   <label class="block text-sm font-semibold text-gray-700 mb-2">Số lượng câu hỏi <span class="text-xs text-gray-400 font-normal">(Tối đa: {{ maxSyllabusQuantity }})</span></label>
                   <input type="number" [ngModel]="syllabusQuantity" (ngModelChange)="updateSyllabusQuantity($event)" min="1" [max]="maxSyllabusQuantity" style="color-scheme: light;" class="w-full bg-white text-gray-900 rounded-lg border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium">
                 </div>
               </div>
            }
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Ghi chú thêm</label>
              <textarea [(ngModel)]="docInstruction" rows="3" [placeholder]="documentMode() === 'existing_exam' ? 'VD: Tập trung biến đổi câu hàm số khó hơn...' : 'VD: Chỉ tập trung vào phần Hình học trong đề cương...'" style="color-scheme: light;" class="w-full bg-white text-gray-900 rounded-lg border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-gray-400"></textarea>
            </div>
          </div>
        }

        <!-- GENERATE BUTTON -->
        <div class="mt-8">
          <button (click)="generate()" [disabled]="isGenerating() || !isValid() || !hasCredits()" class="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 text-lg disabled:bg-indigo-400">
            @if (isGenerating()) { <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Đang phân tích & tạo đề... } @else { @if (hasCredits()) { Tạo Đề Thi Ngay (-1 Token) } @else { 🔒 Hết lượt sinh đề hôm nay } }
          </button>
        </div>

        <!-- EXAM HISTORY -->
        @if (examHistory().length > 0 && activeTab() === 'topic') {
          <div class="mt-10 border-t border-gray-100 pt-6 animate-fade-in">
             <h4 class="font-bold text-gray-800 mb-4 flex items-center gap-2">Lịch sử tạo đề gần đây</h4>
             <div class="grid grid-cols-1 gap-3">
               @for (item of examHistory(); track item.id) {
                 <div class="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition cursor-pointer group" (click)="loadFromHistory(item)">
                    <div class="flex items-center gap-3">
                       <div class="w-10 h-10 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-50 group-hover:text-indigo-600 transition">{{ $index + 1 }}</div>
                       <div><p class="font-bold text-gray-800 text-sm line-clamp-1">{{ item.title }}</p><p class="text-xs text-gray-400">{{ item.examData.questions?.length }} câu hỏi • Tạo lúc: {{ item.createdAt?.seconds * 1000 | date:'HH:mm dd/MM' }}</p></div>
                    </div>
                    <button class="text-indigo-600 text-xs font-bold bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition">Xem lại</button>
                 </div>
               }
             </div>
          </div>
        }
      </div>
      }

      <!-- RESULTS DISPLAY -->
      @if (examData()) {
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden fade-in mb-12 flex flex-col min-h-screen">
          <!-- Result Header -->
          <div class="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 border-b border-indigo-100 flex justify-between items-center text-white flex-shrink-0 sticky top-0 z-50 shadow-md">
            <h3 class="text-xl font-bold truncate pr-4">{{ examData().title }}</h3>
            <div class="flex gap-2 shrink-0">
               <button (click)="downloadExam()" [disabled]="isExporting()" class="bg-white/20 px-3 py-1 rounded text-sm hover:bg-white/30 transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
                  @if(isExporting()) { <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div><span class="hidden sm:inline">Đang tạo file...</span> } @else { <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span class="hidden sm:inline">Tải HTML</span> }
               </button>
               <button (click)="reset()" class="bg-white/20 px-3 py-1 rounded text-sm hover:bg-white/30 transition">Làm đề khác</button>
            </div>
          </div>
          
          <div class="flex-grow">
            @for (part of examParts(); track $index) {
               @if (examParts().length > 1) {
                 <div class="bg-gray-100 p-2 text-center border-b border-gray-200 text-gray-500 font-bold text-sm uppercase tracking-widest">Phần {{ $index + 1 }}</div>
               }

               @if (part.passage) {
                 <div class="flex flex-col lg:flex-row border-b border-gray-200 last:border-0 relative">
                    <!-- LEFT: PASSAGE -->
                    <div class="w-full lg:w-1/2 p-6 bg-gray-50 border-r border-gray-200 relative">
                       <div class="lg:sticky lg:top-20 max-h-[80vh] overflow-y-auto custom-scrollbar">
                         <div class="bg-gray-50 pb-3 mb-2 border-b border-gray-200 flex justify-between items-center">
                           <h4 class="font-bold text-gray-700 uppercase tracking-wide text-sm flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Ngữ liệu / Đề bài</h4>
                         </div>
                         <div class="prose prose-indigo max-w-none text-gray-900 font-serif text-lg passage-content whitespace-pre-wrap" [innerHTML]="renderMath(part.passage)"></div>
                       </div>
                    </div>
                    <!-- RIGHT: QUESTIONS -->
                    <div class="w-full lg:w-1/2 p-6 bg-white">
                       <div class="pb-3 mb-4 border-b border-gray-200 flex justify-between items-center"><h4 class="font-bold text-gray-700 uppercase tracking-wide text-sm">Câu hỏi</h4></div>
                       <div class="space-y-8">
                         @for (q of part.questions; track q.id) { <ng-container *ngTemplateOutlet="questionTemplate; context: { $implicit: q, showPassage: true }"></ng-container> }
                       </div>
                    </div>
                 </div>
               } @else {
                 <div class="p-6 space-y-8 border-b border-gray-200 last:border-0">
                    @for (q of part.questions; track q.id) { <ng-container *ngTemplateOutlet="questionTemplate; context: { $implicit: q, showPassage: false }"></ng-container> }
                 </div>
               }
            }
          </div>
        </div>
      }
    </div>

    <!-- REUSABLE QUESTION TEMPLATE -->
    <ng-template #questionTemplate let-q let-showPassage="showPassage">
      <div class="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
        <div class="flex gap-3 mb-3">
          <span class="bg-indigo-600 text-white w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-sm shadow-sm">{{ q.id }}</span>
          <div class="flex-grow">
            <div class="text-gray-900 font-medium mb-3 text-lg whitespace-pre-wrap" [innerHTML]="renderMath(q.questionText)"></div>
            @if (q.type === 'MultipleChoice') {
              <div [class]="showPassage ? 'grid grid-cols-1 gap-2 ml-1' : 'grid grid-cols-1 md:grid-cols-2 gap-3 ml-1'">
                @for (opt of q.options; track $index) {
                  <div class="flex items-start p-3 rounded border transition-all group select-none relative overflow-hidden" [class]="getOptionClass(q, $index, opt)" (click)="selectAnswer(q, opt)">
                     <div class="w-6 h-6 mt-0.5 rounded-full border mr-3 flex-shrink-0 flex items-center justify-center text-xs font-bold transition-colors z-10" [class.border-gray-300]="!q.userAnswer" [class.text-gray-400]="!q.userAnswer" [class.bg-white]="q.userAnswer && !isCorrectIndex(q, $index) && q.userAnswer !== opt" [class.border-transparent]="q.userAnswer && (isCorrectIndex(q, $index) || q.userAnswer === opt)">
                        @if(q.userAnswer) { @if (isCorrectIndex(q, $index)) { <span class="text-green-600 font-bold text-sm">✓</span> } @else if (q.userAnswer === opt) { <span class="text-red-600 font-bold text-sm">✕</span> } @else { {{ getAlphaLabel($index) }} } } @else { {{ getAlphaLabel($index) }} }
                     </div>
                     <span class="z-10 pt-0.5 text-gray-900" [innerHTML]="renderMath(opt)"></span>
                  </div>
                }
              </div>
            }
            @else if (q.type === 'TrueFalse') {
              @if (q.options && q.options.length > 0) {
               <div class="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                <table class="w-full text-sm text-left">
                  <thead class="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200"><tr><th class="p-3">Các mệnh đề</th><th class="p-3 w-20 text-center">Đúng</th><th class="p-3 w-20 text-center">Sai</th></tr></thead>
                  <tbody class="divide-y divide-gray-100">
                    @for (opt of q.options; track $index) {
                      <tr class="hover:bg-gray-50 transition-colors">
                         <td class="p-3"><span class="font-bold text-indigo-600 mr-2">{{ getAlphaLabel($index) }})</span><span class="text-gray-900" [innerHTML]="renderMath(opt)"></span></td>
                         <td class="p-3 text-center"><button (click)="selectTF(q, $index, 'Đúng')" [class]="getTFButtonClass(q, $index, 'Đúng')" class="w-8 h-8 rounded-full border text-xs font-bold transition-all shadow-sm">Đ</button></td>
                         <td class="p-3 text-center"><button (click)="selectTF(q, $index, 'Sai')" [class]="getTFButtonClass(q, $index, 'Sai')" class="w-8 h-8 rounded-full border text-xs font-bold transition-all shadow-sm">S</button></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              }
            }
            @else if (q.type === 'ShortAnswer') {
               <div class="mt-3 max-w-md">
                  <label class="block text-xs text-gray-500 mb-1">Nhập kết quả (Tối đa 4 ký tự):</label>
                  <div class="flex gap-3 items-center">
                    <div class="relative">
                      <input type="text" [(ngModel)]="q.userAnswer" maxlength="4" [disabled]="q.isSubmitted" placeholder="..." class="w-32 text-center font-bold text-2xl tracking-widest border-2 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-gray-900" [class.border-gray-300]="!q.isSubmitted" [class.border-green-500]="q.isSubmitted && q.isCorrect" [class.border-red-500]="q.isSubmitted && !q.isCorrect" [class.bg-green-50]="q.isSubmitted && q.isCorrect" [class.bg-red-50]="q.isSubmitted && !q.isCorrect" [class.text-green-800]="q.isSubmitted && q.isCorrect" [class.text-red-800]="q.isSubmitted && !q.isCorrect" (keyup.enter)="checkShortAnswer(q)">
                      @if (q.isSubmitted) { <div class="absolute right-2 top-1/2 -translate-y-1/2">@if (q.isCorrect) { <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> } @else { <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg> }</div> }
                    </div>
                    @if (!q.isSubmitted) { <button (click)="checkShortAnswer(q)" class="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm">Kiểm tra</button> }
                  </div>
                  @if (q.isSubmitted && !q.isCorrect) { <p class="text-red-600 text-sm mt-2">Đáp án đúng là: <b>{{ q.correctAnswer }}</b></p> }
               </div>
            }
            @else if (q.type === 'Essay') {
               <div class="flex flex-col">
                  <div class="flex justify-end mt-2">
                     <button (click)="toggleEssaySolution(q)" class="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border border-indigo-200"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>{{ q.showSolution ? 'Ẩn đáp án' : 'Xem đáp án chi tiết' }}</button>
                  </div>
                  @if (q.showSolution) {
                    <div class="mt-3 bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm animate-fade-in relative">
                        <div class="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-xl"></div>
                        <h4 class="font-bold text-emerald-800 mb-2 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Đáp án & Hướng dẫn chấm</h4>
                        <div class="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap" [innerHTML]="renderMath(q.explanation)"></div>
                    </div>
                  }
               </div>
            }
            @if (shouldShowExplanation(q)) {
              <div class="mt-4 bg-emerald-50 p-4 rounded-lg border border-emerald-100 text-sm relative overflow-hidden animate-fade-in">
                <div class="font-bold text-emerald-800 mb-1 flex flex-col gap-1">
                   @if (q.type === 'MultipleChoice') { <span class="text-green-700 text-base">✓ Đáp án đúng: {{ q.correctAnswer }}</span><hr class="border-emerald-200 my-1"> }
                   <span>Giải thích chi tiết:</span>
                </div>
                @if (q.type === 'TrueFalse') { <div class="mb-2 text-emerald-800 bg-white/50 p-2 rounded" [innerHTML]="formatTFResult(q.correctAnswer)"></div> }
                <div class="text-emerald-900 whitespace-pre-wrap mt-1" [innerHTML]="renderMath(q.explanation)"></div>
              </div>
            }
          </div>
        </div>
      </div>
    </ng-template>

    <style>
      .passage-content { line-height: 2.0 !important; }
      .passage-content p { margin-bottom: 1.5rem; }
    </style>
  `
})
export class ExamGeneratorComponent implements OnInit {
  geminiService = inject(GeminiService);
  dbService = inject(DatabaseService);
  sanitizer = inject(DomSanitizer);
  public authService = inject(AuthService);
  
  // State
  activeTab = signal<'topic' | 'matrix' | 'document'>('topic');
  subjects = ['Toán', 'Ngữ văn', 'Ngoại ngữ'];
  math12Chapters: MathChapter[] = [
    { name: 'Chương 1. Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số', lessons: [] },
    { name: 'Chương 2. Vectơ và hệ trục tọa độ trong không gian', lessons: [] },
    { name: 'Chương 3. Các số đo đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm', lessons: [] },
    { name: 'Chương 4. Nguyên hàm và tích phân', lessons: [] },
    { name: 'Chương 5. Phương pháp tọa độ trong không gian', lessons: [] },
    { name: 'Chương 6. Xác suất có điều kiện', lessons: [] }
  ];
  questionTypes: Record<string, string[]> = {
    'Toán': ['Trắc nghiệm A,B,C,D', 'Trắc nghiệm đúng sai', 'Trả lời ngắn'],
    'Ngữ văn': ['Truyện', 'Thơ', 'Tùy bút', 'Kịch', 'Văn nghị luận', 'Báo chí'],
    'Ngoại ngữ': ['Dạng 1: Hoàn thành đoạn văn – Cloze Test', 'Dạng 2: Đọc hiểu', 'Dạng 3: Sắp xếp câu / hội thoại', 'Dạng 4: Hoàn thành thông báo / quảng cáo', 'Dạng 5: Hoàn thành tờ rơi – Leaflet']
  };

  selectedSubject = signal<string>('Toán');
  grade = signal<string>('12');
  difficulty = signal<string>('Trung bình');
  selectedType = signal<string>('Trắc nghiệm A,B,C,D');
  selectedSubType = signal<string>(''); 
  selectedChapter = signal<string>('');
  topic = signal<string>('');
  detailRequest = signal<string>('');
  quantity = signal<number>(5);
  matrixPdfFile = signal<FileData | null>(null);
  documentMode = signal<'existing_exam' | 'syllabus'>('existing_exam');
  docFile = signal<FileData | null>(null);
  docInstruction = signal<string>('');
  syllabusQuestionType = 'Trắc nghiệm A,B,C,D';
  syllabusQuantity = 5;
  isGenerating = signal<boolean>(false);
  isExporting = signal<boolean>(false);
  examData = signal<any>(null);
  examHistory = signal<ExamHistoryItem[]>([]);
  examParts = signal<ExamPart[]>([]);

  // Computed
  availableQuestionTypes = computed(() => this.questionTypes[this.selectedSubject()] || ['Trắc nghiệm A,B,C,D']);
  showEnglishSubType = computed(() => this.selectedSubject() === 'Ngoại ngữ' && (this.selectedType().includes('Dạng 2') || this.selectedType().includes('Dạng 3')));
  availableSubTypes = computed(() => this.selectedType().includes('Dạng 2') ? ['Đọc hiểu ngắn', 'Đọc hiểu dài'] : (this.selectedType().includes('Dạng 3') ? ['Sắp xếp đoạn văn', 'Sắp xếp hội thoại'] : []));
  quantityLabel = computed(() => this.selectedSubject() === 'Ngoại ngữ' ? 'Số bài (Tasks)' : 'Số lượng câu hỏi');
  maxQuantity = computed(() => this.selectedSubject() === 'Ngoại ngữ' ? 3 : 10);
  get maxSyllabusQuantity() { 
     if (this.syllabusQuestionType === 'Trắc nghiệm A,B,C,D') return 25;
     if (this.syllabusQuestionType === 'Trắc nghiệm đúng sai') return 15;
     return 30;
  }
  hasCredits = computed(() => this.authService.isAdmin() || this.authService.generatorCredits() > 0);

  // Methods
  async ngOnInit() { await this.refreshHistory(); }
  async refreshHistory() { const user = this.authService.currentUser(); if (user) this.examHistory.set(await this.dbService.getUserExamHistory(user.uid)); }
  loadFromHistory(item: ExamHistoryItem) { if (item.examData) this.processExamData(item.examData); }
  onSubjectChange(sub: string) { this.selectedSubject.set(sub); this.selectedType.set(this.availableQuestionTypes()[0]); this.selectedSubType.set(''); this.selectedChapter.set(''); if (sub === 'Ngoại ngữ') this.quantity.set(1); else if (sub !== 'Ngữ văn') this.quantity.set(10); }
  onTypeChange(type: string) { this.selectedType.set(type); if (type.includes('Dạng 2')) this.selectedSubType.set('Đọc hiểu ngắn'); else if (type.includes('Dạng 3')) this.selectedSubType.set('Sắp xếp đoạn văn'); else this.selectedSubType.set(''); }
  onChapterChange(chap: string) { this.selectedChapter.set(chap); this.topic.set(chap); }
  updateQuantity(val: number) { this.quantity.set(Math.min(Math.max(val, 1), this.maxQuantity())); }
  updateSyllabusQuantity(val: number) { this.syllabusQuantity = Math.min(Math.max(val, 1), this.maxSyllabusQuantity); }
  onSyllabusTypeChange(type: string) { this.syllabusQuestionType = type; if (this.syllabusQuantity > this.maxSyllabusQuantity) this.syllabusQuantity = this.maxSyllabusQuantity; }
  onMatrixPdfSelected(file: FileData | null) { this.matrixPdfFile.set(file); }
  onDocFileSelected(file: FileData | null) { this.docFile.set(file); }
  isValid() { if (this.activeTab() === 'topic') return this.topic().trim().length > 0; if (this.activeTab() === 'matrix') return !!this.matrixPdfFile(); if (this.activeTab() === 'document') return !!this.docFile(); return false; }
  
  async generate() {
    if (!this.authService.isAdmin() && this.authService.generatorCredits() <= 0) return alert("Hết lượt.");
    if (!await this.authService.consumeCredit('generator')) return alert("Lỗi trừ lượt.");
    this.isGenerating.set(true); this.examData.set(null); this.examParts.set([]);
    try {
      let result;
      if (this.activeTab() === 'topic') {
        result = await this.geminiService.generateSubjectExam({ grade: this.grade(), subject: this.selectedSubject(), difficulty: this.difficulty(), questionType: this.selectedType(), questionSubType: this.selectedSubType(), topic: this.topic(), detailRequest: this.detailRequest(), quantity: this.quantity() });
      } else if (this.activeTab() === 'matrix' && this.matrixPdfFile()) {
         result = await this.geminiService.generateExamFromMatrixFile(this.matrixPdfFile()!.data, this.matrixPdfFile()!.type === 'pdf' ? 'application/pdf' : 'image/jpeg');
      } else if (this.activeTab() === 'document' && this.docFile()) {
        const mime = this.docFile()!.type === 'pdf' ? 'application/pdf' : 'image/jpeg';
        result = this.documentMode() === 'existing_exam' ? await this.geminiService.generateVariantExam(this.docFile()!.data, mime, this.docInstruction()) : await this.geminiService.generateExamFromSyllabus(this.docFile()!.data, mime, this.docInstruction(), this.syllabusQuestionType, this.syllabusQuantity);
      }
      if (result) {
        if (!result.title && this.activeTab() === 'topic') result.title = `${this.selectedSubject()} - ${this.topic()}`;
        this.processExamData(result);
        if (this.authService.currentUser()) { await this.dbService.saveExamHistory(this.authService.currentUser()!.uid, result); await this.refreshHistory(); }
        this.dbService.incrementStat('examsCreated');
      }
    } catch (e) { console.error(e); alert('Lỗi sinh đề.'); } finally { this.isGenerating.set(false); }
  }

  processExamData(data: any) {
    const parts: ExamPart[] = []; let currentPassage: string | null = null; let currentQuestions: any[] = [];
    if (data.questions) {
      data.questions.forEach((q: any) => {
        q.userAnswer = null; if (q.type === 'TrueFalse') q.tfAnswers = new Array(q.options?.length || 4).fill(null);
        if (q.type === 'Essay') q.showSolution = false;
        if (q.questionText && q.questionText.includes('<<<PASSAGE_DIVIDER>>>')) {
           if (currentQuestions.length > 0) { parts.push({ passage: currentPassage, questions: [...currentQuestions] }); currentQuestions = []; }
           const splitText = q.questionText.split('<<<PASSAGE_DIVIDER>>>'); currentPassage = splitText[0].trim(); q.questionText = splitText[1].trim();
        }
        currentQuestions.push(q);
      });
      if (currentQuestions.length > 0) parts.push({ passage: currentPassage, questions: currentQuestions });
    }
    if (parts.length === 0 && data.questions?.length > 0) parts.push({ passage: null, questions: data.questions });
    this.examParts.set(parts); this.examData.set(data);
  }

  reset() { this.examData.set(null); this.examParts.set([]); }
  
  downloadExam() {
    const data = this.examData(); if (!data) return; this.isExporting.set(true);
    try {
      let htmlContent = `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><title>${data.title}</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"><style>body{font-family:'Times New Roman',serif;padding:40px;max-width:800px;margin:0 auto} .passage{background:#f8f9fa;padding:15px;border-left:4px solid #3f51b5;margin-bottom:15px;white-space:pre-wrap} .solution-box{margin-top:10px;background:#e8f5e9;padding:10px;border:1px solid #c8e6c9} @media print{.solution-box{display:block}}</style></head><body><h1>${data.title}</h1>`;
      this.examParts().forEach((part, i) => {
         if (this.examParts().length > 1) htmlContent += `<h3>Phần ${i + 1}</h3>`;
         if (part.passage) htmlContent += `<div class="passage">${this.formatTextForExport(part.passage)}</div>`;
         part.questions.forEach(q => {
            htmlContent += `<div style="margin-bottom:20px"><b>Câu ${q.id}:</b> ${this.formatTextForExport(q.questionText)}`;
            if (q.type === 'MultipleChoice' || q.type === 'TrueFalse') {
               htmlContent += `<div style="margin-left:20px">`;
               q.options.forEach((opt: string, idx: number) => htmlContent += `<div><b>${String.fromCharCode(65+idx)}.</b> ${this.formatTextForExport(opt)}</div>`);
               htmlContent += `</div>`;
            }
            htmlContent += `<div class="solution-box"><b>Đáp án:</b> ${this.formatTextForExport(q.correctAnswer)}<br><b>Giải:</b> ${this.formatTextForExport(q.explanation || '')}</div></div>`;
         });
      });
      htmlContent += `</body></html>`;
      const url = window.URL.createObjectURL(new Blob([htmlContent], { type: 'text/html' }));
      const a = document.createElement('a'); a.href = url; a.download = `${data.title || 'De_thi'}.html`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch (e) { console.error(e); } finally { this.isExporting.set(false); }
  }

  // --- ROBUST MATH RENDERING (Duplicated from Grader but necessary here) ---
  renderMath(text: string): SafeHtml {
    if (!text) return '';
    const str = String(text);
    let cleanText = str
      .replace(/\\\[/g, '$$$$') 
      .replace(/\\\]/g, '$$$$')
      .replace(/\\\(/g, '$')
      .replace(/\\\)/g, '$');

    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]*?\$)/g;
    const parts = cleanText.split(regex);

    const processedParts = parts.map(part => {
      if (part.startsWith('$$') && part.endsWith('$$') && part.length >= 4) {
        const tex = part.slice(2, -2);
        try {
          return typeof katex !== 'undefined'
            ? katex.renderToString(tex, { displayMode: true, throwOnError: false, output: 'html' })
            : part;
        } catch { return part; }
      }
      else if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
        const tex = part.slice(1, -1);
        try {
          return typeof katex !== 'undefined'
            ? katex.renderToString(tex, { displayMode: false, throwOnError: false, output: 'html' })
            : part;
        } catch { return part; }
      }
      else {
        return part
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
          .replace(/\n/g, '<br>');
      }
    });

    return this.sanitizer.bypassSecurityTrustHtml(processedParts.join(''));
  }

  formatTextForExport(text: string): string {
    if (!text) return '';
    // Similar to renderMath but returns raw HTML string for download
    let cleanText = text.replace(/\\\[/g, '$$$$').replace(/\\\]/g, '$$$$').replace(/\\\(/g, '$').replace(/\\\)/g, '$');
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]*?\$)/g;
    const parts = cleanText.split(regex);
    return parts.map(part => {
      if (part.startsWith('$$')) { try { return katex.renderToString(part.slice(2, -2), { displayMode: true }); } catch { return part; } }
      else if (part.startsWith('$')) { try { return katex.renderToString(part.slice(1, -1), { displayMode: false }); } catch { return part; } }
      else { return part.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br>'); }
    }).join('');
  }

  // Helpers
  toggleEssaySolution(q: any) { q.showSolution = !q.showSolution; }
  shouldShowExplanation(q: any): boolean { 
    if (q.type === 'Essay') return false; 
    if (q.type === 'MultipleChoice') return !!q.userAnswer;
    if (q.type === 'TrueFalse') return q.tfAnswers && q.tfAnswers.filter((a: any) => a !== null).length === q.options.length;
    if (q.type === 'ShortAnswer') return q.isSubmitted;
    return false;
  }
  formatTFResult(text: string): SafeHtml {
     if (!text) return '';
     let parts = text.includes(',') ? text.split(',') : (text.includes(';') ? text.split(';') : [text]);
     let html = '<div class="flex flex-col gap-2 mt-1">';
     parts.forEach((p, idx) => {
        const colorClass = p.trim().toLowerCase().includes('đúng') ? 'text-green-700' : 'text-red-700';
        html += `<div class="flex items-center gap-2"><span class="font-bold text-gray-700 w-8">${String.fromCharCode(65+idx)})</span><span class="${colorClass} font-bold border-b border-gray-200 w-full pb-1">${p.trim()}</span></div>`;
     });
     html += '</div>';
     return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  getAlphaLabel(i: number) { return String.fromCharCode(65 + i); }
  isCorrectIndex(q: any, i: number) { return q.correctAnswer && (q.correctAnswer.trim().toUpperCase()[0].charCodeAt(0) - 65) === i; }
  getOptionClass(q: any, i: number, opt: string) {
    if (!q.userAnswer) return "cursor-pointer hover:bg-gray-50 border-gray-200";
    if (this.isCorrectIndex(q, i)) return "bg-green-50 border-green-500 text-green-900 font-medium ring-1 ring-green-500";
    if (q.userAnswer === opt && !this.isCorrectIndex(q, i)) return "bg-red-50 border-red-500 text-red-900";
    return "opacity-50 border-gray-100";
  }
  selectAnswer(q: any, opt: string) { if (!q.userAnswer) q.userAnswer = opt; }
  selectTF(q: any, i: number, val: 'Đúng' | 'Sai') { if (!q.tfAnswers) q.tfAnswers = []; if (!q.tfAnswers[i]) q.tfAnswers[i] = val; }
  getTFButtonClass(q: any, i: number, type: 'Đúng' | 'Sai') {
     const u = q.tfAnswers ? q.tfAnswers[i] : null; if (!u) return "bg-white border-gray-300 text-gray-500 hover:border-indigo-500 hover:text-indigo-600";
     const cArr = q.correctAnswer.split(',').map((s:string)=>s.trim());
     if (u === type) return u.toLowerCase() === (cArr[i]||'').toLowerCase() ? "bg-green-600 border-green-600 text-white" : "bg-red-600 border-red-600 text-white";
     else if (u) return type.toLowerCase() === (cArr[i]||'').toLowerCase() ? "bg-green-100 border-green-200 text-green-800 opacity-50" : "bg-gray-50 border-gray-100 text-gray-300 opacity-25";
     return "";
  }
  checkShortAnswer(q: any) { if (q.userAnswer?.trim()) { q.isSubmitted = true; q.isCorrect = q.userAnswer.trim().replace(/\s/g, '').replace(',', '.') === q.correctAnswer.trim().replace(/\s/g, '').replace(',', '.'); } }
}
