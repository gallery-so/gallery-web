import { useCallback } from 'react';
import styled from 'styled-components';

import { Button } from '~/components/core/Button/Button';
import GalleryLink from '~/components/core/GalleryLink/GalleryLink';
import { VStack } from '~/components/core/Spacer/Stack';
import { BaseXL, BODY_FONT_FAMILY } from '~/components/core/Text/Text';
import {
  IS_READ_ONLY_MODE,
  READ_ONLY_MODE_MESSAGE,
  READ_ONLY_MODE_TITLE,
} from '~/constants/readOnlyMode';
import { useModalActions } from '~/contexts/modal/ModalContext';
import colors from '~/shared/theme/colors';

export default function useUniversalAuthModal() {
  const { hideModal, showModal } = useModalActions();

  return useCallback(() => {
    if (IS_READ_ONLY_MODE) {
      showModal({
        id: 'read-only-auth-disabled',
        content: <ReadOnlyModeModal onClose={() => hideModal({ id: 'read-only-auth-disabled' })} />,
        headerText: '',
      });
      return;
    }
  }, [hideModal, showModal]);
}

type ReadOnlyModeModalProps = {
  onClose: () => void;
};

function ReadOnlyModeModal({ onClose }: ReadOnlyModeModalProps) {
  return (
    <StyledContent gap={20}>
      <VStack gap={10}>
        <StyledTitle>{READ_ONLY_MODE_TITLE}</StyledTitle>
        <StyledBody>{READ_ONLY_MODE_MESSAGE}</StyledBody>
        <StyledAnnouncementLink
          href="https://x.com/GALLERY/status/2032184859305644396"
          target="_blank"
          eventElementId="Read Only Mode Announcement Link"
          eventName="Clicked Read Only Mode Announcement Link"
          eventContext={null}
          inheritLinkStyling
        >
          See our announcement here
        </StyledAnnouncementLink>
      </VStack>
      <StyledButtonRow>
        <StyledButton
          eventElementId={null}
          eventName={null}
          eventContext={null}
          onClick={onClose}
          variant="primary"
        >
          Continue browsing
        </StyledButton>
      </StyledButtonRow>
    </StyledContent>
  );
}

const StyledTitle = styled.h2`
  margin: 0;
  font-family: ${BODY_FONT_FAMILY};
  line-height: 28px;
  letter-spacing: -0.04em;
  font-weight: 500;
  font-size: 24px;
  color: ${colors.black['800']};
`;

const StyledBody = styled(BaseXL)`
  font-family: ${BODY_FONT_FAMILY};
  line-height: 26px;
  color: ${colors.shadow};
`;

const StyledAnnouncementLink = styled(GalleryLink)`
  width: fit-content;
  color: ${colors.shadow};
  font-family: ${BODY_FONT_FAMILY};
  font-size: 18px;
  line-height: 26px;
  text-decoration: underline;

  &:hover {
    color: ${colors.black['800']};
    text-decoration: underline;
  }
`;

const StyledButtonRow = styled.div`
  width: 100%;
`;

const StyledContent = styled(VStack)`
  width: 100%;
  min-width: 320px;
  max-width: 420px;
  padding-top: 8px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  padding: 12px 24px;
`;
