'use client'
import UserProvider from "@/provider/UserProvider";
import "./globals.css";
import AuthProvider from "@/provider/AuthProvider";
import "react-datepicker/dist/react-datepicker.css";
import Notification from "@/components/Notification";
export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>  
        <Notification/>    
      </body>
    </html>
  );
}
