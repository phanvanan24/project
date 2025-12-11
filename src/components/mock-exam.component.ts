
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mock-exam',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-[85vh] fade-in rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white relative">
       <!-- Loading Indicator (Hiển thị khi iframe đang tải) -->
       <div class="absolute inset-0 flex items-center justify-center z-0 bg-slate-50">
          <div class="flex flex-col items-center gap-3">
             <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
             <span class="text-sm font-medium text-slate-500">Đang tải hệ thống thi thử...</span>
          </div>
       </div>

       <!-- Embedded Web App -->
       <iframe 
         [src]="safeUrl" 
         class="w-full h-full border-0 relative z-10 bg-white"
         allow="camera; microphone; fullscreen; clipboard-read; clipboard-write; display-capture"
         title="Hệ thống thi thử Online"
       ></iframe>
    </div>
  `
})
export class MockExamComponent {
  private sanitizer = inject(DomSanitizer);
  safeUrl: SafeResourceUrl;

  constructor() {
    // Trust URL để hiển thị trong iframe
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://online-exam-app-deve-fr88.bolt.host/');
  }
}
