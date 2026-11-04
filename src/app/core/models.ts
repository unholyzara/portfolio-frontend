export interface PersonalInfo {
  name: string;
  surname: string;
  job_role: string;
  email: string;
  phone_number: string
}

export interface Overview {
  text: string;
}

export interface SpokenLanguage {
  uuid: string;
  name: string;
  level: string;
}

export interface Education {
  uuid: string;
  institution: string;
  qualification: string;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  description: string;
}

export interface Company {
  uuid: string;
  name: string;
  website: string | null;
}

export type SkillType = 'technical' | 'soft';

export interface Skill {
  uuid: string;
  name: string;
  description: string | null;
  typology: SkillType;
}

export interface Technology {
  uuid: string;
  name: string;
  typology_display: string;
  level: string;
}

export interface WorkExperience {
  uuid: string;
  title: string;
  description: string | null;
  company: Company;
  start_date: string;
  end_date: string | null;
  technical_skills: Skill[];
  soft_skills: Skill[];
  technologies: Technology[];
}

export interface WorkResponsibility {
  uuid: string
  description: string
  order: number
  work_experience: WorkExperience
}

export interface ProjectRepository {
  uuid: string;
  project: string;
  url: string;
  label: string
}

export interface Project {
  uuid: string;
  title: string;
  description: string | null;
  technologies: Technology[];
  work_experience: WorkExperience | null;
}
