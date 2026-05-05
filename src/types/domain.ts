export type OptionItem = {
  id: string;
  label: string;
};

export type DashboardStats = {
  photos: number;
  people: number;
  locations: number;
  events: number;
  pending: number;
  memoirs: number;
};

export type FamilyTreeNode = {
  id: string;
  name: string;
  relationName?: string | null;
  avatarUrl?: string | null;
  isSelf: boolean;
  parents: string[];
  spouses: string[];
  children: string[];
};
