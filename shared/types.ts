export interface ProjectConfig {
  name?: string;
  type?: string;
  platforms?: string[];
  content?: string;

  // TODO: This is a map of string --> bool or string
  pages?: any;
  related?: string[];

  last_fetched?: any;
  last_updated?: any;
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
  created_at: Date;
}