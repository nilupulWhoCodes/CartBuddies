import { StyleSheet } from 'react-native';
import { AppTheme } from '@/themes';

export const textFieldStyles = (theme: AppTheme, isFocused: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: isFocused ? theme.colors.primary : theme.colors.gray7Bg,
      borderRadius: 4,
    },
    icon: {
      marginHorizontal: 13,
    },
    contentStyle: {
      paddingBottom: 0.1,
      alignItems: 'flex-start',
    },
    errorMessage: {
      color: theme.colors.error,
      ...theme.fonts.info_subModule,
    },
    textStyles: {
      ...theme.fonts.body,
    },
  });
