using App.Infrastructure.Interfaces;
using Nancy;
using Nancy.Authentication.Forms;
using System;
using System.Security.Claims;

namespace App.Models.Authentication.Forms
{
    public class UserMapperForms : IUserMapper
    {
        private readonly IUserRepository _userRepository;

        public UserMapperForms(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public ClaimsPrincipal GetUserFromIdentifier(Guid identifier, NancyContext context) => throw new NotImplementedException();
    }
}