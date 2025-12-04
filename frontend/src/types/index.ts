export type UserRole =
  | "admin"
  | "Corp FA"
  | "Direktur"
  | "CEO"
  | "CFO"
  | "Sourcing dan Procurement";

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  department: string;
  is_active: boolean;
  is_ldap_user: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export type ProposalStatus =
  | "draft"
  | "submitted"
  | "reviewing"
  | "approved"
  | "rejected"
  | "revision";

export interface InvestmentProposal {
  id: number;
  proposal_number: string;
  title: string;
  description: string;
  investment_type: string;
  estimated_cost: number;
  currency: string;
  proposal_date: string;
  expected_start_date: string;
  expected_complete_date: string;
  justification: string;
  expected_benefit: string;
  risk_analysis: string;
  status: ProposalStatus;
  submitted_by_id: number;
  submitted_by: User;
  department_id: string;
  attachments?: Attachment[];
  approvals?: Approval[];
  comments?: Comment[];
  created_at: string;
  updated_at: string;
}

export interface CreateProposalRequest {
  title: string;
  description: string;
  investment_type: string;
  estimated_cost: number;
  currency: string;
  expected_start_date: string;
  expected_complete_date: string;
  justification: string;
  expected_benefit: string;
  risk_analysis: string;
  department_id: string;
}

export interface Attachment {
  id: number;
  proposal_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_by: number;
  created_at: string;
}

export interface Approval {
  id: number;
  proposal_id: number;
  approver_id: number;
  approver: User;
  approver_role: UserRole;
  status: string;
  comments: string;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  proposal_id: number;
  user_id: number;
  user: User;
  content: string;
  created_at: string;
  updated_at: string;
}
