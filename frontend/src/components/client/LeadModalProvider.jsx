"use client";

import { createContext, useContext, useCallback, useState } from "react";
import LeadFormModal from "./LeadFormModal";

const LeadModalContext = createContext(null);

export function LeadModalProvider({ children, defaultProduct = null }) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(defaultProduct);

  const openLeadModal = useCallback((nextProduct = null) => {
    setProduct(nextProduct);
    setOpen(true);
  }, []);

  const closeLeadModal = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <LeadModalContext.Provider value={{ openLeadModal, closeLeadModal }}>
      {children}
      {open && <LeadFormModal product={product} onClose={closeLeadModal} />}
    </LeadModalContext.Provider>
  );
}

export const useLeadModal = () => {
  const context = useContext(LeadModalContext);
  if (!context) {
    throw new Error("useLeadModal must be used within LeadModalProvider");
  }
  return context;
};