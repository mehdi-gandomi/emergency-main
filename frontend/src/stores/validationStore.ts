import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { IncidentFormData } from '@/types/incident';

type ValidationErrors = Record<string, string>;

type ValidationContextValue = {
  errors: ValidationErrors;
  getError: (field: keyof IncidentFormData | string) => string | undefined;
  clearError: (field: keyof IncidentFormData | string) => void;
  setError: (field: keyof IncidentFormData | string, message: string) => void;
  validateField: (field: keyof IncidentFormData, data: IncidentFormData) => string | undefined;
  validateAll: (data: IncidentFormData) => boolean;
};

const ValidationContext = createContext<ValidationContextValue | null>(null);

const isEmpty = (v: any) => v === undefined || v === null || String(v).trim() === '';

export const ValidationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const getError = useCallback((field: keyof IncidentFormData | string) => errors[String(field)], [errors]);

  const clearError = useCallback((field: keyof IncidentFormData | string) => {
    setErrors(prev => {
      const next = { ...prev };
      delete next[String(field)];
      return next;
    });
  }, []);

  const setError = useCallback((field: keyof IncidentFormData | string, message: string) => {
    setErrors(prev => ({ ...prev, [String(field)]: message }));
  }, []);

  const validateField = useCallback((field: keyof IncidentFormData, data: IncidentFormData) => {
    let message: string | undefined;
    if (field === 'text' && String(data.type_call) === '5') {
      if (isEmpty(data.text)) message = 'این فیلد الزامی است.';
    }
    if (String(data.type_call) === '5') {
      if (field === 'province_id' && isEmpty(data.province_id)) message = 'استان الزامی است.';
      if (field === 'city_id' && isEmpty(data.city_id)) message = 'شهر الزامی است.';
      if (field === 'latitude' && isEmpty(data.latitude)) message = 'عرض جغرافیایی الزامی است.';
      if (field === 'longitude' && isEmpty(data.longitude)) message = 'طول جغرافیایی الزامی است.';
    }
    if (message) setError(field, message); else clearError(field);
    return message;
  }, [clearError, setError]);

  const validateAll = useCallback((data: IncidentFormData) => {
    const fieldsToCheck: (keyof IncidentFormData)[] = ['text', 'province_id', 'city_id', 'latitude', 'longitude'];
    const next: ValidationErrors = {};
    fieldsToCheck.forEach((f) => {
      const msg = validateField(f, data);
      if (msg) next[String(f)] = msg;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [validateField]);

  const value = useMemo<ValidationContextValue>(() => ({
    errors,
    getError,
    clearError,
    setError,
    validateField,
    validateAll,
  }), [errors, getError, clearError, setError, validateField, validateAll]);

  return React.createElement(ValidationContext.Provider, { value }, children as React.ReactNode);
};

export const useValidationStore = () => {
  const ctx = useContext(ValidationContext);
  if (!ctx) throw new Error('useValidationStore must be used within ValidationProvider');
  return ctx;
};




