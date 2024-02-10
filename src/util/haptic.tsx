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
