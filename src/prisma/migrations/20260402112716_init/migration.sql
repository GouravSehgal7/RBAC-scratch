/*
  Warnings:

  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RolePermission";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_PermissionToRoles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PermissionToRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PermissionToRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "Roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToRoles_AB_unique" ON "_PermissionToRoles"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToRoles_B_index" ON "_PermissionToRoles"("B");
