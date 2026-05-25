import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import LegalMarkdown from '@/components/LegalMarkdown';
import { isAppLocale } from '@/i18n/routing';
import { loadLegalMarkdown } from '@/lib/legal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });
  return {
    title: t('terms.title'),
    description: t('terms.description'),
    robots: { index: true, follow: true },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const source = await loadLegalMarkdown('terms', locale);
  if (!source) notFound();

  const t = await getTranslations({ locale, namespace: 'legal' });
  const showLocaleNotice = locale !== 'ko';

  return (
    <>
      {showLocaleNotice && (
        <div className="border-b border-zinc-800 bg-zinc-900/60 px-6 py-3 text-center text-sm text-zinc-400">
          {t('localeNotice')}
        </div>
      )}
      <LegalMarkdown source={source} />
    </>
  );
}
