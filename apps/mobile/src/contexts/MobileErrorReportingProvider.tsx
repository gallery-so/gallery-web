import { PropsWithChildren } from 'react';

import ErrorReportingProvider from '~/shared/contexts/ErrorReportingContext';

function captureException(error: Error) {
  // eslint-disable-next-line no-console
  console.error(error);
}

function captureMessage(message: string) {
  // eslint-disable-next-line no-console
  console.warn(message);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setUser(_user: { id?: string }) {
  // no-op
}

export function MobileErrorReportingProvider({ children }: PropsWithChildren) {
  return (
    <ErrorReportingProvider
      captureException={captureException}
      captureMessage={captureMessage}
      setUser={setUser}
    >
      {children}
    </ErrorReportingProvider>
  );
}
