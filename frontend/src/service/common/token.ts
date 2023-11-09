export class Token {

	public readonly value: string;
	public readonly id: string;
	public readonly subject: number;
	public readonly issuedAt: number;
	public readonly expirationTime: number;

	public constructor(value: string) {
		const claims: any = JSON.parse(atob(value.replace(/-/g, "+").replace(/_/g, "/").split(".")[1]));
		this.value = value;
		this.id = claims.jti;
		this.subject = +claims.sub;
		this.issuedAt = +claims.exp * 1000;
		this.expirationTime = +claims.exp * 1000;
	}

	public isAlive(): boolean {
		return this.expirationTime >= Date.now();
	}

	public isExpired(): boolean {
		return this.expirationTime < Date.now();
	}

	public timeLeft(): number {
		return this.expirationTime - Date.now();
	}

	public toString(): string {
		return this.value;
	}

}

export default Token;