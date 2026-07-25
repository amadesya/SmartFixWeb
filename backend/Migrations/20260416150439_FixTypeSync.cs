using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartFixApi.Migrations
{
    /// <inheritdoc />
    public partial class FixTypeSync : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "TypeId",
                table: "SpareParts",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_SpareParts_SparePartType_TypeId",
                table: "SpareParts",
                column: "TypeId",
                principalTable: "SparePartType",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "TypeId",
                table: "SpareParts",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SpareParts_SparePartType_TypeId",
                table: "SpareParts",
                column: "TypeId",
                principalTable: "SparePartType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
