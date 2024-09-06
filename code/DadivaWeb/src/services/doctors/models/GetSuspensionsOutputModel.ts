import { UserSuspension } from '../../../domain/User/UserSuspension';

export interface GetSuspensionsOutputModel {
  suspensions: UserSuspension[];
}
