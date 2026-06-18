import useTranslation from 'next-translate/useTranslation'
import { Seo } from '~/components/Seo'
import { ResetPassword } from '~/components/ResetPassword'

export async function getServerSideProps() {
  return { props: {} }
}

export default function ResetPage() {
  const { t } = useTranslation('auth')

  const canonical = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/reset/`

  return (
    <>
      <Seo
        title={ t('reset_password_page_title') }
        description={ t('reset_password_page_description') }
        canonicalUrl={ canonical }
        noIndex={ true }
      />
      <ResetPassword />
    </>
  )
}

