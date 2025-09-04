using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserAuthenticationApi.Models;
using UserAuthenticationApi.Repository;
using UserAuthenticationApi.Exceptions;
using UserAuthenticationApi.DTO;

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

        public async Task<User?> FindUserByIdAsync(Guid id)
        {
            var user = await _userRepository.FindUserByIdAsync(id);      
            if (user == null) throw new InvalidOperationException("Usuario no encontrado.");
            return user;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync() =>
            await _userRepository.GetAllUsersAsync();

        public async Task<string> AuthenticateAsync(string email, string password)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null) throw new AppException("Credenciales invalidas");

            // Aquí deberías validar el password con hash + salt
            if (password != "1234") throw new AppException("Credenciales invalidas");

            return GenerateJwtToken(user);
        }       

        public async Task<User> RegisterUserAsync(UserDto userDto)
        {
            var existing = await _userRepository.GetByEmailAsync(userDto.Email);
            if (existing != null)
                throw new InvalidOperationException("El correo ya está registrado.");

            using var hmac = new System.Security.Cryptography.HMACSHA512();
            var user = new User{
                Id = Guid.NewGuid(),
                Email = userDto.Email,
                Name = userDto.Name,
                Role = userDto.Role,
                PasswordSalt = hmac.Key,
                PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(userDto.Password)),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            return await _userRepository.AddUserAsync(user);
        }

        public async Task UpdateUserAsync(User user)
        {
            var existing = await _userRepository.FindUserByIdAsync(user.Id);
            if (existing == null)
                throw new KeyNotFoundException("Usuario no encontrado.");
            
            var emailInUse = await _userRepository.GetByEmailAsync(user.Email);
            if (emailInUse != null && emailInUse.Id != user.Id)
                throw new InvalidOperationException("El correo ya está en uso por otro usuario.");

            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateUserAsync(user);
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
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
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
}