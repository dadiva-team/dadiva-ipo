/**
 * Entity for HTTP request problems
 *
 * @property type the type of problem
 * @property title title of the problem
 * @property status the HTTP status code of the problem
 * @property detail a more thorough description of the problem
 */

export interface IProblem {
  type: string;
  title: string;
  status: number;
  detail?: string;
}

export class Problem {
  type: string;
  title: string;
  status: number;
  detail?: string;

  constructor(problem: IProblem) {
    this.type = problem.type;
    this.title = problem.title;
    this.status = problem.status;
    this.detail = problem.detail;
  }
}
