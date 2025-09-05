using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserAuthenticationApi.DTO;
using UserAuthenticationApi.Exceptions;
using UserAuthenticationApi.Models;
using UserAuthenticationApi.Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace UserAuthenticationApi.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Register(UserDto userDto)
        {
            try
            {
                await _userService.RegisterUserAsync(userDto);
                return Ok(new { message = "Usuario creado con éxito." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user = await _userService.FindUserByIdAsync(id);
            if (user == null)
                return NotFound(new { error = "Usuario no encontrado." });

            return Ok(user);
        }

      
        [HttpGet]
        [Authorize(Roles = "admin")]        
        public async Task<IActionResult> GetAllUsers([FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int size = 10)
        {
            var result = await _userService.GetAllUsersAsync(search, page, size);
            return Ok(result);
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] User user)
        {
            if (id != user.Id)
                return BadRequest(new { error = "El ID no coincide." });

            try
            {
                await _userService.UpdateUserAsync(user);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]

        public async Task<IActionResult> DeleteUser(Guid id)
        {
            try
            {
                await _userService.DeleteUserAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }

    }
}
