import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Appbar, SegmentedButtons } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AppTheme, useAppTheme } from '@/themes';
import ClearCheckbox from '@/components/ClearCheckbox/ClearCheckbox';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import TextField from '@/components/TextField/TextField';
import Selector from '@/components/Selector/Selector';
import { SelectorItemsProps } from '@/types/ShoppingListTypes';
import { Entypo } from '@expo/vector-icons';

type ShoppingItem = {
  id: number;
  label: string;
  value: string;
  checked: boolean;
};

const { height } = Dimensions.get('screen');

const selectorItems: SelectorItemsProps[] = [
  {
    id: 1,
    name: '06-Aug-2025',
  },
  {
    id: 2,
    name: '07-Aug-2025',
  },
  {
    id: 3,
    name: '06-Aug-2025',
  },
  {
    id: 4,
    name: '06-Aug-2025',
  },
  {
    id: 5,
    name: '06-Aug-2025',
  },
];
const ShoppingList = () => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const styles = shoppingListStyles(theme);
  const [value, setValue] = useState('walk');
  const [selectedCard, setSelectedCard] = useState<SelectorItemsProps>(
    selectorItems[0]
  );

  const [cardItemsMap, setCardItemsMap] = useState<
    Record<number, ShoppingItem[]>
  >(() => {
    const initialMap: Record<number, ShoppingItem[]> = {};
    selectorItems.forEach((card) => {
      initialMap[card.id] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        label: `Item ${i + 1}`,
        value: `Value ${i + 1}`,
        checked: false,
      }));
    });
    return initialMap;
  });

  const toggleChecked = (index: number) => {
    const updated = { ...cardItemsMap };
    const items = [...updated[selectedCard.id]];
    items[index].checked = !items[index].checked;
    updated[selectedCard.id] = items;
    setCardItemsMap(updated);
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={{ flexDirection: 'row', gap: 30, justifyContent: 'center' }}>
        <View>
          <View
            style={{
              width: 60,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 40,
              borderWidth: 1,
              borderColor: theme.colors.primary,
            }}
          >
            <Entypo name="plus" size={24} color={theme.colors.primary} />
          </View>
          <Text
            style={{
              textAlign: 'center',
              ...theme.fonts.label,
              color: theme.colors.gray1Text,
            }}
          >
            Income
          </Text>
        </View>
        <View>
          <View
            style={{
              width: 60,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 40,
              borderWidth: 1,
              borderColor: theme.colors.primary,
            }}
          >
            <Entypo name="minus" size={24} color={theme.colors.primary} />
          </View>
          <Text
            style={{
              textAlign: 'center',
              ...theme.fonts.label,
              color: theme.colors.gray1Text,
            }}
          >
            Expense
          </Text>
        </View>
      </View>
      <View style={{ marginHorizontal: 20, marginTop: 30 }}>
        <SegmentedButtons
          style={{ backgroundColor: theme.colors.secondary, borderRadius: 40 }}
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: 'income',
              label: 'Income',
              style: {
                borderWidth: 0,
                borderColor: 'transparent',
                elevation: 0,
                backgroundColor:
                  value === 'income' ? theme.colors.primary : 'transparent', // Green if selected
              },
            },
            {
              value: 'expense',
              label: 'Expense',
              style: {
                borderWidth: 0,
                borderColor: 'transparent',
                elevation: 0,
              },
            },
          ]}
        />
      </View>

      {/* <View style={styles.body}>
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>{selectedCard.name}</Text>
          </View>
          <View style={{ maxHeight: height / 2 }}>
            <ScrollView
              contentContainerStyle={styles.cardBody}
              showsVerticalScrollIndicator={false}
            >
              {cardItemsMap[selectedCard.id]?.map((item, index) => (
                <View style={styles.cardBodyRow} key={item.id}>
                  <View style={{ flex: 0.3 }}>
                    <Text style={styles.label}>{`#${item.id}`}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>{item.label}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.value}>{item.value}</Text>
                  </View>
                  <ClearCheckbox
                    checked={item.checked}
                    onToggle={() => toggleChecked(index)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.cardFooter}>
            <View style={{ flex: 1 }}>
              <TextField placeholder="Price" />
            </View>
            <View style={{ flex: 1, marginTop: 2 }}>
              <PrimaryButton title="Ok" onPress={() => console.log('submit')} />
            </View>
          </View>
        </View>
      </View> */}
    </SafeAreaView>
  );
};

export default ShoppingList;

const shoppingListStyles = (theme: AppTheme) =>
  StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    appBar: {
      elevation: 6,
      backgroundColor: theme.colors.background,
    },
    appBarTitle: {
      ...theme.fonts.headerMedium,
      color: theme.colors.gray1Text,
    },
    body: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      flex: 1,
    },
    cardContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 16,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      flexGrow: 0,
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
      flexGrow: 1,
      paddingTop: 8,
    },
    value: {
      color: theme.colors.gray1Text,
      ...theme.fonts.value,
      textAlignVertical: 'center',
    },
    label: {
      color: theme.colors.gray3Text,
      ...theme.fonts.label,
      textAlignVertical: 'center',
    },
    cardBodyRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      marginVertical: 8,
    },
    cardFooter: {
      flexDirection: 'row',
      gap: 12,
      paddingTop: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.colors.borders,
    },
  });
