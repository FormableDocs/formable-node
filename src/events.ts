export type RedliningEventType =
  | "document_ready_for_signing"
  | "redline_edit_inserted"
  | "redline_edit_deleted"
  | "redline_edit_rejected"
  | "redline_edit_accepted"
  | "redline_comment_added"
  | "redline_message_added"
  | "redline_turn_ended"
  | "redline_shared";

export type SigningEventType =
  | "document_signed"
  | "document_completed"
  | "document_viewed";

export type RedliningEventMemberRole =
  | "disclosing_party"
  | "receiving_party"
  | "disclosing_counsel"
  | "receiving_counsel";

interface EventMetadata<TCategory extends string, TType extends string> {
  event_id: string;
  event_category: TCategory;
  event_type: TType;
  event_time: number;
}

export interface RedlineRequestEvent {
  event: EventMetadata<"redlining", RedliningEventType>;
  redlining: {
    redline_request_id: string;
    redline_member_role: RedliningEventMemberRole;
    redline_edit_insertion?: string;
    redline_edit_deletion?: string;
    content?: string;
    change_type?: string;
    comment_added?: string;
    message?: string;
    author_email?: string;
  };
}

export interface SignatureRequestEvent {
  event: EventMetadata<"signing", SigningEventType>;
  signing: {
    signature_request_id: string;
    recipient_signature_id?: string;
  };
}

export interface RedlineRequestEventsResponse {
  redlineRequestEvents: RedlineRequestEvent[];
}

export interface SignatureRequestEventsResponse {
  signatureRequestEvents: SignatureRequestEvent[];
}
