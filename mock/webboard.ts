export type WebboardCategory = "GENERAL" | "QA" | "SHOWCASE" | "FEEDBACK";

export type WebboardPost = {
  id: string;
  authorId: string;
  authorName: string;
  category: WebboardCategory;
  title: string;
  content: string;
  createdAt: string;
  replyCount: number;
  pinned?: boolean;
};

export type WebboardReply = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
};

export const CATEGORY_LABEL: Record<WebboardCategory, string> = {
  GENERAL:  "ทั่วไป",
  QA:       "ถาม-ตอบ",
  SHOWCASE: "แสดงผลงาน",
  FEEDBACK: "ข้อเสนอแนะ",
};

export const CATEGORY_COLOR: Record<WebboardCategory, { bg: string; text: string }> = {
  GENERAL:  { bg: "var(--cream-2)",              text: "var(--ink-3)" },
  QA:       { bg: "#EEF2FF",                     text: "#4338CA" },
  SHOWCASE: { bg: "var(--pine-soft, #DDEAE0)",   text: "var(--pine)" },
  FEEDBACK: { bg: "var(--vermilion-soft)",        text: "var(--vermilion)" },
};

export const MOCK_WEBBOARD_POSTS: WebboardPost[] = [
  {
    id: "post_001",
    authorId: "demo_admin_01",
    authorName: "ทีม Plearn",
    category: "GENERAL",
    title: "ยินดีต้อนรับสู่ Webboard Plearn! 🎉",
    content: `สวัสดีทุกคน! ยินดีต้อนรับสู่ Webboard ชุมชนของ Plearn

ที่นี่คุณสามารถ:
- ถามคำถามเกี่ยวกับคอร์สที่กำลังเรียน
- แชร์ความรู้และประสบการณ์กับผู้เรียนคนอื่น
- แสดงผลงานที่สร้างจากความรู้ในคอร์ส
- ให้ข้อเสนอแนะเพื่อพัฒนาแพลตฟอร์ม

กติกาง่ายๆ: เคารพซึ่งกันและกัน แบ่งปันด้วยใจดี และสนุกกับการเรียนรู้ร่วมกัน!`,
    createdAt: "2026-05-01T08:00:00Z",
    replyCount: 5,
    pinned: true,
  },
  {
    id: "post_002",
    authorId: "demo_learner_01",
    authorName: "ปาริชาต วรรณกรรม",
    category: "QA",
    title: "สอบถามเรื่อง Figma — ทำ Prototype แล้ว Link ไม่ทำงาน",
    content: `สวัสดีค่ะ กำลังเรียนคอร์ส UX Design อยู่ พอทำ Prototype ใน Figma แล้วลอง Preview แต่ปุ่มที่ Link ไว้ไม่ทำงานค่ะ

ลองแก้แล้วหลายรอบ แต่ยังไม่ได้ ขั้นตอนที่ทำคือ:
1. วาด Frame สำหรับ Screen 1 และ Screen 2
2. วาดปุ่มบน Screen 1
3. ใช้ Prototype tab → ลาก connection จากปุ่ม → Screen 2

มีใครเจอปัญหาแบบนี้บ้างคะ? แก้ยังไงได้บ้าง?`,
    createdAt: "2026-05-20T10:30:00Z",
    replyCount: 3,
  },
  {
    id: "post_003",
    authorId: "user_0004",
    authorName: "นภา ฝันดี",
    category: "SHOWCASE",
    title: "แชร์ผลงาน: Dashboard Design จากคอร์ส UX 🎨",
    content: `เรียนจบบทที่ 3 Wireframe แล้ว ลองทำ Dashboard สำหรับแอป Fitness Tracker ดูค่ะ

สิ่งที่ได้เรียนและนำมาใช้:
- ใช้ Grid System 12 คอลัมน์
- Color Palette แบบ Monochromatic (สีน้ำเงิน)
- Typography: Inter สำหรับ Header, Noto Sans Thai สำหรับ Body
- Dark Mode / Light Mode Toggle

ผลลัพธ์ออกมาดีกว่าที่คิดมากเลยค่ะ รู้สึกว่าตัวเองก้าวหน้าขึ้นเยอะมาก ขอบคุณอาจารย์และเพื่อนๆ ทุกคนนะคะ!`,
    createdAt: "2026-05-22T14:00:00Z",
    replyCount: 8,
  },
  {
    id: "post_004",
    authorId: "user_0001",
    authorName: "สมชาย ใจดี",
    category: "QA",
    title: "Python: ทำไม list.sort() กับ sorted() ให้ผลต่างกัน?",
    content: `สวัสดีครับ กำลังเรียนคอร์ส Python Data Science อยู่ครับ

สงสัยเรื่อง list sorting ครับ เพราะเจอโค้ดในงานที่ใช้สองแบบ:

\`\`\`python
# แบบที่ 1
my_list.sort()
print(my_list)  # [1, 2, 3, 5, 8]

# แบบที่ 2
result = sorted(my_list)
print(result)   # [1, 2, 3, 5, 8]
\`\`\`

ผลเหมือนกัน แต่รู้สึกว่ามีความแตกต่างบางอย่าง ใครรู้ช่วยอธิบายได้ไหมครับ?`,
    createdAt: "2026-05-24T09:15:00Z",
    replyCount: 4,
  },
  {
    id: "post_005",
    authorId: "user_0002",
    authorName: "มาลี สวัสดิ์",
    category: "FEEDBACK",
    title: "ข้อเสนอแนะ: อยากได้ฟีเจอร์ Bookmark บทเรียน",
    content: `สวัสดีค่ะ ขอเสนอแนะฟีเจอร์ใหม่ค่ะ

ตอนนี้เวลาเรียนไปถึงจุดที่อยากกลับมาทบทวน ต้องไปหาเองในหน้า Course Outline ซึ่งค่อนข้างเสียเวลาค่ะ

อยากให้มีฟีเจอร์ Bookmark หรือ "บันทึกจุดนี้" ในบทเรียน เพื่อให้กลับมาได้ง่ายขึ้นค่ะ เหมือนกับที่ Notion หรือ YouTube มี Timestamp บันทึกได้

ใครเห็นด้วยบ้างคะ? หรือมีวิธีอื่นที่ทำอยู่แล้ว?`,
    createdAt: "2026-05-25T16:45:00Z",
    replyCount: 6,
  },
  {
    id: "post_006",
    authorId: "demo_instructor_01",
    authorName: "ดร.วิชาญ สอนดี",
    category: "GENERAL",
    title: "อัปเดต: เพิ่มบทเรียนใหม่ในคอร์ส UX Design แล้ว!",
    content: `สวัสดีนักเรียนทุกคนครับ

เพิ่งอัปโหลดบทเรียนใหม่เข้าคอร์ส UX Design ครับ:
- **บทที่ 4**: Usability Testing — วิธีทำ User Testing แบบ Remote
- **บทที่ 5**: Design System — สร้าง Component Library ใน Figma

ใครเรียนถึงบทที่ 3 แล้ว สามารถต่อได้เลยนะครับ เนื้อหาต่อเนื่องกันโดยตรง

มีคำถามอะไรโพสต์ถามได้ในกระทู้นี้เลยครับ!`,
    createdAt: "2026-05-27T11:00:00Z",
    replyCount: 2,
  },
];

