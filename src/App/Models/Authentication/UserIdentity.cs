using App.Infrastructure.Cryptography;
using App.Infrastructure.Extensions;
using App.Infrastructure.Interfaces;
using App.Infrastructure.Validatation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace App.Models.Authentication
{
    [DataContract]
    public class UserIdentity : IUserIdentity
    {
        public Guid Id { get; } = Guid.NewGuid();
        public string UserId { get; private set; } = string.Empty;
        public string Password { get; private set; } = string.Empty;
        public string FirstName { get; private set; } = string.Empty;
        public string LastName { get; private set; } = string.Empty;
        public IEnumerable<string> Claims { get; private set; } = new string[0];
        public Guid ResetToken { get; private set; } = Guid.Empty;
        public DateTime LastModified { get; private set; } = DateTime.UtcNow;

        public IUserIdentity Clone()
        {
            return (IUserIdentity)MemberwiseClone();
        }

        public void SetLastModified()
        {
            LastModified = DateTime.UtcNow;
        }

        public void SetUserId(string name)
        {
            Require.ArgumentNotNullEmpty(name, nameof(name));
            UserId = name;
        }

        public void SetPassword(string password)
        {
            Require.ArgumentNotNullEmpty(password, nameof(password));
            Password = password;
        }

        public void SetFirstName(string first)
        {
            Require.ArgumentNotNullEmpty(first, nameof(first));
            FirstName = first;
        }

        public void SetLastName(string last)
        {
            Require.ArgumentNotNullEmpty(last, nameof(last));
            LastName = last;
        }

        public void AddClaim(string claim)
        {
            Require.ArgumentNotNullEmpty(claim, nameof(claim));
            Claims = Claims.Concat(new[] { claim }).Distinct().ToArray();
        }

        public void RemoveClaim(string claim)
        {
            Require.ArgumentNotNullEmpty(claim, nameof(claim));
            Claims = Claims.Where(cm => cm.IsNotEqualTo(claim)).ToArray();
        }

        public void SetResetToken()
        {
            ResetToken = Guid.NewGuid();
        }

        public void ClearResetToken()
        {
            ResetToken = Guid.Empty;
        }

        public string Hash(string password)
        {
            return Crypto.HashPassword(password, Id);
        }
    }
}