using System;
using System.Collections.Generic;
using Nancy3.Models.Authentication;

namespace Nancy3.Infrastructure
{
    public interface IUserRepository
    {
        UserPrincipal User(Guid id);
        UserPrincipal User(string username);
        IEnumerable<UserPrincipal> GetAllUsers();
        IEnumerable<UserPrincipal> GetAdminUsers();
        void AddUser(UserPrincipal userIdentity);
        void AdminAddUsers(IEnumerable<UserPrincipal> newUsers);
        void DeleteUser(string username);
        void DeleteUsers(IEnumerable<string> usernames);
        void UpdateUserClaims(string username, string claims);
        void UpdatePasswordWarning(string username);
        void UpdateAccountInformation(string username, string first, string last, string company);
        void UpdateAccountPassword(string username, string password);
        Guid GenerateResetToken(string username);
        void ModifyClaims(IEnumerable<Tuple<string, string>> mods);
        void LockAccount(string username);
        void UnlockAccount(string username);
        void UpdateLastLogin(string username);
    }
}