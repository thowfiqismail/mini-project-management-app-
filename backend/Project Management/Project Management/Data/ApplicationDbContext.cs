using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Project_Management.Models;

namespace Project_Management.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }

        public DbSet<Notification> Notifications { get; set; }
    }
}
