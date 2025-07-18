export interface PublicProfile {
  created_at: string;
  email: string;
  id: string;
  email_confirmed_at?: string;
  phone?: string;
  phone_confirmed_at?: string;
  last_name?: string;
  first_name?: string;
  is_fliiinker?: boolean;
  avatar?: string;
  gender: string;
  birthday?: string;
}

export interface FliiinkerServiceMtm {
  service_id: number;
  created_at: string;
  is_active: boolean;
  hourly_rate: number;
  description?: string;
  options?: any;
  fliiinker_id: string;
  tags?: string[];
  status_config: boolean;
}

export interface FliiinkerProfile {
  created_at: string;
  description?: string;
  degree?: string;
  tagline?: string;
  status: string;
  is_pro: boolean;
  is_validated: boolean;
  avatar?: string;
  id: string;
  spoken_languages?: any[];
  status_config?: boolean;
  supa_powa?: any[];
  fliiinker_pictures?: any;
  Pictures1?: string;
  Pictures2?: string;
  Pictures3?: string;
  sponsor_code?: string;
}

export interface Address {
  id: number;
  created_at: string;
  name: string;
  street: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  is_default: boolean;
  user_id: string;
  city?: string;
}

export interface AdministrativeData {
  id: number;
  created_at: string;
  country: string;
  social_security_number?: string;
  ssn_is_valid: boolean;
  has_driver_liscence: boolean;
  has_car: boolean;
  iban?: string;
  siret?: string;
  id_card_verification_status?: string;
  fliiinker_profile_id?: string;
  status_config: boolean;
  is_entrepreneur?: boolean;
  public_profile_id?: string;
}

export interface AddressLocation {
  address_id: number;
  service_id: number;
  user_id: string;
  location: any;
  radius_max: number;
  hourly_rate: number;
  fliiinker_name: string;
  fliiinker_is_pro: boolean;
  fliiinker_is_validated: boolean;
  fliiinker_rating?: number;
  fliiinker_avatar?: string;
  service_name?: string;
  hourly_rate_with_fees?: number;
}

export interface Service {
  id: number;
  created_at: string;
  name: string;
  description?: string;
  body?: any;
  is_published: boolean;
  updated_at: string;
  order: number;
  service_zone?: any;
  questions_for_client: any;
  description_answer_heading?: string;
  description_plum?: string;
  superpower: any;
}

export interface FliiinkerData {
  profile: PublicProfile;
  fliiinkerProfile?: FliiinkerProfile;
  services: FliiinkerServiceMtm[];
  serviceDetails: Service[];
  addresses: Address[];
  administrativeData?: AdministrativeData;
  addressLocations: AddressLocation[];
}

export type DecisionAction = 'approve' | 'reject' | 'pending' | 'review'; 