namespace ExploreNowWebapplicationAPI.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using ExploreNowWebapplicationAPI.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<ExploreNowWebapplicationAPI.Models.ExploreNowWebapplicationAPIContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(ExploreNowWebapplicationAPI.Models.ExploreNowWebapplicationAPIContext context)
        {
            context.Categories.AddOrUpdate(x => x.Id,
                new Category() { Id = 1, Name = "Fiske"},
                new Category() { Id = 2, Name = "Vandring"},
                new Category() { Id = 3, Name = "Skidåkning"},
                new Category() { Id = 4, Name = "Längdskidåkning"},
                new Category() { Id = 5, Name = "Cykling"}
                );
            //https://www.gpskoordinater.com/
            context.Activities.AddOrUpdate(x => x.Id,
                new Activity()
                {
                    Id = 1,
                    Name = "Forsaleden",
                    Description = "Vandringsled längst Forsaleden.",
                    Latitude = 14.967649100000017,
                    Longitude = 62.8988458,
                    CategoryId = 2
                },
                new Activity()
                {
                    Id = 2,
                    Name = "Bydalen",
                    Description = "Utförsåkning i Bydalen.",
                    Latitude = 13.796461099999988,
                    Longitude = 63.10122430000001,
                    CategoryId = 3
                },
                new Activity()
                {
                    Id = 3,
                    Name = "Hannacksjön",
                    Description = "Bra fiskeställe för stor abborre.",
                    Latitude = 15.2974289,
                    Longitude = 63.19891579999999,
                    CategoryId = 1
                },
                new Activity()
                {
                    Id = 4,
                    Name = "Åre",
                    Description = "Utförsåkning i Åre.",
                    Latitude = 13.081505800000059,
                    Longitude = 63.3990428,
                    CategoryId = 3
                },
                new Activity()
                {
                    Id = 5,
                    Name = "Stora renger",
                    Description = "Fiskevatten med bra badmöjligheter.",
                    Latitude = 15.720074699999941,
                    Longitude = 58.2589227,
                    CategoryId = 1
                },
                new Activity()
                {
                    Id = 6,
                    Name = "Fusteli Cykelstigar",
                    Description = "Stig- och enduroåkning i Fugelsta.",
                    Latitude = 63.10840744170753,
                    Longitude = 14.723997116088867,
                    CategoryId = 5
                },
                new Activity()
                {
                    Id = 7,
                    Name = "Torråsen Längdskidspår",
                    Description = "Längdskidspår i Torråsen.",
                    Latitude = 63.199582052986784,
                    Longitude = 14.72468376159668,
                    CategoryId = 4
                }
            );
           
        }
    }
}
