import { MOCK_COURSES } from "@/mock/courses";

export interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
  courses?: typeof MOCK_COURSES;
}

type Course = (typeof MOCK_COURSES)[0];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function norm(text: string) {
  return text.toLowerCase().trim();
}

// Check if normalized input includes ANY keyword
function has(text: string, keywords: string[]) {
  return keywords.some((k) => text.includes(k));
}

function formatPrice(price: number) {
  return price === 0 ? "ฟรี" : `฿${price.toLocaleString()}`;
}

// ─── Keyword lists ─────────────────────────────────────────────────────────────
const KW_GREET    = ["สวัสดี", "hello", "hi ", "หวัดดี", "ดีครับ", "ดีค่ะ", "hey"];
// "ช่วย" is intentionally removed — too broad, breaks "ช่วยหา python"
const KW_HELP     = ["ทำอะไรได้บ้าง", "แนะนำตัว", "ช่วยอะไรได้", "ใช้งานยังไง", "คุณคือใคร", "คุณทำอะไรได้"];
const KW_FREE     = ["ฟรี", "free", "ไม่เสียเงิน", "ไม่มีค่าใช้จ่าย", "ราคา 0"];
const KW_PRICE    = ["ราคา", "ค่าใช้จ่าย", "เท่าไหร่", "กี่บาท", "price", "cost", "ค่าเรียน"];
const KW_NEW      = ["ใหม่ล่าสุด", "เพิ่งเปิด", "ล่าสุด", "คอร์สใหม่", "new course", "openใหม่"];
const KW_BEST     = ["bestseller", "ยอดนิยม", "ดีที่สุด", "popular", "ขายดี", "คนเรียนเยอะ"];
const KW_ALL      = ["ทั้งหมด", "มีอะไรบ้าง", "รายการทั้งหมด", "ดูทั้งหมด", "list all", "all course", "คอร์สมีอะไร"];
const KW_CONTACT  = ["ติดต่อ", "support", "ช่วยเหลือ", "email", "อีเมล", "โทร", "inbox"];
const KW_ONSITE   = [
  "on-site", "onsite", "on site", "ออนไซต์", "สถานที่", "เรียนที่ไหน",
  "เรียนสด", "เรียนจริง", "ห้องเรียน", "ที่ตั้ง", "address", "pim",
  "ปัญญาภิวัฒน์", "สถาบัน", "มาเรียน", "เดินทาง", "location",
];
const KW_BEGINNER = ["มือใหม่", "เริ่มต้น", "beginner", "พื้นฐาน", "ง่าย", "zero to", "ไม่มีพื้นฐาน"];
const KW_INTER    = ["ระดับกลาง", "intermediate", "ปานกลาง", "มีพื้นฐานบ้าง"];
const KW_ADVANCED = ["ขั้นสูง", "advanced", "pro level", "expert", "ระดับสูง"];

// Intent/prefix words to strip before free-text search
// e.g. "คอร์ส python" → strip "คอร์ส" → search "python"
const STRIP_WORDS = [
  "คอร์ส", "เรียน", "อยากเรียน", "ต้องการเรียน", "อยากได้คอร์ส",
  "สนใจ", "สนใจคอร์ส", "หา", "ค้นหา", "ช่วยหา", "แนะนำ",
  "เกี่ยวกับ", "เรื่อง", "ดู", "มีคอร์ส", "course", "มีไหม",
];

// ─── Token-based course search ────────────────────────────────────────────────
function searchCourses(rawInput: string): Course[] {
  let q = norm(rawInput);

  // Strip intent words (left-to-right, longest match wins via sort)
  const sorted = [...STRIP_WORDS].sort((a, b) => b.length - a.length);
  for (const w of sorted) {
    q = q.split(w).join(" ");
  }
  q = q.replace(/\s+/g, " ").trim();

  if (!q || q.length < 2) return [];

  // Split into tokens, discard single-char tokens
  const tokens = q.split(/\s+/).filter((t) => t.length >= 2);
  if (tokens.length === 0) return [];

  return MOCK_COURSES.filter((c) => {
    const haystack = [
      c.title,
      c.description,
      c.category.name,
      c.category.slug,
      c.instructor.name,
    ]
      .join(" ")
      .toLowerCase();

    // Match if ANY token appears in the haystack
    return tokens.some((t) => haystack.includes(t));
  });
}

