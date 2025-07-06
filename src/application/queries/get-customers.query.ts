export class GetCustomersQuery {
  constructor(
    public readonly limit?: number,
    public readonly offset?: number,
  ) {}
}

export class GetCustomerByIdQuery {
  constructor(public readonly id: string) {}
}

export class GetCustomerByEmailQuery {
  constructor(public readonly email: string) {}
} 