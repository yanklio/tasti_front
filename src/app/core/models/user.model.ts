class User {
  constructor(
    public pk: number,
    public username: string,
    public email: string | undefined,
    public firstName: string | undefined,
    public secondName: string | undefined,
  ) {}
}
