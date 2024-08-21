import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { AuthContext } from "@/provider/AuthProvider";
import Loader from "@/elements/Loader";
import { Modal } from "@mui/material";
import Box from "@mui/material/Box";
import styles from "@/ui/modal.module.css";
import { Snackbar, Alert } from "@mui/material";
export default function Groups() {
  const { user } = AuthContext();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const usersCollection = collection(db, "users");
  const groupsCollection = collection(db, "groups");
  const habitsCollection = collection(db, "habits");
  const currentUser = doc(usersCollection, user.user.uid);
  const [habitUid, setHabitUid] = useState();
  const [groupHabits, setGroupHabits] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewGroupAdded, setIsNewGroupAdded] = useState(false);
  const [groupToAddId, setGroupToAddId] = useState("");
  const [newGroupData, setNewGroupData] = useState({
    title: "",
    habits: [
      {
        title: "",
        category: "",
        period: "",
        targetValue: null,
      },
    ],
    users: [currentUser],
  });

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setNewGroupData({
      title: "",
      habits: [
        {
          title: "",
          category: "",
          period: "",
          targetValue: null,
        },
      ],
      users: [currentUser],
    });

    setIsModalOpen(false);
  };

  const addToGroup = async () => {
    const groupDocReference = doc(groupsCollection, groupToAddId);
    const groupDoc = await getDoc(groupDocReference);

    if (!groupDoc.exists()) {
      setToastMessage("Такой группы нет");
      setToastOpen(true);
      return;
    }

    const groupUsers = groupDoc.data().users;

    if (!groupUsers.includes(currentUser)) groupUsers.push(currentUser);
    await updateDoc(groupDocReference, { users: groupUsers });
  };

  const newGroup = async () => {
    const habitDocReferences = [];
    for (const habitData of newGroupData.habits) {
      habitDocReferences.push(await addDoc(habitsCollection, habitData));
    }
    newGroupData.habits = habitDocReferences;

    const newGroupRef = await addDoc(groupsCollection, newGroupData);
    const newGroupId = newGroupRef.id;
    setToastMessage("Вы можете пригласить участников в", newGroupId);
    setToastOpen(true);
    setHabitUid(newGroupId);
    handleModalClose();
    setIsNewGroupAdded(true);
    setIsNewGroupAdded(false);
    setIsLoaded(false);
  };

  useEffect(() => {
    const userGroupsQuery = query(
      groupsCollection,
      where("users", "array-contains", doc(usersCollection, user?.user?.uid))
    );

    const unsubscribe = onSnapshot(userGroupsQuery, async (userGroups) => {
      const updatedGroupHabits = [];

      for (const groupDoc of userGroups.docs) {
        const groupData = groupDoc.data();

        for (const habitDocReference of groupData.habits) {
          const currentHabitData = {
            group: groupData,
            habit: (await getDoc(habitDocReference)).data(),
          };

          if (
            !updatedGroupHabits.some(
              (item) =>
                item.group === currentHabitData.group &&
                item.habit === currentHabitData.habit
            )
          ) {
            updatedGroupHabits.push(currentHabitData);
          }
        }
      }

      setGroupHabits(updatedGroupHabits);
      setIsLoaded(true);
    });

    return () => {
      unsubscribe();
    };
  }, [isNewGroupAdded]);

  return (
    <>
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box className={styles.box}>
          <input
            style={{ width: "100%", padding: "1vh" }}
            placeholder="Название группы"
            onChange={(event) =>
              setNewGroupData((prevState) => ({
                ...prevState,
                title: event.target.value,
              }))
            }
          />
          <br />
          {newGroupData.habits.map((_, index) => (
            <div key={`habit-${index}`}>
              <br />
              <input
                style={{ width: "100%", padding: "1vh" }}
                placeholder="Название привычки"
                type="text"
                onChange={(event) => {
                  const habitsCopy = [...newGroupData.habits];
                  habitsCopy[index].title = event.target.value;
                  setNewGroupData((prevState) => ({
                    ...prevState,
                    habits: habitsCopy,
                  }));
                }}
              />
              <br />
              <input
                type="text"
                style={{ width: "100%", padding: "1vh" }}
                placeholder="Категория"
                onChange={(event) => {
                  const habitsCopy = [...newGroupData.habits];
                  habitsCopy[index].category = event.target.value;
                  setNewGroupData((prevState) => ({
                    ...prevState,
                    habits: habitsCopy,
                  }));
                }}
              />
              <br />
              <input
                list="periodOptions"
                style={{ width: "100%", padding: "1vh" }}
                placeholder="Период"
                type="text"
                onChange={(event) => {
                  const habitsCopy = [...newGroupData.habits];
                  habitsCopy[index].period = event.target.value;
                  setNewGroupData((prevState) => ({
                    ...prevState,
                    habits: habitsCopy,
                  }));
                }}
              />
              <datalist id="periodOptions">
                <option value="daily" />
                <option value="weekly" />
                <option value="monthly" />
              </datalist>
              <br />
              <input
                style={{ width: "100%", padding: "1vh" }}
                type="number"
                placeholder="По желанию добавьте цель"
                onChange={(event) => {
                  const habitsCopy = [...newGroupData.habits];
                  habitsCopy[index].targetValue = event.target.value;
                  setNewGroupData((prevState) => ({
                    ...prevState,
                    habits: habitsCopy,
                  }));
                }}
              />
            </div>
          ))}
          <br />
          <button
            type="button"
            onClick={() => {
              const habitsCopy = [...newGroupData.habits];
              habitsCopy.push({
                title: "",
                category: "",
                period: "",
                targetValue: null,
              });
              setNewGroupData((prevState) => ({
                ...prevState,
                habits: habitsCopy,
              }));
            }}
          >
            + Привычку
          </button>
          <br />
          <br />
          <Button variant="contained" onClick={newGroup}>
            Создать группу
          </Button>
        </Box>
      </Modal>
      <input onChange={(event) => setGroupToAddId(event.target.value)} />
      <Button onClick={addToGroup}>Добавиться в группу</Button>
      <br />
      <Button onClick={handleModalOpen}>Создать группу</Button>
      {isLoaded ? (
        <div className="groupHabits" key="groupHabits">
          {groupHabits.map((item, index) => (
            <p key={`groupHabit-${index}`}>
              Группа {item?.group?.title}: Привычка {item?.habit?.title}
            </p>
          ))}
        </div>
      ) : (
        <Loader key="loader" />
      )}
      <br />
      <p>
        Пригласить в свою группу:
        {habitUid}
      </p>
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
}
