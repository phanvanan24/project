
import { Component, signal, inject, computed, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FileUploaderComponent } from './file-uploader.component';
import { GeminiService } from '../services/gemini.service';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { Chat } from '@google/genai';

declare var katex: any;

interface GradingResult {
  problemStatement: string;
  studentAnalysis: {
    stepContent: string;
    isCorrect: boolean;
    correction: string;
  }[];
  errors: string[];
  modelSolution: string;
  score: number;
  generalFeedback: string;
  improvementSuggestions: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

interface PracticeQuestion {
  id: number;
  questionText: string;
  type: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  userAnswer?: string; // Local state
}

@Component({
  selector: 'app-math-grader',
  standalone: true,
  imports: [CommonModule, FileUploaderComponent, FormsModule],
  templateUrl: './math-grader.component.html',
})
export class MathGraderComponent {
  private geminiService = inject(GeminiService);
  private dbService = inject(DatabaseService);
  private sanitizer = inject(DomSanitizer);
  public authService = inject(AuthService);

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  // Grading State
  problemImage = signal<string | null>(null);
  solutionImage = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  result = signal<GradingResult | null>(null);
  error = signal<string | null>(null);

  // Chat State
  chatSession: Chat | null = null;
  messages = signal<ChatMessage[]>([]);
  currentMessage = signal<string>('');
  isChatLoading = signal<boolean>(false);

  // Practice State
  showPracticePrompt = signal<boolean>(false);
  isPracticeLoading = signal<boolean>(false);
  practiceQuestions = signal<PracticeQuestion[]>([]);

  // Computed
  hasCredits = computed(() => {
    return this.authService.isAdmin() || this.authService.graderCredits() > 0;
  });

  canGrade = computed(() => {
    return this.problemImage() !== null && 
           this.solutionImage() !== null && 
           !this.isLoading() &&
           this.hasCredits();
  });
  
  isAllPracticeAnswered = computed(() => {
     const qs = this.practiceQuestions();
     return qs.length > 0 && qs.every(q => !!q.userAnswer);
  });

  // Handlers
  onProblemImageSelected(file: {data: string, type: string} | null) {
    this.problemImage.set(file ? file.data : null);
    this.resetResult();
  }

  onSolutionImageSelected(file: {data: string, type: string} | null) {
    this.solutionImage.set(file ? file.data : null);
    this.resetResult();
  }

  resetResult() {
    this.result.set(null);
    this.messages.set([]);
    this.chatSession = null;
    this.showPracticePrompt.set(false);
    this.practiceQuestions.set([]);
  }

