export interface TrueMap {
  [s: string]: true;
}

export interface Subprojects {
  auth: boolean;
  database: boolean;
  firestore: boolean;
  storage: boolean;
}

export interface Config {
  content?: string;
  last_updated?: Date;
  last_updated_from_now?: string;
  name?: string;
  pages?: TrueMap;
  parent?: string;
  platforms?: TrueMap;
  related?: TrueMap;
  stars?: number;
  subprojects?: Subprojects;
  tags?: TrueMap;
  type?: string;
  letter?: string;
  color?: string;
  repo?: string;
  org?: string;
  description?: string;
  last_fetched?: Date;
  last_fetched_from_now?: string;
}
