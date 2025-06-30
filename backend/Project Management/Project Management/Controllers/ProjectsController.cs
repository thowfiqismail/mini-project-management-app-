using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Project_Management.Data;
using Project_Management.Models;
using ProjectManagementApp.Services;

namespace ProjectManagementApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<ProjectHub> _hub;
        private readonly SmsService _sms;
        private readonly string _toNumber;

        public ProjectsController(
            ApplicationDbContext context,
            IHubContext<ProjectHub> hub,
            SmsService sms,
            IConfiguration config)
        {
            _context = context;
            _hub = hub;
            _sms = sms;

            _toNumber = config["Twilio:ToNumber"];
        }

        // ✅ Get all projects
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await _context.Projects.ToListAsync();
            return Ok(projects);
        }

        // ✅ Create a project + notification
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Project project)
        {
            if (!IsAdmin()) return Forbid("Only Admins can create.");

            _context.Projects.Add(project);
            _context.Notifications.Add(new Notification
            {
                Message = $"Project '{project.Name}' created!"
            });

            await _context.SaveChangesAsync();
            await _hub.Clients.All.SendAsync("ProjectCreated");

            _sms.SendSms(_toNumber, $"Project '{project.Name}' created!");

            return Ok(project);
        }

        // ✅ Update project + notification
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Project updated)
        {
            if (!IsAdmin()) return Forbid("Only Admins can update.");

            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();

            project.Name = updated.Name;
            project.Description = updated.Description;

            _context.Notifications.Add(new Notification
            {
                Message = $"Project '{project.Name}' updated!"
            });

            await _context.SaveChangesAsync();
            await _hub.Clients.All.SendAsync("ProjectUpdated");

            _sms.SendSms(_toNumber, $"Project '{project.Name}' updated!");

            return Ok(project);
        }

        // ✅ Delete project + notification
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (!IsAdmin()) return Forbid("Only Admins can delete.");

            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();

            _context.Projects.Remove(project);
            _context.Notifications.Add(new Notification
            {
                Message = $"Project '{project.Name}' deleted!"
            });

            await _context.SaveChangesAsync();
            await _hub.Clients.All.SendAsync("ProjectDeleted");

            _sms.SendSms(_toNumber, $"Project '{project.Name}' deleted!");

            return NoContent();
        }

        [HttpDelete("notifications/{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var note = await _context.Notifications.FindAsync(id);
            if (note == null) return NotFound();

            _context.Notifications.Remove(note);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // ✅ Get all notifications
        [HttpGet("notifications")]
        public async Task<IActionResult> GetNotifications()
        {
            var notifications = await _context.Notifications
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
            return Ok(notifications);
        }

        // ✅ Mark one notification as read
        [HttpPost("notifications/{id}/mark-read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null) return NotFound();

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok();
        }

        // ✅ Helper: check RBAC
        private bool IsAdmin()
        {
            var role = Request.Headers["Role"].FirstOrDefault();
            return string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase);
        }
    }
}
