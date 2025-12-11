
import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { DatabaseService, SystemStats } from '../services/database.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Lesson {
  id: string;
  name: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto fade-in py-12 px-4">
      
      <!-- HEADER -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
             Quản trị hệ thống
           </h1>
           <p class="text-gray-500">Xin chào Admin, {{ authService.currentUser()?.displayName || 'User' }}</p>
        </div>
        <div class="flex gap-3">
          <div class="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm border border-green-200">
             ● Server: Online
          </div>
          <button (click)="loadAll()" class="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-50 transition">
             ⟳ Refresh
          </button>
        </div>
      </div>

      <!-- TABS NAVIGATION -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-8 inline-flex overflow-x-auto max-w-full">
         <button (click)="activeTab.set('config')" [class]="activeTab() === 'config' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50'" class="px-5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 whitespace-nowrap">
           Cấu hình chung
         </button>
         <button (click)="activeTab.set('prompts')" [class]="activeTab() === 'prompts' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50'" class="px-5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 whitespace-nowrap">
           System Prompts
         </button>
         <button (click)="activeTab.set('data')" [class]="activeTab() === 'data' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50'" class="px-5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 whitespace-nowrap">
           Dữ liệu mẫu
         </button>
         <button (click)="activeTab.set('upload')" [class]="activeTab() === 'upload' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50'" class="px-5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 whitespace-nowrap">
           Upload đề thi thử
         </button>
      </div>

      <!-- TAB 1: CONFIG & STATS -->
      @if (activeTab() === 'config') {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          <!-- API Configuration -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 h-full">
             <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
               Cấu hình API Key
             </h2>
             
             <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Gemini API Key</label>
                  <div class="relative">
                    <input [type]="showKey() ? 'text' : 'password'" [(ngModel)]="apiKey" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" placeholder="Nhập khóa API...">
                    <button (click)="showKey.set(!showKey())" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {{ showKey() ? 'Hide' : 'Show' }}
                    </button>
                  </div>
                </div>
                <button (click)="saveApiKey()" class="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg flex justify-center gap-2">
                   <span>Lưu API Key</span>
                   @if(savedSuccess()) { <span class="text-green-400">✓</span> }
                </button>
             </div>
          </div>

          <!-- Stats -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 h-full">
             <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
               Thống kê
             </h2>
             <div class="grid grid-cols-1 gap-4">
                <div class="bg-indigo-50 p-4 rounded-xl flex justify-between">
                   <div><p class="text-sm font-bold text-indigo-600">USERS</p><p class="text-3xl font-black text-slate-800">{{ stats()?.studentsRegistered || 0 }}</p></div>
                </div>
                <div class="bg-purple-50 p-4 rounded-xl flex justify-between">
                   <div><p class="text-sm font-bold text-purple-600">EXAMS</p><p class="text-3xl font-black text-slate-800">{{ stats()?.examsCreated || 0 }}</p></div>
                </div>
             </div>
          </div>
        </div>
      }

      <!-- TAB 2: SYSTEM PROMPTS (Categorized) -->
      @if (activeTab() === 'prompts') {
         <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in h-[calc(100vh-250px)]">
            
            <!-- Sidebar -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-y-auto custom-scrollbar">
               <div class="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700">Danh sách Prompt</div>
               
               <div class="p-2 space-y-1">
                  <!-- System Group -->
                  <div class="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">Hệ thống</div>
                  <button (click)="selectPrompt('grading_math', 'Chấm bài Toán (Core)')" [class]="selectedPromptKey() === 'grading_math' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50'" class="w-full text-left px-3 py-2 rounded-lg text-sm transition">Chấm bài Toán</button>
                  <button (click)="selectPrompt('chat_teacher', 'Chat Teacher AI')" [class]="selectedPromptKey() === 'chat_teacher' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50'" class="w-full text-left px-3 py-2 rounded-lg text-sm transition">Chat Teacher AI</button>
                  
                  <!-- Gen Group -->
                  <div class="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">Sinh đề thi</div>
                  <button (click)="selectPrompt('gen_math_core', 'Sinh đề Toán (Core)')" [class]="selectedPromptKey() === 'gen_math_core' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50'" class="w-full text-left px-3 py-2 rounded-lg text-sm transition">Sinh đề Toán</button>
                  <button (click)="selectPrompt('gen_lit_core', 'Sinh đề Văn (Core)')" [class]="selectedPromptKey() === 'gen_lit_core' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50'" class="w-full text-left px-3 py-2 rounded-lg text-sm transition">Sinh đề Văn</button>
                  <button (click)="selectPrompt('gen_eng_core', 'Sinh đề Anh (Core)')" [class]="selectedPromptKey() === 'gen_eng_core' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50'" class="w-full text-left px-3 py-2 rounded-lg text-sm transition">Sinh đề Anh</button>
               </div>
            </div>

            <!-- Editor -->
            <div class="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
               <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 class="font-bold text-gray-800">{{ selectedPromptName() }}</h3>
                  <div class="flex gap-2">
                     <button (click)="resetPrompt()" class="px-3 py-1.5 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100">Khôi phục gốc</button>
                     <button (click)="saveCurrentPrompt()" class="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-1">
                        Lưu Prompt
                        @if(savedSuccess()) { <span>✓</span> }
                     </button>
                  </div>
               </div>
               <textarea 
                  [(ngModel)]="currentPromptContent" 
                  class="flex-grow w-full p-6 bg-slate-50 font-mono text-sm leading-relaxed outline-none resize-none text-slate-800"
                  placeholder="Chọn một prompt bên trái để chỉnh sửa..."
               ></textarea>
            </div>
         </div>
      }

      <!-- TAB 3: DATA EXAMPLES (Generalized) -->
      @if (activeTab() === 'data') {
         <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fade-in">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-800 mb-2">Quản lý Dữ liệu Mẫu</h2>
              <p class="text-sm text-gray-500">
                AI sẽ tham khảo các ví dụ mẫu này để sinh đề chính xác hơn.
              </p>
            </div>

            <!-- Generic Filters -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
               
               <!-- Subject Select -->
               <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Môn học</label>
                  <select [(ngModel)]="dataSubject" (change)="onDataSubjectChange()" class="w-full p-2 rounded-lg border border-gray-200 bg-white font-medium outline-none focus:ring-2 focus:ring-indigo-500">
                     <option value="math">Toán học (12)</option>
                     <option value="lit">Ngữ văn</option>
                     <option value="eng">Tiếng Anh</option>
                  </select>
               </div>

               <!-- Category Select (Dynamic) -->
               <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">
                    {{ dataSubject === 'math' ? 'Chương' : (dataSubject === 'lit' ? 'Thể loại' : 'Dạng bài') }}
                  </label>
                  <select [(ngModel)]="dataCategory" (change)="onDataCategoryChange()" class="w-full p-2 rounded-lg border border-gray-200 bg-white font-medium outline-none focus:ring-2 focus:ring-indigo-500">
                     @for (cat of availableCategories(); track cat.id) {
                        <option [value]="cat.id">{{ cat.name }}</option>
                     }
                  </select>
               </div>

               <!-- Lesson Select (MATH ONLY) -->
               @if (dataSubject === 'math') {
                 <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Bài học (Lesson)</label>
                    <select [(ngModel)]="dataLesson" (change)="loadExampleData()" class="w-full p-2 rounded-lg border border-gray-200 bg-white font-medium outline-none focus:ring-2 focus:ring-indigo-500">
                       <option value="all">-- Tổng hợp chương --</option>
                       @for (les of availableLessons(); track les.id) {
                          <option [value]="les.id">{{ les.name }}</option>
                       }
                    </select>
                 </div>
               }

               <!-- Level Select -->
               <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Mức độ / Trình độ</label>
                  <select [(ngModel)]="dataLevel" (change)="loadExampleData()" class="w-full p-2 rounded-lg border border-gray-200 bg-white font-medium outline-none focus:ring-2 focus:ring-indigo-500">
                     @if (dataSubject === 'eng') {
                       <option value="a1">A1</option>
                       <option value="a2">A2</option>
                       <option value="b1">B1</option>
                       <option value="b2">B2</option>
                     } @else {
                       <option value="easy">Nhận biết (Dễ)</option>
                       <option value="medium">Thông hiểu (TB)</option>
                       <option value="hard">Vận dụng (Khó)</option>
                       <option value="any">Chung (Mọi mức độ)</option>
                     }
                  </select>
               </div>
            </div>

            <!-- Editor -->
            <div class="relative">
               @if (isLoadingData()) {
                  <div class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                     <div class="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  </div>
               }
               
               <label class="block text-sm font-bold text-gray-700 mb-2">
                 Nội dung ví dụ mẫu 
                 <span class="font-normal text-gray-400 text-xs ml-2">(Nhập các câu hỏi mẫu để AI học theo)</span>
               </label>
               <textarea 
                 [(ngModel)]="dataContent" 
                 class="w-full h-80 p-4 bg-slate-50 border border-gray-300 rounded-xl font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                 placeholder="Nhập nội dung mẫu tại đây..."
               ></textarea>
            </div>

            <div class="flex justify-end items-center mt-4">
               <button (click)="saveExampleData()" class="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center gap-2">
                  Lưu Dữ liệu Mẫu
                  @if(savedSuccess()) { <span class="text-white">✓</span> }
               </button>
            </div>
         </div>
      }

      <!-- TAB 4: UPLOAD (Embedded Admin for Mock Exam) -->
      @if (activeTab() === 'upload') {
         <div class="w-full h-[85vh] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative animate-fade-in">
            <!-- Loading Indicator for Iframe -->
            <div class="absolute inset-0 flex items-center justify-center z-0 bg-slate-50">
               <div class="flex flex-col items-center gap-3">
                  <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <span class="text-sm font-medium text-slate-500">Đang tải trang quản trị đề thi...</span>
               </div>
            </div>
            
            <iframe 
               [src]="safeUploadUrl" 
               class="w-full h-full border-0 relative z-10 bg-white"
               allow="clipboard-read; clipboard-write; fullscreen"
               title="Mock Exam Admin"
            ></iframe>
         </div>
      }
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  authService = inject(AuthService);
  dbService = inject(DatabaseService);
  router: Router = inject(Router);
  sanitizer = inject(DomSanitizer);

  activeTab = signal<'config' | 'prompts' | 'data' | 'upload'>('config');

  // Config State
  apiKey = '';
  showKey = signal<boolean>(false);
  stats = signal<SystemStats | null>(null);

  // --- PROMPT TAB STATE ---
  promptsMap: Record<string, string> = {};
  selectedPromptKey = signal<string>('grading_math');
  selectedPromptName = signal<string>('Chấm bài Toán (Core)');
  currentPromptContent = '';

  // --- DATA TAB STATE ---
  dataSubject = 'math';
  dataCategory = 'c1';
  dataLesson = 'all'; // New state for lesson
  dataLevel = 'easy';
  dataContent = '';
  isLoadingData = signal<boolean>(false);
  
  // --- UPLOAD TAB STATE ---
  safeUploadUrl: SafeResourceUrl;
  
  savedSuccess = signal<boolean>(false);

  // Helper Lists
  mathCats = [
    {id: 'c1', name: 'Chương 1: Ứng dụng đạo hàm'}, 
    {id: 'c2', name: 'Chương 2: Vectơ không gian'},
    {id: 'c3', name: 'Chương 3: Số liệu ghép nhóm'}, 
    {id: 'c4', name: 'Chương 4: Nguyên hàm & Tích phân'},
    {id: 'c5', name: 'Chương 5: Phương pháp Oxyz'}, 
    {id: 'c6', name: 'Chương 6: Xác suất'}
  ];

  // Specific Lessons mapping for Math
  mathLessonsMap: Record<string, Lesson[]> = {
    'c1': [
       {id: 'b1', name: 'Bài 1: Tính đơn điệu và cực trị'},
       {id: 'b2', name: 'Bài 2: Giá trị lớn nhất, nhỏ nhất'},
       {id: 'b3', name: 'Bài 3: Đường tiệm cận'},
       {id: 'b4', name: 'Bài 4: Khảo sát sự biến thiên và vẽ đồ thị'},
       {id: 'b5', name: 'Bài 5: Ứng dụng đạo hàm (Thực tiễn)'}
    ],
    'c2': [
       {id: 'b6', name: 'Bài 6: Vectơ trong không gian'},
       {id: 'b7', name: 'Bài 7: Hệ trục toạ độ trong không gian'},
       {id: 'b8', name: 'Bài 8: Biểu thức toạ độ các phép toán vectơ'}
    ],
    'c3': [
       {id: 'b9', name: 'Bài 9: Khoảng biến thiên và khoảng tứ phân vị'},
       {id: 'b10', name: 'Bài 10: Phương sai và độ lệch chuẩn'}
    ]
    // Add default placeholders for other chapters if needed, or leave empty
  };

  litCats = [
    {id: 'truyen', name: 'Truyện'}, {id: 'tho', name: 'Thơ'}, {id: 'tuybut', name: 'Tùy bút'},
    {id: 'kich', name: 'Kịch'}, {id: 'nghiluan', name: 'Văn Nghị luận'}, {id: 'baochi', name: 'Báo chí'}
  ];
  engCats = [
    {id: 'dang1', name: 'Dạng 1: Cloze Test'}, {id: 'dang2', name: 'Dạng 2: Reading'},
    {id: 'dang3', name: 'Dạng 3: Sắp xếp'}, {id: 'dang4', name: 'Dạng 4: Notice'},
    {id: 'dang5', name: 'Dạng 5: Leaflet'}
  ];

  constructor() {
    this.safeUploadUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://online-exam-app-deve-fr88.bolt.host/admin');
  }

  async ngOnInit() {
    if (!this.authService.isAdmin()) {
       this.router.navigate(['/']);
       return;
    }
    this.loadAll();
  }

  async loadAll() {
    // 1. Config
    const config = await this.dbService.getSystemConfig();
    if (config?.apiKey) this.apiKey = config.apiKey;

    // 2. Stats
    this.stats.set(await this.dbService.getSystemStats());

    // 3. Prompts
    this.promptsMap = await this.dbService.getPromptsConfig();
    
    // Load initial selection based on active tab logic or default
    if (this.activeTab() === 'prompts') {
        this.loadCurrentPromptContent();
    } else if (this.activeTab() === 'data') {
        this.loadExampleData();
    }
  }

  // --- CONFIG ACTIONS ---
  async saveApiKey() {
    const success = await this.dbService.saveSystemConfig({ apiKey: this.apiKey });
    this.flashSuccess(success);
  }

  async refreshStats() {
    this.stats.set(await this.dbService.getSystemStats());
  }

  // --- PROMPT ACTIONS ---
  selectPrompt(key: string, name: string) {
    this.selectedPromptKey.set(key);
    this.selectedPromptName.set(name);
    this.loadCurrentPromptContent();
  }

  loadCurrentPromptContent() {
    // Try get from DB map, else empty (or handle defaults if I imported them here)
    this.currentPromptContent = this.promptsMap[this.selectedPromptKey()] || '';
  }

  resetPrompt() {
    if(!confirm("Hành động này sẽ xóa nội dung trong ô soạn thảo?")) return;
    this.currentPromptContent = ''; 
    // Ideally, we could load the hardcoded default from prompts.ts here, 
    // but importing all of them might bloat. User can just leave blank to use code default.
  }

  async saveCurrentPrompt() {
    this.promptsMap[this.selectedPromptKey()] = this.currentPromptContent;
    const success = await this.dbService.savePromptsConfig(this.promptsMap);
    this.flashSuccess(success);
  }

  // --- DATA ACTIONS ---

  availableCategories() {
    if (this.dataSubject === 'math') return this.mathCats;
    if (this.dataSubject === 'lit') return this.litCats;
    if (this.dataSubject === 'eng') return this.engCats;
    return [];
  }

  availableLessons() {
    if (this.dataSubject === 'math') {
      return this.mathLessonsMap[this.dataCategory] || [];
    }
    return [];
  }

  onDataSubjectChange() {
    // Reset defaults when subject changes
    if (this.dataSubject === 'math') { 
        this.dataCategory = 'c1'; 
        this.dataLesson = 'all'; // Default
        this.dataLevel = 'easy'; 
    }
    else if (this.dataSubject === 'lit') { this.dataCategory = 'truyen'; this.dataLevel = 'any'; }
    else if (this.dataSubject === 'eng') { this.dataCategory = 'dang1'; this.dataLevel = 'b1'; }
    this.loadExampleData();
  }

  onDataCategoryChange() {
    // When category (chapter) changes, reset lesson to 'all'
    if (this.dataSubject === 'math') {
       this.dataLesson = 'all';
    }
    this.loadExampleData();
  }

  async loadExampleData() {
    this.isLoadingData.set(true);
    // Pass dataLesson to service (only relevant for math if not 'all')
    const lessonParam = (this.dataSubject === 'math') ? this.dataLesson : undefined;
    const content = await this.dbService.getExampleData(this.dataSubject, this.dataCategory, this.dataLevel, lessonParam);
    this.dataContent = content || '';
    this.isLoadingData.set(false);
  }

  async saveExampleData() {
    this.isLoadingData.set(true);
    const lessonParam = (this.dataSubject === 'math') ? this.dataLesson : undefined;
    const success = await this.dbService.saveExampleData(this.dataSubject, this.dataCategory, this.dataLevel, this.dataContent, lessonParam);
    this.isLoadingData.set(false);
    this.flashSuccess(success);
  }

  // Helpers
  flashSuccess(success: boolean) {
    if(success) {
      this.savedSuccess.set(true);
      setTimeout(() => this.savedSuccess.set(false), 2000);
    } else {
      alert("Lỗi lưu dữ liệu.");
    }
  }
}
