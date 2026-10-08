export class ApiError extends Error {
  readonly status: number = -1
  constructor(msg: string, status?: number) {
    super(msg)
    // https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
    Object.setPrototypeOf(this, ApiError.prototype)

    if (status !== undefined) {
      this.status = status
    }
  }

  say(): string {
    if (this.status === -1) {
      return `An unexpected error occurred: ${this.message}`
    }

    return `Request failed with status ${this.status}: ${this.message}`
  }
}
