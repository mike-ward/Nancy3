using App.Infrastructure.Extensions;
using App.Infrastructure.Interfaces;
using App.Infrastructure.Validatation;
using Nancy;
using Nancy.Authentication.Forms;

namespace App.Models.Authentication
{
    public class Session : ISession
    {
        private readonly IUserRepository _repository;

        public Session(IUserRepository repository)
        {
            _repository = repository;
        }

        public Response SignIn(UserNamePassword namePassword, NancyModule module)
        {
            var user = _repository.Find(namePassword.Name);
            if (user == null)
            {
                return HttpStatusCode.Unauthorized;
            }

            var hash = user.Hash(namePassword.Password);

            return user.Password.IsNotEqualTo(hash)
                ? HttpStatusCode.Unauthorized
                : module.LoginAndRedirect(user.Id);
        }

        public Response SignOut(NancyModule module) => module.Logout("/");

        public Response AddOrUpdateUser(IUserIdentity userIdentity) => HttpStatusCode.NotImplemented;

        public Response DeleteUser(IUserIdentity userIdentity) => HttpStatusCode.NotImplemented;

        public Response LockUser(IUserIdentity userIdentity) => HttpStatusCode.NotImplemented;

        public Response UnlockUser(IUserIdentity userIdentity) => HttpStatusCode.NotImplemented;
    }
}
