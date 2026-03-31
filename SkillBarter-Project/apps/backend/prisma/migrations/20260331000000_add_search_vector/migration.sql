-- Add search_vector column to Skill
ALTER TABLE "Skill" ADD COLUMN "search_vector" tsvector;

-- Create GIN index on search_vector
CREATE INDEX "skills_search_idx" ON "Skill" USING GIN ("search_vector");

-- Update all existing skills to compute the vector
UPDATE "Skill" SET "search_vector" = to_tsvector('english', title || ' ' || description || ' ' || category);

-- Note: In this project, the tsvector update is handled explicitly in the Application Controller after saving. But we could also use a trigger. The codebase explicitly requests the raw SQL execution from code in guide.txt.
