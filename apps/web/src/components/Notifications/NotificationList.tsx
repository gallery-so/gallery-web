import { useCallback, useMemo } from 'react';
import { usePaginationFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import styled from 'styled-components';

import { VStack } from '~/components/core/Spacer/Stack';
import { TitleDiatypeL } from '~/components/core/Text/Text';
import { SeeMore } from '~/components/Notifications/SeeMore';
import { useSanityAnnouncementContext } from '~/contexts/SanityAnnouncementProvider';
import { NotificationListFragment$key } from '~/generated/NotificationListFragment.graphql';
import { STATIC_FEATURE_FLAGS } from '~/shared/utils/featureFlags';

import AnnouncementNotification from './AnnouncementNotification';
import { Notification } from './Notification';
import { NotificationTwitterAlert } from './NotificationTwitterAlert';

export const NOTIFICATIONS_PER_PAGE = 15;

type NotificationListProps = {
  queryRef: NotificationListFragment$key;
  toggleSubView: (page?: JSX.Element) => void;
};

export function NotificationList({ queryRef, toggleSubView }: NotificationListProps) {
  const {
    data: query,
    loadPrevious,
    hasPrevious,
    isLoadingPrevious,
  } = usePaginationFragment(
    graphql`
      fragment NotificationListFragment on Query
      @refetchable(queryName: "NotificationsModalRefetchableQuery") {
        viewer {
          ... on Viewer {
            notifications(last: $notificationsLast, before: $notificationsBefore)
              @connection(key: "NotificationsFragment_notifications") {
              edges {
                node {
                  id
                  ...NotificationFragment
                }
              }
            }
          }
        }

        ...NotificationQueryFragment
        ...NotificationTwitterAlertFragment
      }
    `,
    queryRef
  );

  const { announcement, hasDismissedAnnouncement } = useSanityAnnouncementContext();

  const nonNullNotifications = useMemo(() => {
    const notifications = [];

    for (const edge of query.viewer?.notifications?.edges ?? []) {
      if (edge?.node) {
        notifications.push(edge.node);
      }
    }

    notifications.reverse();

    return notifications;
  }, [query.viewer?.notifications?.edges]);

  const handleSeeMore = useCallback(() => {
    loadPrevious(NOTIFICATIONS_PER_PAGE);
  }, [loadPrevious]);

  const hasNotifications = nonNullNotifications.length > 0;

  return (
    <NotificationsContent grow>
      {STATIC_FEATURE_FLAGS.SHOW_SOCIAL_CONNECTIONS && (
        <NotificationTwitterAlert queryRef={query} />
      )}
      {announcement && !hasDismissedAnnouncement && (
        <AnnouncementNotification announcement={announcement} />
      )}
      {hasNotifications ? (
        <>
          {nonNullNotifications.map((notification) => {
            return (
              <Notification
                queryRef={query}
                key={notification.id}
                notificationRef={notification}
                toggleSubView={toggleSubView}
              />
            );
          })}

          {hasPrevious && <SeeMore onClick={handleSeeMore} isLoading={isLoadingPrevious} />}
        </>
      ) : (
        <EmptyContainer grow justify="center" align="center">
          <EmptyNotificationsText>Nothing to see here yet.</EmptyNotificationsText>
        </EmptyContainer>
      )}
    </NotificationsContent>
  );
}

const EmptyContainer = styled(VStack)``;

const EmptyNotificationsText = styled(TitleDiatypeL)`
  text-align: center;
`;

const NotificationsContent = styled(VStack)`
  width: 100%;
  height: 100%;
`;
