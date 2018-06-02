using System.Security.Claims;
using System.Security.Principal;

namespace App.Models.Authentication
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