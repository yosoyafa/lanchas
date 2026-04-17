-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerPhone" TEXT NOT NULL,
    "customerName" TEXT,
    "boatNumber" INTEGER NOT NULL,
    "requestedDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "paymentReceiptUrl" TEXT,
    "rejectionReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentSubmittedAt" DATETIME,
    "reviewedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
