
import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-2">
      <label class="block text-sm font-semibold text-slate-700 ml-1">{{ label }}</label>
      
      <div 
        class="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-white hover:border-indigo-400 hover:shadow-md transition-all duration-300 cursor-pointer group min-h-[180px]"
        [class.border-indigo-500]="hasFile()"
        [class.bg-indigo-50]="hasFile()"
        (click)="fileInput.click()"
        (dragover)="onDragOver($event)"
        (drop)="onDrop($event)"
      >
        <input 
          #fileInput 
          type="file" 
          [accept]="acceptType" 
          class="hidden" 
          (change)="onFileSelected($event)"
        >

        @if (hasFile()) {
          @if (isPdf()) {
            <!-- PDF Icon Display -->
            <div class="flex flex-col items-center animate-fade-in">
               <div class="w-16 h-16 bg-red-100 text-red-500 rounded-xl flex items-center justify-center mb-3 shadow-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l3 3 3-3"/><line x1="12" y1="18" x2="12" y2="12"/></svg>
               </div>
               <span class="text-sm font-bold text-slate-700 text-center break-all px-4 line-clamp-2">{{ fileName() }}</span>
               <span class="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full mt-2 border border-green-100">Đã tải lên thành công</span>
            </div>
          } @else {
            <!-- Image Preview -->
            <div class="relative w-full h-full flex justify-center animate-fade-in">
               <img [src]="previewUrl()" class="max-h-40 object-contain rounded-lg shadow-sm" alt="Preview">
            </div>
          }

          <button 
            (click)="removeFile($event)" 
            class="absolute -top-3 -right-3 bg-white text-red-500 border border-red-100 rounded-full p-2 shadow-lg hover:bg-red-50 hover:scale-110 transition z-20"
            title="Xóa file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        } @else {
          <div class="w-14 h-14 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <p class="text-sm text-slate-600 font-semibold">Tải lên file</p>
          <p class="text-xs text-slate-400 mt-1">{{ acceptDescription }}</p>
        }
      </div>
    </div>
  `
})
export class FileUploaderComponent {
  @Input({ required: true }) label!: string;
  @Input() allowPdf: boolean = false;
  
  @Output() imageSelected = new EventEmitter<{data: string, type: 'image' | 'pdf'} | null>();
  
  previewUrl = signal<string | null>(null);
  fileName = signal<string>('');
  isPdf = signal<boolean>(false);
  hasFile = computed(() => !!this.previewUrl() || this.isPdf());

  get acceptType() {
    return this.allowPdf ? "image/*,application/pdf" : "image/*";
  }

  get acceptDescription() {
    return this.allowPdf ? "PNG, JPG hoặc PDF" : "PNG hoặc JPG";
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  processFile(file: File) {
    const isPdf = file.type === 'application/pdf';
    if (!file.type.startsWith('image/') && !isPdf) return;

    this.fileName.set(file.name);
    this.isPdf.set(isPdf);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!isPdf) {
        this.previewUrl.set(result);
      } else {
        this.previewUrl.set(null); // No preview for PDF
      }
      
      // Send base64 stripped of data URL prefix
      const base64 = result.split(',')[1];
      this.imageSelected.emit({
        data: base64,
        type: isPdf ? 'pdf' : 'image'
      });
    };
    reader.readAsDataURL(file);
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.previewUrl.set(null);
    this.isPdf.set(false);
    this.fileName.set('');
    this.imageSelected.emit(null);
    
    // Reset input value so same file can be selected again
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) input.value = '';
  }
}
