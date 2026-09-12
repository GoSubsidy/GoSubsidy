import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../services/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  // Customer profile from public.customer_profiles
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // =========================================================
  // LOAD CUSTOMER PROFILE
  // =========================================================

  const loadProfile = async (currentUser) => {
    if (!currentUser?.id) {
      setProfile(null);
      return null;
    }

    try {
      setProfileLoading(true);

      const { data, error } = await supabase
        .from("customer_profiles")
        .select("*")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (error) {
        console.error(
          "[AuthContext] Customer profile load error:",
          error
        );

        setProfile(null);
        return null;
      }

      // If user signed in via Google and no profile exists yet, create one
      if (!data && currentUser.app_metadata?.provider === "google") {
        const googleName =
          currentUser.user_metadata?.full_name ||
          currentUser.user_metadata?.name ||
          "";
        const { data: newProfile } = await supabase
          .from("customer_profiles")
          .upsert(
            {
              user_id: currentUser.id,
              full_name: googleName,
              profile_status: "incomplete",
            },
            { onConflict: "user_id" }
          )
          .select()
          .maybeSingle();

        setProfile(newProfile || null);
        return newProfile;
      }

      setProfile(data || null);
      return data;
    } catch (error) {
      console.error(
        "[AuthContext] Unexpected profile error:",
        error
      );

      setProfile(null);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  // =========================================================
  // INITIAL SESSION
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error(
            "[AuthContext] Session error:",
            error
          );
        }

        if (!mounted) return;

        setSession(currentSession || null);

        const currentUser = currentSession?.user || null;

        setUser(currentUser);

        if (currentUser) {
          await loadProfile(currentUser);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error(
          "[AuthContext] Authentication initialization error:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // =======================================================
    // AUTH STATE LISTENER
    // =======================================================

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        if (!mounted) return;

        setSession(currentSession || null);

        const currentUser =
          currentSession?.user || null;

        setUser(currentUser);

        if (currentUser) {
          await loadProfile(currentUser);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // =========================================================
  // SIGN UP
  // =========================================================

  const signUp = async (
    email,
    password,
    metadata = {}
  ) => {
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...metadata,
        },
      },
    });

    return response;
  };

  // =========================================================
  // LOGIN (EMAIL / PASSWORD)
  // =========================================================

  const signIn = async (email, password) => {
    const response =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (response?.data?.user) {
      setUser(response.data.user);

      await loadProfile(response.data.user);
    }

    if (response?.data?.session) {
      setSession(response.data.session);
    }

    return response;
  };

  // =========================================================
  // SIGN IN / REGISTER WITH GOOGLE
  // =========================================================

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/customer/dashboard`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("[AuthContext] Google OAuth error:", error);
      throw error;
    }

    return data;
  };

  // =========================================================
  // UPDATE CUSTOMER PROFILE
  // =========================================================

  const updateProfile = async (updates = {}) => {
    if (!user?.id) {
      throw new Error(
        "You must be logged in to update your profile."
      );
    }

    try {
      setProfileLoading(true);

      const profileUpdates = {
        full_name:
          updates.full_name ??
          updates.fullName ??
          profile?.full_name ??
          "",

        phone:
          updates.phone ??
          profile?.phone ??
          "",

        business_name:
          updates.business_name ??
          updates.businessName ??
          profile?.business_name ??
          "",

        business_type:
          updates.business_type ??
          updates.businessType ??
          profile?.business_type ??
          "",

        address_line1:
          updates.address_line1 ??
          updates.addressLine1 ??
          profile?.address_line1 ??
          "",

        address_line2:
          updates.address_line2 ??
          updates.addressLine2 ??
          profile?.address_line2 ??
          "",

        city:
          updates.city ??
          profile?.city ??
          "",

        state:
          updates.state ??
          profile?.state ??
          "",

        pincode:
          updates.pincode ??
          profile?.pincode ??
          "",

        annual_turnover:
          updates.annual_turnover ??
          updates.annualTurnover ??
          profile?.annual_turnover ??
          null,

        years_in_business:
          updates.years_in_business ??
          updates.yearsInBusiness ??
          profile?.years_in_business ??
          null,

        employees_count:
          updates.employees_count ??
          updates.employeesCount ??
          profile?.employees_count ??
          null,

        preferred_service:
          updates.preferred_service ??
          updates.preferredService ??
          profile?.preferred_service ??
          "",

        profile_status:
          updates.profile_status ??
          profile?.profile_status ??
          "incomplete",
      };

      const requiredFields = [
        profileUpdates.full_name,
        profileUpdates.phone,
        profileUpdates.city,
        profileUpdates.state,
      ];

      const complete = requiredFields.every(
        (value) =>
          String(value || "").trim().length > 0
      );

      profileUpdates.profile_status = complete
        ? "complete"
        : "incomplete";

      const { data, error } = await supabase
        .from("customer_profiles")
        .upsert(
          {
            user_id: user.id,
            ...profileUpdates,
          },
          {
            onConflict: "user_id",
          }
        )
        .select()
        .single();

      if (error) {
        console.error(
          "[AuthContext] Profile update error:",
          error
        );

        throw error;
      }

      setProfile(data);

      const { data: authData, error: authError } =
        await supabase.auth.updateUser({
          data: {
            full_name: data.full_name || "",
            phone: data.phone || "",
            business_name:
              data.business_name || "",
            business_type:
              data.business_type || "",
            city: data.city || "",
            state: data.state || "",
          },
        });

      if (authError) {
        console.warn(
          "[AuthContext] Auth metadata update warning:",
          authError
        );
      }

      if (authData?.user) {
        setUser(authData.user);
      }

      return {
        success: true,
        profile: data,
        user: authData?.user || user,
      };
    } catch (error) {
      console.error(
        "[AuthContext] updateProfile failed:",
        error
      );

      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  // =========================================================
  // REFRESH PROFILE
  // =========================================================

  const refreshProfile = async () => {
    if (!user?.id) {
      setProfile(null);
      return null;
    }

    return await loadProfile(user);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const signOut = async () => {
    const response =
      await supabase.auth.signOut();

    setUser(null);
    setSession(null);
    setProfile(null);

    return response;
  };

  // =========================================================
  // DERIVED CUSTOMER INFORMATION
  // =========================================================

  const customerName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Customer";

  const customerEmail =
    user?.email || "";

  const customerPhone =
    profile?.phone ||
    user?.user_metadata?.phone ||
    "";

  const businessName =
    profile?.business_name ||
    user?.user_metadata?.business_name ||
    "";

  const businessType =
    profile?.business_type ||
    user?.user_metadata?.business_type ||
    "";

  const customerCity =
    profile?.city ||
    user?.user_metadata?.city ||
    "";

  const customerState =
    profile?.state ||
    user?.user_metadata?.state ||
    "";

  // =========================================================
  // PROFILE COMPLETION
  // =========================================================

  const profileFields = [
    customerName,
    customerEmail,
    customerPhone,
    businessName,
    customerCity,
    customerState,
  ];

  const completedFields =
    profileFields.filter(
      (value) =>
        String(value || "").trim() !== ""
    ).length;

  const profileCompletion = Math.round(
    (completedFields /
      profileFields.length) *
      100
  );

  // =========================================================
  // CONTEXT PROVIDER
  // =========================================================

  return (
    <AuthContext.Provider
      value={{
        // Authentication
        user,
        session,
        loading,

        // Customer profile
        profile,
        profileLoading,

        // Customer information
        customerName,
        customerEmail,
        customerPhone,
        businessName,
        businessType,
        customerCity,
        customerState,

        // Profile completion
        profileCompletion,

        // Core auth functions
        signUp,
        signIn,
        signOut,
        signInWithGoogle,

        // Compatibility aliases for legacy components
        register: signUp,
        login: signIn,
        logout: signOut,

        // Profile functions
        updateProfile,
        refreshProfile,
        loadProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ===========================================================
// useAuth Hook
// ===========================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}