// hooks/useTransactionsFilters.ts

import { useState, useCallback } from "react";
import type {
  TransactionTab,
  TransactionStatus,
  TransactionsFilters,
} from "@/types/transaction";

export const useTransactionsFilters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus>("all");
  const [activeTab, setActiveTab] = useState<TransactionTab>("all");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Handlers accept string and cast internally
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as TransactionTab);
    setCurrentPage(1);
    setStatusFilter("all");
  }, []);

  const handleStatusFilterChange = useCallback((status: string) => {
    setStatusFilter(status as TransactionStatus);
    setCurrentPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: string) => {
    setPageSize(Number(size));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    filters: {
      searchTerm,
      statusFilter,
      activeTab,
      pageSize,
      currentPage,
    } as TransactionsFilters,
    handlers: {
      handleSearchChange,
      handleTabChange,
      handleStatusFilterChange,
      handlePageSizeChange,
      handlePageChange,
    },
  };
};
