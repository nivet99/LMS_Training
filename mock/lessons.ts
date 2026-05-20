export type MockQuestion = {
  id: string;
  content: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE";
  options: string[];
  correctIndex: number;
  points: number;
};

export type MockQuiz = {
  id: string;
  passingScore: number;
  timeLimitSecs?: number;
  questions: MockQuestion[];
};

export type MockLesson = {
  id: string;
  chapterId: string;
  courseId: string;
  title: string;
  type: "VIDEO" | "TEXT" | "QUIZ";
  order: number;
  duration?: number; // seconds
  isFree: boolean;
  videoId?: string; // YouTube video id placeholder
  content?: string; // for TEXT type
  quiz?: MockQuiz;
};

export type MockChapter = {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: MockLesson[];
};

// ─── Course 1: UX Design ─────────────────────────────────────────────────────
const CHAPTERS_COURSE_01: MockChapter[] = [
  {
    id: "ch_01_01",
    courseId: "course_01",
    title: "บทที่ 1: ทำความรู้จัก UX Design",
    order: 1,
    lessons: [
      {
        id: "lesson_01_01_01",
        chapterId: "ch_01_01",
        courseId: "course_01",
        title: "UX Design คืออะไร และทำไมถึงสำคัญ",
        type: "VIDEO",
        order: 1,
        duration: 720,
        isFree: true,
        videoId: "dh_UX_intro",
        content: "บทนำเกี่ยวกับ UX Design และความสำคัญในโลกดิจิทัล",
      },
      {
        id: "lesson_01_01_02",
        chapterId: "ch_01_01",
        courseId: "course_01",
        title: "ความแตกต่างระหว่าง UX และ UI",
        type: "VIDEO",
        order: 2,
        duration: 840,
        isFree: true,
        videoId: "dh_UX_ui_diff",
        content: "เรียนรู้ความแตกต่างและความสัมพันธ์ระหว่าง UX กับ UI Design",
      },
      {
        id: "lesson_01_01_03",
        chapterId: "ch_01_01",
        courseId: "course_01",
        title: "Quiz: พื้นฐาน UX Design",
        type: "QUIZ",
        order: 3,
        duration: 300,
        isFree: true,
        quiz: {
          id: "quiz_01_01_03",
          passingScore: 70,
          timeLimitSecs: 300,
          questions: [
            {
              id: "q_01",
              content: "UX ย่อมาจากอะไร?",
              type: "MULTIPLE_CHOICE",
              options: ["User Experience", "User Extension", "Unified Exchange", "Universal Experience"],
              correctIndex: 0,
              points: 1,
            },
            {
              id: "q_02",
              content: "UX Design มีเป้าหมายหลักคืออะไร?",
              type: "MULTIPLE_CHOICE",
              options: [
                "ทำให้แอปสวยงาม",
                "ทำให้ผู้ใช้มีประสบการณ์ที่ดีและใช้งานง่าย",
                "เพิ่มยอดขาย",
                "ลดต้นทุนการพัฒนา",
              ],
              correctIndex: 1,
              points: 1,
            },
            {
              id: "q_03",
              content: "UI Designer รับผิดชอบด้านใดเป็นหลัก?",
              type: "MULTIPLE_CHOICE",
              options: [
                "การวิจัยผู้ใช้",
                "การออกแบบ Visual เช่น สี, Typography, ปุ่ม",
                "การเขียนโค้ด",
                "การทดสอบ",
              ],
              correctIndex: 1,
              points: 1,
            },
            {
              id: "q_04",
              content: "UX Designer ต้องทำ User Research เสมอ",
              type: "TRUE_FALSE",
              options: ["จริง", "ไม่จริง"],
              correctIndex: 0,
              points: 1,
            },
          ],
        },
      },
    ],
  },
  {
    id: "ch_01_02",
    courseId: "course_01",
    title: "บทที่ 2: User Research",
    order: 2,
    lessons: [
      {
        id: "lesson_01_02_01",
        chapterId: "ch_01_02",
        courseId: "course_01",
        title: "วิธีทำ User Interview",
        type: "VIDEO",
        order: 1,
        duration: 1200,
        isFree: false,
        videoId: "dh_user_interview",
        content: "เทคนิคการสัมภาษณ์ผู้ใช้เพื่อค้นหา Pain Points ที่แท้จริง",
      },
      {
        id: "lesson_01_02_02",
        chapterId: "ch_01_02",
        courseId: "course_01",
        title: "การสร้าง User Persona",
        type: "TEXT",
        order: 2,
        duration: 600,
        isFree: false,
        content: `## User Persona คืออะไร?

User Persona คือตัวแทนสมมติของกลุ่มผู้ใช้จริง ที่ช่วยให้ทีม Design มีเป้าหมายชัดเจนในการออกแบบ

### องค์ประกอบหลักของ Persona

1. **ชื่อและภาพ** — ทำให้ persona รู้สึกเป็นคนจริง
2. **ข้อมูลพื้นฐาน** — อายุ อาชีพ เป้าหมาย
3. **Pain Points** — สิ่งที่ทำให้หงุดหงิดหรือยากลำบาก
4. **Goals** — สิ่งที่ต้องการบรรลุ
5. **Behavior Patterns** — พฤติกรรมการใช้เทคโนโลยี

### วิธีสร้าง Persona ที่ดี

- ใช้ข้อมูลจาก User Interview จริง ไม่ใช่แค่สมมติ
- สร้าง 2-4 personas ต่อโปรเจค
- อัปเดต persona เมื่อมีข้อมูลใหม่

> ตัวอย่าง: "คุณปาริชาต วรรณกรรม อายุ 26 ปี นักการตลาด ต้องการเรียนออนไลน์ระหว่างเดินทางด้วยมือถือ"`,
      },
      {
        id: "lesson_01_02_03",
        chapterId: "ch_01_02",
        courseId: "course_01",
        title: "Quiz: User Research",
        type: "QUIZ",
        order: 3,
        duration: 300,
        isFree: false,
        quiz: {
          id: "quiz_01_02_03",
          passingScore: 70,
          timeLimitSecs: 300,
          questions: [
            {
              id: "q_05",
              content: "User Persona ควรสร้างจากข้อมูลอะไร?",
              type: "MULTIPLE_CHOICE",
              options: [
                "ความเห็นของทีม Designer",
                "ข้อมูลจาก User Research จริง",
                "สมมติจากประสบการณ์",
                "ข้อมูลจากผู้บริหาร",
              ],
              correctIndex: 1,
              points: 1,
            },
            {
              id: "q_06",
              content: "ควรสร้าง Persona กี่ตัวต่อโปรเจค?",
              type: "MULTIPLE_CHOICE",
              options: ["1 ตัว", "2-4 ตัว", "10+ ตัว", "ยิ่งมากยิ่งดี"],
              correctIndex: 1,
              points: 1,
            },
            {
              id: "q_07",
              content: "Pain Points คือสิ่งที่ผู้ใช้พอใจในผลิตภัณฑ์",
              type: "TRUE_FALSE",
              options: ["จริง", "ไม่จริง"],
              correctIndex: 1,
              points: 1,
            },
          ],
        },
      },
    ],
  },
  {
    id: "ch_01_03",
    courseId: "course_01",
    title: "บทที่ 3: Wireframe และ Prototype ใน Figma",
    order: 3,
    lessons: [
      {
        id: "lesson_01_03_01",
        chapterId: "ch_01_03",
        courseId: "course_01",
        title: "เริ่มต้นใช้ Figma",
        type: "VIDEO",
        order: 1,
        duration: 1500,
        isFree: false,
        videoId: "dh_figma_intro",
        content: "ภาพรวม Figma Interface และ tools พื้นฐาน",
      },
      {
        id: "lesson_01_03_02",
        chapterId: "ch_01_03",
        courseId: "course_01",
        title: "สร้าง Low-fidelity Wireframe",
        type: "VIDEO",
        order: 2,
        duration: 1800,
        isFree: false,
        videoId: "dh_wireframe",
        content: "ฝึกสร้าง Wireframe สำหรับ Mobile App",
      },
    ],
  },
];

