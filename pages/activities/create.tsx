import { ActivityService } from "~/services/activitity/ActivityService";
import { GetServerSideProps } from "next";
import { GetSportsQueryResponseDto } from "~/types/activity/dto/GetSportsQueryResponseDto";
import { CreateActivity } from "~/components/CreateActivity";

export type CreateActivityPageProps = {
  sports: GetSportsQueryResponseDto
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getServerSideProps = (async (_context) =>  {
  const activityService = new ActivityService();
  const result = await activityService.getSports()

  if (!result.success) {
    return {
      redirect: {
        destination: '/500/',
        permanent: false,
      },
    };
  }

  const sports = result.value

  return { props: { sports } }
}) satisfies GetServerSideProps<CreateActivityPageProps>

export default function ProfilePage({ sports }: CreateActivityPageProps) {
  if (!sports) {
    return null
  }

  return (
    <div className="flex flex-col p-4">
      <CreateActivity sports={sports.sports}/>
    </div>
  )
}
