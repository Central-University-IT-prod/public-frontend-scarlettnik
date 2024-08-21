import styles from "@/ui/header.module.css";
import { AuthContext } from "@/provider/AuthProvider";
import { LOGIN_ROUTE } from "@/routes";
import { auth } from "@/services/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  BarChart4,
  NotebookPen,
  ShoppingCart,
  Swords,
  Users,
} from "lucide-react";

const Header = ({ view, setView }) => {
  const { user } = AuthContext();
  const router = useRouter();
  const logOut = () => {
    signOut(auth)
      .then(() => {
        router.push(LOGIN_ROUTE);
      })
      .catch((e) => {
        console.log("Logout Catch ", e.message);
      });
  };

  return (
    <div className={styles.main}>
      <div>Rfhnbyrf</div>
      <nav className={styles.navbar}>
        <button
          className={`${styles.navigate} ${
            view === "habittracker" ? styles.active : ""
          }`}
          onClick={() => setView("habittracker")}
        >
          {" "}
          <NotebookPen />
          <p className={styles.text}>Трекер</p>
        </button>
        <button
          className={`${styles.navigate} ${
            view === "statistic" ? styles.active : ""
          }`}
          onClick={() => setView("statistic")}
        >
          <BarChart4 />
          <p className={styles.text}>Статистика</p>
        </button>
        <button
          className={`${styles.navigate} ${
            view === "shop" ? styles.active : ""
          }`}
          onClick={() => setView("shop")}
        >
          <ShoppingCart />
          <p className={styles.text}>Магазин</p>
        </button>
        <button
          className={`${styles.navigate} ${
            view === "groups" ? styles.active : ""
          }`}
          onClick={() => setView("groups")}
        >
          <Users />
          <p className={styles.text}>Группы</p>
        </button>
        <button
          className={`${styles.navigate} ${
            view === "account" ? styles.active : ""
          }`}
          onClick={() => setView("account")}
        >
          {" "}
          <Swords />
          <p className={styles.text}>Аккаунт</p>
        </button>
      </nav>
      <div>{user?.user?.email}</div>
      <button onClick={logOut}>Выйти</button>
    </div>
  );
};

export default Header;
