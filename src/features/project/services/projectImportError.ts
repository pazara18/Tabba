export class ProjectImportError extends Error {
  readonly issues: string[];

  constructor(message: string, issues: string[] = [message]) {
    super(message);
    this.name = "ProjectImportError";
    this.issues = issues;
