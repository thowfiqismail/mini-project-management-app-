using Microsoft.AspNetCore.Mvc;
using Project_Management.Data;
using Project_Management.Models;


[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuthController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] User loginUser)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username == loginUser.Username && u.Role == loginUser.Role);
        if (user != null)
        {
            return Ok(user);
        }
        else
        {
            return null;
        }
        
    }
}
