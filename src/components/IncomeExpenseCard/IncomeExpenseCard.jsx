import { useT } from "../../i18n/I18n";

function SemiGauge({ value, max, color }) {
  const pct = Math.max(0, Math.min(1, value / max));
  const radius = 42;
  const circumference = Math.PI * radius;
  const dash = circumference * pct;
  const angle = -180 + pct * 180;
  const cx = 50;
  const cy = 50;
  const needleX = cx + radius * Math.cos((angle * Math.PI) / 180);
  const needleY = cy + radius * Math.sin((angle * Math.PI) / 180);

  return (
    <svg viewBox="0 0 100 60" className="w-full h-14">
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      <circle cx={needleX} cy={needleY} r="3" fill="white" />
    </svg>
  );
}

function fmt(n) {
  const num = Number(n) || 0;
  return num.toLocaleString("en-US");
}

function IncomeExpenseCard({ income, expense }) {
  const { t } = useT();
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      <div
        className="rounded-3xl p-4 h-44 flex flex-col justify-between overflow-hidden relative shadow-lg"
        style={{
          background:
            "linear-gradient(145deg, #4a1810 0%, #a84826 50%, #e07a3e 100%)",
        }}
      >
        <div className="flex items-start justify-between">
          <p className="text-white font-semibold text-base">{t("cards.expenses")}</p>
          <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-white">
              <polyline points="17 11 12 6 7 11" />
              <polyline points="17 18 12 13 7 18" />
            </svg>
          </span>
        </div>
        <div>
          <p className="text-xs text-white/70">{t("cards.totalSpent")}</p>
          <p className={`font-semibold text-white ${expense.toString().length <= 6 ? "text-3xl" : "text-2xl"}`}>
            ${fmt(expense)}
          </p>
        </div>
      </div>

      <div
        className="rounded-3xl p-4 h-44 flex flex-col justify-between overflow-hidden relative shadow-lg"
        style={{
          background:
            "linear-gradient(145deg, #1a2410 0%, #3d5a1f 50%, #6b8e3a 100%)",
        }}
      >
        <div className="flex items-start justify-between">
          <p className="text-white font-semibold text-base">{t("cards.income")}</p>
          <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-white">
              <polyline points="7 13 12 18 17 13" />
              <polyline points="7 6 12 11 17 6" />
            </svg>
          </span>
        </div>
        <SemiGauge value={income} max={70000} color="#A2F263" />
        <div>
          <p className="text-xs text-white/70">{t("cards.totalIncome")}</p>
          <p className={`font-semibold text-white ${income.toString().length <= 6 ? "text-3xl" : "text-2xl"}`}>
            ${fmt(income)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default IncomeExpenseCard;
