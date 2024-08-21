import { db } from "@/services/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import moment from "moment";
import { AuthContext } from "@/provider/AuthProvider";
import Chart from "chart.js";
import styles from "@/ui/statistic.module.css";
import Loader from "@/elements/Loader";

export default function Statistic() {
  const [data, setData] = useState([]);
  const { user } = AuthContext();

  useEffect(() => {
    const collectionRef = collection(db, "habits");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const habits = querySnapshot.docs
        .map((doc) => {
          const habitData = doc.data();
          if (habitData.user === user.user.uid) {
            return {
              ...habitData,
              id: doc.id,
            };
          }
          return null;
        })
        .filter(Boolean);

      const habitsWithoutTargetValue = habits.filter(
        (habit) => !habit.targetValue
      );

      const habitsWithDaysSinceAdd = habitsWithoutTargetValue.map((habit) => {
        const seconds = habit?.addDate?.seconds;
        const arhseconds = habit?.archived?.seconds;
        const nanoseconds = habit.addDate.nanoseconds;
        const achnanoseconds = habit?.archived?.nanoseconds;
        const timestamp = seconds * 1000 + nanoseconds / 1000000;
        const achtimestamp = arhseconds * 1000 + achnanoseconds / 1000000;
        const addDate = moment(timestamp);
        const addAchDate = moment(achtimestamp);
        const today = moment();
        const daysSinceAdd = today.diff(addDate, "days");
        const achDaysSinceAdd = addAchDate.diff(addDate, "days");
        return {
          ...habit,
          achDaysSinceAdd,
          daysSinceAdd,
        };
      });

      setData(habitsWithDaysSinceAdd);
    });

    return () => unsubscribe();
  }, [user.user.uid]);

  useEffect(() => {
    data.forEach((habit) => {
      const habitDaysData = [
        {
          label: "Days",
          data: habit.achDaysSinceAdd || habit.daysSinceAdd,
          backgroundColor: "#36A2EB",
        },
        {
          label: "Completed Days",
          data: habit.completed,
          backgroundColor: "#FF6384",
        },
      ];

      const ctx = document.getElementById(`habitChart-${habit.id}`);
      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: habitDaysData.map((data) => data.label),
          datasets: [
            {
              data: habitDaysData.map((data) => data.data),
              backgroundColor: habitDaysData.map(
                (data) => data.backgroundColor
              ),
            },
          ],
        },
      });
    });
  }, [data]);

  console.log(data);
  return (
    <div>
      {data.length > 0 ? (
        <div>
          {data.map((habit) => (
            <div key={habit.id}>
              <h3 className={styles.text}>{habit.title}</h3>
              <canvas id={`habitChart-${habit.id}`}></canvas>
              <p className={styles.text}>
                Дней с начала трекинга: {habit.daysSinceAdd}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>Привычек TrueFalse пока нет</p>
          <Loader />
        </div>
      )}
    </div>
  );
}
