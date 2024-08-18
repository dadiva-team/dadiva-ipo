import { SuspensionType } from '../../services/users/models/LoginOutputModel';

export class UserSuspension {
  public userNic: number;
  public suspensionType: SuspensionType;
  public suspensionStartDate: Date;
  public suspensionEndDate?: Date;
  public reason?: string;
  public suspensionNote?: string;
  public suspendedBy: number;

  constructor(
    userNic: number,
    suspensionType: SuspensionType,
    suspensionStartDate: Date,
    suspendedBy: number,
    suspensionEndDate?: Date,
    reason?: string,
    suspensionNote?: string
  ) {
    this.userNic = userNic;
    this.suspensionType = suspensionType;
    this.suspensionStartDate = suspensionStartDate;
    this.suspensionEndDate = suspensionEndDate;
    this.reason = reason;
    this.suspensionNote = suspensionNote;
    this.suspendedBy = suspendedBy;
  }
}
