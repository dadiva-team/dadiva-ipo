export interface LoginOutputModel {
  readonly nic: number;
  readonly token: string;
  readonly accountStatus: UserAccountStatus;
}

export enum AccountStatus {
  Active = 0,
  PendingReview = 1,
  Suspended = 2,
}

export interface UserAccountStatus {
  userNic: number;
  status: AccountStatus;
  suspendedUntil: Date | null;
  lastSubmissionDate: Date | null;
  lastSubmissionId: number | null;
}
