import useTranslation from 'next-translate/useTranslation'
import { Seo } from '~/components/Seo'
import { Signup } from '~/components/Signup'

export async function getServerSideProps() {
  return { props: {} }
}

export default function SignupPage() {
  const { t } = useTranslation('auth')

  const canonical = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/signup/`

  return (
    <>
      <Seo
        title={ t('signup_page_title') }
        description={ t('signup_page_description') }
        canonicalUrl={ canonical }
        noIndex={ true }
      />
      <Signup />
    </>
  )
}

