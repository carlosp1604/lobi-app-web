import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useAuth } from "~/hooks/useAuth";
import { SecuritySettings} from "~/components/UserProfile/SecuritySettings";
import {GetUserProfileByUsernameResponseDto} from "~/types/users/dto/GetUserProfileByUsernameResponseDto";
import {Badge} from "~/components/ui/badge";
import useTranslation from "next-translate/useTranslation";
import {EmptyState} from "~/components/EmptyState";
import {Construction} from "lucide-react";

type UserProfile = GetUserProfileByUsernameResponseDto

interface ProfileViewProps {
  userProfile: UserProfile;
}

export function UserProfile({ userProfile }: ProfileViewProps) {
  const { t } = useTranslation('user');
  const { status, user: authUser } = useAuth();

  const isOwner = status === 'authenticated' && authUser?.id === userProfile.id;

  return (
    <div className="container mx-auto px-4 space-y-6">
      <header className="flex items-center gap-6">
        <Avatar className="w-24 h-24 border">
          <AvatarImage
            src={userProfile.imageUrl || undefined}
            alt={userProfile.name}
          />
          <AvatarFallback className="text-2xl font-medium ">
            {userProfile.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-bold">
              {userProfile.name}
            </h1>
          </div>
          <p className="text-muted-foreground">
            @{userProfile.username}
          </p>
          {isOwner && (
            <Badge variant="secondary" className="font-normal bg-cyan-50">
              { t('user_profile_my_profile_badge_title') }
            </Badge>
          )}
        </div>
      </header>

      <Tabs defaultValue="activities" className="w-full gap-y-4">
        <TabsList className={`${isOwner ? "w-full" : "w-fit"}`}>
          <TabsTrigger value="activities" className="cursor-pointer">
            { t('user_profile_activities_tab_title')}
          </TabsTrigger>

          {isOwner && (
            <>
              <TabsTrigger value="profile" className="cursor-pointer">
                { t('user_profile_profile_setting_tab_title')}
              </TabsTrigger>
              <TabsTrigger value="security" className="cursor-pointer">
                { t('user_profile_security_tab_title')}
              </TabsTrigger>
              <TabsTrigger value="settings" className="cursor-pointer">
                { t('user_profile_app_settings_tab_title')}
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="activities" className="min-h-[400px]">
          <EmptyState
            icon={Construction}
            title={ t('user_profile_inactive_tab_title') }
            description={ t('user_profile_inactive_tab_description') }
          />
        </TabsContent>

        {isOwner && (
          <>
            <TabsContent value="profile" className="min-h-[400px]">
              <EmptyState
                icon={Construction}
                title={ t('user_profile_inactive_tab_title') }
                description={ t('user_profile_inactive_tab_description') }
              />
            </TabsContent>
            <TabsContent value="security" className="min-h-[400px]">
              <SecuritySettings />
            </TabsContent>
            <TabsContent value="settings" className="min-h-[400px]">
              <EmptyState
                icon={Construction}
                title={ t('user_profile_inactive_tab_title') }
                description={ t('user_profile_inactive_tab_description') }
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
