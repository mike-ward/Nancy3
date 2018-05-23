using Nancy;

namespace Nancy3.Modules
{
    public class Index : NancyModule
    {
        public Index()
        {
            Get("/", args => View["index"]);
        }
    }
}
