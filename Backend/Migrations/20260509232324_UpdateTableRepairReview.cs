using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartFixApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTableRepairReview : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Reviews_RepairRequestId",
                table: "Reviews",
                column: "RepairRequestId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_RepairRequests_RepairRequestId",
                table: "Reviews",
                column: "RepairRequestId",
                principalTable: "RepairRequests",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_RepairRequests_RepairRequestId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_RepairRequestId",
                table: "Reviews");
        }
    }
}
