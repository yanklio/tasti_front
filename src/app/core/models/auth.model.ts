class AuthRequest {
  constructor(
    public username: string,
    public password: string,
  ) {}
}

class AuthResponse {
  constructor(
    public access: string,
    public refresh: string,
    public user: User,
  ) {}
}
