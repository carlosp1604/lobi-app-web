import useTranslation from 'next-translate/useTranslation'
import { Seo } from '~/components/Seo'
import { UserProfile } from '~/components/UserProfile/UserProfile'
import { UserService } from '~/services/user/UserService'
import { GetServerSideProps } from 'next'
import { GetUserProfileByUsernameResponseDto } from '~/types/users/dto/GetUserProfileByUsernameResponseDto'
import {
  GET_USER_PROFILE_BY_USERNAME_INVALID_USERNAME,
  GET_USER_PROFILE_BY_USERNAME_USER_NOT_FOUND
} from '~/types/users/ApiCodes'

export interface ProfilePageProps {
  user: GetUserProfileByUsernameResponseDto
}

export const getServerSideProps = (async (context) =>  {
  const username = context.query.username

  if (!username || Array.isArray(username)) {
    return { notFound: true }
  }

  const userService = new UserService()
  const result = await userService.getUserProfile(username)

  if (!result.success) {
    const error = result.error

    const obfuscatedErrors = [
      GET_USER_PROFILE_BY_USERNAME_USER_NOT_FOUND,
      GET_USER_PROFILE_BY_USERNAME_INVALID_USERNAME,
    ]

    if (error.isApiErrorType(obfuscatedErrors)) {
      return { notFound: true }
    }

    return {
      redirect: {
        destination: '/500/',
        permanent: false,
      },
    }
  }

  const userProfile = result.value

  if (!userProfile) {
    return { notFound: true }
  }

  return { props: { user: userProfile } }
}) satisfies GetServerSideProps<ProfilePageProps>

export default function ProfilePage({ user }: ProfilePageProps) {
  const { t } = useTranslation('user')

  if (!user) {
    return null
  }

  const canonical = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/users/${user.username}/`

  return (
    <>
      <Seo
        title={ t('user_profile_page_title', { userName: user.name }) }
        description={ t('user_profile_page_description', { userName: user.name }) }
        canonicalUrl={ canonical }
        noIndex={ true }
      />
      <UserProfile userProfile={ user }/>
    </>
  )
}
