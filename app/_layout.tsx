import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { CombinedDarkTheme, CombinedLightTheme } from '@/themes';
import Inter from '../assets/fonts/Inter.ttf';
import InterBold from '@assets/fonts/InterBold.ttf';
import InterMedium from '@assets/fonts/InterMedium.ttf';
import InterSemiBold from '@assets/fonts/InterSemiBold.ttf';
import PoppinsBold from '@assets/fonts/Poppins-Bold.ttf';
import PoppinsMedium from '@assets/fonts/Poppins-Medium.ttf';
import PoppinsRegular from '@assets/fonts/Poppins-Regular.ttf';
import PoppinsSemiBold from '@assets/fonts/Poppins-SemiBold.ttf';
import { useColorScheme } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/hooks/useLocalization';
import { SessionProvider } from '@/contexts/authContext';
import InAppNotification from '@/components/InappNotification/InappNotification';
import { NotificationProvider } from '@/contexts/NotificationContext';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'poppins-regular': PoppinsRegular,
    'poppins-bold': PoppinsBold,
    inter: Inter,
    'inter-medium': InterMedium,
    'poppins-semibold': PoppinsSemiBold,
    'inter-bold': InterBold,
    'inter-semibold': InterSemiBold,
    'poppins-medium': PoppinsMedium,
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const paperTheme =
    colorScheme === 'light' ? CombinedLightTheme : CombinedDarkTheme;

  return (
    <SessionProvider>
      <NotificationProvider>
        <I18nextProvider i18n={i18n}>
          <PaperProvider theme={paperTheme}>
            <Slot initialRouteName="(public)" />
            <InAppNotification />
          </PaperProvider>
        </I18nextProvider>
      </NotificationProvider>
    </SessionProvider>
  );
}
