import { API_RESPONSIBILITY, API_STATUS, API_TYPE } from '../enums/api-details';

export interface IApiDetails {
  isCsv: boolean;
  metadataUrl?: string;
  apiUrl: string;
  type: API_TYPE;
  tableName: string;
  apiStatus: API_STATUS;
  responseKey?: string;
  responsibility: API_RESPONSIBILITY;
  message: string;
}

export interface IApiResponse {
  responsibility: API_RESPONSIBILITY;
  apiType: API_TYPE;
  statusCode: number;
  message: string;
}
