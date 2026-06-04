export interface Donation {
  id: string;
  orderCode: number;
  amount: number;
  donorName: string;
  message: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface DonorLeaderboardEntry {
  donorName: string;
  totalAmount: number;
}

export interface DonationStats {
  totalAmount: number;
  donationCount: number;
  topDonors: DonorLeaderboardEntry[];
  recentDonations: {
    id: string;
    amount: number;
    donorName: string;
    message: string | null;
    paidAt: string | null;
  }[];
}

export interface CreateDonationPayload {
  amount: number;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  message?: string;
  isAnonymous?: boolean;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface CreateDonationResponse {
  id: string;
  orderCode: number;
  amount: number;
  checkoutUrl: string;
  status: string;
}
