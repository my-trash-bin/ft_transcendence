import React from 'react';
import { Api } from '../../..//api/api';

export type ApiContextType = Api<unknown>;
export const ApiContext = React.createContext<ApiContextType>(
  undefined as unknown as Api<unknown>,
);
