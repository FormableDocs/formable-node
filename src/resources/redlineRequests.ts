import { RedlineRequestEventsResponse } from "../events";
import { HttpClient } from "../http";
import { toUpdatedSince } from "./shared";
import {
  CreateRedlineRequestParams,
  CreateRedlineRequestResponse,
  ListParams,
  RedlineMember,
  RedlineMembersResponse,
  RedlineRequest,
  RedlineUrlResponse,
} from "../types";

export class RedlineRequests {
  constructor(private readonly http: HttpClient) {}

  create = (
    params: CreateRedlineRequestParams
  ): Promise<CreateRedlineRequestResponse> =>
    this.http.post("/redline-requests", params);

  list = ({ updatedSince }: ListParams = {}): Promise<RedlineRequest[]> =>
    this.http.get("/redline-requests", {
      updatedSince: toUpdatedSince(updatedSince),
    });

  get = (redlineRequestId: string): Promise<RedlineRequest> =>
    this.http.get(`/redline-requests/${encodeURIComponent(redlineRequestId)}`);

  updateMembers = (
    redlineRequestId: string,
    members: RedlineMember[]
  ): Promise<RedlineMembersResponse> =>
    this.http.put(
      `/redline-requests/${encodeURIComponent(redlineRequestId)}/members`,
      { members }
    );

  createUrl = (
    redlineRequestId: string,
    memberEmail: string
  ): Promise<RedlineUrlResponse> =>
    this.http.post(
      `/redline-requests/${encodeURIComponent(redlineRequestId)}/url`,
      { memberEmail }
    );

  getEvents = (
    redlineRequestId: string
  ): Promise<RedlineRequestEventsResponse> =>
    this.http.get(
      `/redline-requests/${encodeURIComponent(redlineRequestId)}/events`
    );
}
