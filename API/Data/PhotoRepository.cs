using API.Dtos;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly DataContext _context;

        public PhotoRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Photo> GetPhotoById(int photoId)
        {
            return await _context.Photos.IgnoreQueryFilters().Where(p => p.Id == photoId).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<PhotoForApprovalDto>> GetUnapprovedPhotos()
        {
            return await _context.Photos
                .IgnoreQueryFilters()
                .Where(p => p.IsApproved != true)
                .Select(u => new PhotoForApprovalDto
                    {
                        PhotoId = u.Id,
                        Username = u.AppUser.UserName,
                        PhotoUrl = u.Url,
                        IsApproved = u.IsApproved
                    }).ToListAsync();
        }

        public async Task RemovePhoto(Photo photo)
        {
            _context.Photos.Remove(photo);
        }
    }
}
