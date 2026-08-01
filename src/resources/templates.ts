import { HttpClient } from "../http";
import {
  CreateTemplateParams,
  CreateTemplateResponse,
  TemplateEditUrlResponse,
  TemplateFile,
} from "../types";

export class Templates {
  constructor(private readonly http: HttpClient) {}

  create = ({
    file,
    filename,
    signerRoles,
  }: CreateTemplateParams): Promise<CreateTemplateResponse> => {
    const form = new FormData();
    form.append("file", toBlob(file), filename);
    form.append("filename", filename);
    if (signerRoles) {
      form.append("signer_roles", JSON.stringify(signerRoles));
    }
    return this.http.postForm("/templates", form);
  };

  createEditUrl = (templateId: string): Promise<TemplateEditUrlResponse> =>
    this.http.post(`/templates/${encodeURIComponent(templateId)}/edit-url`);
}

// Blob accepts any ArrayBufferView at runtime; the cast works around
// BlobPart rejecting Uint8Array<ArrayBufferLike> (Node's Buffer type)
const toBlob = (file: TemplateFile): Blob =>
  file instanceof Blob ? file : new Blob([file as ArrayBuffer]);
