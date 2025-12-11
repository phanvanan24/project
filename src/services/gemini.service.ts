
import { Injectable, inject } from '@angular/core';
import { GoogleGenAI, Type, Chat } from '@google/genai';
import { DatabaseService } from './database.service';
import {
  MATH_GRADING_PROMPT,
  CHAT_SYSTEM_INSTRUCTION_TEMPLATE,
  TEACHER_CHAT_INSTRUCTION,
  PRACTICE_GENERATION_PROMPT,
  getMath12Prompt,
  getLiteraturePrompt,
  getEnglishPrompt,
  getNaturalScienceInstruction,
  getSocialTechInstruction,
  MATRIX_PROMPT,
  VARIANT_EXAM_PROMPT,
  SYLLABUS_EXAM_PROMPT
} from './prompts';

export interface ExamConfig {
  grade: string;
  subject: string;
  difficulty: string;
  questionType: string;
  questionSubType?: string; // For English mostly
  topic: string;
  detailRequest: string;
  quantity?: number; // Number of questions or tasks
}

export interface MixedExamConfig {
  subject: string;
  abcdCount: number;
  tfCount: number;
  shortCount: number;
  tags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private modelId = 'gemini-2.5-pro';
  private dbService = inject(DatabaseService);

  // Cache for API Key and Prompts
  private cachedApiKey: string | null = null;
  private cachedPrompts: Record<string, string> = {};

