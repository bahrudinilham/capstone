-- CreateTable
CREATE TABLE `Student` (
    `student_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Student_email_key`(`email`),
    PRIMARY KEY (`student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentProgress` (
    `progress_id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `course_name` VARCHAR(191) NOT NULL,
    `learning_path_id` INTEGER NOT NULL,
    `active_tutorials` INTEGER NOT NULL DEFAULT 0,
    `completed_tutorials` INTEGER NOT NULL DEFAULT 0,
    `is_graduated` BOOLEAN NOT NULL DEFAULT false,
    `already_generated_certificate` BOOLEAN NOT NULL DEFAULT false,
    `final_submission_id` INTEGER NULL,
    `submission_rating` INTEGER NULL,
    `final_exam_id` INTEGER NULL,
    `exam_score` INTEGER NULL,
    `started_learning_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`progress_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LearningPath` (
    `learning_path_id` INTEGER NOT NULL AUTO_INCREMENT,
    `learning_path_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`learning_path_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `course_id` INTEGER NOT NULL AUTO_INCREMENT,
    `learning_path_id` INTEGER NOT NULL,
    `course_name` VARCHAR(191) NOT NULL,
    `course_level_str` INTEGER NOT NULL,
    `hours_to_study` INTEGER NOT NULL,

    UNIQUE INDEX `Course_course_name_key`(`course_name`),
    PRIMARY KEY (`course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseLevel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_level` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tutorial` (
    `tutorial_id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_id` INTEGER NOT NULL,
    `tutorial_title` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`tutorial_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentProgress` ADD CONSTRAINT `StudentProgress_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Student`(`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentProgress` ADD CONSTRAINT `StudentProgress_course_name_fkey` FOREIGN KEY (`course_name`) REFERENCES `Course`(`course_name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentProgress` ADD CONSTRAINT `StudentProgress_learning_path_id_fkey` FOREIGN KEY (`learning_path_id`) REFERENCES `LearningPath`(`learning_path_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_learning_path_id_fkey` FOREIGN KEY (`learning_path_id`) REFERENCES `LearningPath`(`learning_path_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_course_level_str_fkey` FOREIGN KEY (`course_level_str`) REFERENCES `CourseLevel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tutorial` ADD CONSTRAINT `Tutorial_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;
