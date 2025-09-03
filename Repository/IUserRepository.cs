using Microsoft.EntityFrameworkCore;
using UserAuthenticationApi.Models;


namespace UserAuthenticationApi.Repository
{
    public interface IUserRepository
    {

        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> FindUserByIdAsync(Guid id);
        Task<User?> GetByEmailAsync(string email);
        Task<User> AddUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(User user);

    }
}
