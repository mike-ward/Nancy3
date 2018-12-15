using Nancy;

namespace App.Modules
{
    public sealed class IndexModule : NancyModule
    {
        public IndexModule()
        {
            Get("/", args => View["index"]);
        }
    }
}