using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using App.Infrastructure.Extensions;
using App.Infrastructure.Interfaces;
using App.Infrastructure.Validatation;
using Nancy;
using Newtonsoft.Json;

namespace App.Models.Authentication.Repositories
{
    public class UserRepositoryFile : IUserRepository
    {
        private readonly IRootPathProvider _rootPathProvider;
        private static readonly object LockObj = new object();

        public UserRepositoryFile(IRootPathProvider rootPathProvider)
        {
            _rootPathProvider = rootPathProvider;
        }

        public IEnumerable<UserIdentity> AllUsers()
        {
            var users = ReadUsers();
            return users;
        }

        public IEnumerable<UserIdentity> AdminUsers()
        {
            var users = ReadUsers().Where(user => user.Claims.Contains("admin"));
            return users;
        }

        public void AddOrUpdateUser(UserIdentity userIdentity)
        {
            Require.ArgumentNotNull(userIdentity, nameof(userIdentity));

            var users = ReadUsers()
                .Where(user => userIdentity.Id != user.Id)
                .Concat(new[] { userIdentity })
                .ToList();

            WriteUsers(users);
        }

        public void DeleteUser(UserIdentity userIdentity)
        {
            Require.ArgumentNotNull(userIdentity, nameof(userIdentity));

            var users = ReadUsers()
                .Where(user => userIdentity.Id != user.Id)
                .ToList();

            WriteUsers(users);
        }

        public UserIdentity Find(string name)
        {
            Require.ArgumentNotNullEmpty(name, nameof(name));
            var users = ReadUsers();
            var user = users.Find(u => u.UserId.IsEqualToIgnoreCase(name));
            return user;
        }

        private string GetFilePath()
        {
            // If no config setting, return default
            return Path.Combine(_rootPathProvider.GetRootPath(), "App_Data/Users.dat");
        }

        private List<UserIdentity> ReadUsers()
        {
            if (!Monitor.TryEnter(LockObj, 2000))
            {
                return new List<UserIdentity>();
            }

            try
            {
                var path = GetFilePath();

                return !File.Exists(path)
                    ? new List<UserIdentity>()
                    : JsonConvert.DeserializeObject<List<UserIdentity>>(File.ReadAllText(path));
            }
            finally
            {
                Monitor.Exit(LockObj);
            }
        }

        private void WriteUsers(List<UserIdentity> users)
        {
            if (!Monitor.TryEnter(LockObj, 2000))
            {
                throw new Exception("User repository is locked, cannot update users");
            }

            try
            {
                var path = GetFilePath();

                var name = Path.GetFileNameWithoutExtension(path);
                var dir = Path.GetDirectoryName(path);
                if (dir == null) throw new Exception("Cannot get repository directory");
                var backup = Path.Combine(dir, name + ".bak");

                // Remove Backup
                if (File.Exists(backup))
                {
                    File.Delete(backup);
                }

                // Rename existing file
                if (File.Exists(path))
                {
                    File.Move(path, backup);
                }

                File.WriteAllText(path, JsonConvert.SerializeObject(users, Formatting.Indented));
            }
            finally
            {
                Monitor.Exit(LockObj);
            }
        }
    }
}
