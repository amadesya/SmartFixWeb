using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartFixApi.Migrations
{
    /// <inheritdoc />
    public partial class AnalyticsAndRepairServices2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_RepairRequests_TechnicianId",
                table: "RepairRequests",
                column: "TechnicianId");

            migrationBuilder.AddForeignKey(
                name: "FK_RepairRequests_Users_TechnicianId",
                table: "RepairRequests",
                column: "TechnicianId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RepairRequests_Users_TechnicianId",
                table: "RepairRequests");

            migrationBuilder.DropIndex(
                name: "IX_RepairRequests_TechnicianId",
                table: "RepairRequests");
        }
    }
}
