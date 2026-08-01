import { FormableOptions, HttpClient } from "./http";
import { RedlineRequests } from "./resources/redlineRequests";
import { SignatureRequests } from "./resources/signatureRequests";
import { Templates } from "./resources/templates";
import { BillingResponse, HealthResponse } from "./types";

export class Formable {
  readonly templates: Templates;
  readonly signatureRequests: SignatureRequests;
  readonly redlineRequests: RedlineRequests;
  private readonly http: HttpClient;

  constructor(options: FormableOptions) {
    this.http = new HttpClient(options);
    this.templates = new Templates(this.http);
    this.signatureRequests = new SignatureRequests(this.http);
    this.redlineRequests = new RedlineRequests(this.http);
  }

  billing = (): Promise<BillingResponse> => this.http.get("/billing");

  health = (): Promise<HealthResponse> => this.http.get("/health");
}

export { FormableError } from "./error";
export { DEFAULT_BASE_URL } from "./http";
export type { FormableOptions } from "./http";
export * from "./types";
export * from "./events";
export default Formable;
