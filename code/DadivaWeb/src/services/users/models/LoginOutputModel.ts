export interface LoginOutputModel {
  readonly token: string;
  readonly accountStatus: UserAccountStatus;
}

export interface UserAccountStatus {
  suspensionIsActive: boolean;
  suspensionType?: SuspensionType;
  suspensionStartDate?: Date;
  suspensionEndDate?: Date;
}

export enum SuspensionType {
  PendingReview = 'pendingReview',
  Permanent = 'permanent',
  BetweenBloodDonations = 'betweenBloodDonations',
  Other = 'other',
}
