import { ResetPassword } from '~/components/ResetPassword'

export async function getServerSideProps() {
  return { props: {} }
}

export default function ResetPage() {
  return <ResetPassword />
}

