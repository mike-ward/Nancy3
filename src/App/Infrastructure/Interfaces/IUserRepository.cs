using System.Collections.Generic;
using App.Models.Authentication;

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