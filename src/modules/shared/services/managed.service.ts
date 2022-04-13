import { EntityManager } from 'typeorm'

export class ManagedService {
  public manager: EntityManager

  public setManager(manager: EntityManager): void {
    this.manager = manager
  }

  public cleanManager(): void {
    this.manager = null
  }
}
