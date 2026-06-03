import { ActivityDetails } from "~/components/ActivityDetails";
import { ActivityService } from "~/services/activitity/ActivityService";
import { GetServerSideProps } from "next";
import { GetActivityResponseDto } from "~/types/activity/dto/GetActivityResponseDto";
import { InformationModalProvider } from "~/context/InformationModalProvider";
import { GET_ACTIVITY_ACTIVITY_NOT_FOUND } from "~/types/activity/ApiCodes";

export type ActivityPageProps = {
  activityData: GetActivityResponseDto
}

export const getServerSideProps = (async (context) =>  {
  const activityId = context.query.activityId;

  if (!activityId || Array.isArray(activityId)) {
    return { notFound: true,}
  }

  const cookieHeader = context.req.headers.cookie;

  const activityService = new ActivityService();
  const result = await activityService.getActivity(activityId, {
    headers: {
      'Cookie': cookieHeader
    }
  })

  if (!result.success) {
    const error = result.error

    if (error.isApiErrorType(GET_ACTIVITY_ACTIVITY_NOT_FOUND)) {
      return { notFound: true };
    }

    return {
      redirect: {
        destination: '/500/',
        permanent: false,
      },
    };
  }

  const activityData = result.value

  return { props: { activityData } }
}) satisfies GetServerSideProps<ActivityPageProps>

export default function ActivityPage({ activityData }: ActivityPageProps) {
  if (!activityData) {
    return null;
  }

  return (
    <InformationModalProvider>
      <ActivityDetails activityData={activityData} />
    </InformationModalProvider>
  );
}
