export class User {
  constructor(
    public id: string,
    public username?: string,
    public password?: string,
    public active?: boolean,
    public name?: string,
    public email?: string,
    public phone?: number,
    public idProfilePicture?: string
  ) {}
}
