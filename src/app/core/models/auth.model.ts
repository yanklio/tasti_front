export class LoginRequest {
  constructor(
    public username: string,
    public password: string,
  ) {}
}

export class RegisterRequest {
  constructor(
    public username: string,
    public password: string,
  ) {}
}

export class AuthResponse {
  constructor(
    public access: string,
    public refresh: string,
    public user: User,
  ) {}
}
