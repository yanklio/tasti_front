import { AuthRequired } from './auth-required';

describe('AuthRequired', () => {
  it('should create an instance', () => {
    const directive = new AuthRequired();
    expect(directive).toBeTruthy();
  });
});
