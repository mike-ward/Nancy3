using App.Infrastructure.Interfaces;
using App.Infrastructure.Validatation;
using Nancy;
using Nancy.ModelBinding;

namespace App.Modules
{
    public sealed class AuthenticateModule : NancyModule
    {
        public AuthenticateModule(ISession session) : base("api/auth")
        {
            Post("/sign-in", args => session.SignIn(this.Bind<UserNamePassword>(), this));
            Post("/sign-out", args => session.SignOut(this));
            Post("/add-or-update-user", args => session.AddOrUpdateUser(this.Bind<IUserIdentity>()));
            Post("/delete-user", args => session.DeleteUser(this.Bind<IUserIdentity>()));
            Post("/lock-user", args => session.LockUser(this.Bind<IUserIdentity>()));
            Post("/unlock-user", args => session.UnlockUser(this.Bind<IUserIdentity>()));
        }
    }
}