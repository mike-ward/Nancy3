﻿using System;
using System.Security.Claims;
using App.Infrastructure;
using Nancy;
using Nancy.Authentication.Forms;

namespace App.Models.Authentication.Forms
{
    public class UserMapperForms : IUserMapper
    {
        private readonly IUserRepository _userRepository;

        public UserMapperForms(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public ClaimsPrincipal GetUserFromIdentifier(Guid identifier, NancyContext context)
        {
            throw new NotImplementedException();
        }
    }
}