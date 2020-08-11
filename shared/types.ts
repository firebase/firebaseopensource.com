import firebase from 'firebase'

export type Timestamp = firebase.firestore.Timestamp

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
  last_updated: string;
  last_fetched: Timestamp;
}

/**
 * A ProjectConfig as we use it in the Frontend.
 */
export interface ProjectConfig {
  id: string; // if fetched with firewings
  ref: string; // if fetched with firewings
  name: string;
  description: string;
  type?: string;
  platforms?: string[];
  content?: string;
  stars: number;

  pages?: PageConfig[];
  related?: string[];
  tabs?: Array<TabConfig>;     

  last_fetched: Date | any;  // Timestamps don't go well with Nuxt
  last_updated: Date | any;  // Timestamps don't go well with Nuxt
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
  id?: string; // if fetched with firewings
  ref?: string; // if fetched with firewings
  header: PageSection;
  sections: PageSection[];
}

export interface PageSection {
  id?: string; // if fetched with firewings
  ref?: string; // if fetched with firewings
  name: string;
  content: string;
}

export interface RepoMetadata {
  description: string;
  fork: boolean;
  stars: number;
  last_updated: any;
}

/**
 * A RepoRelease as it is stored in the database.
 */
export interface StoredRepoRelease {
  org: string;
  repo: string;
  url: string;
  tag_name: string;
  created_at: Timestamp;
}

/**
 * A RepoRelease as we use it in the frontend
 */
export interface RepoRelease {
  org: string;
  repo: string;
  url: string;
  tag_name: string;
  created_at: Date; // Timestamps don't go well with Nuxt
}
