import { useTranslations } from 'next-intl';

/**
 * Demand-validation section. The 1,176 figure + 8× ratio + 40.2% YoY come
 * from the README and are the strongest signal that the cross-language pair
 * is not a speculative target. Phrased as quiet statistics, not hype.
 */
export default function PersonaSection() {
  const t = useTranslations('persona');

  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="overflow-hidden rounded-[40px] bg-sunset p-8 text-white md:p-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
              {t('eyebrow')}
            </span>
            <h2 className="break-keep text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
              {t('title')}
            </h2>
            <p className="break-keep text-base leading-relaxed text-white/85 md:text-lg">
              {t('body')}
            </p>
            <p className="text-sm leading-relaxed text-white/70">
              {t('source')}
            </p>
          </div>

          <div className="grid gap-4">
            <Stat
              value="1,176"
              label={t('stat1.label')}
              caption={t('stat1.caption')}
            />
            <Stat
              value="+40.2%"
              label={t('stat2.label')}
              caption={t('stat2.caption')}
            />
            <Stat
              value="≈ 8×"
              label={t('stat3.label')}
              caption={t('stat3.caption')}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-white/20 pt-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
            {t('roadmap')}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <RoadmapChip active>🇰🇷 한국</RoadmapChip>
            <span className="text-white/50">→</span>
            <RoadmapChip active>🇯🇵 日本</RoadmapChip>
            <span className="text-white/50">→</span>
            <RoadmapChip>🇺🇸 USA</RoadmapChip>
            <span className="text-white/50">→</span>
            <RoadmapChip>🇹🇭 ไทย</RoadmapChip>
            <span className="text-white/50">→</span>
            <RoadmapChip>🇮🇳 भारत</RoadmapChip>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  caption,
}: {
  value: string;
  label: string;
  caption: string;
}) {
  return (
    <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">
      <p className="text-3xl font-bold tracking-tight md:text-4xl">{value}</p>
      <p className="mt-1 text-sm font-semibold text-white/90">{label}</p>
      <p className="mt-1 text-xs text-white/70">{caption}</p>
    </div>
  );
}

function RoadmapChip({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={
        active
          ? 'rounded-full bg-white px-3 py-1 text-sm font-semibold text-[color:var(--color-primary-dark)]'
          : 'rounded-full border border-white/40 px-3 py-1 text-sm text-white/70'
      }
    >
      {children}
    </span>
  );
}
