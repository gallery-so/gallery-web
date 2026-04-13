import { forwardRef, useCallback } from 'react';
import { View } from 'react-native';
import { FarcasterOutlineIcon } from 'src/icons/FarcasterOutlineIcon';
import { QRCodeIcon } from 'src/icons/QRCodeIcon';
import { WalletIcon } from 'src/icons/WalletIcon';

import { OpenManageWalletProps } from '~/contexts/ManageWalletContext';
import { contexts } from '~/shared/analytics/constants';
import { STATIC_FEATURE_FLAGS } from '~/shared/utils/featureFlags';

import { BottomSheetRow } from '../BottomSheetRow';
import { Typography } from '../Typography';
import {
  FarcasterAuthProvider,
  useLoginWithFarcaster,
} from './AuthProvider/Farcaster/FarcasterAuthProvider';

type Props = {
  onQrCodePress: () => void;
  openManageWallet: (o: OpenManageWalletProps) => void;
};

function SignInBottomSheet({ onQrCodePress, openManageWallet }: Props) {
  const handleConnectWallet = useCallback(() => {
    openManageWallet({ method: 'auth' });
  }, [openManageWallet]);

  return (
    <View className="flex flex-col space-y-6">
      <View className="flex flex-col space-y-4">
        <Typography
          className="text-lg text-black-900 dark:text-offWhite"
          font={{ family: 'ABCDiatype', weight: 'Bold' }}
        >
          Sign in or sign up
        </Typography>
      </View>

      <View className="flex flex-col space-y-2">
        <BottomSheetRow
          icon={<WalletIcon />}
          text="Wallet"
          onPress={handleConnectWallet}
          eventContext={contexts.Authentication}
          fontWeight="Bold"
        />

        {/* wrapping necessary as bottom sheet doesn't inherit farcaster auth context from main App Providers */}
        {STATIC_FEATURE_FLAGS.SHOW_SOCIAL_CONNECTIONS && (
          <View>
            <FarcasterAuthProvider>
              <FarcasterBottomSheetRow />
            </FarcasterAuthProvider>
          </View>
        )}

        <BottomSheetRow
          icon={<QRCodeIcon width={24} height={24} />}
          text="Sign in via Desktop"
          onPress={onQrCodePress}
          eventContext={contexts.Authentication}
          fontWeight="Bold"
        />
      </View>
    </View>
  );
}

function FarcasterBottomSheetRow() {
  const { open: handleConnectFarcaster } = useLoginWithFarcaster();

  return (
    <BottomSheetRow
      icon={<FarcasterOutlineIcon />}
      text="Farcaster"
      onPress={handleConnectFarcaster}
      eventContext={contexts.Authentication}
      fontWeight="Bold"
    />
  );
}

const ForwardedSignInBottomSheet = forwardRef(SignInBottomSheet);

export { ForwardedSignInBottomSheet as SignInBottomSheet };