  // Common schema for all exam generation types
  private examSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            questionText: { type: Type.STRING, description: "Nội dung câu dẫn chính. Với TrueFalse: KHÔNG chứa nội dung 4 mệnh đề a,b,c,d (chúng nằm ở options). Với Văn/Anh: NẾU câu hỏi thuộc một bài đọc/ngữ liệu MỚI, bắt buộc phải có format: [Nội dung ngữ liệu] + ' <<<PASSAGE_DIVIDER>>> ' + [Nội dung câu hỏi]." },
            type: { type: Type.STRING, enum: ["MultipleChoice", "TrueFalse", "ShortAnswer", "Essay"] },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "BẮT BUỘC PHẢI CÓ DỮ LIỆU.\n- Trắc nghiệm ABCD: 4 lựa chọn.\n- TrueFalse: CHÍNH XÁC 4 chuỗi văn bản tương ứng mệnh đề a, b, c, d. Dùng LaTeX ($...$) cho công thức.\n- ShortAnswer: Để mảng rỗng []."
            },
            correctAnswer: { 
              type: Type.STRING, 
              description: "Đáp án đúng:\n- ABCD: 'A' hoặc 'B'...\n- TrueFalse: Chuỗi 'Đúng, Sai, Đúng, Sai' (ngăn cách bởi dấu phẩy).\n- ShortAnswer: KẾT QUẢ CUỐI CÙNG, TỐI ĐA 4 KÝ TỰ (chỉ số và dấu)." 
            },
            explanation: { type: Type.STRING, description: "Lời giải chi tiết. Dùng LaTeX cho công thức." }
          },
          required: ["id", "questionText", "type", "options", "correctAnswer", "explanation"]
        }
      }
    },
    required: ["title", "questions"]
  };

  constructor() {
    this.refreshConfig();
  }

  async refreshConfig() {
    // 1. Get Global Config (API Key)
    const globalConfig = await this.dbService.getSystemConfig();
    if (globalConfig && globalConfig['apiKey']) {
      this.cachedApiKey = globalConfig['apiKey'];
    }

    // 2. Get Prompts Config (All system prompts)
    const promptsConfig = await this.dbService.getPromptsConfig();
    this.cachedPrompts = promptsConfig || {};
  }

  private getAiInstance(): GoogleGenAI {
    let apiKey = this.cachedApiKey || '';
    
    // Fallback: LocalStorage
    if (!apiKey) {
      try {
        if (typeof localStorage !== 'undefined') {
          const storedKey = localStorage.getItem('LIMVA_ADMIN_API_KEY');
          if (storedKey) apiKey = storedKey;
        }
      } catch (e) { }
    }

    // Fallback: Environment
    if (!apiKey) {
      try {
        if (typeof process !== 'undefined' && process.env) {
          apiKey = process.env['API_KEY'] || '';
        }
      } catch (e) {
        console.warn('Unable to access process.env.');
      }
    }

    return new GoogleGenAI({ apiKey: apiKey });
  }

  async gradeMathAssignment(problemImageBase64: string, solutionImageBase64: string): Promise<any> {
    const gradingSchema = {
      type: Type.OBJECT,
      properties: {
        problemStatement: { type: Type.STRING, description: "Nội dung đề bài được trích xuất từ ảnh." },
        studentAnalysis: {
          type: Type.ARRAY,
          description: "Phân tích từng bước làm của học sinh.",
          items: {
            type: Type.OBJECT,
            properties: {
              stepContent: { type: Type.STRING, description: "Nội dung dòng/bước làm của học sinh." },
              isCorrect: { type: Type.BOOLEAN, description: "Bước này đúng hay sai." },
              correction: { type: Type.STRING, description: "Nhận xét hoặc sửa lỗi nếu sai." }
            },
            required: ["stepContent", "isCorrect", "correction"]
          }
        },
        errors: { type: Type.ARRAY, items: { type: Type.STRING } },
        modelSolution: { type: Type.STRING, description: "Lời giải mẫu chính xác và đầy đủ (định dạng Markdown/LaTeX)." },
        score: { type: Type.NUMBER, description: "Điểm số trên thang điểm 10." },
        generalFeedback: { type: Type.STRING, description: "Nhận xét chung về bài làm." },
        improvementSuggestions: { type: Type.STRING, description: "Gợi ý để học sinh làm tốt hơn lần sau." }
      },
      required: ["problemStatement", "studentAnalysis", "errors", "modelSolution", "score", "generalFeedback", "improvementSuggestions"]
    };

    try {
      await this.refreshConfig();
      // DB Override -> Default Constant
      const promptText = this.cachedPrompts['grading_math'] || MATH_GRADING_PROMPT;

      const ai = this.getAiInstance();
      const response = await ai.models.generateContent({
        model: this.modelId,
        contents: [
          {
            role: 'user',
            parts: [
              { text: promptText },
              { inlineData: { mimeType: 'image/jpeg', data: problemImageBase64 } },
              { inlineData: { mimeType: 'image/jpeg', data: solutionImageBase64 } }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: gradingSchema,
          temperature: 0.4
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  createChatSession(gradingContext: any): Chat {
    const systemInstruction = CHAT_SYSTEM_INSTRUCTION_TEMPLATE(gradingContext);
    const ai = this.getAiInstance();
    return ai.chats.create({
      model: this.modelId,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5
      }
    });
  }
  
  // Updated to accept history
  createTeacherChatSession(history: {role: string, parts: {text: string}[]}[] = []): Chat {
    const ai = this.getAiInstance();
    // DB Override -> Default Constant
    const instruction = this.cachedPrompts['chat_teacher'] || TEACHER_CHAT_INSTRUCTION;
    return ai.chats.create({
      model: this.modelId,
      history: history, // Load previous context
      config: {
        systemInstruction: instruction,
        temperature: 0.6
      }
    });
  }
  
  // New: Practice Set Generation
  async generatePracticeSet(originalProblem: string): Promise<any> {
    const prompt = PRACTICE_GENERATION_PROMPT(originalProblem);
    return this.runExamGeneration(prompt);
  }

  // 1. Subject Exam Generation
  async generateSubjectExam(config: ExamConfig): Promise<any> {
    const { subject, grade, difficulty, questionType, questionSubType, topic, detailRequest, quantity } = config;

    const baseContext = `
       Bạn là giáo viên chuyên nghiệp, am hiểu chương trình Giáo dục phổ thông 2018 (SGK mới).
       Nhiệm vụ: Tạo đề kiểm tra Lớp ${grade}.
       Chủ đề: "${topic}".
       Mức độ: ${difficulty}.
       Yêu cầu thêm: "${detailRequest}".
    `;

    let specificInstruction = "";

    const isMath = subject === 'Toán';
    const isLiterature = subject === 'Ngữ văn';
    const isEnglish = subject === 'Ngoại ngữ';
    const socialTech = ['Lịch sử', 'Địa lý', 'Giáo dục kinh tế và pháp luật', 'Tin học', 'Công nghệ'];
    const isSocialTech = socialTech.includes(subject);

    if (isMath) {
       let examplePrompt = "";
       // Try fetching DB example for Math
       const dbExample = await this.fetchExampleFromDB('math', topic, difficulty);
       if (dbExample) {
          examplePrompt = dbExample;
       } else if (grade === '12') {
          examplePrompt = getMath12Prompt(topic, difficulty);
       }
       
       // Use DB Core Instruction if available, else default
       const core = this.cachedPrompts['gen_math_core'];
       if (core) {
         specificInstruction = `${core}\n\n${examplePrompt}`;
       } else {
         specificInstruction = getNaturalScienceInstruction(subject, questionType, quantity || 5, examplePrompt);
       }
    }
    else if (isLiterature) {
       // Try fetching DB example for Literature (by genre)
       const genre = questionType; // e.g. "Thơ", "Truyện"
       const dbExample = await this.fetchExampleFromDB('lit', genre, 'any');
       
       let coreInst = this.cachedPrompts['gen_lit_core'];
       if (!coreInst) coreInst = getLiteraturePrompt(questionType, grade);
       
       if (dbExample) {
         specificInstruction = `${coreInst}\n\nTHAM KHẢO NGỮ LIỆU/CẤU TRÚC SAU:\n${dbExample}`;
       } else {
         specificInstruction = coreInst;
       }
    }
    else if (isEnglish) {
       const subType = questionSubType || '';
       const numTasks = quantity || 1; 
       
       let cefrLevel = 'A1';
       // Simple CEFR mapping
       const gradeNum = parseInt(grade, 10);
       if (!isNaN(gradeNum)) {
          if (gradeNum >= 6 && gradeNum <= 9) {
             if (difficulty === 'Dễ') cefrLevel = 'A1';
             else if (difficulty === 'Trung bình') cefrLevel = 'A2';
             else cefrLevel = 'B1'; 
          } else if (gradeNum >= 10 && gradeNum <= 12) {
             if (difficulty === 'Dễ') cefrLevel = 'A2';
             else if (difficulty === 'Trung bình') cefrLevel = 'B1';
             else cefrLevel = 'B2';
          }
       }

       // Try fetching DB example for English (by type)
       // Map subtype to DB ID friendly string
       const typeId = questionType.includes('Dạng') ? questionType.split(':')[0].trim().replace(/\s/g, '').toLowerCase() : 'general';
       const dbExample = await this.fetchExampleFromDB('eng', typeId, cefrLevel.toLowerCase());

       let coreInst = this.cachedPrompts['gen_eng_core'];
       if (!coreInst) coreInst = getEnglishPrompt(questionType, subType, cefrLevel, numTasks);

       if (dbExample) {
          specificInstruction = `${coreInst}\n\nSỬ DỤNG DỮ LIỆU MẪU SAU:\n${dbExample}`;
       } else {
          specificInstruction = coreInst;
       }
    }
    else if (isSocialTech) {
       specificInstruction = getSocialTechInstruction(subject, questionType, quantity || 5);
    }

    const prompt = `
      ${baseContext}
      
      ${specificInstruction}
      
      Output JSON format strictly conforming to the schema.
    `;

    return this.runExamGeneration(prompt);
  }

  // Generalized Helper to fetch examples
  private async fetchExampleFromDB(subject: string, rawCategory: string, rawLevel: string): Promise<string | null> {
    // 1. Math Mapping
    if (subject === 'math') {
        const chapterMatch = rawCategory.match(/Chương (\d+)/i);
        const cid = chapterMatch ? `c${chapterMatch[1]}` : 'c1';
        let lid = 'medium';
        if (rawLevel === 'Dễ') lid = 'easy';
        if (rawLevel === 'Khó') lid = 'hard';
        return await this.dbService.getExampleData('math', cid, lid);
    }
    
    // 2. Literature Mapping
    if (subject === 'lit') {
        // Category is genre: "Thơ", "Truyện"... -> "tho", "truyen"
        const cid = this.removeVietnameseTones(rawCategory).toLowerCase().replace(/\s/g, '');
        return await this.dbService.getExampleData('lit', cid, 'any');
    }

    // 3. English Mapping
    if (subject === 'eng') {
        // Category is "Dạng 1...", "Dạng 2..." -> "dang1", "dang2"
        const cid = this.removeVietnameseTones(rawCategory).toLowerCase().replace(/\s/g, '');
        return await this.dbService.getExampleData('eng', cid, rawLevel.toLowerCase()); // Level is a1, a2...
    }

    return null;
  }
  
  private removeVietnameseTones(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }

  async generateExamFromMatrixFile(fileBase64: string, mimeType: string): Promise<any> {
    const prompt = this.cachedPrompts['gen_matrix_core'] || MATRIX_PROMPT;
    return this.runGenWithFile(prompt, fileBase64, mimeType);
  }

  async generateVariantExam(fileBase64: string, mimeType: string, instruction: string): Promise<any> {
    let prompt = this.cachedPrompts['gen_variant_core'] || VARIANT_EXAM_PROMPT('{{INSTRUCTION}}');
    prompt = prompt.replace('{{INSTRUCTION}}', instruction);
    return this.runGenWithFile(prompt, fileBase64, mimeType);
  }

  async generateExamFromSyllabus(fileBase64: string, mimeType: string, instruction: string, questionType: string, quantity: number): Promise<any> {
    let prompt = this.cachedPrompts['gen_syllabus_core'] || SYLLABUS_EXAM_PROMPT('{{TYPE}}', 0, '{{INSTRUCTION}}');
    prompt = prompt.replace('{{TYPE}}', questionType).replace('0', quantity.toString()).replace('{{INSTRUCTION}}', instruction);
    return this.runGenWithFile(prompt, fileBase64, mimeType);
  }

  private async runGenWithFile(prompt: string, fileData: string, mimeType: string) {
    try {
      const ai = this.getAiInstance();
      const response = await ai.models.generateContent({
        model: this.modelId,
        contents: [
          { role: 'user', parts: [{ text: prompt }, { inlineData: { mimeType: mimeType, data: fileData } }] }
        ],
        config: { responseMimeType: 'application/json', responseSchema: this.examSchema }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) { throw error; }
  }

  private async runExamGeneration(prompt: string): Promise<any> {
    try {
      const ai = this.getAiInstance();
      const response = await ai.models.generateContent({
        model: this.modelId,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: this.examSchema,
          temperature: 0.7
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Exam Gen Error", error);
      throw error;
    }
  }
}
