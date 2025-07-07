import { AppTheme, useAppTheme } from '@/themes';
import { DailyPurchase, WeeklyPurchases } from '@/types/WeeklyPurchasesTypes';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AnimatedFAB, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from '@/firebaseConfig';
import { useSession } from '@/contexts/authContext';
const db = getFirestore(app);
const isIOS = Platform.OS === 'ios';

const WEEKLY_PURCHASES: WeeklyPurchases = {
  week1: [
    {
      id: '1',
      day: 'Monday 01',
      items: [
        { label: 'Rice', value: '2kg' },
        { label: 'Milk', value: '1L' },
      ],
    },
    {
      id: '2',
      day: 'Tuesday 02',
      items: [{ label: 'Bread', value: '1 loaf' }],
    },
  ],
  week2: [
    {
      id: '3',
      day: 'Monday 08',
      items: [
        { label: 'Eggs', value: '12' },
        { label: 'Butter', value: '200g' },
      ],
    },
  ],
  week3: [
    {
      id: '4',
      day: 'Wednesday 15',
      items: [{ label: 'Chicken', value: '1kg' }],
    },
  ],
  week4: [
    { id: '5', day: 'Thursday 22', items: [{ label: 'Fruits', value: '1kg' }] },
  ],
};

export default function Home() {
  const theme = useAppTheme();
  const { session } = useSession();

  console.log(session);

  const styles = getStyles(theme);
  const [isExtended, setIsExtended] = React.useState(true);
  const [value, setValue] = React.useState<
    'week1' | 'week2' | 'week3' | 'week4'
  >('week1');

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(event.nativeEvent.contentOffset.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  const data = WEEKLY_PURCHASES[value];

  const renderItem = ({ item }: { item: DailyPurchase }) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>{item.day}</Text>
      </View>
      <View style={styles.cardBody}>
        {item.items.map((i, idx) => (
          <View key={idx} style={styles.cardBodyRow}>
            <View style={styles.valueLabelContainer}>
              <Text style={styles.label}>{i.label}</Text>
              <Text style={styles.value}>{i.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          backgroundColor: theme.colors.primary,
          marginHorizontal: 20,
          borderRadius: 20,
          paddingVertical: 25,
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            ...theme.fonts.interSemiSubTitle,
            color: theme.colors.background,
          }}
        >
          Total Balance
        </Text>
        <Text
          style={{
            ...theme.fonts.interBoldTitleLg,
            color: theme.colors.background,
          }}
        >
          2,548
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}
        >
          <View>
            <Text
              style={{
                ...theme.fonts.interMedSubTitle,
                color: theme.colors.secondary,
              }}
            >
              Income
            </Text>
            <Text
              style={{
                ...theme.fonts.interSemiHeader,
                color: theme.colors.background,
              }}
            >
              1233
            </Text>
          </View>
          <View>
            <Text
              style={{
                ...theme.fonts.interMedSubTitle,
                color: theme.colors.secondary,
              }}
            >
              Expenses
            </Text>
            <Text
              style={{
                ...theme.fonts.interSemiHeader,
                color: theme.colors.background,
              }}
            >
              1233
            </Text>
          </View>
        </View>
      </View>

      {/* <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.body}
        onScroll={onScroll}
      /> */}

      <AnimatedFAB
        icon={'plus'}
        label={'Label'}
        extended={isExtended}
        onPress={() => router.push('/(auth)/add/addGrocery')}
        visible={true}
        animateFrom={'right'}
        style={styles.fabStyle}
        color={theme.colors.background}
      />
    </SafeAreaView>
  );
}

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: 16,
    },
    header: {
      paddingHorizontal: 16,
    },
    headerTitle: {
      ...theme.fonts.headerLarge,
      color: theme.colors.black,
    },
    headerName: {
      color: theme.colors.primary,
    },
    segmentedButtons: {
      marginTop: 4,
    },
    body: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    fabStyle: {
      position: 'absolute',
      right: 16,
      bottom: 16,
      backgroundColor: theme.colors.primary,
      borderRadius: 28,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3.84,
    },
    cardContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 16,
      marginVertical: 10,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    cardHeader: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borders,
      paddingBottom: 6,
    },
    cardHeaderText: {
      color: theme.colors.primary,
      ...theme.fonts.headerSmall,
    },
    cardBody: {
      paddingTop: 8,
    },
    cardBodyRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 4,
    },
    valueLabelContainer: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-between',
    },
    value: {
      color: theme.colors.gray1Text,
      ...theme.fonts.value,
    },
    label: {
      color: theme.colors.gray3Text,
      ...theme.fonts.label,
    },
  });
