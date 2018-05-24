using System.Security.Principal;

namespace Nancy3.Models.Authentication
{
    public static class PrincipalExtensions
    {
        public static UserPrincipal AsUserPrincipal(this IPrincipal principal)
        {
            return principal != null
                ? principal as UserPrincipal ?? new UserPrincipal(principal)
                : null;
        }
    }
}