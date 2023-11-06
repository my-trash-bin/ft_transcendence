import { RequestContext } from './RequestContext';
import { IRepository } from './interface/IRepository';

export interface ApplicationImportsFromInfrastructure {
  repository: IRepository;
}

export interface ApplicationImportsFromApi {
  requestContext: RequestContext;
}

export interface ApplicationImports
  extends ApplicationImportsFromInfrastructure,
    ApplicationImportsFromApi {}