export const MOCK_WEBBOARD_REPLIES: WebboardReply[] = [
  // post_002 replies
  {
    id: "reply_001",
    postId: "post_002",
    authorId: "demo_instructor_01",
    authorName: "ดร.วิชาญ สอนดี",
    content: `สวัสดีครับ ปัญหานี้เจอบ่อยมากเลยครับ! สาเหตุหลักๆ มักเป็นเพราะ:\n\n1. **ตั้ง Trigger ผิด** — ต้องเป็น "On Click" ไม่ใช่ "While Hovering"\n2. **Connection ชี้ไปผิด Frame** — ลอง zoom out แล้วดูว่า arrow ชี้ไปถูก Frame ไหม\n3. **Preview mode ต้องกด ▶ ที่มุมบนขวา** ไม่ใช่แค่ Ctrl+P\n\nลองเช็คดูครับ ถ้ายังไม่ได้ส่งรูปหน้าจอมาดูให้ได้ครับ`,
    createdAt: "2026-05-20T11:00:00Z",
  },
  {
    id: "reply_002",
    postId: "post_002",
    authorId: "user_0004",
    authorName: "นภา ฝันดี",
    content: `เจอแบบนี้เหมือนกันค่ะ! แก้ได้โดยการ Detach Component ก่อนค่ะ บางทีถ้า Frame นั้นเป็น Component อยู่ Prototype link จะทำงานไม่ได้`,
    createdAt: "2026-05-20T12:30:00Z",
  },
  {
    id: "reply_003",
    postId: "post_002",
    authorId: "demo_learner_01",
    authorName: "ปาริชาต วรรณกรรม",
    content: `ขอบคุณมากเลยค่ะ! แก้ได้แล้วค่ะ ปัญหาคือ Trigger ตั้งผิดจริงๆ เปลี่ยนเป็น "On Click" ก็ทำงานได้เลยค่ะ 🎉`,
    createdAt: "2026-05-20T14:00:00Z",
  },
  // post_004 replies
  {
    id: "reply_004",
    postId: "post_004",
    authorId: "demo_instructor_01",
    authorName: "ดร.วิชาญ สอนดี",
    content: `คำถามดีมากครับ!\n\n**list.sort()** — แก้ list ตัวเองโดยตรง (in-place) และ return None\n**sorted()** — สร้าง list ใหม่ ของเดิมไม่เปลี่ยน\n\nเมื่อไหร่ใช้อะไร:\n- ถ้าไม่ต้องการเก็บของเดิม → sort() (ประหยัด memory)\n- ถ้าต้องการทั้งสองเวอร์ชัน → sorted()`,
    createdAt: "2026-05-24T10:00:00Z",
  },
  {
    id: "reply_005",
    postId: "post_004",
    authorId: "user_0001",
    authorName: "สมชาย ใจดี",
    content: `เข้าใจแล้วครับ! ขอบคุณมากครับ นึกว่าเหมือนกันทุกอย่างเลย`,
    createdAt: "2026-05-24T15:00:00Z",
  },
];
