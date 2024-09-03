import { Rule } from './FormOutputModel';

export interface EditInconsistenciesRequest {
  inconsistencies: Rule[];
  language: string;
  reason?: string[] | null;
}
