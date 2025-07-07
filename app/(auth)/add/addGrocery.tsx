import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import uuid from 'react-native-uuid';
import TextArea from '@/components/TextArea/TextArea';
import TextField from '@/components/TextField/TextField';
import { AppTheme, useAppTheme } from '@/themes';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import { router } from 'expo-router';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import app from '@/firebaseConfig';
import { useSession } from '@/contexts/authContext';

type GroceryItemInput = {
  id: string;
  item: string;
  amount: string;
  remarks: string;
};

type GroceryEntry = {
  groceries: GroceryItemInput[];
  createdAt: string;
  familyCode: string;
  isActive: true;
};

const db = getFirestore(app);

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Example: Get current time in Asia/Kolkata timezone
const localTime = dayjs().tz('Asia/Colombo').format();
console.log(localTime);

const AddGrocery = () => {
  const theme = useAppTheme();
  const styles = addGroceriesStyles(theme);
  const { t } = useTranslation();
  const { session } = useSession();

  const [inputs, setInputs] = useState<GroceryItemInput[]>([
    { id: uuid.v4() as string, item: '', amount: '', remarks: '' },
  ]);

  const [validatedRows, setValidatedRows] = useState<string[]>([]);
  const [errors, setErrors] = useState<
    Record<string, Partial<Record<keyof GroceryItemInput, string>>>
  >({});

  const submitGroceries = async (
    items: GroceryItemInput[],
    familyCode: string
  ) => {
    if (!items.length || !familyCode) {
      throw new Error('Missing grocery items or family ID');
    }

    const payload: GroceryEntry = {
      groceries: items,
      createdAt: localTime,
      familyCode,
      isActive: true,
    };

    const docRef = await addDoc(collection(db, 'groceries'), payload);
    return { id: docRef.id, ...payload };
  };

  const handleChange = (
    id: string,
    field: keyof GroceryItemInput,
    value: string
  ) => {
    setInputs((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );

    setErrors((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: undefined },
    }));
  };

  const handleValidateAndAddRow = (id: string) => {
    const current = inputs.find((input) => input.id === id);
    if (!current) return;

    let hasError = false;
    const newErrors = { ...errors };

    if (!current.item.trim()) {
      newErrors[id] = { ...newErrors[id], item: t('item_name_is_required') };
      hasError = true;
    }

    if (!current.amount.trim()) {
      newErrors[id] = { ...newErrors[id], amount: t('quantity_is_required') };
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    if (!validatedRows.includes(id)) {
      setValidatedRows([...validatedRows, id]);
    }

    const isLast = inputs[inputs.length - 1].id === id;
    if (isLast) {
      setInputs([
        ...inputs,
        { id: uuid.v4() as string, item: '', amount: '', remarks: '' },
      ]);
    }
  };

  const handleRemoveRow = (id: string) => {
    setInputs((prev) => prev.filter((row) => row.id !== id));
    setValidatedRows((prev) => prev.filter((rowId) => rowId !== id));

    const newErrors = { ...errors };
    delete newErrors[id];
    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    const validated = inputs.filter((input) =>
      validatedRows.includes(input.id)
    );

    try {
      if (!session) {
        throw new Error(t('something_went_wrong'));
      }
      const res = await submitGroceries(validated, session);
    } catch (err) {
      console.error('❌ Error submitting groceries:', err);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction
          onPress={() => {
            router.back();
          }}
        />
        <Appbar.Content
          titleStyle={styles.appBarTitle}
          title={t('add_groceries')}
        />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
          {inputs.map((input, idx) => {
            const isValidated = validatedRows.includes(input.id);
            const error = errors[input.id] || {};

            return (
              <View style={styles.row} key={input.id}>
                <View
                  style={{ flex: 0.3, alignSelf: 'flex-start', paddingTop: 6 }}
                >
                  <Text style={styles.listIndexText}>{`#${idx + 1}`}</Text>
                </View>
                <View style={{ flexDirection: 'column', flex: 3 }}>
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    <View style={{ flex: 2 }}>
                      <TextField
                        required
                        placeholder={t('item_name')}
                        value={input.item}
                        onChangeText={(text) =>
                          handleChange(input.id, 'item', text)
                        }
                        errorMessage={error.item}
                      />
                    </View>
                    <View style={{ flex: 1.5 }}>
                      <TextField
                        required
                        placeholder={t('quantity')}
                        value={input.amount}
                        onChangeText={(text) =>
                          handleChange(input.id, 'amount', text)
                        }
                        keyboardType="numeric"
                        errorMessage={error.amount}
                      />
                    </View>
                  </View>

                  <TextArea
                    multiline
                    placeholder={t('remarks')}
                    value={input.remarks}
                    onChangeText={(text) =>
                      handleChange(input.id, 'remarks', text)
                    }
                    placeholderTextColor={theme.colors.gray3Text}
                  />
                </View>
                <View style={styles.iconButtonContainer}>
                  <IconButton
                    icon={isValidated ? 'close' : 'check'}
                    onPress={() =>
                      isValidated
                        ? handleRemoveRow(input.id)
                        : handleValidateAndAddRow(input.id)
                    }
                    iconColor={
                      isValidated ? theme.colors.error : theme.colors.primary
                    }
                    size={24}
                    style={styles.icon}
                  />
                </View>
              </View>
            );
          })}
        </View>
        <View style={styles.submitContainer}>
          <PrimaryButton
            title={t('submit')}
            onPress={handleSubmit}
            disabled={validatedRows.length === 0}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddGrocery;

const addGroceriesStyles = (theme: AppTheme) =>
  StyleSheet.create({
    appBar: {
      elevation: 6,
      backgroundColor: theme.colors.background,
    },
    appBarTitle: {
      ...theme.fonts.headerMedium,
      color: theme.colors.gray1Text,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingLeft: 16,
      paddingRight: 12,
      paddingTop: 24,
      justifyContent: 'space-between',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    icon: {
      margin: 0,
    },
    iconButtonContainer: {
      flex: 0.3,
      alignSelf: 'flex-start',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      marginTop: 1,
    },
    listIndexText: {
      ...theme.fonts.label,
      color: theme.colors.primary,
    },
    submitContainer: {
      marginTop: 10,
    },
  });
