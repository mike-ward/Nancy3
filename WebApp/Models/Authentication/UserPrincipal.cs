using System.Security.Claims;
using System.Security.Principal;

namespace Nancy3.Models.Authentication
{
    public class UserPrincipal : ClaimsPrincipal
    {
        public UserPrincipal(IPrincipal principal)
            : base(principal)
        {
        }

        public string FullName => FindFirst(ClaimTypes.Name).Value;
    }
}