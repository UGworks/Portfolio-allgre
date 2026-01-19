export interface Project {
  id: string;
  title: string;
  category: string;
  image?: string;
  video?: string;
  link?: string;
  description?: string;
}

export interface Info {
  name: string;
  title: string;
  description: string;
  location: string;
  email: string;
  clients: string[];
  superpower?: string;
  beyondCode?: string;
  education?: {
    school: string;
    degree: string;
    awards?: string[];
  };
  experience?: {
    period: string;
    role: string;
    company: string;
    description: string;
    link?: string;
  }[];
  tools?: string[];
  socials?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

