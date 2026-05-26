import { Signup } from "~/components/Signup";

export async function getServerSideProps() {
  return { props: {} }
}

export default function ResetPage() {
  return <Signup />
}

