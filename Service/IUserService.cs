using UserAuthenticationApi.Models;

namespace UserAuthenticationApi.Service
{
    public interface IUserService
    {
        Task<string> AuthenticateAsync(string email, string password);
        Task<User> RegisterUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(Guid id);

    }
}
