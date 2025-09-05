using UserAuthenticationApi.DTO;
using UserAuthenticationApi.Models;
using UserAuthenticationApi.Service.Impl;

namespace UserAuthenticationApi.Service
{
    public interface IUserService
    {        
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<AuthResponse> AuthenticateAsync(string email, string password);
        Task RegisterUserAsync(UserDto userDto);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(Guid id);
        Task <User?> FindUserByIdAsync(Guid id);

    }
}
