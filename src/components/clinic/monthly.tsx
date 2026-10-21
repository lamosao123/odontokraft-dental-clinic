import { monthRows } from "@/lib/finance/calc";
import { monthsInRange, pct, peso, prettyMonth, trailingMonths } from "@/lib/finance/format";
import { useClinic } from "@/lib/finance/store";
import { PageHead } from "@/components/clinic/ui";
import { cn } from "@/lib/cn";

export function Monthly() {
  const data = useClinic();
  const months = trailingMonths(data.anchorMonth, 12);
  const selected = new Set(monthsInRange(data.anchorMonth, data.range));
  const rows = monthRows(data, months, data.branch).slice().reverse();

  return (
    <div>
      <PageHead
        title="Monthly summary"
        subtitle="Twelve months through the month you have selected. The branch filter still applies."
      />
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <article key={row.month} className={cn("rounded-3xl border border-line p-4", selected.has(row.month) && "bg-gold-soft")}>
            <h2 className="font-display text-xl">{prettyMonth(row.month)}</h2>
            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-muted">Revenue</dt><dd className="tabular-nums">{peso(row.revenue)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Expenses</dt><dd className="tabular-nums">{peso(row.expenses)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Salaries</dt><dd className="tabular-nums">{peso(row.salaries)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Net profit</dt><dd className={cn("tabular-nums", row.profit < 0 && "text-loss")}>{peso(row.profit)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Margin</dt><dd className="tabular-nums">{pct(row.margin)}</dd></div>
            </dl>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-3xl border border-line md:block">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Month</th>
              <th className="px-4 py-3 font-medium">Revenue</th>
              <th className="px-4 py-3 font-medium">Expenses</th>
              <th className="px-4 py-3 font-medium">Salaries</th>
              <th className="px-4 py-3 font-medium">Net profit</th>
              <th className="px-4 py-3 font-medium">Margin</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.month} className={cn("border-t border-line", selected.has(row.month) && "bg-gold-soft")}>
                <td className="px-4 py-3">{prettyMonth(row.month)}</td>
                <td className="px-4 py-3 tabular-nums">{peso(row.revenue)}</td>
                <td className="px-4 py-3 tabular-nums">{peso(row.expenses)}</td>
                <td className="px-4 py-3 tabular-nums">{peso(row.salaries)}</td>
                <td className={cn("px-4 py-3 tabular-nums", row.profit < 0 && "text-loss")}>{peso(row.profit)}</td>
                <td className="px-4 py-3 tabular-nums">{pct(row.margin)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
