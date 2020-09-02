using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ExploreNowWebapplicationAPI.Models
{
    public class ActivityDetailDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string CategoryName { get; set; }
    }
}