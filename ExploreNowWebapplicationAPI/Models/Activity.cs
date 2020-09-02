using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace ExploreNowWebapplicationAPI.Models
{
    public class Activity
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        // Främmande nyckel till kategorier
        public int CategoryId { get; set; }
        // Navigering till kategorier
        public Category Category { get; set; }
    }
}