import type { Metadata } from "next";
import { formatCurrency, formatNumber } from "@/lib/utils";

export const metadata: Metadata = { title: "การชำระเงิน — Admin" };

type Transaction = {
  id: string;
  user: string;
  course: string;
  amount: number;
  method: string;
  status: "SUCCESS" | "PENDING" | "REFUNDED";
  date: string;
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "TXN-2026-001", user: "สมชาย ใจดี",        course: "UX/UI Design Fundamentals",    amount: 1490, method: "บัตรเครดิต", status: "SUCCESS",  date: "2026-05-28" },
  { id: "TXN-2026-002", user: "มาลี สวัสดิ์",       course: "Digital Marketing Bootcamp",   amount: 1990, method: "PromptPay",  status: "SUCCESS",  date: "2026-05-27" },
  { id: "TXN-2026-003", user: "นภา ฝันดี",          course: "Financial Planning",           amount: 2490, method: "บัตรเครดิต", status: "REFUNDED", date: "2026-05-26" },
  { id: "TXN-2026-004", user: "กิตติ มั่นคง",       course: "English Communication",        amount: 990,  method: "PromptPay",  status: "SUCCESS",  date: "2026-05-25" },
  { id: "TXN-2026-005", user: "ปาริชาต วรรณกรรม",  course: "Business Strategy",            amount: 3490, method: "บัตรเครดิต", status: "PENDING",  date: "2026-05-25" },
  { id: "TXN-2026-006", user: "วิชัย ทำดี",         course: "UX/UI Design Fundamentals",    amount: 1490, method: "PromptPay",  status: "SUCCESS",  date: "2026-05-24" },
  { id: "TXN-2026-007", user: "สุดา รักเรียน",       course: "Python for Data Science",      amount: 0,    method: "-",          status: "SUCCESS",  date: "2026-05-23" },
  { id: "TXN-2026-008", user: "ธนา ลงทุน",          course: "Financial Planning",           amount: 2490, method: "บัตรเครดิต", status: "SUCCESS",  date: "2026-05-22" },
];

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  SUCCESS:  { bg: "var(--pine-soft, #E8F5E9)", text: "var(--pine)",      label: "สำเร็จ"   },
  PENDING:  { bg: "#FEF3C7",                   text: "#D97706",           label: "รอดำเนินการ" },
  REFUNDED: { bg: "var(--vermilion-soft)",      text: "var(--vermilion)", label: "คืนเงิน"  },
};

export default function AdminPaymentsPage() {
  const successTxns  = MOCK_TRANSACTIONS.filter((t) => t.status === "SUCCESS");
  const totalRevenue = successTxns.reduce((s, t) => s + t.amount, 0);
  const pending      = MOCK_TRANSACTIONS.filter((t) => t.status === "PENDING").length;
  const refunded     = MOCK_TRANSACTIONS.filter((t) => t.status === "REFUNDED").length;

  return (
    <div>
      <div className="mb-8">
        <p className="text-label mb-1" style={{ color: "var(--ink-3)" }}>PLATFORM ADMIN</p>
        <h1 className="text-display-m" style={{ color: "var(--ink)" }}>การชำระเงิน</h1>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "รายได้รวม (เดือนนี้)",  value: formatCurrency(totalRevenue, "THB"), color: "var(--pine)" },
          { label: "รายการสำเร็จ",          value: successTxns.length.toString(),        color: "var(--ink)" },
          { label: "รอดำเนินการ",            value: pending.toString(),                   color: "#D97706" },
          { label: "คืนเงิน",               value: refunded.toString(),                  color: "var(--vermilion)" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border p-5"
            style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
            <p className="text-caption mb-1" style={{ color: "var(--ink-3)" }}>{kpi.label}</p>
            <p className="font-serif font-medium" style={{ fontSize: "24px", color: kpi.color, lineHeight: 1.2 }}>
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Revenue breakdown (mock chart placeholder) */}
      <div className="rounded-xl border p-6 mb-8" style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
        <h2 className="text-h3 mb-4" style={{ color: "var(--ink)" }}>รายได้ตามหมวดหมู่</h2>
        <div className="space-y-3">
          {[
            { label: "Design",     pct: 38, amount: 55_000 },
            { label: "Technology", pct: 27, amount: 39_000 },
            { label: "Marketing",  pct: 18, amount: 26_000 },
            { label: "Finance",    pct: 10, amount: 14_500 },
            { label: "อื่นๆ",     pct: 7,  amount: 10_100 },
          ].map((cat) => (
            <div key={cat.label} className="flex items-center gap-4">
              <span className="w-24 text-body-s text-right shrink-0" style={{ color: "var(--ink-3)" }}>
                {cat.label}
              </span>
              <div className="flex-1 h-2 rounded-full" style={{ background: "var(--cream-2)" }}>
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${cat.pct}%`, background: "var(--vermilion)" }}
                />
              </div>
              <span className="text-body-s font-mono w-24 shrink-0" style={{ color: "var(--ink)" }}>
                {formatCurrency(cat.amount, "THB")}
              </span>
              <span className="text-caption font-mono w-10 shrink-0 text-right" style={{ color: "var(--ink-4)" }}>
                {cat.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction table */}
      <div>
        <h2 className="text-h3 mb-4" style={{ color: "var(--ink)" }}>รายการล่าสุด</h2>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--line)" }}>
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: "var(--cream-2)", borderBottom: "1px solid var(--line)" }}>
                {["รหัสรายการ", "ผู้ใช้", "คอร์ส", "ยอด", "ช่องทาง", "วันที่", "สถานะ"].map((h) => (
                  <th key={h} className="px-4 py-3 text-caption font-medium" style={{ color: "var(--ink-3)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANSACTIONS.map((tx, i) => {
                const ss = STATUS_STYLE[tx.status];
                return (
                  <tr key={tx.id}
                    style={{
                      background: "var(--paper)",
                      borderTop: i > 0 ? "1px solid var(--line)" : undefined,
                    }}>
                    <td className="px-4 py-3 font-mono text-sm" style={{ color: "var(--ink-3)" }}>{tx.id}</td>
                    <td className="px-4 py-3 text-body-s" style={{ color: "var(--ink)" }}>{tx.user}</td>
                    <td className="px-4 py-3 text-body-s" style={{ color: "var(--ink-3)" }}>{tx.course}</td>
                    <td className="px-4 py-3 font-mono text-sm font-medium"
                      style={{ color: tx.amount === 0 ? "var(--pine)" : "var(--ink)" }}>
                      {tx.amount === 0 ? "ฟรี" : formatCurrency(tx.amount, "THB")}
                    </td>
                    <td className="px-4 py-3 text-body-s" style={{ color: "var(--ink-3)" }}>{tx.method}</td>
                    <td className="px-4 py-3 text-caption" style={{ color: "var(--ink-3)" }}>{tx.date}</td>
                    <td className="px-4 py-3">
                      <span className="badge text-xs" style={{ background: ss.bg, color: ss.text }}>
                        {ss.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
