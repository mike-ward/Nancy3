using System;
using System.Globalization;

namespace App.Infrastructure.Extensions
{
    public static class ObjectExtensions
    {
        public static string ToStringInvariant(this object item)
        {
            // Insure numbers like 7E-06 are expressed as 0.000007
            return item is double d
                ? d.ToString("0.###################", CultureInfo.InvariantCulture)
                : Convert.ToString(item, CultureInfo.InvariantCulture);
        }
    }
}
