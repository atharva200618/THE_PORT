/**
 * The Port — Web Mobile Haptic Feedback Utility
 * Delivers native-feeling tactile vibration pulses on touch-enabled mobile devices.
 */

export function triggerHaptic(type = 'light') {
  if (typeof window === 'undefined' || !navigator.vibrate) {
    return;
  }

  try {
    switch (type) {
      case 'light':
        // Quick 12ms subtle micro-tap for pills, mode toggles, format selections
        navigator.vibrate(12);
        break;
      case 'medium':
        // 25ms tactile pop for file staging and primary button clicks
        navigator.vibrate(25);
        break;
      case 'success':
        // Dual-pulse celebration pattern (20ms tap -> 40ms pause -> 25ms pop) for conversion completion
        navigator.vibrate([20, 40, 25]);
        break;
      case 'error':
        // Warning double-buzz
        navigator.vibrate([40, 60, 40]);
        break;
      default:
        navigator.vibrate(12);
    }
  } catch (err) {
    // Graceful fallback for non-supporting browsers
  }
}
