export type SignerVariables = {
  address: string;
  nonce: string;
  message: string;
  signature: string;
};

export type EoaPayloadVariables = {
  authMechanismType: 'eoa' | 'gnosisSafe';
  chain: 'Ethereum' | 'Tezos';
  userFriendlyWalletName: string;
  email?: string;
} & SignerVariables;

export type GnosisPayloadVariables = {
  authMechanismType: 'eoa' | 'gnosisSafe';
  userFriendlyWalletName: string;
  email?: string;
} & SignerVariables;

export type NeynarPayloadVariables = {
  authMechanismType: 'neynar';
  primaryAddress?: string;
  email?: string;
  userFriendlyWalletName?: string;
} & SignerVariables;

export type AuthPayloadVariables =
  | EoaPayloadVariables
  | GnosisPayloadVariables
  | NeynarPayloadVariables;

export function isEoaPayload(payload: AuthPayloadVariables): payload is EoaPayloadVariables {
  return payload.authMechanismType === 'eoa';
}
