
export class CommentPeekus {
  constructor(
    public text: string,
    public idUser: string,
    public idEvent: string,
    public commentDate?: Date,
    public id?: string,
  ) {}
}
