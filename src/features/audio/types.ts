export interface AudioStemFile {
  name: string;
  type: string;
  size: number;
  lastModified?: number;
}

export interface RuntimeStemSource {
  stemId: string;
  file: File;
}
