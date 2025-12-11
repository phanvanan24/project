
import { Injectable, signal, computed, inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { DatabaseService } from './database.service';

const firebaseConfig = {
  apiKey: "AIzaSyA48GcL6K3bt0ywuD8LU3XdE9LKXOTqitg",
  authDomain: "thithu-c66eb.firebaseapp.com",
  projectId: "thithu-c66eb",
  storageBucket: "thithu-c66eb.firebasestorage.app",
  messagingSenderId: "11672956754",
  appId: "1:11672956754:web:01842953bd9e549f0fd48b",
  measurementId: "G-XC9G6JPNEE"
};

export interface RegisterData {
  email: string;
  pass: string;
  fullName: string;
  username: string;
  className: string;
  school: string;
  province: string;
}

interface UserCredits {
  grader: number;
  generator: number;
  lastReset: string; // ISO Date string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private app = initializeApp(firebaseConfig);
  private auth = getAuth(this.app);
  private db = getFirestore(this.app); // Firestore for User Data
  private dbService = inject(DatabaseService); // Inject DB Service for Stats

  currentUser = signal<User | null>(null);
  isLoading = signal<boolean>(true);
  
  // Global Login Modal State
  showLoginModal = signal<boolean>(false);
  
  // Credit System Signals
  graderCredits = signal<number>(0);
  generatorCredits = signal<number>(0);
  
  // Admin Check
  isAdmin = computed(() => {
    const user = this.currentUser();
    return user?.email === 'admin@limva.edu.vn';
  });

  constructor() {
    onAuthStateChanged(this.auth, async (user) => {
      this.currentUser.set(user);
      
      if (user) {
        // ADMIN LOGIC: Bypass Firestore checks entirely
        if (user.email === 'admin@limva.edu.vn') {
           this.graderCredits.set(9999);
           this.generatorCredits.set(9999);
           this.isLoading.set(false);
           return; 
        }

        // NORMAL USER LOGIC
        await this.checkAndResetCredits(user.uid);
      } else {
        this.graderCredits.set(0);
        this.generatorCredits.set(0);
      }
      this.isLoading.set(false);
    });
  }

  // Helper for Route Guard
  isAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        unsubscribe();
        resolve(!!user);
      });
    });
  }

  // --- CREDIT LOGIC ---

  private async checkAndResetCredits(uid: string) {
    const todayStr = new Date().toDateString();
    // Default: 30 credits per feature per day for normal users
    const defaultCredits = { grader: 30, generator: 30, lastReset: new Date().toISOString() };

    try {
      const userDocRef = doc(this.db, 'users', uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as UserCredits;
        const lastResetDate = new Date(data.lastReset).toDateString();

        if (lastResetDate !== todayStr) {
          // New Day -> Reset Credits
          await updateDoc(userDocRef, defaultCredits);
          this.graderCredits.set(30);
          this.generatorCredits.set(30);
        } else {
          // Same Day -> Load current
          this.graderCredits.set(data.grader);
          this.generatorCredits.set(data.generator);
        }
      } else {
        // First time user -> Create doc
        await setDoc(userDocRef, defaultCredits);
        this.graderCredits.set(30);
        this.generatorCredits.set(30);
      }
    } catch (e: any) {
      // Permission Error (Security Rules) -> Fallback to LocalStorage silently
      this.useLocalStorageCredits(uid, todayStr, defaultCredits);
    }
  }

  private useLocalStorageCredits(uid: string, todayStr: string, defaultCredits: any) {
    const key = `limva_credits_${uid}`;
    let data = defaultCredits;
    
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        const lastResetDate = new Date(parsed.lastReset).toDateString();
        if (lastResetDate === todayStr) {
          data = parsed; // Use stored data if it's from today
        } else {
          // New day -> Reset in storage
          localStorage.setItem(key, JSON.stringify(defaultCredits));
        }
      } else {
        // Init storage
        localStorage.setItem(key, JSON.stringify(defaultCredits));
      }
      
      this.graderCredits.set(data.grader);
      this.generatorCredits.set(data.generator);
    } catch (err) {
      console.error("LocalStorage error", err);
      // Absolute fallback
      this.graderCredits.set(30);
      this.generatorCredits.set(30);
    }
  }

  async consumeCredit(type: 'grader' | 'generator'): Promise<boolean> {
    // 1. Admin always succeeds without consuming
    if (this.isAdmin()) return true;

    const uid = this.currentUser()?.uid;
    if (!uid) return false;

    const currentVal = type === 'grader' ? this.graderCredits() : this.generatorCredits();
    
    // 2. Normal user check
    if (currentVal <= 0) return false;

    // Optimistic UI update
    const newVal = currentVal - 1;
    this.updateLocalState(type, newVal);

    try {
      const userDocRef = doc(this.db, 'users', uid);
      await updateDoc(userDocRef, { [type]: newVal });
      return true;
    } catch (e) {
      // Fallback: Update LocalStorage
      try {
        const key = `limva_credits_${uid}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          const data = JSON.parse(stored);
          data[type] = newVal;
          localStorage.setItem(key, JSON.stringify(data));
          return true;
        }
      } catch (localErr) {
        console.error("Failed to update local storage", localErr);
      }
      return true; // Return true since we updated UI anyway
    }
  }

  private updateLocalState(type: 'grader' | 'generator', newVal: number) {
    if (type === 'grader') this.graderCredits.set(newVal);
    else this.generatorCredits.set(newVal);
  }

  // --- AUTH ACTIONS ---

  async login(email: string, pass: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, pass);
      return { success: true, user: result.user };
    } catch (error: any) {
      
      // --- AUTO-RESTORE ADMIN LOGIC ---
      // Nếu đăng nhập đúng email/pass Admin mà bị lỗi (do mất DB hoặc cơ chế bảo mật của Firebase ẩn lỗi user-not-found)
      // Hệ thống sẽ tự động tạo lại tài khoản.
      if (email === 'admin@limva.edu.vn' && pass === 'Vanan24042008@' && 
          (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential')) {
         try {
           const newAdmin = await createUserWithEmailAndPassword(this.auth, email, pass);
           await updateProfile(newAdmin.user, { displayName: 'Administrator' });
           // Force update state immediately
           this.currentUser.set({ ...newAdmin.user, displayName: 'Administrator' });
           return { success: true, user: newAdmin.user };
         } catch (createErr: any) {
            // Nếu tạo thất bại do 'email-already-in-use', nghĩa là tài khoản tồn tại nhưng PASS CŨ KHÁC pass này.
            if (createErr.code === 'auth/email-already-in-use') {
               return { success: false, error: 'Tài khoản Admin đã tồn tại nhưng sai mật khẩu.' };
            }
            console.error("Failed to restore admin", createErr);
            return { success: false, error: 'Không thể khôi phục tài khoản Admin.' };
         }
      }
      // --------------------------------

      let msg = 'Đăng nhập thất bại.';
      if (error.code === 'auth/invalid-credential') msg = 'Sai email hoặc mật khẩu.';
      if (error.code === 'auth/user-not-found') msg = 'Tài khoản không tồn tại.';
      if (error.code === 'auth/wrong-password') msg = 'Sai mật khẩu.';
      return { success: false, error: msg };
    }
  }

  async register(data: RegisterData) {
    try {
      // Create auth user
      const result = await createUserWithEmailAndPassword(this.auth, data.email, data.pass);
      
      // Update basic profile (DisplayName)
      await updateProfile(result.user, { displayName: data.fullName });
      
      // Force refresh user to get display name immediately
      this.currentUser.set({ ...result.user, displayName: data.fullName }); 
      
      // Initialize Credits for new user
      await this.checkAndResetCredits(result.user.uid);
      
      // Increment Global Student Stat
      this.dbService.incrementStat('studentsRegistered');

      return { success: true, user: result.user };
    } catch (error: any) {
      let msg = 'Đăng ký thất bại.';
      if (error.code === 'auth/email-already-in-use') msg = 'Email này đã được sử dụng.';
      if (error.code === 'auth/weak-password') msg = 'Mật khẩu phải có ít nhất 6 ký tự.';
      return { success: false, error: msg };
    }
  }

  async logout() {
    await signOut(this.auth);
    this.graderCredits.set(0);
    this.generatorCredits.set(0);
  }
}
