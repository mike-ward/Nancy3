using Nancy;

namespace App.Modules
{
    public class IndexModule : NancyModule
    {
        public IndexModule()
        {
            Get("/", args => View["index"]);
        }
    }
}
