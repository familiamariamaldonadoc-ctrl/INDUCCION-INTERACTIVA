export type DocType = 'CC' | 'TI' | 'CE' | 'PEP' | 'PPT';

export interface ApprenticeProfile {
  name: string;
  docType: DocType;
  docNumber: string;
  program: string;
  fichaNumber: string;
  regional: string;
  center: string;
  avatar: string;
  registeredAt: string;
}

export type CategoryType = 'derecho' | 'deber' | 'prohibicion' | 'falta_sancion' | 'etapa_productiva';

export interface ChapterSection {
  id: string;
  title: string;
  badgeTag: string;
  content: string[];
  keyArticles?: string;
  practicalTip?: string;
}

export interface InductionModule {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  icon: string;
  summary: string;
  estimatedMinutes: number;
  pointsReward: number;
  sections: ChapterSection[];
  completed: boolean;
  score?: number;
}

export interface QuizQuestion {
  id: string;
  moduleId?: string;
  category: CategoryType;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  articleRef: string;
  points: number;
}

export interface CaseOption {
  text: string;
  isBestChoice: boolean;
  feedback: string;
  consequence: string;
  points: number;
}

export interface CaseDilemma {
  id: string;
  title: string;
  context: string;
  character: string;
  question: string;
  options: CaseOption[];
  articleRef: string;
  teachingPoint: string;
}

export interface CardSortItem {
  id: string;
  text: string;
  category: 'derecho' | 'deber' | 'prohibicion';
  explanation: string;
  articleRef: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface CertificateData {
  certificateId: string;
  verificationCode: string;
  apprenticeName: string;
  docType: DocType;
  docNumber: string;
  program: string;
  fichaNumber: string;
  regional: string;
  center: string;
  issueDate: string;
  scorePercentage: number;
  status: 'APROBADO' | 'EXCELENCIA';
  hoursIntensity: number;
}

export interface ApprenticeRecord {
  id: string;
  name: string;
  docType: DocType;
  docNumber: string;
  program: string;
  fichaNumber: string;
  regional: string;
  center: string;
  status: 'Certificado' | 'En Proceso' | 'Pendiente';
  scorePercentage: number;
  xp: number;
  badgesEarned: number;
  verificationCode?: string;
  registeredAt: string;
  updatedAt: string;
}

export type MilestoneCategory =
  | 'registro'
  | 'modulo'
  | 'medalla'
  | 'evaluacion'
  | 'juego'
  | 'certificado';

export interface TimelineMilestone {
  id: string;
  category: MilestoneCategory;
  title: string;
  description: string;
  timestamp: string; // ISO 8601
  xpEarned?: number;
  score?: number;
  badgeId?: string;
  badgeTitle?: string;
  moduleNumber?: number;
  status: 'completado' | 'en_progreso' | 'pendiente';
}
