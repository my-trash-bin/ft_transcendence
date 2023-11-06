import { IRepository } from './interface/IRepository';
import { RequestContext } from './RequestContext';

export interface ApplicationImportsFromInfrastructure {
  repository: IRepository;
}

export interface ApplicationImports
  extends ApplicationImportsFromInfrastructure {
  requestContext: RequestContext;
}
