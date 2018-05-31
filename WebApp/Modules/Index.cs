using Nancy;

namespace App.Modules
{
    public class Index : NancyModule
    {
        public Index()
        {
            Get("/", args => View["index"]);
        }
    }
}
