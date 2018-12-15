using App.Models.Authentication;
using System.Collections.Generic;

namespace App.Infrastructure.Interfaces
{
    public interface IUserRepository
    {
        IEnumerable<UserIdentity> AllUsers();

        IEnumerable<UserIdentity> AdminUsers();

        void AddOrUpdateUser(UserIdentity userIdentity);

        void DeleteUser(UserIdentity userIdentity);

        UserIdentity Find(string name);
    }
}