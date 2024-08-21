import { yupResolver } from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import * as Yup from 'yup';

const loginSchema = Yup.object({
    email:Yup.string().required("Поле не должно быть пустым"),
    password: Yup.string().required("Поле не должно быть пустым")
})

export const loginValidation = () => useForm({
    resolver:yupResolver(loginSchema)
});


const registerSchema = Yup.object({
    email:Yup.string().required("Поле не должно быть пустым"),
    password: Yup.string().required("Поле не должно быть пустым"),
    cnfPassword: Yup.string().required("Поле не должно быть пустым").oneOf([Yup.ref('password')],"Пароли не совпадают")
});

export const registerValidation = () => useForm({
    resolver:yupResolver(registerSchema)
});