using App.Infrastructure.Validatation;
using Nancy;

namespace App.Infrastructure.Interfaces
{
    public interface ISession
    {
        Response SignIn(UserNamePassword namePassword, NancyModule module);

        Response SignOut(NancyModule module);

        Response AddOrUpdateUser(IUserIdentity userIdentity);

        Response DeleteUser(IUserIdentity userIdentity);

        Response LockUser(IUserIdentity userIdentity);

        Response UnlockUser(IUserIdentity userIdentity);
    }
}