// ─── Course 2: Digital Marketing ─────────────────────────────────────────────
const CHAPTERS_COURSE_02: MockChapter[] = [
  {
    id: "ch_02_01",
    courseId: "course_02",
    title: "บทที่ 1: Digital Marketing Overview",
    order: 1,
    lessons: [
      {
        id: "lesson_02_01_01",
        chapterId: "ch_02_01",
        courseId: "course_02",
        title: "Digital Marketing Ecosystem",
        type: "VIDEO",
        order: 1,
        duration: 900,
        isFree: true,
        videoId: "dm_ecosystem",
        content: "ภาพรวม Digital Marketing ในยุคปัจจุบัน",
      },
      {
        id: "lesson_02_01_02",
        chapterId: "ch_02_01",
        courseId: "course_02",
        title: "กำหนด KPI สำหรับ Digital Marketing",
        type: "TEXT",
        order: 2,
        duration: 600,
        isFree: true,
        content: `## KPI ใน Digital Marketing

KPI (Key Performance Indicators) คือตัวชี้วัดความสำเร็จของแคมเปญ

### KPI หลักที่ต้องรู้

| KPI | ความหมาย |
|-----|----------|
| **CTR** | Click-Through Rate — % คนที่คลิกจากคนที่เห็น |
| **CPC** | Cost Per Click — ต้นทุนต่อการคลิก 1 ครั้ง |
| **ROAS** | Return On Ad Spend — ผลตอบแทนต่อเงินโฆษณา |
| **Conversion Rate** | % คนที่ทำ Action ที่ต้องการ |
| **CAC** | Customer Acquisition Cost — ต้นทุนการได้ลูกค้าใหม่ |

### การตั้ง KPI ที่ดี (SMART)
- **S**pecific — ระบุชัดเจน
- **M**easurable — วัดได้
- **A**chievable — ทำได้จริง
- **R**elevant — เกี่ยวข้องกับเป้าหมาย
- **T**ime-bound — มีกรอบเวลา`,
      },
      {
        id: "lesson_02_01_03",
        chapterId: "ch_02_01",
        courseId: "course_02",
        title: "Quiz: Digital Marketing Basics",
        type: "QUIZ",
        order: 3,
        duration: 240,
        isFree: true,
        quiz: {
          id: "quiz_02_01_03",
          passingScore: 70,
          timeLimitSecs: 240,
          questions: [
            {
              id: "q_dm_01",
              content: "CTR ย่อมาจากอะไร?",
              type: "MULTIPLE_CHOICE",
              options: [
                "Click-Through Rate",
                "Customer Target Reach",
                "Content Traffic Report",
                "Channel Tracking Record",
              ],
              correctIndex: 0,
              points: 1,
            },
            {
              id: "q_dm_02",
              content: "ROAS ที่ดีควรมีค่าเท่าไหร่ขึ้นไป?",
              type: "MULTIPLE_CHOICE",
              options: ["1x (เท่ากับต้นทุน)", "4x ขึ้นไป", "0.5x", "ขึ้นอยู่กับอุตสาหกรรม"],
              correctIndex: 3,
              points: 1,
            },
            {
              id: "q_dm_03",
              content: "Conversion Rate คือ % ของคนที่คลิกโฆษณาแล้วซื้อสินค้า (หรือทำ Action ที่ต้องการ)",
              type: "TRUE_FALSE",
              options: ["จริง", "ไม่จริง"],
              correctIndex: 0,
              points: 1,
            },
          ],
        },
      },
    ],
  },
  {
    id: "ch_02_02",
    courseId: "course_02",
    title: "บทที่ 2: SEO พื้นฐาน",
    order: 2,
    lessons: [
      {
        id: "lesson_02_02_01",
        chapterId: "ch_02_02",
        courseId: "course_02",
        title: "How Search Engines Work",
        type: "VIDEO",
        order: 1,
        duration: 1080,
        isFree: false,
        videoId: "dm_seo_how",
        content: "ทำความเข้าใจ Crawling, Indexing และ Ranking",
      },
      {
        id: "lesson_02_02_02",
        chapterId: "ch_02_02",
        courseId: "course_02",
        title: "On-Page SEO Techniques",
        type: "VIDEO",
        order: 2,
        duration: 1440,
        isFree: false,
        videoId: "dm_on_page_seo",
        content: "Title Tag, Meta Description, Header Tags, Internal Links",
      },
    ],
  },
];

