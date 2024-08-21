"use client";

import InputField from "@/style/InputField";
import { HOME_ROUTE, REGISTER_ROUTE } from "@/routes";
import Link from "next/link";
import { auth } from "@/services/firebase";
import { loginValidation } from "@/validator/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import useAuthentication from "@/hooks/useAuthentication";
import styles from "@/ui/auth.module.css";
import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = loginValidation();
  const router = useRouter();
  useAuthentication();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const submitForm = (values) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        setToastMessage("Успешная авторизация");
        setToastOpen(true);
        router.push(HOME_ROUTE);
      })
      .catch((e) => {
        setToastMessage("Проверьте правильность данных");
        setToastOpen(true);
      });
  };

  return (
    <div className={styles.form}>
      <div className={styles.formData}>
        <div>
          <span>Авторизация</span>
        </div>
        <br />
        <form onSubmit={handleSubmit(submitForm)}>
          <div className={styles.inputData}>
            <InputField
              register={register}
              error={errors.email}
              type="text"
              name="email"
              label="Email"
            />
          </div>
          <div>
            <InputField
              className={styles.inputData}
              register={register}
              error={errors.password}
              type="password"
              name="password"
              label="Пароль"
            />
          </div>
          <div>
            <button className={styles.button} variant="contained">
              Войти
            </button>
          </div>
        </form>
        <br />
        <div>
          <span>
            Если нет аккаунта
            <Link href={REGISTER_ROUTE}>
              <span style={{ color: "#99ff99" }}> Зарегистрируйтесь</span>
            </Link>
          </span>
        </div>
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
    </div>
  );
};

export default Login;
