import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_KEY,
  type UserSettings,
} from "@/modules/settings/model/settings";
import { parseStoredSettings } from "@/modules/settings/model/settingsStorage";

type SaveSettingsResult = "success" | "missing_display_name" | "missing_email";

const serializeSettings = (settings: UserSettings) => JSON.stringify(settings);

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    serializeSettings(DEFAULT_SETTINGS),
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = parseStoredSettings(
      window.localStorage.getItem(SETTINGS_STORAGE_KEY),
    );
    if (!stored) {
      return;
    }

    setSettings(stored);
    setSavedSnapshot(serializeSettings(stored));
  }, []);

  const isDirty = useMemo(
    () => serializeSettings(settings) !== savedSnapshot,
    [savedSnapshot, settings],
  );

  const updateSettings = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K],
  ) => {
    setSettings(previous => ({
      ...previous,
      [key]: value,
    }));
  };

  const saveSettings = (): SaveSettingsResult => {
    if (!settings.displayName.trim()) {
      return "missing_display_name";
    }

    if (!settings.email.trim()) {
      return "missing_email";
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        serializeSettings(settings),
      );
    }

    setSavedSnapshot(serializeSettings(settings));
    return "success";
  };

  const restoreDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    isDirty,
    updateSettings,
    saveSettings,
    restoreDefaults,
  };
}
