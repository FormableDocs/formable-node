export interface Party {
  email: string;
  name: string;
}

export interface ListParams {
  updatedSince?: string | Date;
}

// ------------------------------- Templates -------------------------------

export type TemplateFile = Blob | ArrayBuffer | Uint8Array;

export interface TemplateSignerRole {
  name: string;
  order: number;
}

export interface CreateTemplateParams {
  file: TemplateFile;
  filename: string;
  signerRoles?: TemplateSignerRole[];
}

export interface TemplateEditUrlResponse {
  editUrl: string;
  expiresAt: string;
}

export interface CreateTemplateResponse {
  templateId: string;
  editTemplateAccess: TemplateEditUrlResponse;
}

// --------------------------- Signature requests ---------------------------

export type SignatureRequestStatus = "Created" | "Completed" | "Expired";

export interface SignerInput {
  email: string;
  name: string;
  role?: string;
}

export interface FieldValueInput {
  fieldId: string;
  value: string;
}

export interface CreateSignatureRequestParams {
  templateId: string;
  signers: SignerInput[];
  sender?: Party;
  testMode?: boolean;
  fields?: FieldValueInput[];
}

export interface SignatureRequestSigner extends Party {
  recipientSignatureId: string;
}

export interface CreateSignatureRequestResponse {
  signatureRequestId: string;
  templateId: string;
  signers: SignatureRequestSigner[];
  sender: Party;
  status: SignatureRequestStatus;
  testMode: boolean;
}

export interface SignatureRequest {
  signatureRequestId: string;
  templateId: string;
  signer: Party;
  sender: Party;
  status: SignatureRequestStatus;
  testMode: boolean;
}

export interface SigningUrlResponse {
  signingUrl: string;
  expiresAt: string;
}

export interface SignedEnvelopeResponse {
  signedEnvelopePresignedUrl: string;
}

// ----------------------------- Redline requests -----------------------------

export type RedlineMemberRole =
  | "DisclosingParty"
  | "ReceivingParty"
  | "DisclosingCounsel"
  | "ReceivingCounsel";

export type RedlineRequestStatus =
  | "DisclosingPartyDraft"
  | "DisclosingPartyRequestedReview"
  | "DocumentReadyForSigning"
  | "ReceivingPartyDraft"
  | "ReceivingPartyOpened"
  | "ReceivingPartyRequestedReview";

export type RedlineRoundParty = "Disclosing" | "Receiving";

export interface RedlineMember {
  email: string;
  displayName: string;
  role: RedlineMemberRole;
}

export interface RedlineRequestMetadata {
  subject?: string;
}

export interface CreateRedlineRequestParams {
  templateId: string;
  members: RedlineMember[];
  testMode?: boolean;
  metadata?: RedlineRequestMetadata;
}

export interface CreateRedlineRequestResponse {
  redlineRequestId: string;
  templateId: string;
}

export interface RedlineRequest {
  templateId: string;
  status: RedlineRequestStatus;
  members: RedlineMember[];
  testMode: boolean;
  currentRound: RedlineRoundParty;
}

export interface RedlineMembersResponse {
  members: RedlineMember[];
}

export interface RedlineUrlResponse {
  redlineUrl: string;
  expiresAt: string;
}

// ------------------------------ Billing/health ------------------------------

export interface BillingResponse {
  numberOfRedliningSessions: number;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  version?: string;
}
