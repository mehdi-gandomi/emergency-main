import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { IncidentFormData } from '@/types/incident';
import { IncidentDeclarationSource } from '@/types/enums/incidentDeclarationSource';
import { PublicSource } from '@/types/enums/publicSource';

type ValidationErrors = Record<string, string>;

type ValidationContextValue = {
  errors: ValidationErrors;
  getError: (field: keyof IncidentFormData | string) => string | undefined;
  getAllErrors: () => ValidationErrors;
  clearError: (field: keyof IncidentFormData | string) => void;
  setError: (field: keyof IncidentFormData | string, message: string) => void;
  validateField: (field: keyof IncidentFormData, data: IncidentFormData) => string | undefined;
  validateAll: (data: IncidentFormData) => boolean;
};

const ValidationContext = createContext<ValidationContextValue | null>(null);

const isEmpty = (v: any) => v === undefined || v === null || String(v).trim() === '' || (Array.isArray(v) && v.length === 0);

export const ValidationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const getError = useCallback((field: keyof IncidentFormData | string) => errors[String(field)], [errors]);

  const getAllErrors = useCallback(() => errors, [errors]);

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
    if(field == 'mobile' && isEmpty(data.mobile)) {
      message = 'شماره تماس گیرنده الزامی است.';
    }
    // Validation for fields that should not contain digits
    if (field === 'main_complaint' && data.main_complaint) {
      if (/[0-9]/.test(data.main_complaint)) {
        message = 'شکایت اصلی نمی‌تواند شامل عدد باشد.';
      }
    }
    if (field === 'caller_name' && data.caller_name) {
      if (/[0-9]/.test(data.caller_name)) {
        message = 'نام تماس گیرنده نمی‌تواند شامل عدد باشد.';
      }
    }
    if (field === 'caller_lastname' && data.caller_lastname) {
      if (/[0-9]/.test(data.caller_lastname)) {
        message = 'نام خانوادگی تماس گیرنده نمی‌تواند شامل عدد باشد.';
      }
    }
    
    if (String(data.type_call) === '9') {
      if(field == 'device' && isEmpty(data.device)) {
        message = 'نام دستگاه الزامی است.';
      }
     
    }
    if (String(data.type_call) === '2') {
      if(field == 'event_follow_id' && isEmpty(data.event_follow_id)) {
        message = 'حادثه مرتبط الزامی است.';
      }
      if(field == 'follow_up_type' && isEmpty(data.follow_up_type)) {
        message = 'نوع پیگیری الزامی است.';
      }
      
    }
    if (String(data.type_call) === '5') {
      if (field === 'incident_declaration_source' && (isEmpty(data.incident_declaration_source) || data.incident_declaration_source === 0)) {
        message = 'منبع اعلام حادثه الزامی است.';
      }
      if (field === 'province_id' && isEmpty(data.province_id)) message = 'استان الزامی است.';
      if (field === 'city_id' && isEmpty(data.city_id)) message = 'شهر الزامی است.';
      if (field === 'latitude' && isEmpty(data.latitude)) message = 'عرض جغرافیایی الزامی است.';
      if (field === 'longitude' && isEmpty(data.longitude)) message = 'طول جغرافیایی الزامی است.';
      if (field === 'text' && isEmpty(data.text)) message = 'شرح مختصر حادثه الزامی است.';
      if (field === 'help_triage_result' && isEmpty(data.help_triage_result)) message = 'نتیجه تریاژ نجات الزامی است.';
      if (field === 'event_people_num' && isEmpty(data.event_people_num)) message = 'تعداد افراد حادثه دیده الزامی است.';
      if(field == 'caller_name' && isEmpty(data.caller_name) && data.incident_declaration_source == IncidentDeclarationSource.PUBLIC) message = 'نام تماس گیرنده الزامی است.';
      if(field == 'caller_lastname' && isEmpty(data.caller_lastname) && data.incident_declaration_source == IncidentDeclarationSource.PUBLIC) message = 'نام خانوادگی تماس گیرنده الزامی است.';
      if(field == 'mission_result' && data.help_triage_result == '2' && isEmpty(data.mission_result)) message = 'توضیحات هدایت کارشناس الزامی است.';

      // Validation for OperationalTeamDispatchSection fields
      if (data.incident_declaration_source === IncidentDeclarationSource.PUBLIC) {
        if (field === 'incident_source_location' && (isEmpty(data.incident_source_location) || data.incident_source_location === 0)) {
          message = 'وضعیت حضور در صحنه الزامی است.';
        }
        if (field === 'public_source' && (isEmpty(data.public_source) || data.public_source === 0)) {
          message = 'نسبت تماس گیرنده با فرد حادثه دیده الزامی است.';
        }
        if (field === 'relative_type' && data.public_source === PublicSource.RELATIVES && isEmpty(data.relative_type)) {
          message = 'نوع خویشاوندی الزامی است.';
        }
      }
      
      if (data.incident_declaration_source === IncidentDeclarationSource.ORGANIZATIONAL) {
        if (field === 'organizational_type' && isEmpty(data.organizational_type)) {
          message = 'نوع سازمان الزامی است.';
        }
        if (field === 'organizational_source' && (!Array.isArray(data.organizational_source) || data.organizational_source.length === 0)) {
          message = 'انتخاب نوع سازمان الزامی است.';
        }
      }
      if(field == 'operational_teams' && (!Array.isArray(data.operational_teams) || data.operational_teams.length === 0)) {
        message = 'نوع تیم عملیاتی الزامی است.';
      }
      if(field == 'required_vehicles' && (!Array.isArray(data.required_vehicles) || data.required_vehicles.length === 0)) {
        message = 'نوع خودرو الزامی است.';
      }
   
    }
    if(String(data.type_call) == '8') {
      if(field == 'mission_cancel_reason' && isEmpty(data.mission_cancel_reason)) {
        message = 'دلیل لغو مأموریت الزامی است.';
      }
      if(field == 'event_follow_id' && isEmpty(data.event_follow_id)) {
        message = 'حادثه مرتبط الزامی است.';
      }
      if(field == 'cancel_source' && isEmpty(data.cancel_source)) {
        message = 'منبع لغو کننده الزامی است.';
      }
      
      // Validation for cancel source fields
      if (data.cancel_source === String(IncidentDeclarationSource.PUBLIC)) {
        if (field === 'cancel_incident_declaration_source' && (isEmpty(data.cancel_incident_declaration_source) || data.cancel_incident_declaration_source === 0)) {
          message = 'وضعیت حضور در صحنه الزامی است.';
        }
        if (field === 'cancel_public_source' && (isEmpty(data.cancel_public_source) || String(data.cancel_public_source) === '0')) {
          message = 'نوع منبع مردمی الزامی است.';
        }
        if (field === 'cancel_relative_type' && String(data.cancel_public_source) === String(PublicSource.RELATIVES) && isEmpty(data.cancel_relative_type)) {
          message = 'نوع خویشاوندی الزامی است.';
        }
        if (field === 'caller_name'  && isEmpty(data.caller_name)) {
          message = 'نام تماس گیرنده الزامی است.';
        }
        if (field === 'caller_lastname'  && isEmpty(data.caller_lastname)) {
          message = 'نام خانوادگی تماس گیرنده الزامی است.';
        }
      }
      
      if (data.cancel_source === String(IncidentDeclarationSource.ORGANIZATIONAL)) {
        if (field === 'cancel_organizational_type' && isEmpty(data.cancel_organizational_type)) {
          message = 'نوع سازمان الزامی است.';
        }
        if (field === 'cancel_organizational_source' && (!Array.isArray(data.cancel_organizational_source) || data.cancel_organizational_source.length === 0)) {
          message = 'انتخاب نوع سازمان الزامی است.';
        }
      }
    }
    if (message) setError(field, message); else clearError(field);
    return message;
  }, [clearError, setError]);

  const validateAll = useCallback((data: IncidentFormData) => {
    // All fields that might have validation rules
    const fieldsToCheck: (keyof IncidentFormData)[] = [
      'text',
      'device',
      'custom_device_name',
      'incident_declaration_source',
      'province_id',
      'city_id',
      'latitude',
      'longitude',
      'help_triage_result',
      'event_people_num',
      'caller_name',
      'caller_lastname',
      'main_complaint',
      'incident_source_location',
      'public_source',
      'relative_type',
      'organizational_type',
      'organizational_source',
      'mission_result',
      'operational_teams',
      'required_vehicles',
      'mission_types',
      'mission_cancel_reason',
      'event_follow_id',
      'follow_up_type',
      'cancel_source',
      'cancel_incident_declaration_source',
      'cancel_public_source',
      'cancel_relative_type',
      'cancel_organizational_type',
      'cancel_organizational_source',
      'mobile'
    ];
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
    getAllErrors,
    clearError,
    setError,
    validateField,
    validateAll,
  }), [errors, getError, getAllErrors, clearError, setError, validateField, validateAll]);

  return React.createElement(ValidationContext.Provider, { value }, children as React.ReactNode);
};

export const useValidationStore = () => {
  const ctx = useContext(ValidationContext);
  if (!ctx) throw new Error('useValidationStore must be used within ValidationProvider');
  return ctx;
};




