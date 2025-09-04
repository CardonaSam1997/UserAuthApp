using UserAuthenticationApi.Models;
using UserAuthenticationApi.DTO;

namespace UserAuthenticationApi.Service
{
    public interface IUserService
    {        
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<string> AuthenticateAsync(string email, string password);
        Task<User> RegisterUserAsync(UserDto userDto);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(Guid id);
        Task <User?> FindUserByIdAsync(Guid id);

    }
}
