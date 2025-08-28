import { Environment, EnvSpecificConfig } from '@/types';

const ENVIRONMENT_VS_API_URL: EnvSpecificConfig<string> = {
  local: `https://localhost:44320`,
  integration: 'https://starconnector.vsstaging.com',
  staging: 'https://starconnector.vsstaging.com',
  production: 'https://starmech.vividconnector.com',
};

// cspell:disable
const ENVIRONMENT_VS_APP_CLIENT_ID: EnvSpecificConfig<string> = {
  local: 'rewfea6m9enlzs1elq6c5ifdhz9rme8',
  integration: 'rewfea6m9enlzs1elq6c5ifdhz9rme8',
  staging: 'rewfea6m9enlzs1elq6c5ifdhz9rme8',
  production: 'rewfea6m9enlzs1elq6c5ifdhz9rme8',
};
// cspell:enable

const DEFAULT_ENVIRONMENT =
  import.meta.env.VITE_IS_LOCAL_ENVIRONMENT === 'TRUE' ? Environment.Local : Environment.Production;

export function getVSAPIBaseURL(environment?: Environment) {
  return ENVIRONMENT_VS_API_URL[
    environment ?? window.B3?.setting?.environment ?? DEFAULT_ENVIRONMENT
  ];
}

export function getVSAppClientId(environment?: Environment) {
  return ENVIRONMENT_VS_APP_CLIENT_ID[
    environment ?? window.B3?.setting?.environment ?? DEFAULT_ENVIRONMENT
  ];
}

export interface DataSourceRequest {
  page: number;
  pageSize: number;
  skip: number;
  sort: SortDescriptor[];
  filter: Partial<FilterDescriptor>;
  companyId: string;
  companyIds: number[];
}

export interface SortDescriptor {
  field: string;
  dir: string;
}

export interface FilterDescriptor {
  logic: string;
  filters: Partial<FilterDescriptor>[];
  field: string;
  operator: string;
  value: any;
}

const queryParse = <T>(query: T): string => {
  let queryText = '';

  Object.keys(query || {}).forEach((key: string) => {
    queryText += `${key}=${(query as any)[key]}&`;
  });
  return queryText.slice(0, -1);
};

export { queryParse };
