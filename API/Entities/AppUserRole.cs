using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    // this class is acting like our join table for AppUser and AppRole
    public class AppUserRole : IdentityUserRole<int>
    {
        public AppUser User { get; set; }
        public AppRole Role { get; set; }
    }
}
