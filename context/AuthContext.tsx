"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { getApiUrl, API_CONFIG } from "../config/api";

export interface Business {
  _id: string;
  owner_id: string;
  name: string;
}

export interface Permission {
  _id: string;
  business_id: string;
  expire: string;
  level: string;
  name: string;
}

export interface DetailedBusiness {
  _id: string;
  business_id: string;
  name: string;
  owner_id: string;
  permissions?: Permission[];
}

interface AuthContextType {
  token: string | null;
  userEmail: string | null;
  adminToken: string | null;
  businesses: Business[];
  allBusinesses: DetailedBusiness[];
  isLoading: boolean;
  setToken: (token: string | null) => void;
  setUserEmail: (email: string | null) => void;
  setAdminToken: (token: string | null) => void;
  fetchBusinesses: () => Promise<void>;
  fetchAllBusinesses: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [allBusinesses, setAllBusinesses] = useState<DetailedBusiness[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingAll, setIsFetchingAll] = useState(false);

  useEffect(() => {
    // 从 localStorage 初始化状态
    const storedAdminToken = localStorage.getItem("adminToken");
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedToken) setToken(storedToken);
    if (storedEmail) setUserEmail(storedEmail);
    if (storedAdminToken) setAdminToken(storedAdminToken);

    setIsLoading(false);
  }, []);

  const fetchBusinesses = async () => {
    if (!token || isFetching) return;

    try {
      setIsFetching(true);
      const response = await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.LIST_BUSINESS),
        {
          token: token,
        }
      );

      if (response.data.status_code === 200) {
        setBusinesses(response.data.business);
      }
    } catch (error) {
      console.error("获取业务列表失败:", error);
    } finally {
      setIsFetching(false);
    }
  };
  const getPermissionInfo = async (businessId: string) => {
    const response = await axios.post(
      getApiUrl("/shop/get_business_permission"),
      {
        business_id: businessId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    return response.data;
  };

  const fetchAllBusinesses = useCallback(async () => {
    if (!adminToken || isFetchingAll) return;

    try {
      setIsFetchingAll(true);
      const response = await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.SEARCH_BUSINESS),
        {
          detail: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status_code === 200) {
        // 获取所有业务
        const businesses = response.data.business;

        // 获取每个业务的权限信息
        const businessesWithPermissions = await Promise.all(
          businesses.map(async (business: Business) => {
            const permissionResponse = await getPermissionInfo(business._id);

            if (permissionResponse.status_code === 200) {
              return {
                _id: business._id,
                name: business.name,
                owner_id: business.owner_id,
                permissions: permissionResponse.permissions,
              };
            }
          })
        );
        setAllBusinesses(businessesWithPermissions);
      }
    } catch (error) {
      console.error("failed to fetch all businesses:", error);
    } finally {
      setIsFetchingAll(false);
    }
  }, [adminToken, isFetchingAll]);

  return (
    <AuthContext.Provider
      value={{
        token,
        adminToken,
        userEmail,
        businesses,
        allBusinesses,
        isLoading,
        setToken,
        setUserEmail,
        setAdminToken,
        fetchBusinesses,
        fetchAllBusinesses,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
