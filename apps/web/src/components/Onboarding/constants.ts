export const FOOTER_HEIGHT = 56;

const ALL_STEPS = [
  'welcome',
  'add-user-info',
  'add-username',
  'add-profile-picture',
  'add-persona',
  'recommend-users',
] as const;

export type StepName = (typeof ALL_STEPS)[number];

export const STEPS = ALL_STEPS;

export const ONBOARDING_NEXT_BUTTON_TEXT_MAP: { [key in StepName]: string | null } = {
  welcome: 'Next',
  'add-user-info': 'Next',
  'add-username': 'Next',
  'add-profile-picture': 'Skip',
  'add-persona': 'Skip',
  'recommend-users': 'Skip',
};

export const ONBOARDING_PROGRESS_BAR_STEPS: {
  [key in StepName]: {
    from: number;
    to: number;
  } | null;
} = {
  welcome: null,
  'add-username': {
    from: 10,
    to: 30,
  },
  'add-profile-picture': {
    from: 30,
    to: 50,
  },
  'add-user-info': {
    from: 50,
    to: 80,
  },
  'add-persona': {
    from: 80,
    to: 90,
  },
  'recommend-users': {
    from: 90,
    to: 95,
  },
};

export function getStepIndex(step: StepName) {
  return STEPS.indexOf(step);
}
