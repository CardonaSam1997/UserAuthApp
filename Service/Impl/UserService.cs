using BCrypt.Net;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserAuthenticationApi.DTO;
using UserAuthenticationApi.Exceptions;
using UserAuthenticationApi.Models;
using UserAuthenticationApi.Repository;

namespace UserAuthenticationApi.Service.Impl
{
    public class UserService : IUserService
    {

        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _config;

        public UserService(IUserRepository userRepository, IConfiguration config)
        {
            _userRepository = userRepository;
            _config = config;
        }

        public async Task<UserDetailDto?> FindUserByIdAsync(Guid id)
        {
            return await _userRepository.QueryUsers()
                .Where(u => u.Id == id)
                .Select(u => new UserDetailDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    Name = u.Name,
                    Role = u.Role,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt
                })
                .FirstOrDefaultAsync();
        }


        public async Task<PagedResult<UserListDto>> GetAllUsersAsync(string? search, int page, int size)
        {
            var query = _userRepository.QueryUsers(); // importante devolver IQueryable

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u => u.Name.Contains(search) || u.Email.Contains(search));
            }

            var totalItems = await query.CountAsync();

            var items = await query
                .OrderBy(u => u.Name)
                .Skip((page - 1) * size)
                .Take(size)
                .Select(u => new UserListDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    Name = u.Name,
                    Role = u.Role
                })
                .ToListAsync();

            return new PagedResult<UserListDto>
            {
                Items = items,
                TotalItems = totalItems,
                Page = page,
                Size = size
            };
        }

        public async Task<AuthResponse> AuthenticateAsync(string email, string password)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null) throw new AppException("Credenciales inválidas");

            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                throw new AppException("Credenciales inválidas");

            var token = GenerateJwtToken(user);

            return new AuthResponse
            {
                Token = token,
                User = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role
                }
            };
        }

        public async Task RegisterUserAsync(UserDto userDto)
        {
            var existing = await _userRepository.GetByEmailAsync(userDto.Email);
            if (existing != null)
                throw new InvalidOperationException("El correo ya está registrado.");
            
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = userDto.Email,
                Name = userDto.Name,
                Role = userDto.Role,
                PasswordHash = passwordHash,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddUserAsync(user);
        }


        public async Task UpdateUserAsync(User user)
        {
            var existing = await _userRepository.FindUserByIdAsync(user.Id);
            if (existing == null)
                throw new KeyNotFoundException("Usuario no encontrado.");

            var emailInUse = await _userRepository.GetByEmailAsync(user.Email);
            if (emailInUse != null && emailInUse.Id != user.Id)
                throw new InvalidOperationException("El correo ya está en uso por otro usuario.");

            existing.Name = user.Name;
            existing.Email = user.Email;
            existing.Role = user.Role;
            existing.IsActive = user.IsActive;
            existing.UpdatedAt = DateTime.UtcNow;
            
            if (!string.IsNullOrWhiteSpace(user.PasswordHash))
            {
                existing.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
            }

            await _userRepository.UpdateUserAsync(existing);
        }


        public async Task DeleteUserAsync(Guid id)
        {
            var existing = await _userRepository.FindUserByIdAsync(id);
            if (existing == null)
                throw new KeyNotFoundException("Usuario no encontrado.");

            await _userRepository.DeleteUserAsync(existing);
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(ClaimTypes.Role, string.IsNullOrEmpty(user.Role) ? "user" : user.Role) // 👈 validación
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


    }

    public class AuthResponse
    {
        public string Token { get; set; }
        public object User { get; set; }        
    }

}