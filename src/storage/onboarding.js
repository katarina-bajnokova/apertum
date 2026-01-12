const ONBOARDING_KEY = "apertum.onboardingComplete";

export function isOnboardingComplete() {
  return localStorage.getItem(ONBOARDING_KEY) === "true";
}

export function markOnboardingComplete() {
  localStorage.setItem(ONBOARDING_KEY, "true");
}

export function resetOnboarding() {
  localStorage.removeItem(ONBOARDING_KEY);
}
