import { SuspensionType } from '../../services/users/models/LoginOutputModel';
import { DonorModel } from '../../services/doctors/models/SubmissionOutputModel';
export interface UserSuspension {
  donor: DonorModel;
  doctor?: DonorModel;
  suspensionType: SuspensionType;
  suspensionStartDate: Date;
  suspensionEndDate?: Date;
  reason?: string;
  suspensionNote?: string;
}
