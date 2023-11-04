import { RequestContext } from 'node-fetch';
import { IRepository } from './interface/IRepository';

export interface ApplicationImportsFromInfrastructure {
  repository: IRepository;
}

export interface ApplicationImports
  extends ApplicationImportsFromInfrastructure {
  requestContext: RequestContext;
}
