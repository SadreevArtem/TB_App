import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { jwtDecode } from "jwt-decode";

type TJwtPayload = {
  username: string;
  sub: number;
};

export const useJwtToken = () => {
  const token = useAuthStore((state) => state.token) ?? "";
  const [decodedJwt, setDecodedJwt] = useState<TJwtPayload | undefined>(
    token ? jwtDecode<TJwtPayload>(token) : undefined
  );

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode<TJwtPayload>(token);
      setDecodedJwt(decoded);
    }
  }, [token]);

  return { ...decodedJwt };
};
