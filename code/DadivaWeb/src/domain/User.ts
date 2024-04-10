export interface User {
  name: string;
  nic: string;
}

export class User {
  constructor(name: string, nic: string) {
    this.name = name;
    this.nic = nic;
  }
}
