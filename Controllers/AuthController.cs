using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserAuthenticationApi.Exceptions;
using UserAuthenticationApi.Models;
using UserAuthenticationApi.Service;
using UserAuthenticationApi.DTO;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace UserAuthenticationApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var response = await _userService.AuthenticateAsync(request.Email, request.Password);
                return Ok(response);
            }
            catch (AppException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
        }

        
        [HttpPost("register")]        
        public async Task<IActionResult> Register(UserDto userDto)
        {
            try
            {
                await _userService.RegisterUserAsync(userDto);
                var response = await _userService.AuthenticateAsync(userDto.Email, userDto.Password);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

}
