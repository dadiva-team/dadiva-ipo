export interface LoginOutputModel {
  readonly token: string;
  readonly suspensionAccountStatus: SuspensionAccountStatus;
}

export interface SuspensionAccountStatus {
  isActive: boolean;
  type?: SuspensionType;
  startDate?: Date;
  endDate?: Date;
  reason?: string;
}

export enum SuspensionType {
  PendingReview = 'pendingReview',
  Permanent = 'permanent',
  BetweenReviewAndDonation = 'betweenReviewAndDonation',
  BetweenBloodDonations = 'betweenBloodDonations',
  Other = 'other',
}
