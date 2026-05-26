import Image from 'next/image';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { AspectRatio } from '~/components/ui/aspect-ratio';
import useTranslation from 'next-translate/useTranslation';

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default function Custom500() {
  const { t } = useTranslation('next-errors');

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="flex w-full max-w-md flex-col items-center space-y-8">
        <div className="w-full max-w-[280px] sm:max-w-xs overflow-hidden">
          <AspectRatio ratio={1 / 1}>
            <Image
              src="/static/this-is-fine.gif"
              alt={t('500_page_image_alt_title')}
              unoptimized={true}
              fill
              priority
              className="object-contain"
            />
          </AspectRatio>
        </div>

        <div className="space-y-3">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t('500_page_title')}
          </h1>
          <h2 className="text-xl font-semibold tracking-tight">
            {t('500_page_subtitle')}
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            {t('500_page_description')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button asChild size="lg" className="mx-auto w-full max-w-xs">
            <Link href="/">
              {t('500_page_home_button_title')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
