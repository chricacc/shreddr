/*
  Warnings:

  - Made the column `difficulty` on table `Exercise` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "published" BOOLEAN DEFAULT false,
    "archived" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "difficulty" TEXT NOT NULL
);
INSERT INTO "new_Exercise" ("archived", "createdAt", "description", "difficulty", "id", "name", "published", "slug", "updatedAt") SELECT "archived", "createdAt", "description", "difficulty", "id", "name", "published", "slug", "updatedAt" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
CREATE UNIQUE INDEX "Exercise_slug_key" ON "Exercise"("slug");
CREATE INDEX "Exercise_slug_idx" ON "Exercise"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