// ─── Main reply ───────────────────────────────────────────────────────────────
export function getBotReply(input: string): ChatMessage {
  const text = norm(input);
  const id = Date.now().toString();

  // 1. Greeting
  if (has(text, KW_GREET)) {
    return {
      id,
      role: "bot",
      text: "สวัสดีครับ! ผม Plearn AI ช่วยค้นหาคอร์สเรียนให้คุณได้เลย\n\nลองพิมพ์ เช่น\n• \"python\"\n• \"คอร์สฟรี\"\n• \"คอร์สยอดนิยม\"\n• \"คอร์สมือใหม่\"",
    };
  }

  // 2. Help / about bot
  if (has(text, KW_HELP)) {
    return {
      id,
      role: "bot",
      text: "ผมช่วยคุณได้เรื่อง:\n\n• ค้นหาคอร์สตามชื่อหรือหมวดหมู่\n  เช่น \"python\", \"ux design\", \"การตลาด\"\n• คอร์สตามประเภท\n  เช่น \"คอร์สฟรี\", \"คอร์สยอดนิยม\", \"คอร์สใหม่\"\n• คอร์สตามระดับ\n  เช่น \"คอร์สมือใหม่\", \"คอร์สขั้นสูง\"\n• สอบถามราคา\n• ติดต่อทีมงาน",
    };
  }

  // 3. On-site location
  if (has(text, KW_ONSITE)) {
    return {
      id,
      role: "bot",
      text: "Plearn มีคลาสเรียนแบบ On-site ครับ\n\n📍 สถานที่:\nสถาบันปัญญาภิวัฒน์ (PIM)\n85/1 หมู่ 2 ถ.แจ้งวัฒนะ ต.บางตลาด\nอ.ปากเกร็ด จ.นนทบุรี 11120\n\n🚇 การเดินทาง:\n• MRT สายสีชมพู สถานี PIM (ทางออก 1)\n• รถยนต์: ใกล้แยกแจ้งวัฒนะ-ปากเกร็ด\n\n🕘 เวลาทำการ:\nจันทร์–ศุกร์ 8:00–20:00 น.\nเสาร์–อาทิตย์ 9:00–18:00 น.\n\n📞 สอบถามตารางคลาส:\nsupport@plearn.co.th\nหรือโทร 02-xxx-xxxx",
    };
  }

  // 4. Contact
  if (has(text, KW_CONTACT)) {
    return {
      id,
      role: "bot",
      text: "ติดต่อทีม Plearn ได้ที่:\n\n📧 support@plearn.co.th\n⏰ จันทร์–ศุกร์ 9:00–18:00 น.\n\nหรือไปที่หน้า \"ช่วยเหลือ\" ในเมนูด้านบนครับ",
    };
  }

  // 4. Free courses
  if (has(text, KW_FREE)) {
    const list = MOCK_COURSES.filter((c) => c.price === 0);
    return list.length > 0
      ? { id, role: "bot", text: `มีคอร์สฟรี ${list.length} คอร์สครับ:`, courses: list }
      : { id, role: "bot", text: "ขณะนี้ยังไม่มีคอร์สฟรีเปิดให้เรียนครับ" };
  }

  // 5. Bestseller
  if (has(text, KW_BEST)) {
    const list = MOCK_COURSES.filter((c) => c.isBestseller);
    return { id, role: "bot", text: `คอร์สยอดนิยม ${list.length} คอร์สครับ:`, courses: list };
  }

  // 6. New courses — guard against "มือใหม่" matching "ใหม่"
  if (has(text, KW_NEW) || (text.includes("ใหม่") && !has(text, KW_BEGINNER))) {
    const list = MOCK_COURSES.filter((c) => c.isNew);
    return { id, role: "bot", text: `คอร์สใหม่ล่าสุด ${list.length} คอร์สครับ:`, courses: list };
  }

  // 7. All courses
  if (has(text, KW_ALL)) {
    return {
      id,
      role: "bot",
      text: `มีคอร์สทั้งหมด ${MOCK_COURSES.length} คอร์สครับ:`,
      courses: MOCK_COURSES,
    };
  }

  // 8. Price info
  if (has(text, KW_PRICE)) {
    const sorted = [...MOCK_COURSES].sort((a, b) => a.price - b.price);
    const freeCount = MOCK_COURSES.filter((c) => c.price === 0).length;
    return {
      id,
      role: "bot",
      text: `ราคาคอร์สบน Plearn:\n\n• เริ่มต้น: ${formatPrice(sorted[0].price)}\n• สูงสุด: ${formatPrice(sorted[sorted.length - 1].price)}\n• คอร์สฟรี: ${freeCount} คอร์ส\n\nพิมพ์ชื่อคอร์สที่สนใจเพื่อดูราคาได้เลยครับ`,
    };
  }

  // 9. Level: Beginner
  if (has(text, KW_BEGINNER)) {
    const list = MOCK_COURSES.filter(
      (c) => c.level === "BEGINNER" || c.level === "ALL_LEVELS"
    );
    return { id, role: "bot", text: `คอร์สสำหรับมือใหม่ ${list.length} คอร์สครับ:`, courses: list };
  }

  // 10. Level: Intermediate
  if (has(text, KW_INTER)) {
    const list = MOCK_COURSES.filter((c) => c.level === "INTERMEDIATE");
    return { id, role: "bot", text: `คอร์สระดับกลาง ${list.length} คอร์สครับ:`, courses: list };
  }

  // 11. Level: Advanced
  if (has(text, KW_ADVANCED)) {
    const list = MOCK_COURSES.filter((c) => c.level === "ADVANCED");
    return list.length > 0
      ? { id, role: "bot", text: `คอร์สขั้นสูง ${list.length} คอร์สครับ:`, courses: list }
      : { id, role: "bot", text: "ยังไม่มีคอร์สขั้นสูงในขณะนี้ครับ\nลองดูคอร์สระดับกลางก่อนได้เลย" };
  }

  // 12. Free-text search (token-based, strips intent words)
  const results = searchCourses(input);
  if (results.length > 0) {
    return {
      id,
      role: "bot",
      text: `พบ ${results.length} คอร์สที่ตรงกับ "${input}" ครับ:`,
      courses: results,
    };
  }

  // 13. Fallback
  return {
    id,
    role: "bot",
    text: `ขออภัยครับ ไม่พบคอร์สที่ตรงกับ "${input}"\n\nลองพิมพ์:\n• ชื่อวิชา เช่น "Python", "UX", "การตลาด"\n• "คอร์สทั้งหมด"\n• "คอร์สมือใหม่"\n• "คอร์สยอดนิยม"`,
  };
}

export const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "bot",
  text: "สวัสดีครับ! ผม Plearn AI พร้อมช่วยคุณค้นหาคอร์สที่ใช่\n\nพิมพ์ชื่อวิชา หมวดหมู่ หรือสิ่งที่อยากเรียนได้เลยครับ",
};
