export interface StringMap<T> {
  [s: string]: T;
}

export enum Env {
  STAGING = "staging",
  PROD = "prod",
}

export class GetParams {
  env: Env = Env.PROD;
  branch: string = "master";
}

/**
 * A ProjectConfig as it is stored in the database.
 */
export interface StoredProjectConfig {
  // Basic repo information
  name: string;
  description?: string;
  stars: number;

  // Content and other display info
  content: string;
  pages?: Array<PageConfig>;

  // Optional page elements
  related?: StringMap<boolean>;
  tabs?: Array<TabConfig>; 

  // Categorization info
  platforms: StringMap<boolean>;
  blacklist: boolean;
  fork: boolean;

  // Timestamps
  last_updated?: string;
  // TODO: This is a timestamp
  last_fetched?: any;
}

export interface ProjectConfig {
  name?: string;
  type?: string;
  platforms?: string[];
  content?: string;

  pages?: PageConfig[];
  related?: string[];

  last_fetched?: any;
  last_updated?: any;
}

export interface PageConfig {
  name?: string;
  path: string;
}

export interface TabConfig {
  href: string;
  title: string;
}

export interface ProjectPage {
  name: string;
  content: PageContent;
}

export interface PageContent {
  header: PageSection;
  sections: PageSection[];
}

export interface PageSection {
  name: string;
  content: string;
}

export interface RepoMetadata {
  description: string;
  fork: boolean;
  stars: number;
  last_updated: any;
}

export interface RepoRelease {
  org: string;
  repo: string;
  url: string;
  tag_name: string;
  created_at: Timestamp;
}

export interface Timestamp {
  seconds: number;
}