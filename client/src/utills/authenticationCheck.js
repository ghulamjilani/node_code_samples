import { Roles } from "./constants";
export const authenticationCheck = (user, navigate) => {
  if (user.identityVerificationStatus !== "approved") {
    navigate("/identity-verification");
  } else if (!user.isEmailVerified) {
    navigate("/login");
  } else if (!user.isContactVerified) {
    navigate("/otp-verification", {
      state: {
        verifyToken: user.verifyToken,
        contactNumber: user.contactNumber,
        id: user?.id,
        userEmail: user?.email,
        userRole: data?.user?.role,
      },
    });
  }
};

export const isClientPortal = () => {
  let location = window.location;

  if (location.origin?.includes("advise")) return false;

  return true;
};

export const checkRole = (role) => {
  const location = window.location;

  const origin = location.origin?.toLocaleLowerCase();

  // Allow localhost for all roles
  if (origin.includes("localhost")) return true;

  switch (role) {
    case Roles.SUPER_ADMIN:
    case Roles.FINANCIAL_ADVISER:
    case Roles.ADVISED_CLIENT:
      return (
        origin.includes("advisedplatform.mespensions.com") ||
        origin.includes("advisedplatform-staging.mespensions.com")
      );
    case Roles.CLIENT:
      return (
        origin.includes("clientplatform.mespensions.com") ||
        origin.includes("clientplatform-staging.mespensions.com")
      );
    default:
      return false;
  }
};
