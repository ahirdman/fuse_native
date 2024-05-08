import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';

const feedbackStyles = {
  Light: ImpactFeedbackStyle.Light,
  Medium: ImpactFeedbackStyle.Medium,
  Heavy: ImpactFeedbackStyle.Heavy,
};

type FeedbackStyle = keyof typeof feedbackStyles;

export function hapticFeedback(style?: FeedbackStyle): void {
  void impactAsync(ImpactFeedbackStyle[style ?? 'Light']);
}

// biome-ignore lint/suspicious/noExplicitAny: generic function
export function withHapticFeedback<T extends (...args: any[]) => any>(
  fn: T,
  style?: FeedbackStyle,
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    impactAsync(ImpactFeedbackStyle[style ?? 'Light']);
    return fn(...args);
  };
}
