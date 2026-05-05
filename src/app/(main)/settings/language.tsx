import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { WizardHeader } from '@/components/setup/WizardHeader';
import {
  setAppLanguage,
  SUPPORTED_APP_LANGUAGES,
  type SupportedLanguage,
} from '@/i18n';
import { colors, radii } from '@/constants/colors';
import { fonts } from '@/constants/fonts';

export default function LanguageSettingsScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const current = i18n.language as SupportedLanguage;

  const handleSelect = async (lang: SupportedLanguage) => {
    if (lang === current) return;
    await setAppLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <WizardHeader
        compact
        title={t('languageSettings.title')}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 24 + insets.bottom }]}>
        <Text style={styles.subtitle}>{t('languageSettings.subtitle')}</Text>
        <View style={styles.list}>
          {SUPPORTED_APP_LANGUAGES.map((code) => {
            const selected = code === current;
            return (
              <Pressable
                key={code}
                onPress={() => handleSelect(code)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={({ pressed }) => [
                  styles.row,
                  selected && styles.rowSelected,
                  pressed && styles.rowPressed,
                ]}
              >
                <Text style={[styles.label, selected && styles.labelSelected]}>
                  {t(`languages.${code}`)}
                </Text>
                {selected && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
    lineHeight: 20,
    marginBottom: 16,
  },
  list: { gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.card,
  },
  rowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  rowPressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.text,
    letterSpacing: 0.2,
  },
  labelSelected: {
    color: colors.primary,
  },
});
