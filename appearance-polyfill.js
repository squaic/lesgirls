import { Platform, Appearance } from 'react-native';

if (Platform.OS === 'web') {
  Appearance.setColorScheme = (scheme) => {
    document.documentElement.setAttribute('data-theme', scheme);
  };
  Appearance.getColorScheme = () => {
    const systemValue = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const userValue = document.documentElement.getAttribute('data-theme');
    return userValue && userValue !== 'null' ? userValue : systemValue;
  };
  Appearance.addChangeListener = (listener) => {
    const systemValueListener = (event) => {
      const next = event.matches ? 'dark' : 'light';
      const userValue = document.documentElement.getAttribute('data-theme');
      listener({ colorScheme: userValue && userValue !== 'null' ? userValue : next });
    };
    const systemValue = window.matchMedia('(prefers-color-scheme: dark)');
    systemValue.addEventListener('change', systemValueListener);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) if (mutation.attributeName === 'data-theme') listener({ colorScheme: Appearance.getColorScheme() });
    });
    observer.observe(document.documentElement, { attributes: true });
    return { remove() { systemValue.removeEventListener('change', systemValueListener); observer.disconnect(); } };
  };
}
