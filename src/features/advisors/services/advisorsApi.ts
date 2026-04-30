import { advisorsMock } from '../mocks/advisors.mock';
import {
  ADVISORS_AVAILABILITY_URL,
  ADVISORS_LISTINGS_URL,
  ADVISORS_MOCK_LIST_DELAY_MS,
  ADVISORS_USE_MOCK,
} from '../config/advisors.config';
import type { Advisor, AdvisorApiDto, AdvisorAvailabilityResponse } from '../types/advisor.types';

const mockAvailabilityCallCountByAdvisorId = new Map<number, number>();
const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
const FALLBACK_AVATAR_URL = 'https://via.placeholder.com/72?text=A';

function normalizeBooleanAvailability(value: unknown): boolean {
  if (value === 1 || value === true || value === '1') return true;
  return false;
}

function normalizeAdvisorId(value: unknown, fallbackId: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallbackId;
}

function mapAdvisor(dto: AdvisorApiDto, index: number): Advisor {
  const id = normalizeAdvisorId(dto.id, index + 1);
  const name = typeof dto.name === 'string' && dto.name.trim().length > 0 ? dto.name : `Advisor #${id}`;
  const profilePictureUrl =
    typeof dto.profilePictureUrl === 'string' && dto.profilePictureUrl.trim().length > 0
      ? dto.profilePictureUrl
      : FALLBACK_AVATAR_URL;
  const price = typeof dto.price === 'string' && dto.price.trim().length > 0 ? dto.price : 'N/A';

  return {
    id,
    name,
    profilePictureUrl,
    price,
    isCallAvailable: normalizeBooleanAvailability(dto['call-availability']),
    isChatAvailable: normalizeBooleanAvailability(dto['chat-availability']),
  };
}

function parseAdvisorsPayload(payload: unknown): Advisor[] {
  if (!payload || typeof payload !== 'object') return [];

  const rawData = (payload as { data?: unknown }).data;
  if (!Array.isArray(rawData)) return [];

  return rawData.map((dto, index) => mapAdvisor((dto ?? {}) as AdvisorApiDto, index));
}

function parseAdvisorAvailabilityPayload(payload: unknown, advisorId: number): AdvisorAvailabilityResponse {
  if (!payload || typeof payload !== 'object') {
    return { advisorId, callAvailable: false, chatAvailable: false };
  }

  const value = payload as Record<string, unknown>;

  return {
    advisorId: normalizeAdvisorId(value.advisorId, advisorId),
    callAvailable: normalizeBooleanAvailability(value.callAvailable),
    chatAvailable: normalizeBooleanAvailability(value.chatAvailable),
  };
}

function getMockAdvisors(): Advisor[] {
  const mockData = advisorsMock.data ?? [];
  return mockData.map((dto, index) => mapAdvisor(dto, index));
}

export async function getAdvisors(): Promise<Advisor[]> {
  if (ADVISORS_USE_MOCK) {
    await sleep(ADVISORS_MOCK_LIST_DELAY_MS);
    return getMockAdvisors();
  }

  try {
    const response = await fetch(ADVISORS_LISTINGS_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch advisors (status ${response.status})`);
    }

    const payload: unknown = await response.json();
    const advisors = parseAdvisorsPayload(payload);
    if (advisors.length === 0) {
      throw new Error('Listings payload did not include advisors data.');
    }

    return advisors;
  } catch {
    // Fallback keeps the app usable when the demo endpoint is down/unreachable.
    await sleep(ADVISORS_MOCK_LIST_DELAY_MS);
    return getMockAdvisors();
  }
}

export async function getAdvisorAvailability(advisorId: number): Promise<AdvisorAvailabilityResponse> {
  if (ADVISORS_USE_MOCK) {
    const advisor = (advisorsMock.data ?? []).find((item) => item.id === advisorId);
    const baseCallAvailable = advisor ? advisor['call-availability'] === 1 : false;
    const baseChatAvailable = advisor ? advisor['chat-availability'] === 1 : false;

    if (import.meta.env.MODE === 'test') {
      return {
        advisorId,
        callAvailable: baseCallAvailable,
        chatAvailable: baseChatAvailable,
      };
    }

    const currentCallCount = mockAvailabilityCallCountByAdvisorId.get(advisorId) ?? 0;
    const nextCallCount = currentCallCount + 1;
    mockAvailabilityCallCountByAdvisorId.set(advisorId, nextCallCount);

    const shouldFlipAvailability = nextCallCount % 2 === 0;

    return {
      advisorId,
      callAvailable: shouldFlipAvailability ? !baseCallAvailable : baseCallAvailable,
      chatAvailable: shouldFlipAvailability ? !baseChatAvailable : baseChatAvailable,
    };
  }

  try {
    const response = await fetch(`${ADVISORS_AVAILABILITY_URL}?advisorId=${advisorId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch availability for advisor ${advisorId}`);
    }

    const payload: unknown = await response.json();
    return parseAdvisorAvailabilityPayload(payload, advisorId);
  } catch {
    return {
      advisorId,
      callAvailable: false,
      chatAvailable: false,
    };
  }
}
