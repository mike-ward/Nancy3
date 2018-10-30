using System;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace App.Infrastructure.Cryptography
{
    public class Crypto
    {
        public static string HashPassword(string password, Guid salt)
        {
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentNullException(nameof(password));
            if (salt == Guid.Empty) throw new ArgumentException("salt");
            using (var md5 = MD5.Create())
            {
                var bytes = md5.ComputeHash(Encoding.UTF8.GetBytes(password + salt));
                return string.Join(null, bytes.Select(b => b.ToString("x2", CultureInfo.InvariantCulture)));
            }
        }
    }
}
