export type AdvisorApiDto = {
  id?: number | null;
  name?: string | null;
  profilePictureUrl?: string | null;
  price?: string | null;
  'call-availability'?: 0 | 1 | null;
  'chat-availability'?: 0 | 1 | null;
};

export type Advisor = {
  id: number;
  name: string;
  profilePictureUrl: string;
  price: string;
  isCallAvailable: boolean;
  isChatAvailable: boolean;
};

export type AdvisorsResponse = {
  data?: AdvisorApiDto[] | null;
};

export type AdvisorAvailabilityResponse = {
  advisorId: number;
  callAvailable: boolean;
  chatAvailable: boolean;
};
