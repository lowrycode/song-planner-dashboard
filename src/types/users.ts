export type UserRole = 0 | 1 | 2 | 3;

export interface Network {
  id: number;
  name: string;
  slug: string;
}

export interface Church {
  id: number;
  name: string;
  slug: string;
}

export interface NetworkAccess {
  id: number;
  network_id: number;
  network_name: string;
  network_slug: string;
}

export interface ChurchAccess {
  id: number;
  church_id: number;
  church_name: string;
  church_slug: string;
}

export interface ChurchActivityAccess {
  id: number;
  church_activity_id: number;
  church_activity_name: string;
  church_activity_slug: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  role: UserRole;
  created_at: string;
  network: Network;
  church: Church;
}

export interface UserAccesses {
  networks: NetworkAccess[];
  churches: ChurchAccess[];
  church_activities: ChurchActivityAccess[];
}

export interface UserWithAccesses extends User {
  accesses: UserAccesses;
}

// Used for authentication context
export interface AuthUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  network: Network;
  church: Church;
}
