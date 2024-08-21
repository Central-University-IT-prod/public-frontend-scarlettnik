import React, { useEffect, useState, useCallback } from "react";
import { Alert, Checkbox, Snackbar } from "@mui/material";
import {
  ArchiveRestore,
  Check,
  CheckCheck,
  CheckCheckIcon,
  Trash2,
} from "lucide-react";
import { AuthContext } from "@/provider/AuthProvider";
import styles from "@/ui/tracker.module.css";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "./Loader";

const HabitsOwn = () => {
  const { user } = AuthContext();
  const [habits, setHabits] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habitData, setHabitData] = useState({});
  const [displayedWeekdays, setDisplayedWeekdays] = useState([]);
  const [inputValues, setInputValues] = useState([]);
  const [checkboxValues, setCheckboxValues] = useState([]);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const onChangeCheckbox = useCallback(
    async (habitId, day, value) => {
      if (day !== 0) {
        setToastMessage(
          "Возвращайтесь в другой день или используйте календарь"
        );
        setToastOpen(true);
      } else {
        const updatedValues = [...checkboxValues];
        setCheckboxValues(updatedValues);
        try {
          const selectedDateString = selectedDate.toISOString().split("T")[0];
          const habitDocReference = doc(db, "habits", habitId);
          const habitDoc = await getDoc(habitDocReference);
          const habitData = habitDoc.data();
          const userDocReference = doc(db, "users", user?.user?.uid);
          const userDoc = await getDoc(userDocReference);
          const userData = userDoc.data();

          const updatedActions = {
            ...habitData.actions,
            [selectedDateString]: {
              ...(habitData.actions[selectedDateString] || {}),
              value: value,
            },
          };

          await updateDoc(habitDocReference, {
            ...habitData,
            actions: updatedActions,
            completed: habitData.completed + 1 || 1,
          });
          const newProgress = userData.progress + 1;
          const newLevel =
            newProgress === 5 ? userData.level + 1 : userData.level;
          const newWallet =
            newProgress === 5 ? userData.wallet + 2 : userData.wallet;
          await updateDoc(userDocReference, {
            ...userData,
            progress: newProgress === 5 ? 0 : newProgress,
            level: newLevel,
            wallet: newWallet,
          });
          setToastMessage("Данные обновлены");
          setToastOpen(true);
        } catch (error) {
          console.error(error);
        }
      }
    },
    [selectedDate]
  );

  const onDeleteHabit = useCallback(async (habitId) => {
    try {
      const habitDocReference = doc(db, "habits", habitId);
      await deleteDoc(habitDocReference);
      setToastMessage("Привычка удалена");
      setToastOpen(true);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const ArchiveHabit = useCallback(async (habitId) => {
    try {
      const habitDocReference = doc(db, "habits", habitId);
      const userDoc = await getDoc(habitDocReference);
      const userData = userDoc.data();
      await updateDoc(habitDocReference, {
        ...userData,
        archived: new Date(),
      });
      setToastMessage("Привычка архивирована");
      setToastOpen(true);
    } catch (error) {
      console.error(error);
    }
  }, []);
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const collectionRef = collection(db, "habits");
      const q = query(collectionRef);
      const querySnapshot = await getDocs(q);
      const newHabits = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setHabits(newHabits);

      const newHabitData = {};
      newHabits.forEach((habit) => {
        if (habit.user === user?.user?.uid && habit.days) {
          const habitId = habit.id;
          const storedData = localStorage.getItem(habitId);
          const storedDays = storedData !== null ? JSON.parse(storedData) : {};
          const currentDate = new Date();
          const currentDateString = currentDate.toISOString().split("T")[0];
          newHabitData[habitId] = {
            days: storedDays,
            input: storedDays[currentDateString] || "",
          };
        }
      });
      setHabitData(newHabitData);
    };

    fetchData();
  }, [user, habitData]);

  const groupedHabits = habits.reduce((acc, habit) => {
    const { period } = habit;
    if (acc[period]) {
      acc[period].push(habit);
    } else {
      acc[period] = [habit];
    }
    return acc;
  }, {});
  const updateDisplayedWeekdays = (selectedDate) => {
    const weekdays = [];
    const currentDate = new Date(selectedDate.getTime());

    for (let i = 6; i >= 0; i--) {
      currentDate.setDate(selectedDate.getDate() - i);
      const formattedDate = currentDate.toLocaleDateString("ru-RU", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      weekdays.push(formattedDate);
    }

    setDisplayedWeekdays(weekdays);
  };
  const sortedPeriod = ["daily", "weekly", "monthly"];
  const periodLabels = {
    daily: "Каждый день",
    weekly: "Каждую неделю",
    monthly: "Каждый месяц",
  };

  return (
    <>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          updateDisplayedWeekdays(date);
        }}
        dateFormat="yyyy-MM-dd"
      />
      <p className={styles.title}>Ваши привычки</p>
      <div>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th></th>
              {Array.from({ length: 7 }).map((_, index) => {
                const date = new Date(selectedDate.getTime());
                date.setDate(selectedDate.getDate() + index);
                const formattedDate = date.toLocaleDateString("ru-RU", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                });
                return (
                  <th className={styles.date} key={formattedDate}>
                    {formattedDate}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {habits ? (
              <>
                {" "}
                {sortedPeriod.map((targetValue) => {
                  const shouldDisplaytargetValue = groupedHabits[
                    targetValue
                  ]?.some((habit) => habit.user === user?.user?.uid);
                  return (
                    <React.Fragment key={targetValue}>
                      {shouldDisplaytargetValue && (
                        <>
                          <tr>
                            <th className={styles.category} colSpan={8}>
                              {periodLabels[targetValue]}
                            </th>
                          </tr>
                          {groupedHabits[targetValue].map((habit) => {
                            if (
                              habit.user === user?.user?.uid &&
                              !habit.archived
                            ) {
                              const habitId = habit.id;
                              return (
                                <tr className={styles.calendar} key={habitId}>
                                  <td className={styles.selector}>
                                    <button
                                      style={{
                                        background: "transparent",
                                        border: "0",
                                      }}
                                      onClick={() => ArchiveHabit(habitId)}
                                    >
                                      <ArchiveRestore
                                        style={{ width: "1.5em" }}
                                      />
                                    </button>
                                    <button
                                      style={{
                                        background: "transparent",
                                        border: "0",
                                      }}
                                      onClick={() => onDeleteHabit(habitId)}
                                    >
                                      <Trash2 style={{ width: "1.5em" }} />
                                    </button>
                                    {habit.title}
                                  </td>
                                  {Array.from({ length: 7 }).map((_, index) => {
                                    if (habit.targetValue) {
                                      return (
                                        <td
                                          className={styles.checkbox}
                                          key={index}
                                        >
                                          <input
                                            className={styles.inputNumber}
                                            type="number"
                                            value={inputValues[index]}
                                            onChange={(event) =>
                                              onChangeCheckbox(
                                                habitId,
                                                index,
                                                event.target.value
                                              )
                                            }
                                          />
                                        </td>
                                      );
                                    } else {
                                      return (
                                        <td
                                          className={styles.checkbox}
                                          key={index}
                                        >
                                          <Checkbox
                                            icon={
                                              checkboxValues[index] ? (
                                                <CheckCheck
                                                  className={styles.icon}
                                                />
                                              ) : (
                                                <Check
                                                  className={styles.icon}
                                                  style={{ color: "white" }}
                                                />
                                              )
                                            }
                                            checked={checkboxValues[index]}
                                            onChange={(event) =>
                                              onChangeCheckbox(
                                                habitId,
                                                index,
                                                event.target.checked
                                                  ? true
                                                  : false
                                              )
                                            }
                                          />
                                        </td>
                                      );
                                    }
                                  })}
                                </tr>
                              );
                            }
                            return null;
                          })}
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </>
            ) : (
              <Loader />
            )}
          </tbody>
        </table>
      </div>
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          sx={{ width: "100%", maxWidth: 400 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default HabitsOwn;
