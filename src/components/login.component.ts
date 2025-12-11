
import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="close.emit()"></div>

      <!-- Modal -->
      <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="relative z-10 p-6 pb-0 text-center shrink-0">
          <!-- Decoration -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-bl-full -mr-8 -mt-8 z-0 pointer-events-none"></div>
          
          <h2 class="text-2xl font-bold text-slate-800 relative z-10">{{ isLoginMode() ? 'Đăng nhập' : 'Đăng ký tài khoản' }}</h2>
          <p class="text-slate-500 text-sm mt-1 relative z-10">
            {{ isLoginMode() ? 'Chào mừng bạn quay trở lại với LimVA' : 'Điền thông tin để tham gia hệ thống học tập thông minh' }}
          </p>
        </div>

        <!-- Scrollable Content -->
        <div class="p-6 overflow-y-auto custom-scrollbar flex-grow">
          
          <!-- Error Alert -->
          @if (errorMsg()) {
            <div class="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2 border border-red-100">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               {{ errorMsg() }}
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="space-y-4">
            
            @if (!isLoginMode()) {
              <!-- Registration Fields Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <!-- Full Name -->
                <div class="md:col-span-2">
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Họ và tên <span class="text-red-500">*</span></label>
                  <input type="text" [(ngModel)]="fullName" name="fullName" class="form-input" placeholder="Nguyễn Văn A" required>
                </div>

                <!-- Username -->
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Tên đăng nhập <span class="text-red-500">*</span></label>
                  <input type="text" [(ngModel)]="username" name="username" class="form-input" placeholder="user123" required>
                </div>

                 <!-- Class -->
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Lớp <span class="text-red-500">*</span></label>
                  <input type="text" [(ngModel)]="className" name="className" class="form-input" placeholder="12A1" required>
                </div>
                
                <!-- School -->
                 <div class="md:col-span-2">
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Trường học <span class="text-red-500">*</span></label>
                  <input type="text" [(ngModel)]="schoolName" name="schoolName" class="form-input" placeholder="THPT Chuyên..." required>
                </div>

                <!-- Province -->
                <div class="md:col-span-2">
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Tỉnh / Thành phố <span class="text-red-500">*</span></label>
                  <select [(ngModel)]="selectedProvince" name="province" class="form-input" required>
                    <option value="" disabled selected>-- Chọn Tỉnh/Thành phố --</option>
                    @for (prov of provinces; track prov) {
                      <option [value]="prov">{{ prov }}</option>
                    }
                  </select>
                </div>
              </div>
            }

            <!-- Common Fields (Login & Register) -->
             <div class="grid grid-cols-1 gap-4">
               <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Email <span class="text-red-500">*</span></label>
                <input type="email" [(ngModel)]="email" name="email" class="form-input" placeholder="name@example.com" required>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Mật khẩu <span class="text-red-500">*</span></label>
                <div class="relative">
                  <input 
                    [type]="showPassword() ? 'text' : 'password'" 
                    [(ngModel)]="password" 
                    name="password" 
                    class="form-input pr-10" 
                    placeholder="••••••••" 
                    required
                  >
                  <button 
                    type="button"
                    (click)="showPassword.set(!showPassword())"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                    tabindex="-1"
                  >
                    @if (showPassword()) {
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>
             </div>

            <button 
              type="submit" 
              [disabled]="isLoading()"
              class="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200 disabled:opacity-50 flex justify-center items-center gap-2 mt-6"
            >
              @if (isLoading()) {
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              }
              {{ isLoginMode() ? 'Đăng nhập ngay' : 'Đăng ký thành viên' }}
            </button>
          </form>

          <div class="mt-6 text-center pb-2">
            <button (click)="toggleMode()" class="text-sm text-indigo-600 font-bold hover:underline">
              {{ isLoginMode() ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập' }}
            </button>
          </div>
        </div>

        <!-- Close Button -->
        <button (click)="close.emit()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-20 bg-white rounded-full p-1 hover:bg-slate-100 transition">
           <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

      </div>
    </div>

    <style>
      .form-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        transition: all 0.2s;
        outline: none;
      }
      .form-input:focus {
        background-color: #ffffff;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5); /* indigo-500 ring */
        border-color: #6366f1;
      }
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    </style>
  `
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();
  
  authService = inject(AuthService);
  
  isLoginMode = signal<boolean>(true);
  isLoading = signal<boolean>(false);
  errorMsg = signal<string>('');
  
  // New Signal for password visibility
  showPassword = signal<boolean>(false);

  // Login Fields
  email = '';
  password = '';

  // Register Fields
  fullName = '';
  username = '';
  className = '';
  schoolName = '';
  selectedProvince = '';

  // Data
  provinces = [
    'Thành phố Hà Nội', 'Tỉnh Cao Bằng', 'Tỉnh Tuyên Quang', 'Tỉnh Điện Biên', 'Tỉnh Lai Châu', 
    'Tỉnh Sơn La', 'Tỉnh Lào Cai', 'Tỉnh Thái Nguyên', 'Tỉnh Lạng Sơn', 'Tỉnh Quảng Ninh', 
    'Tỉnh Bắc Ninh', 'Tỉnh Phú Thọ', 'Thành phố Hải Phòng', 'Tỉnh Hưng Yên', 'Tỉnh Ninh Bình', 
    'Tỉnh Thanh Hóa', 'Tỉnh Nghệ An', 'Tỉnh Hà Tĩnh', 'Tỉnh Quảng Trị', 'Thành phố Huế', 
    'Thành phố Đà Nẵng', 'Tỉnh Quảng Ngãi', 'Tỉnh Gia Lai', 'Tỉnh Khánh Hòa', 'Tỉnh Đắk Lắk', 
    'Tỉnh Lâm Đồng', 'Tỉnh Đồng Nai', 'Thành phố Hồ Chí Minh', 'Tỉnh Tây Ninh', 'Tỉnh Đồng Tháp', 
    'Tỉnh Vĩnh Long', 'Tỉnh An Giang', 'Thành phố Cần Thơ', 'Tỉnh Cà Mau'
  ];

  toggleMode() {
    this.isLoginMode.update(v => !v);
    this.errorMsg.set('');
  }

  async onSubmit() {
    this.errorMsg.set('');

    // Basic Validation
    if (!this.email || !this.password) {
      this.errorMsg.set('Vui lòng nhập Email và Mật khẩu.');
      return;
    }

    if (!this.isLoginMode()) {
       if (!this.fullName || !this.username || !this.className || !this.schoolName || !this.selectedProvince) {
         this.errorMsg.set('Vui lòng điền đầy đủ tất cả các trường thông tin.');
         return;
       }
    }

    this.isLoading.set(true);

    let res;
    if (this.isLoginMode()) {
      res = await this.authService.login(this.email, this.password);
    } else {
      res = await this.authService.register({
        email: this.email,
        pass: this.password,
        fullName: this.fullName,
        username: this.username,
        className: this.className,
        school: this.schoolName,
        province: this.selectedProvince
      });
    }

    this.isLoading.set(false);

    if (res.success) {
      this.close.emit();
    } else {
      this.errorMsg.set(res.error || 'Có lỗi xảy ra');
    }
  }
}