// ─── Course 3: Python Data Science ───────────────────────────────────────────
const CHAPTERS_COURSE_03: MockChapter[] = [
  {
    id: "ch_03_01",
    courseId: "course_03",
    title: "บทที่ 1: Python พื้นฐาน",
    order: 1,
    lessons: [
      {
        id: "lesson_03_01_01",
        chapterId: "ch_03_01",
        courseId: "course_03",
        title: "ติดตั้ง Python และ Jupyter Notebook",
        type: "VIDEO",
        order: 1,
        duration: 900,
        isFree: true,
        videoId: "py_install",
        content: "ติดตั้ง Python 3.x และ Anaconda สำหรับ Data Science",
      },
      {
        id: "lesson_03_01_02",
        chapterId: "ch_03_01",
        courseId: "course_03",
        title: "Variables, Data Types และ Operators",
        type: "VIDEO",
        order: 2,
        duration: 1800,
        isFree: true,
        videoId: "py_variables",
        content: "int, float, str, bool, list, dict, tuple",
      },
      {
        id: "lesson_03_01_03",
        chapterId: "ch_03_01",
        courseId: "course_03",
        title: "Quiz: Python Basics",
        type: "QUIZ",
        order: 3,
        duration: 300,
        isFree: true,
        quiz: {
          id: "quiz_03_01_03",
          passingScore: 60,
          timeLimitSecs: 300,
          questions: [
            {
              id: "q_py_01",
              content: "ข้อใดเป็น data type ใน Python?",
              type: "MULTIPLE_CHOICE",
              options: ["integer", "int", "number", "whole"],
              correctIndex: 1,
              points: 1,
            },
            {
              id: "q_py_02",
              content: "Python เป็นภาษา strongly typed",
              type: "TRUE_FALSE",
              options: ["จริง", "ไม่จริง"],
              correctIndex: 1,
              points: 1,
            },
            {
              id: "q_py_03",
              content: "ผลลัพธ์ของ `len([1, 2, 3, 4])` คืออะไร?",
              type: "MULTIPLE_CHOICE",
              options: ["3", "4", "5", "Error"],
              correctIndex: 1,
              points: 1,
            },
            {
              id: "q_py_04",
              content: "Dictionary ใน Python ใช้ syntax ใด?",
              type: "MULTIPLE_CHOICE",
              options: ["[ ]", "( )", "{ }", "< >"],
              correctIndex: 2,
              points: 1,
            },
          ],
        },
      },
    ],
  },
];

