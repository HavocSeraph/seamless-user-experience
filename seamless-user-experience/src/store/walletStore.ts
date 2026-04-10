import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTransactions, mockUser } from '@/lib/mock-data';

export type TransactionType = "EARN" | "SPEND" | "BOUNTY";

export interface Transaction {
  id: string;
  fromUserId: string | null;
  toUserId: string | null;
  amount: number;
  type: TransactionType;
  status: "COMPLETED" | "PENDING" | "FAILED";
  description: string;
  createdAt: string;
}

interface WalletState {
  balance: number;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      balance: mockUser.tokenBalance,
      transactions: mockTransactions as Transaction[],
      addTransaction: (tx) => set((state) => {
        const newTx: Transaction = {
          ...tx,
          id: `t_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        const balanceChange = tx.type === 'SPEND' ? -tx.amount : tx.amount;
        return {
          balance: state.balance + balanceChange,
          transactions: [newTx, ...state.transactions],
        };
      }),
    }),
    {
      name: 'wallet-storage',
    }
  )
);

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'wallet-storage') {
      useWalletStore.persist.rehydrate();
    }
  });
}