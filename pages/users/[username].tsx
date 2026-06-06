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
  if (!user) {
    return null
  }

  return <UserProfile userProfile={ user }/>
}
