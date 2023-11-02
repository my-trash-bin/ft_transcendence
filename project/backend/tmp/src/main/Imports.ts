import { IPubSubService } from './base/interface/IPubSubService';
import { Repository } from './base/Repository';
import { RequestContext } from './base/RequestContext';

export interface Imports {
  repository: Repository;
  requestContext: RequestContext;

  pubSubService: IPubSubService;
}
