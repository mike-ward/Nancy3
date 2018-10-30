using System;
using System.Collections.Generic;

namespace App.Infrastructure.Interfaces
{
    public interface IUserIdentity
    {
        Guid Id { get; }
        string UserId { get; }
        string Password { get; }
        IEnumerable<string> Claims { get; }
        string FirstName { get; }
        string LastName { get; }
        Guid ResetToken { get; }
        DateTime LastModified { get; }

        string Hash(string password);
        void SetUserId(string name);
        void SetPassword(string password);
        void SetFirstName(string first);
        void SetLastName(string last);
        void AddClaim(string claim);
        void RemoveClaim(string claim);
        void SetResetToken();
        void ClearResetToken();
        void SetLastModified();
    }
}