export interface ProjectUrl {
  text: string;
  url?: string;
  disabled?: boolean;
}

export interface Project {
  title: string;
  date: string;
  subtext: string;
  url?: string;
  urls?: ProjectUrl[];
}
