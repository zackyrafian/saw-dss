export interface Project {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ProjectsResponse {
    projects: Project[];
    metadata: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }

  export interface Criteria {
    id: number;
    name: string;
    weight: number;
    type: 'COST' | 'BENEFIT';
  }
  export interface Alternative {
    id: number;
    name: string;
    description?: string;
  }

  export interface ProjectDetail extends Project {
    criterias: Criteria[];
    alternatives: Alternative[];
  }
  

  export interface EvaluationValue {
    criteriaId: number;
    alternativeId: number;
    value: number;
  }
  
  interface EvaluationMatrixProps {
    projectId: number;
    criterias: Criteria[];
    alternatives: Alternative[];
    onSave: () => void;
  }