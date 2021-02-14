export class Exception extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
