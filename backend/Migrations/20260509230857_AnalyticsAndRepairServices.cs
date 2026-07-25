using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartFixApi.Migrations
{
    /// <inheritdoc />
    public partial class AnalyticsAndRepairServices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RepairRequestId",
                table: "Reviews",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CompletedAt",
                table: "RepairRequests",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MasterBonus",
                table: "RepairRequests",
                type: "decimal(65,30)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PartsCost",
                table: "RepairRequests",
                type: "decimal(65,30)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RepairRequestId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "CompletedAt",
                table: "RepairRequests");

            migrationBuilder.DropColumn(
                name: "MasterBonus",
                table: "RepairRequests");

            migrationBuilder.DropColumn(
                name: "PartsCost",
                table: "RepairRequests");
        }
    }
}
