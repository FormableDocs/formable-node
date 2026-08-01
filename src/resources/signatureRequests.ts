import { SignatureRequestEventsResponse } from "../events";
import { HttpClient } from "../http";
import { toUpdatedSince } from "./shared";
import {
  CreateSignatureRequestParams,
  CreateSignatureRequestResponse,
  ListParams,
  SignatureRequest,
  SignedEnvelopeResponse,
  SigningUrlResponse,
} from "../types";

export class SignatureRequests {
  constructor(private readonly http: HttpClient) {}

  create = (
    params: CreateSignatureRequestParams
  ): Promise<CreateSignatureRequestResponse> =>
    this.http.post("/signature-requests", params);

  createEmbedded = (
    params: CreateSignatureRequestParams
  ): Promise<CreateSignatureRequestResponse> =>
    this.http.post("/signature-requests/embedded", params);

  list = ({ updatedSince }: ListParams = {}): Promise<SignatureRequest[]> =>
    this.http.get("/signature-requests", {
      updatedSince: toUpdatedSince(updatedSince),
    });

  get = (signatureRequestId: string): Promise<SignatureRequest> =>
    this.http.get(
      `/signature-requests/${encodeURIComponent(signatureRequestId)}`
    );

  getEvents = (
    signatureRequestId: string
  ): Promise<SignatureRequestEventsResponse> =>
    this.http.get(
      `/signature-requests/${encodeURIComponent(signatureRequestId)}/events`
    );

  getSignedEnvelope = (
    signatureRequestId: string
  ): Promise<SignedEnvelopeResponse> =>
    this.http.get(
      `/signature-requests/${encodeURIComponent(
        signatureRequestId
      )}/signed-envelope`
    );

  createSigningUrl = (
    recipientSignatureId: string
  ): Promise<SigningUrlResponse> =>
    this.http.post(
      `/recipient-signatures/${encodeURIComponent(recipientSignatureId)}/url`
    );
}
