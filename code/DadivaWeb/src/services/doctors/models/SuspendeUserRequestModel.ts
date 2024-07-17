export interface SuspendUserRequestModel {
    userNic: number;
    suspensionType: number;
    suspensionStartDate: string;
    suspensionEndDate?: string;
    reason?: string;
    suspensionNote?: string;
    suspendedBy: number;
}