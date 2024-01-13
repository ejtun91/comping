export class CurrentUser {
  email: string;
  username: string;
  firstName: string;
  lastName: string;

  constructor(
    email: string,
    username: string,
    firstName: string,
    lastName: string
  ) {
    this.email = email;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
