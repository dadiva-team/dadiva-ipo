export interface SuspendUserRequestModel {
  userNic: number;
  suspensionType: string;
  suspensionStartDate: string;
  suspensionEndDate?: string;
  reason?: string;
  suspensionNote?: string;
  suspendedBy: number;
}
