import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { useTranslation } from 'react-i18next';
import { AppTheme, useAppTheme } from '@/themes';
import CartAnimation from '@assets/animations/CartAnimation.json';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton/SecondaryButton';
import BottomDrawer from '@/components/BottomDrawer/BottomDrawer';
import TextField from '@/components/TextField/TextField';
import { updateStateValue } from '@/configs/updateStateValues';
import { CREATE, JOIN } from '@/constants/common';
import { useSession } from '@/contexts/authContext';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import app from '@/firebaseConfig';
import { Snackbar } from 'react-native-paper';
import { useNotification } from '@/contexts/NotificationContext';

interface CreateYourFamilyInterface {
  phoneNumber: string | null;
  familyName: string | null;
}
interface JoinYourFamilyProps {
  familyCode: string | null;
}

const db = getFirestore(app);

const SignIn = () => {
  const theme = useAppTheme();
  const { signIn } = useSession();
  const styles = getSignInStyles(theme);
  const modalRef = useRef<Modalize>(null);
  const { addNotification } = useNotification();
  const { t } = useTranslation();
  const [modalType, setModalType] = useState<'CREATE' | 'JOIN' | null>(null);
  const [createYourFamily, setCreateYourFamily] =
    useState<CreateYourFamilyInterface>({
      phoneNumber: null,
      familyName: null,
    });
  const [joinYourFamily, setJoinYourFamily] = useState<JoinYourFamilyProps>({
    familyCode: null,
  });

  const [errors, setErrors] = useState({
    familyName: '',
    phoneNumber: '',
    familyCode: '',
  });
  // const [snackbarVisible, setSnackbarVisible] = useState(false);
  // const [snackbarMsg, setSnackbarMsg] = useState('');

  const isValidPhoneNumber = (phone: string) => /^[0-9]{10,}$/.test(phone);

  const generateFamilyCode = (name: string) => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    return `${name.replace(/\s+/g, '')}-${randomDigits}`;
  };

  const createFamily = async (
    phoneNumber: string | null,
    familyName: string | null
  ) => {
    if (!phoneNumber || !familyName) {
      throw new Error('Phone number and family name are required.');
    }

    for (let attempt = 0; attempt < 5; attempt++) {
      const familyCode = generateFamilyCode(familyName);

      const existing = await getDocs(
        query(collection(db, 'families'), where('familyCode', '==', familyCode))
      );

      if (existing.empty) {
        const newFamily = {
          phoneNumber,
          familyName,
          familyCode,
          createdAt: new Date().toISOString(),
        };

        const docRef = await addDoc(collection(db, 'families'), newFamily);
        signIn(familyCode);
        return { id: docRef.id, ...newFamily };
      }
    }

    throw new Error(
      'Failed to generate a unique family code. Please try again.'
    );
  };

  const joinFamily = async (familyCode: string) => {
    if (!familyCode) {
      throw new Error('Family code is required.');
    }

    const result = await getDocs(
      query(collection(db, 'families'), where('familyCode', '==', familyCode))
    );

    if (result.empty) {
      throw new Error(t('Family not found'));
    }

    const familyData = result.docs[0].data();
    signIn(familyCode);
    return { id: result.docs[0].id, ...familyData };
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.backgroundContainer}>
        <View style={styles.animation}>
          <LottieView
            style={{ width: 100, height: 100 }}
            source={CartAnimation}
            autoPlay
            loop
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>CART</Text>
            <Text style={styles.title}>BUDDIES</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={{ flex: 1 }}>
            <SecondaryButton
              buttonName={t('join_your_family')}
              onPress={() => {
                setModalType(JOIN);
                modalRef.current?.open();
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              onPress={() => {
                setModalType(CREATE);
                modalRef.current?.open();
              }}
              title={t('add_your_family')}
            />
          </View>
        </View>

        <BottomDrawer
          FooterComponent={
            modalType === CREATE ? (
              <PrimaryButton
                onPress={async () => {
                  const { familyName, phoneNumber } = createYourFamily;
                  let valid = true;

                  const newErrors = {
                    familyName: '',
                    phoneNumber: '',
                    familyCode: '',
                  };

                  if (!familyName) {
                    newErrors.familyName = t('errors.required');
                    valid = false;
                  }
                  if (!phoneNumber) {
                    newErrors.phoneNumber = t('errors.required');
                    valid = false;
                  } else if (!isValidPhoneNumber(phoneNumber)) {
                    newErrors.phoneNumber = t('errors.invalidPhone');
                    valid = false;
                  }

                  if (!valid) {
                    setErrors(newErrors);
                    return;
                  }

                  try {
                    const res = await createFamily(phoneNumber, familyName);
                    router.replace('/');
                  } catch (error) {
                    addNotification(error.message, 'error');
                    updateStateValue(setCreateYourFamily, 'familyName', '');
                    updateStateValue(setCreateYourFamily, 'phoneNumber', '');
                    modalRef.current?.close();
                  }
                }}
                title={t('create')}
              />
            ) : (
              <PrimaryButton
                onPress={async () => {
                  const { familyCode } = joinYourFamily;
                  const newErrors = {
                    familyName: '',
                    phoneNumber: '',
                    familyCode: '',
                  };

                  if (!familyCode) {
                    newErrors.familyCode = t('errors.required');
                    setErrors(newErrors);
                    return;
                  }

                  try {
                    const family = await joinFamily(familyCode);

                    router.replace('/');
                  } catch (err) {
                    console.log(err);

                    addNotification(err.message, 'error');
                    updateStateValue(setJoinYourFamily, 'familyCode', '');
                    modalRef.current?.close();
                  }
                }}
                title={t('join')}
              />
            )
          }
          adjustToContentHeight
          modalRef={modalRef}
        >
          {modalType === CREATE ? (
            <>
              <TextField
                errorMessage={errors.familyName}
                required
                placeholder={t('family_name')}
                onChangeText={(text) => {
                  errors.familyName = '';
                  updateStateValue(setCreateYourFamily, 'familyName', text);
                }}
              />
              <TextField
                errorMessage={errors.phoneNumber}
                keyboardType="number-pad"
                required
                placeholder={t('phone_number')}
                onChangeText={(text) => {
                  errors.phoneNumber = '';
                  updateStateValue(setCreateYourFamily, 'phoneNumber', text);
                }}
              />
            </>
          ) : (
            <TextField
              errorMessage={errors.familyCode}
              required
              placeholder={t('family_code')}
              onChangeText={(text) => {
                errors.familyCode = '';
                updateStateValue(setJoinYourFamily, 'familyCode', text);
              }}
            />
          )}
        </BottomDrawer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SignIn;

const getSignInStyles = (theme: AppTheme) =>
  StyleSheet.create({
    backgroundContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 24,
    },
    animation: {
      flex: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleContainer: {},
    title: {
      ...theme.fonts.header,
      color: theme.colors.primary,
      lineHeight: 50,
      textAlign: 'center',
    },
    footer: {
      flex: 0.5,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
      gap: 10,
    },
  });
