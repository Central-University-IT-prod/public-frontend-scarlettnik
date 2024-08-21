import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import styles from "@/ui/tracker.module.css";
import { AuthContext } from "@/provider/AuthProvider";

export default function HabitsPreset() {
  const [presets, setPresets] = useState([]);
  const [selectedPresets, setSelectedPresets] = useState([]);
  const habitsCollection = collection(db, "habits");
  const { user } = AuthContext();
  useEffect(() => {
    const collectionRef = collection(db, "habits_presets");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setPresets(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });

    return unsubscribe;
  }, []);

  const handleCheckboxChange = (presetId) => {
    setSelectedPresets((prevSelectedPresets) => {
      if (prevSelectedPresets.includes(presetId)) {
        return prevSelectedPresets.filter((id) => id !== presetId);
      } else {
        return [...prevSelectedPresets, presetId];
      }
    });
  };

  const handleSendPresets = async () => {
    for (const presetId of selectedPresets) {
      const selectedPreset = presets.find((preset) => preset.id === presetId);

      if (selectedPreset) {
        const { title, period, targetValue } = selectedPreset;
        const selectedPresetNames = title;
        const selectedPresetPeriod = period;
        const selectedPresetTargetValue = targetValue;

        await addDoc(habitsCollection, {
          user: user.user.uid,
          addDate: new Date(),
          title: selectedPresetNames,
          period: selectedPresetPeriod,
          targetValue: selectedPresetTargetValue || "",
          actions: [],
        });

      }
    }
  };
  return (
    <>
      {presets?.map((preset) => (
        <div className={styles.additional} key={preset?.id}>
          <label>
            <input
              type="checkbox"
              checked={selectedPresets.includes(preset.id)}
              onChange={() => handleCheckboxChange(preset.id)}
            />
            {preset?.title}
          </label>
        </div>
      ))}
      <button onClick={handleSendPresets}>Отправить привычки</button>
    </>
  );
}
