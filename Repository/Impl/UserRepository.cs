using Microsoft.EntityFrameworkCore;
using UserAuthenticationApi.Models;
using UserAuthenticationApi.Repository;

namespace UserAuthenticationApi.Repository.Impl
{
    public class UserRepository : IUserRepository
    {
        private readonly UserAuthDbContext _context;

        public UserRepository(UserAuthDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync() =>
        await _context.Users.AsNoTracking().ToListAsync();

        public async Task<User?> FindUserByIdAsync(Guid id) =>
            await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);

        public async Task<User?> GetByEmailAsync(string email) =>
            await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == email);

        public async Task<User> AddUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }



    }
}
