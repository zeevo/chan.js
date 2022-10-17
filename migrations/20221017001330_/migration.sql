-- CreateTable
CREATE TABLE "Thread" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "threadId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Thread_threadId_key" ON "Thread"("threadId");
