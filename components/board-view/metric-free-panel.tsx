import type { MetricFreeItem } from "../../shared/widget-config/types";

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function MetricFreePanel({ title, items }: { title: string; items: MetricFreeItem[] }) {
  return (
    <section className="space-y-4 rounded-panel border border-border bg-card p-4 shadow-panel sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-caps text-primary">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum item cadastrado.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.key} className="rounded-panel border border-border/60 bg-background/40 p-3">
              <p className="text-xs font-medium uppercase tracking-caps text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                {numberFormatter.format(item.value)}
                {item.unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{item.unit}</span>}
              </p>
              {item.helpText && <p className="mt-1 text-xs text-muted-foreground/56">{item.helpText}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