  async gradeAssignment() {
    const pImg = this.problemImage();
    const sImg = this.solutionImage();

    if (!pImg || !sImg) return;
    
    if (!this.authService.isAdmin() && this.authService.graderCredits() <= 0) {
       alert("Bạn đã hết lượt chấm bài hôm nay. Vui lòng quay lại vào ngày mai!");
       return;
    }

    const creditConsumed = await this.authService.consumeCredit('grader');
    if (!creditConsumed) {
       alert("Lỗi trừ điểm. Vui lòng thử lại.");
       return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.resetResult();

    try {
      const data = await this.geminiService.gradeMathAssignment(pImg, sImg);
      this.result.set(data);
      this.dbService.incrementStat('papersGraded');
      
      this.chatSession = this.geminiService.createChatSession(data);
      this.messages.set([
        { role: 'model', text: 'Chào em, thầy là Trợ Giảng LimVA AI. Em có thắc mắc gì về kết quả chấm bài hay lời giải không? Thầy ở đây để giải thích chi tiết hơn cho em nhé!' }
      ]);
      
      // PRACTICE LOGIC: Check score < 7
      if (data.score < 7) {
         this.showPracticePrompt.set(true);
      }

    } catch (err) {
      this.error.set('Đã xảy ra lỗi khi chấm bài. Vui lòng kiểm tra lại ảnh hoặc thử lại sau.');
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  async sendMessage() {
    const text = this.currentMessage().trim();
    if (!text || !this.chatSession || this.isChatLoading()) return;

    this.messages.update(msgs => [...msgs, { role: 'user', text }]);
    this.currentMessage.set('');
    this.isChatLoading.set(true);
    this.scrollToBottom();

    try {
      const response = await this.chatSession.sendMessage({ message: text });
      this.messages.update(msgs => [...msgs, { role: 'model', text: response.text || "Xin lỗi, mình chưa hiểu ý bạn." }]);
    } catch (e) {
      console.error(e);
      this.messages.update(msgs => [...msgs, { role: 'model', text: 'Có lỗi kết nối, vui lòng thử lại sau.' }]);
    } finally {
      this.isChatLoading.set(false);
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer?.nativeElement) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  // --- PRACTICE MODE FUNCTIONS ---

  async startPractice() {
    const res = this.result();
    if (!res || !res.problemStatement) return;
    
    this.isPracticeLoading.set(true);
    try {
       const practiceData = await this.geminiService.generatePracticeSet(res.problemStatement);
       if (practiceData && practiceData.questions) {
          this.practiceQuestions.set(practiceData.questions);
       }
    } catch (e) {
       alert("Lỗi tạo bài luyện tập. Vui lòng thử lại.");
    } finally {
       this.isPracticeLoading.set(false);
    }
  }

  getAlphaLabel(i: number) { return String.fromCharCode(65 + i); }

  checkPracticeAnswer(q: PracticeQuestion, opt: string) {
    if (q.userAnswer) return; // Already answered
    q.userAnswer = opt;
    // Force UI update (signals sometimes need help with nested object mutation)
    this.practiceQuestions.update(val => [...val]);
  }

  isPracticeCorrect(q: PracticeQuestion, opt: string): boolean {
    if (!q.correctAnswer) return false;
    // Compare Option Text with Correct Answer string (e.g. "A. 5" or just "A" or just "5")
    const correctStr = q.correctAnswer.trim();
    const optStr = opt.trim();
    
    // Check direct match
    if (optStr === correctStr) return true;
    
    // Check Letter match (e.g. correct="A. 5", option="5", label="A")
    const idx = q.options.indexOf(opt);
    const letter = String.fromCharCode(65 + idx);
    
    if (correctStr.startsWith(letter + '.') || correctStr.startsWith(letter + ' ')) return true;
    if (correctStr === letter) return true;
    
    return false;
  }
  
  downloadPractice() {
    const qs = this.practiceQuestions();
    if (qs.length === 0) return;

    let htmlContent = `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><title>Bài luyện tập - LimVA</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"><style>body{font-family:'Times New Roman',serif;padding:40px;max-width:800px;margin:0 auto} .q-box{margin-bottom:20px; border-bottom:1px solid #eee; padding-bottom:20px} .ans-box{margin-top:10px;background:#e8f5e9;padding:10px;border:1px solid #c8e6c9}</style></head><body><h1>Bài luyện tập tăng cường</h1>`;
    
    qs.forEach(q => {
        htmlContent += `<div class="q-box"><b>Câu ${q.id}:</b> ${this.formatTextForExport(q.questionText)}`;
        htmlContent += `<div style="margin-left:20px; margin-top:10px">`;
        q.options.forEach((opt: string, idx: number) => {
            htmlContent += `<div><b>${String.fromCharCode(65+idx)}.</b> ${this.formatTextForExport(opt)}</div>`;
        });
        htmlContent += `</div>`;
        htmlContent += `<div class="ans-box"><b>Đáp án đúng:</b> ${this.formatTextForExport(q.correctAnswer)}<br><b>Giải thích:</b> ${this.formatTextForExport(q.explanation)}</div></div>`;
    });
    htmlContent += `</body></html>`;
    
    const url = window.URL.createObjectURL(new Blob([htmlContent], { type: 'text/html' }));
    const a = document.createElement('a'); a.href = url; a.download = `Bai_luyen_tap_${new Date().getTime()}.html`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  // --- UTILS ---

  reset() {
    // Completely reset signals to initial state
    this.problemImage.set(null);
    this.solutionImage.set(null);
    this.result.set(null);
    this.error.set(null);
    this.messages.set([]);
    this.chatSession = null;
    this.showPracticePrompt.set(false);
    this.practiceQuestions.set([]);
    
    // Smooth scroll to top instead of reloading
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // --- IMPROVED RENDER MATH ENGINE ---
  renderMath(text: string): SafeHtml {
    if (!text) return '';
    const str = String(text);

    // 1. Normalize delimiters
    let cleanText = str
      .replace(/\\\[/g, '$$$$') // \[ -> $$
      .replace(/\\\]/g, '$$$$') // \] -> $$
      .replace(/\\\(/g, '$')    // \( -> $
      .replace(/\\\)/g, '$');   // \) -> $

    // 2. Tokenize using regex that allows newlines inside delimiters
    // Matches $$...$$ OR $...$
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]*?\$)/g;
    
    const parts = cleanText.split(regex);

    // 3. Process
    const processedParts = parts.map(part => {
      // BLOCK MATH
      if (part.startsWith('$$') && part.endsWith('$$') && part.length >= 4) {
        const tex = part.slice(2, -2);
        return this.tryRenderKatex(tex, true) || part;
      }
      // INLINE MATH
      else if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
        const tex = part.slice(1, -1);
        return this.tryRenderKatex(tex, false) || part;
      }
      // TEXT or NAKED MATH (Heuristic Fix)
      else {
        // Handle Multiline Naked Math: Split by newline and check each line
        return part.split('\n').map(line => {
           const trimmed = line.trim();
           if (!trimmed) return '';

           // Heuristic: If line starts with \ (e.g. \Delta) OR contains \ AND = (e.g. x = \frac)
           // and it wasn't caught by the delimiters above, assume it's raw math.
           const looksLikeMath = /^\\/.test(trimmed) || (trimmed.includes('\\') && trimmed.includes('='));
           
           if (looksLikeMath) {
              const rendered = this.tryRenderKatex(trimmed, false); // Try render as math
              if (rendered) return rendered;
           }

           // Normal Text Formatting
           return line
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }).join('<br>');
      }
    });

    return this.sanitizer.bypassSecurityTrustHtml(processedParts.join(''));
  }
  
  private tryRenderKatex(tex: string, displayMode: boolean): string | null {
    if (typeof katex === 'undefined') return null;
    try {
      return katex.renderToString(tex, { 
          displayMode: displayMode, 
          throwOnError: false, 
          output: 'html',
          trust: true 
      });
    } catch { return null; }
  }
  
  formatSolution(text: string): SafeHtml {
    return this.renderMath(text);
  }
  
  formatTextForExport(text: string): string {
    if (!text) return '';
    let cleanText = text.replace(/\\\[/g, '$$$$').replace(/\\\]/g, '$$$$').replace(/\\\(/g, '$').replace(/\\\)/g, '$');
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]*?\$)/g;
    const parts = cleanText.split(regex);
    return parts.map(part => {
      if (part.startsWith('$$')) { return this.tryRenderKatex(part.slice(2, -2), true) || part; }
      else if (part.startsWith('$')) { return this.tryRenderKatex(part.slice(1, -1), false) || part; }
      else { return part.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br>'); }
    }).join('');
  }
}
