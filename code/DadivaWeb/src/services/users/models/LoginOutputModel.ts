export interface LoginOutputModel {
  readonly token: string;
  readonly accountStatus: UserSuspensionAccountStatus;
}

export interface UserSuspensionAccountStatus {
  isActive: boolean;
  type?: SuspensionType;
  startDate?: Date;
  endDate?: Date;
  reason?: string;
}

export enum SuspensionType {
  PendingReview = 'pendingReview',
  Permanent = 'permanent',
  BetweenBloodDonations = 'betweenBloodDonations',
  Other = 'other',
}