// ─── All chapters by courseId ─────────────────────────────────────────────────
export const MOCK_CHAPTERS: Record<string, MockChapter[]> = {
  course_01: CHAPTERS_COURSE_01,
  course_02: CHAPTERS_COURSE_02,
  course_03: CHAPTERS_COURSE_03,
};

// Flat list of all lessons for lookup by id
export const MOCK_LESSONS: MockLesson[] = Object.values(MOCK_CHAPTERS).flatMap((chapters) =>
  chapters.flatMap((ch) => ch.lessons)
);

// ─── Mock progress (simulates a logged-in user's progress) ───────────────────
export const MOCK_PROGRESS: Record<string, { completedAt: string | null; watchPosition: number }> =
  {
    lesson_01_01_01: { completedAt: "2026-05-10T10:00:00Z", watchPosition: 720 },
    lesson_01_01_02: { completedAt: "2026-05-11T11:00:00Z", watchPosition: 840 },
    lesson_01_01_03: { completedAt: "2026-05-12T09:00:00Z", watchPosition: 300 },
    lesson_01_02_01: { completedAt: null, watchPosition: 400 },
  };

// ─── Mock enrollments ─────────────────────────────────────────────────────────
export const MOCK_ENROLLMENTS = [
  { courseId: "course_01", enrolledAt: "2026-05-01T08:00:00Z", paidAmount: 1490 },
  { courseId: "course_02", enrolledAt: "2026-05-05T14:00:00Z", paidAmount: 1990 },
  { courseId: "course_03", enrolledAt: "2026-05-08T10:00:00Z", paidAmount: 0 },
];
