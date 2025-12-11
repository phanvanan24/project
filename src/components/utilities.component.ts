
import { Component, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { GeminiService } from '../services/gemini.service';
import { DatabaseService, ChatHistoryMsg } from '../services/database.service';
import { AuthService } from '../services/auth.service';
import { Chat } from '@google/genai';

declare var katex: any;

@Component({
  selector: 'app-utilities',
  imports: [CommonModule, FormsModule],
  template: `
    <div [class]="activeTool() ? 'max-w-[96vw]' : 'max-w-6xl'" class="mx-auto fade-in py-8 px-4 transition-all duration-500 ease-in-out">
      @if (!activeTool()) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
             <div class="h-44 relative overflow-hidden">
                <img src="https://sf-static.upanhlaylink.com/img/image_202511302522d503df5cddf3596a66eab1b57512.jpg" alt="Hình học không gian" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
             </div>
             <div class="p-6 flex-grow flex flex-col"><h3 class="font-bold text-xl text-gray-900 mb-2">Hình học không gian</h3><p class="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">Mô phỏng trực quan các khối đa diện, mặt cầu, mặt trụ trong không gian 3 chiều.</p><button (click)="openGeometry()" class="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200 flex items-center justify-center gap-2"><span>Bắt đầu</span></button></div>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
             <div class="h-44 relative overflow-hidden">
                <img src="https://sf-static.upanhlaylink.com/img/image_202511303e73c9eb565696cb101d8c373e04f5d4.jpg" alt="Phòng thí nghiệm Vật Lý ảo" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
             </div>
             <div class="p-6 flex-grow flex flex-col"><h3 class="font-bold text-xl text-gray-900">Phòng thí nghiệm Vật Lý ảo</h3><p class="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">Phòng thí nghiệm ảo cho phép học sinh thực hiện các bài thí nghiệm an toàn hiệu quả.</p><button (click)="openPhysics()" class="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200 flex items-center justify-center gap-2"><span>Bắt đầu</span></button></div>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
             <div class="h-44 relative overflow-hidden">
                <img src="https://sf-static.upanhlaylink.com/img/image_202511303b4e9a31962ea61329c844e7f427d921.jpg" alt="Thầy giáo AI" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
             </div>
             <div class="p-6 flex-grow flex flex-col"><h3 class="font-bold text-xl text-gray-900">Trò chuyện với Thầy giáo AI</h3><p class="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">Trò chuyện 1:1 với thầy giáo AI để hỏi đáp, giải thích phương pháp học.</p><button (click)="openTeacher()" class="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"><span>Trò chuyện ngay</span></button></div>
          </div>
        </div>
      }

      @if (activeTool() === 'geometry') {
        <div class="animate-fade-in flex flex-col h-full w-full">
           <div class="flex items-center justify-between mb-2 bg-white p-3 rounded-xl shadow-sm border border-gray-200"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">🧊</div><div><h3 class="font-bold text-lg text-gray-900">Hình học không gian 3D</h3><p class="text-xs text-gray-500">Mô phỏng trực tuyến</p></div></div><button (click)="closeTool()" class="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-colors text-sm">Quay lại</button></div>
           <div class="w-full h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative group"><iframe [src]="safeGeometryUrl" class="w-full h-full border-0 relative z-10 bg-white" title="Geometry Tool" allowfullscreen></iframe></div>
        </div>
      }

      @if (activeTool() === 'physics') {
        <div class="animate-fade-in flex flex-col h-full w-full">
           <div class="flex items-center justify-between mb-2 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
             <div class="flex items-center gap-3">
               <div><h3 class="font-bold text-lg text-gray-900">Phòng thí nghiệm Vật Lý ảo</h3><p class="text-xs text-gray-500">Mô phỏng thực hành</p></div>
             </div>
             <button (click)="closeTool()" class="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-colors text-sm">Quay lại</button>
           </div>
           <div class="w-full h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative group"><iframe [src]="safePhysicsUrl" class="w-full h-full border-0 relative z-10 bg-white" title="Physics Tool" allowfullscreen></iframe></div>
        </div>
      }

      @if (activeTool() === 'teacher') {
        <div class="animate-fade-in flex flex-col h-full max-w-5xl mx-auto">
           <div class="flex items-center justify-between mb-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
             <div class="flex items-center gap-3">
               <!-- Teacher Avatar Updated -->
               <img src="https://sf-static.upanhlaylink.com/img/image_202511302f0fbad312f306017f5f7d5d7c8b4daf.jpg" class="w-12 h-12 rounded-full border-2 border-emerald-100 object-cover shadow-sm">
               <div><h3 class="font-bold text-lg text-gray-900">Thầy giáo AI</h3><p class="text-xs text-gray-500">Tư vấn phương pháp học & gợi ý bài tập</p></div>
             </div>
             <button (click)="closeTool()" class="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-colors text-sm">Quay lại</button>
           </div>
           <div class="w-full h-[75vh] bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 flex flex-col">
             <div #chatContainer class="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50">
               @if (isHistoryLoading()) {
                   <div class="flex flex-col items-center justify-center h-full gap-3">
                      <div class="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                      <span class="text-sm text-gray-500">Đang tải lịch sử trò chuyện...</span>
                   </div>
               } @else if (messages().length === 0) { 
                   <div class="flex flex-col items-center justify-center h-full text-center text-gray-400 opacity-70"><div class="text-6xl mb-4">👋</div><p class="font-medium">Chào em, thầy là AI Teacher.</p><p class="text-sm">Em cần thầy tư vấn hay gợi ý bài tập nào không?</p></div> 
               }
               @for (msg of messages(); track $index) {
                 <div [class]="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
                    @if (msg.role === 'model') { 
                      <img src="https://sf-static.upanhlaylink.com/img/image_202511302f0fbad312f306017f5f7d5d7c8b4daf.jpg" class="w-10 h-10 rounded-full border-2 border-white shadow-sm mr-3 flex-shrink-0 self-end mb-1 object-cover">
                    }
                    <div [class]="msg.role === 'user' ? 'bg-indigo-600 text-white rounded-2xl rounded-br-none px-5 py-3 shadow-md max-w-[80%] flex flex-col items-end' : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-none px-5 py-3 shadow-sm max-w-[80%]' ">
                       <!-- NOTE: Images are purposefully NOT displayed here to avoid DB storage bloat -->
                       <div class="text-sm prose-sm" [class.prose-invert]="msg.role === 'user'" [innerHTML]="renderMath(msg.text)"></div>
                    </div>
                 </div>
               }
               @if (isChatLoading()) { 
                 <div class="flex justify-start">
                   <img src="https://sf-static.upanhlaylink.com/img/image_202511302f0fbad312f306017f5f7d5d7c8b4daf.jpg" class="w-10 h-10 rounded-full border-2 border-white shadow-sm mr-3 flex-shrink-0 self-end mb-1 object-cover">
                   <div class="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 shadow-sm"><div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div><div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div><div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div></div>
                 </div> 
               }
             </div>
             
             <!-- Preview Image Area (Only shows BEFORE sending) -->
             @if (selectedImages().length > 0) {
                <div class="px-4 pt-2 bg-white border-t border-gray-50 flex items-center gap-3 animate-fade-in overflow-x-auto py-2">
                   @for (img of selectedImages(); track $index) {
                     <div class="relative group flex-shrink-0">
                        <img [src]="img" class="h-16 w-16 object-cover rounded-lg border border-indigo-200 shadow-sm">
                        <button (click)="removeImage($index)" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600 transition">
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                        </button>
                     </div>
                   }
                   <span class="ml-2 text-xs text-gray-500 italic flex-shrink-0">Đã chọn {{ selectedImages().length }}/3 ảnh</span>
                </div>
             }

             <div class="p-4 bg-white border-t border-gray-100">
               <div class="relative flex items-center gap-2">
                 <!-- File Upload Button -->
                 <button (click)="fileInput.click()" class="p-3 text-gray-400 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 rounded-full transition-colors flex-shrink-0" title="Gửi ảnh (Tối đa 3)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                 </button>
                 <input #fileInput type="file" accept="image/*" multiple class="hidden" (change)="onImageSelected($event)">

                 <input type="text" [(ngModel)]="currentMessage" (keyup.enter)="sendMessage()" placeholder="Nhập câu hỏi của em..." class="flex-grow bg-gray-50 border-gray-200 rounded-full py-3 pl-6 pr-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-gray-800 placeholder-gray-400 shadow-inner" [disabled]="isChatLoading() || isHistoryLoading()">
                 
                 <button (click)="sendMessage()" [disabled]="(!currentMessage().trim() && selectedImages().length === 0) || isChatLoading() || isHistoryLoading()" class="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition shadow-md disabled:opacity-50 disabled:shadow-none flex-shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></button>
               </div>
             </div>
           </div>
        </div>
      }
    </div>
  `
})
export class UtilitiesComponent implements AfterViewChecked {
  private sanitizer = inject(DomSanitizer);
  private geminiService = inject(GeminiService);
  private dbService = inject(DatabaseService);
  private authService = inject(AuthService);
  
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  
  // State
  activeTool = signal<'geometry' | 'physics' | 'teacher' | null>(null);

  // Urls
  safeGeometryUrl: SafeResourceUrl;
  safePhysicsUrl: SafeResourceUrl;

  // Teacher Chat State
  chatSession: Chat | null = null;
  messages = signal<ChatHistoryMsg[]>([]);
  currentMessage = signal<string>('');
  selectedImages = signal<string[]>([]); // Array of Base64 strings
  
  isChatLoading = signal<boolean>(false);
  isHistoryLoading = signal<boolean>(false);

  constructor() {
    this.safeGeometryUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:5001/');
    this.safePhysicsUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://phamthidieu1801-code-874u.bolt.host/');
  }

  ngAfterViewChecked() { this.scrollToBottom(); }

  openGeometry() { this.activeTool.set('geometry'); }
  openPhysics() { this.activeTool.set('physics'); }
  
  async openTeacher() { 
    this.activeTool.set('teacher'); 
    
    // Load history from DB
    const uid = this.authService.currentUser()?.uid;
    if (uid) {
        this.isHistoryLoading.set(true);
        const history = await this.dbService.getTeacherChatHistory(uid);
        this.messages.set(history);
        this.isHistoryLoading.set(false);
        
        // Init Gemini Session with History
        // Convert format to SDK expectation
        const geminiHistory = history.map(m => {
            const parts: any[] = [{ text: m.text }];
            // Note: We don't restore images to Gemini context from DB as we don't save them.
            // We just send text history for context.
            return {
                role: m.role,
                parts: parts
            };
        });
        this.chatSession = this.geminiService.createTeacherChatSession(geminiHistory);

        // If no history, send welcome (but don't save to DB yet to avoid spam)
        if (history.length === 0) {
            this.messages.set([{ role: 'model', text: 'Chào em! Thầy có thể giúp gì cho việc học của em hôm nay?' }]);
        }
    } else {
        // Fallback if not logged in (shouldn't happen due to guards)
        this.chatSession = this.geminiService.createTeacherChatSession();
        this.messages.set([{ role: 'model', text: 'Chào em! Thầy có thể giúp gì cho việc học của em hôm nay?' }]);
    }
  }

  closeTool() { this.activeTool.set(null); }
  
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
       const currentCount = this.selectedImages().length;
       const maxToAdd = 3 - currentCount;
       
       if (maxToAdd <= 0) {
          alert('Bạn chỉ được gửi tối đa 3 ảnh cùng lúc.');
          input.value = '';
          return;
       }

       // Convert FileList to Array
       const files = Array.from(input.files).slice(0, maxToAdd);
       
       files.forEach(file => {
           if (!file.type.startsWith('image/')) return;
           const reader = new FileReader();
           reader.onload = (e: any) => {
               this.selectedImages.update(imgs => [...imgs, e.target.result]);
           };
           reader.readAsDataURL(file);
       });
       
       if (input.files.length > maxToAdd) {
           alert(`Chỉ thêm được ${maxToAdd} ảnh (tối đa 3).`);
       }
       
       input.value = '';
    }
  }

  removeImage(index: number) {
    this.selectedImages.update(imgs => imgs.filter((_, i) => i !== index));
    if (this.selectedImages().length === 0 && this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }
  
  async sendMessage() {
    const text = this.currentMessage().trim();
    const images = this.selectedImages();
    
    if ((!text && images.length === 0) || !this.chatSession || this.isChatLoading()) return;
    
    // UPDATE UI LOCAL: 
    // IMPORTANT: We DO NOT add images to the messages list here.
    // This satisfies the requirement: "hình ảnh sẽ không hiện lên tin nhắn".
    // We only add the text, or a placeholder if text is empty.
    const displayText = text || (images.length > 0 ? "[Đã gửi ảnh]" : "");
    const newMessage: ChatHistoryMsg = { role: 'user', text: displayText };
    
    this.messages.update(msgs => [...msgs, newMessage]); 
    
    // Reset inputs immediately
    this.currentMessage.set(''); 
    this.selectedImages.set([]); 
    this.isChatLoading.set(true);
    
    try {
      let response;
      if (images.length > 0) {
         // Send with images to Gemini (Hidden from UI, but sent to AI)
         const parts: any[] = [];
         // Add text part first
         parts.push({ text: text || " " });
         
         // Add image parts
         images.forEach(img => {
            const base64Data = img.split(',')[1];
            parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64Data } });
         });

         // FIX: Use proper contents structure for GenerateContentRequest
         // Sending message: { message: Part[] }
         response = await this.chatSession.sendMessage({
            message: parts
         });
      } else {
         // Text only
         response = await this.chatSession.sendMessage({ message: text });
      }

      const replyText = response.text || "Thầy chưa nghe rõ, em nói lại được không?";
      this.messages.update(msgs => [...msgs, { role: 'model', text: replyText }]);
      
      // Save to DB (Only text is saved since ChatHistoryMsg no longer has images field)
      const uid = this.authService.currentUser()?.uid;
      if (uid) {
         await this.dbService.saveTeacherChatHistory(uid, this.messages());
      }

    } catch (e) { 
      console.error(e); 
      this.messages.update(msgs => [...msgs, { role: 'model', text: 'Mạng yếu quá hoặc ảnh quá lớn, em kiểm tra lại kết nối nhé.' }]); 
    } finally { 
      this.isChatLoading.set(false); 
    }
  }

  scrollToBottom() { if (this.chatContainer?.nativeElement) this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight; }

  // ROBUST MATH RENDERING
  renderMath(text: string): SafeHtml {
    if (!text) return '';
    const str = String(text);
    
    // Normalize delimiters first
    let cleanText = str
      .replace(/\\\[/g, '$$$$') 
      .replace(/\\\]/g, '$$$$')
      .replace(/\\\(/g, '$')
      .replace(/\\\)/g, '$');

    // Split into parts: $$...$$ or $...$
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]*?\$)/g;
    const parts = cleanText.split(regex);

    const processedParts = parts.map(part => {
      // Block Math
      if (part.startsWith('$$') && part.endsWith('$$') && part.length >= 4) {
        const tex = part.slice(2, -2);
        try {
          return typeof katex !== 'undefined'
            ? katex.renderToString(tex, { displayMode: true, throwOnError: false, output: 'html' })
            : part;
        } catch { return part; }
      }
      // Inline Math
      else if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
        const tex = part.slice(1, -1);
        try {
          return typeof katex !== 'undefined'
            ? katex.renderToString(tex, { displayMode: false, throwOnError: false, output: 'html' })
            : part;
        } catch { return part; }
      }
      // Plain Text
      else {
        return part
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n/g, '<br>');
      }
    });

    return this.sanitizer.bypassSecurityTrustHtml(processedParts.join(''));
  }
}
