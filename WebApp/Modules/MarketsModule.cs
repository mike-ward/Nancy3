using System;
using System.Net;
using Nancy;

namespace Nancy3.Modules
{
    public class MarketsModule : NancyModule
    {
        private static object Get(string url)
        {
            using (var client = new WebClient())
            {
                var data = client.DownloadString(new Uri(url));
                return data;
            }
        }

        public MarketsModule() : base("api/markets")
        {
            Get("most-active", args => Get("https://api.iextrading.com/1.0/stock/market/list/mostactive"));
            Get("gainers", args => Get("https://api.iextrading.com/1.0/stock/market/list/gainers"));
            Get("losers", args => Get("https://api.iextrading.com/1.0/stock/market/list/losers"));
            Get("news", args => Get("https://api.iextrading.com/1.0/stock/aapl/news"));
            Get("symbols", args => Get("https://api.iextrading.com/1.0/ref-data/symbols"));
        }
    }
}
