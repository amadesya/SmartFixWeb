using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartFixApi.Migrations
{
    /// <inheritdoc />
    public partial class SparePartTypeAddMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "SpareParts",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "SpareParts");
        }
    }
}
