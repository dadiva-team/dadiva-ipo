export interface SuspendUserRequestModel {
  donorNic: string;
  doctorNic: string;
  type: string;
  startDate: string;
  endDate?: string;
  reason?: string;
  note?: string;
}
