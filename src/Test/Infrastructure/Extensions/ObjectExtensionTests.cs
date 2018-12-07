using App.Infrastructure.Extensions;
using FluentAssertions;
using System;
using Xunit;

namespace Test.Infrastructure.Extensions
{
    public class ObjectExtensionTests
    {
        [Fact]
        public void DoubleToStringTests()
        {
            7e-10.ToStringInvariant().Should().Be("0.0000000007");
            7e5.ToStringInvariant().Should().Be("700000");
        }

        [Fact]
        public void DateToStringTest()
        {
            var date = new DateTime(2018, 12, 3, 11, 59, 0, DateTimeKind.Utc);
            date.ToStringInvariant().Should().Be("2018-12-03 11:59:00Z");
        }

        [Fact]
        public void StringToStringTests()
        {
            "Trump".ToStringInvariant().Should().Be("Trump");
            "Mir geht es gut, danke!".Should().Be("Mir geht es gut, danke!");
        }
    }
}
