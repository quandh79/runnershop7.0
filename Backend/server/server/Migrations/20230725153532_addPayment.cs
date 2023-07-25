using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    public partial class addPayment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            

            migrationBuilder.AddColumn<bool>(
                name: "payment",
                table: "orders",
                type: "bit",
                nullable: false,
                defaultValue: false);

            
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            
        }
    }
}
