import { FileUpload } from 'graphql-upload/Upload.mjs';

export interface WrappedFileUpload {
  promise: Promise<FileUpload>;
}

export type FederatedFileUpload = FileUpload | WrappedFileUpload;
