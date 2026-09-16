import type { MetricFreeItem } from "../../shared/widget-config/types";

const numberFormatter = new Intl.NumberFormat("pt-BR");

// Grade 3x2 (no máximo 6 itens por página, ver shared/tv-pagination.ts).
export function TvMetricFreePage({ title, items }: { title: string; items: MetricFreeItem[] }) {
  return (
    <div className="flex h-full flex-col gap-8">
      <h1 className="text-5xl font-extrabold text-white">{title}</h1>
      {items.length === 0 ? (
        <p className="text-2xl text-white/60">Nenhum item cadastrado ainda.</p>
      ) : (
        <div className="grid flex-1 grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.key} className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-white/8 p-8 text-center">
              <p className="text-xl font-semibold uppercase tracking-wide text-white/70">{item.label}</p>
              <p className="text-6xl font-extrabold tabular-nums text-white">
                {numberFormatter.format(item.value)}
                {item.unit && <span className="ml-2 text-2xl font-medium text-white/60">{item.unit}</span>}
              </p>
              {item.helpText && <p className="text-lg text-white/50">{item.helpText}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
