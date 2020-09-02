using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using ExploreNowWebapplicationAPI.Models;

namespace ExploreNowWebapplicationAPI.Controllers
{
    public class ActivitiesController : ApiController
    {
        private ExploreNowWebapplicationAPIContext db = new ExploreNowWebapplicationAPIContext();

        // GET: api/Activities
        public IQueryable<ActivityDTO> GetActivities()
        {
            // Hämtar aktiviterna från Activities och kopplar dom mot Categories genom ActivityDTO
            var activities = from b in db.Activities
                             select new ActivityDTO()
                             {
                                 Id = b.Id,
                                 Name = b.Name,
                                 CategoryName = b.Category.Name
                             };
            return activities;
        }

        // GET: api/Activities/5
        [ResponseType(typeof(ActivityDetailDTO))]
        public async Task<IHttpActionResult> GetActivity(int id)
        {
            // Hämtar en aktivitet och knyter den till 
            var activity = await db.Activities.Include(b => b.Category).Select(b =>
            new ActivityDetailDTO()
            {
                Id = b.Id,
                Name = b.Name,
                Description = b.Description,
                Latitude = b.Latitude,
                Longitude = b.Longitude,
                CategoryName = b.Category.Name
            }).SingleOrDefaultAsync(b => b.Id == id);

            if (activity == null)
            {
                return NotFound();
            }
            return Ok(activity);
        }

        // PUT: api/Activities/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutActivity(int id, Activity activity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != activity.Id)
            {
                return BadRequest();
            }

            db.Entry(activity).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ActivityExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Activities
        [ResponseType(typeof(ActivityDTO))] // [ResponseType(typeof(Activity))]
        public async Task<IHttpActionResult> PostActivity(Activity activity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Activities.Add(activity);
            await db.SaveChangesAsync();

            // Laddning av namn för kategori
            db.Entry(activity).Reference(x => x.Category).Load();
            var dto = new ActivityDTO()
            {
                Id = activity.Id,
                Name = activity.Name,
                CategoryName = activity.Category.Name
            };

            return CreatedAtRoute("DefaultApi", new { id = activity.Id }, dto);
        }

        // DELETE: api/Activities/5
        [ResponseType(typeof(Activity))]
        public async Task<IHttpActionResult> DeleteActivity(int id)
        {
            Activity activity = await db.Activities.FindAsync(id);
            if (activity == null)
            {
                return NotFound();
            }

            db.Activities.Remove(activity);
            await db.SaveChangesAsync();

            return Ok(activity);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ActivityExists(int id)
        {
            return db.Activities.Count(e => e.Id == id) > 0;
        }
    }
}