// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useToast } from "@/hooks/use-toast";

// interface User {
//   id: string;
//   email: string;
//   firstName?: string;
//   lastName?: string;
//   profileImageUrl?: string;
//   role: "admin" | "user";
//   status: "active" | "blocked";
//   createdAt: string;
//   updatedAt: string;
// }

// async function fetchUser(): Promise<User | null> {
//   try {
//     const response = await fetch("/api/v1/auth/user", {
//       credentials: "include",
//     });

//     if (!response.ok) {
//       if (response.status === 401) {
//         return null;
//       }
//       throw new Error("Failed to fetch user");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     return null;
//   }
// }

// async function logoutUser(): Promise<void> {
//   const response = await fetch("/api/v1/auth/logout", {
//     method: "POST",
//     credentials: "include",
//   });

//   if (!response.ok) {
//     throw new Error("Failed to logout");
//   }
// }

// export function useAuth() {
//   const queryClient = useQueryClient();
//   const { toast } = useToast();

//   const {
//     data: user,
//     isLoading,
//     error,
//   } = useQuery<User | null>({
//     queryKey: ["user"],
//     queryFn: fetchUser,
//     retry: false,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });

//   const logoutMutation = useMutation({
//     mutationFn: logoutUser,
//     onSuccess: () => {
//       queryClient.setQueryData(["user"], null);
//       toast({
//         title: "Logged out",
//         description: "You have been successfully logged out.",
//       });
//       // Optionally redirect to home
//       window.location.href = "/";
//     },
//     onError: (error) => {
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to logout",
//         variant: "destructive",
//       });
//     },
//   });

//   return {
//     user,
//     isAuthenticated: !!user,
//     isLoading,
//     error,
//     logout: logoutMutation.mutate,
//     isLoggingOut: logoutMutation.isPending,
//   };
// }



import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: "admin" | "user";
  status: "active" | "blocked";
  createdAt: string;
  updatedAt: string;
  isSSOUser?: boolean;
}

async function fetchUser(): Promise<User | null> {
  try {
    const response = await fetch("/api/v1/auth/user", {
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      throw new Error("Failed to fetch user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

async function logoutUser(): Promise<{ ssoLogout: boolean; ssoLogoutUrl?: string }> {
  const response = await fetch("/api/v1/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to logout");
  }

  return await response.json();
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      // Clear user from cache
      queryClient.setQueryData(["user"], null);

      // Clear all queries (removes any cached data)
      queryClient.clear();

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });

      // If SSO user, redirect to SSO logout to clear SSO session
      if (data.ssoLogout && data.ssoLogoutUrl) {
        console.log("SSO user - redirecting to SSO logout");
        // Redirect to SSO logout URL
        window.location.href = data.ssoLogoutUrl + 
          `?post_logout_redirect_uri=${encodeURIComponent(window.location.origin + "/signin")}`;
      } else {
        // Regular user - just redirect to home
        window.location.href = "/";
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to logout",
        variant: "destructive",
      });
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}



// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useToast } from "@/hooks/use-toast";

// interface User {
//   id: string;
//   email: string;
//   firstName?: string;
//   lastName?: string;
//   profileImageUrl?: string;
//   role: "admin" | "user";
//   status: "active" | "blocked";
//   createdAt: string;
//   updatedAt: string;
//   isSSOUser?: boolean;
// }

// async function fetchUser(): Promise<User | null> {
//   try {
//     const response = await fetch("/api/v1/auth/user", {
//       credentials: "include",
//     });

//     if (!response.ok) {
//       if (response.status === 401) {
//         return null;
//       }
//       throw new Error("Failed to fetch user");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     return null;
//   }
// }

// async function logoutUser(): Promise<{ ssoLogout: boolean; ssoLogoutUrl?: string }> {
//   const response = await fetch("/api/v1/auth/logout", {
//     method: "POST",
//     credentials: "include",
//   });

//   if (!response.ok) {
//     throw new Error("Failed to logout");
//   }

//   return await response.json();
// }

// export function useAuth() {
//   const queryClient = useQueryClient();
//   const { toast } = useToast();

//   const {
//     data: user,
//     isLoading,
//     error,
//   } = useQuery<User | null>({
//     queryKey: ["user"],
//     queryFn: fetchUser,
//     retry: false,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });

//   const logoutMutation = useMutation({
//     mutationFn: logoutUser,
//     onSuccess: (data) => {
//       // Clear user from cache
//       queryClient.setQueryData(["user"], null);

//       // Clear all queries (removes any cached data)
//       queryClient.clear();

//       toast({
//         title: "Logged out",
//         description: "You have been successfully logged out.",
//       });

//       // If SSO user, redirect to SSO logout with proper return URL
//       // if (data.ssoLogout && data.ssoLogoutUrl) {
//       //   console.log("SSO user - redirecting to SSO logout");

//       //   // Construct SSO logout URL with return to homepage
//       //   const returnUrl = encodeURIComponent("https://3d.ebc.edu.kh");
//       //   const ssoLogoutUrl = `${data.ssoLogoutUrl}?post_logout_redirect_uri=${returnUrl}`;

//       //   console.log("SSO logout URL:", ssoLogoutUrl);

//       //   // Redirect to SSO logout (SSO will handle its own confirmation and redirect back)
//       //   window.location.href = ssoLogoutUrl;
//       // }
//       if (data.ssoLogout && data.ssoLogoutUrl) {
//         const returnUrl = "https://3d.ebc.edu.kh/signup";

//         // WSO2 might need multiple parameters
//         const logoutUrl = `${data.ssoLogoutUrl}?` + new URLSearchParams({
//           post_logout_redirect_uri: returnUrl,
//           redirect_uri: returnUrl,
//           returnTo: returnUrl,
//           client_id: "2XYnAUKbfsZgsOTO19gFsvNP8usa",
//         }).toString();

//         window.location.href = logoutUrl;
//       }
//       else {
//         // Regular user - redirect to home page
//         window.location.href = "https://3d.ebc.edu.kh";
//       }
//       //window.location.href = "https://3d.ebc.edu.kh";
//       //window.location.reload();
//     },
//     onError: (error) => {
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to logout",
//         variant: "destructive",
//       });
//     },
//   });

//   return {
//     user,
//     isAuthenticated: !!user,
//     isLoading,
//     error,
//     logout: logoutMutation.mutate,
//     isLoggingOut: logoutMutation.isPending,
//   };
// }