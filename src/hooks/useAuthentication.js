''
import { LOGIN_ROUTE, HOME_ROUTE, OPEN_ROUTES } from "@/routes";
import { AuthContext } from "@/provider/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useAuthentication = () => {
    const {user} = AuthContext();
    const info = user?.user || null;
    const router = useRouter();
    const current = window.location.pathname;

    useEffect(()=>{
        if(!info && !OPEN_ROUTES.includes(current)){
            router.push(LOGIN_ROUTE)
        }

        if(info && OPEN_ROUTES.includes(current)){
            router.push(HOME_ROUTE);
        }
    },[]);

}

export default useAuthentication;