export class ApiSuccess<T = unknown> {
  constructor(
    public readonly data: T,
    public readonly message: string = "Success"
  ) {}
}
