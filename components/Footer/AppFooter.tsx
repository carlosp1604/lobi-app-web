import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

export default function AppFooter() {
  const { t } = useTranslation('navigation');

  return (
    <footer className="w-full text-foreground py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 pb-2">
          <div className="flex flex-col space-y-3 max-w-sm">
            <Link href="/" className="flex items-center space-x-2" aria-label={t('footer_home_link_aria_title')}>
              <span className="font-bold text-lg sm:text-xl" aria-hidden="true">
                {t('footer_app_logo_text')}
              </span>
            </Link>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-between items-start gap-4 text-xs">
          <p>{t('footer_app_copyright_title', { currentYear: 2026 })}</p>
        </div>
      </div>
    </footer>
  );
}
