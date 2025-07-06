import { Customer } from '../entities/customer.entity';

export interface ICustomerRepository {
  // Create
  create(customer: Customer): Promise<Customer>;
  
  // Read
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findByFullNameAndDateOfBirth(
    firstName: string, 
    lastName: string, 
    dateOfBirth: Date
  ): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  findMany(limit?: number, offset?: number): Promise<Customer[]>;
  
  // Update
  update(customer: Customer): Promise<Customer>;
  
  // Delete
  delete(id: string): Promise<void>;
  
  // Business logic queries
  existsByEmail(email: string): Promise<boolean>;
  existsByFullNameAndDateOfBirth(
    firstName: string, 
    lastName: string, 
    dateOfBirth: Date
  ): Promise<boolean>;
  
  // Count
  count(): Promise<number>;
} 