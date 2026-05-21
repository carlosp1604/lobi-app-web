import Login from "~/components/Login";

export async function getServerSideProps() {
  return { props: {} }
}

export default function LoginPage() {
  return <Login />
}

