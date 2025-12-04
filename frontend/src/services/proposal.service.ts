import api from "@/lib/axios";
import { InvestmentProposal, CreateProposalRequest, Comment } from "@/types";

export const proposalService = {
  async getProposals(status?: string): Promise<InvestmentProposal[]> {
    const params = status ? { status } : {};
    const response = await api.get<InvestmentProposal[]>("/proposals", {
      params,
    });
    return response.data;
  },

  async getProposal(id: number): Promise<InvestmentProposal> {
    const response = await api.get<InvestmentProposal>(`/proposals/${id}`);
    return response.data;
  },

  async createProposal(
    data: CreateProposalRequest
  ): Promise<InvestmentProposal> {
    const response = await api.post<InvestmentProposal>("/proposals", data);
    return response.data;
  },

  async updateProposal(
    id: number,
    data: CreateProposalRequest
  ): Promise<InvestmentProposal> {
    const response = await api.put<InvestmentProposal>(
      `/proposals/${id}`,
      data
    );
    return response.data;
  },

  async deleteProposal(id: number): Promise<void> {
    await api.delete(`/proposals/${id}`);
  },

  async submitProposal(id: number): Promise<InvestmentProposal> {
    const response = await api.post<InvestmentProposal>(
      `/proposals/${id}/submit`
    );
    return response.data;
  },

  async addComment(id: number, content: string): Promise<Comment> {
    const response = await api.post<Comment>(`/proposals/${id}/comments`, {
      content,
    });
    return response.data;
  },
};
