import { PropsWithChildren } from 'react';

import ErrorReportingProvider from '~/shared/contexts/ErrorReportingContext';

function captureException(error: Error) {
  console.error(error);
}

function captureMessage(message: string) {
  console.warn(message);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setUser(_user: { id?: string }) {
  // no-op
}

export function WebErrorReportingProvider({ children }: PropsWithChildren) {
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
