export class Token {

  public readonly value: string;
  public readonly id: string;
  public readonly subject: number;
  public readonly issuedAt: number;
  public readonly expirationTime: number;

  public constructor(value: string) {
    const claims = JSON.parse(atob(value.split(".")[1]));
    this.value = value;
    this.id = claims.jti;
    this.subject = +claims.sub;
    this.issuedAt = claims.exp * 1000;
    this.expirationTime = claims.exp * 1000;
  }

  public isAlive() {
    return this.expirationTime >= Date.now();
  }

  public isExpired() {
    return this.expirationTime < Date.now();
  }

  public timeLeft() {
    return this.expirationTime - Date.now();
  }

  public toString() {
    return this.value;
  }

}

export default Token;