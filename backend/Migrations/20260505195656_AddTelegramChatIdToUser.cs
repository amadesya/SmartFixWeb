using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartFixApi.Migrations
{
    /// <inheritdoc />
    public partial class AddTelegramChatIdToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "TelegramChatId",
                table: "Users",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RepairRequests_ClientId",
                table: "RepairRequests",
                column: "ClientId");


            migrationBuilder.AddForeignKey(
                name: "FK_RepairRequests_Users_ClientId",
                table: "RepairRequests",
                column: "ClientId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Employees_Users_UserId",
                table: "Employees");

            migrationBuilder.DropForeignKey(
                name: "FK_RepairRequests_Users_ClientId",
                table: "RepairRequests");

            migrationBuilder.DropIndex(
                name: "IX_RepairRequests_ClientId",
                table: "RepairRequests");

            migrationBuilder.DropColumn(
                name: "TelegramChatId",
                table: "Users");
        }
    }
}
