export class ProjectImportError extends Error {
  readonly issues: string[];

  constructor(message: string, issues: string[] = [message]) {
