-- DropUnique
DROP INDEX "File_code_key";

-- CreateIndex
CREATE INDEX "File_code_idx" ON "File"("code");
