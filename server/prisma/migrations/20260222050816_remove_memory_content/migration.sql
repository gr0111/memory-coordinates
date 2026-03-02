/*
  Warnings:

  - You are about to drop the column `content` on the `Memory` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Memory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "memo" TEXT,
    "date" DATETIME NOT NULL,
    "tags" TEXT,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "addressText" TEXT,
    "fullAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Memory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Memory" ("addressText", "createdAt", "date", "fullAddress", "id", "lat", "lng", "memo", "tags", "title", "updatedAt", "userId") SELECT "addressText", "createdAt", "date", "fullAddress", "id", "lat", "lng", "memo", "tags", "title", "updatedAt", "userId" FROM "Memory";
DROP TABLE "Memory";
ALTER TABLE "new_Memory" RENAME TO "Memory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
